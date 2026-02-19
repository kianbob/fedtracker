#!/usr/bin/env python3
"""Generate separation stats."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()

con.execute(f"""
CREATE VIEW sep AS
SELECT * FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT',
    header=true, all_varchar=true)
""")

# Load agency lookup
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

# Overall monthly separations by type
print("Monthly separations by type...")
monthly = con.execute("""
    SELECT EFDATE as month,
           SEP as type,
           SUM(CAST(COUNT AS INT)) as count
    FROM sep
    GROUP BY EFDATE, SEP
    ORDER BY EFDATE, SEP
""").fetchall()

sep_types = {
    'SA': 'Transfer Out', 'SB': 'Transfer Out (Mass)', 'SC': 'Quit',
    'SD': 'Voluntary Retirement', 'SE': 'Early Retirement', 'SF': 'Disability Retirement',
    'SG': 'Other Retirement', 'SH': 'RIF', 'SJ': 'Termination', 'SK': 'Death', 'SL': 'Other'
}

# Group by month
from collections import defaultdict
by_month = defaultdict(dict)
for month, typ, count in monthly:
    by_month[month][typ] = int(count)

separations = {
    "types": sep_types,
    "monthly": [{"month": m, **{t: by_month[m].get(t, 0) for t in sep_types}} for m in sorted(by_month.keys())]
}

with open(f"{OUT}/separations.json", "w") as f:
    json.dump(separations, f)

# Per-agency separations (top agencies only)
print("Per-agency separations...")
agency_seps = con.execute("""
    SELECT a.AGY as agy_code, a.AGYT as agy_name,
           s.EFDATE as month, s.SEP as type,
           SUM(CAST(s.COUNT AS INT)) as count
    FROM sep s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT, s.EFDATE, s.SEP
    ORDER BY a.AGY, s.EFDATE
""").fetchall()

by_agency = defaultdict(lambda: defaultdict(dict))
agency_names = {}
for agy_code, agy_name, month, typ, count in agency_seps:
    by_agency[agy_code][month][typ] = int(count)
    agency_names[agy_code] = agy_name

os.makedirs(f"{OUT}/agency-separations", exist_ok=True)
for code, months in by_agency.items():
    data = {
        "code": code,
        "name": agency_names.get(code, code),
        "monthly": [{"month": m, **{t: months[m].get(t, 0) for t in sep_types}} for m in sorted(months.keys())]
    }
    with open(f"{OUT}/agency-separations/{code}.json", "w") as f:
        json.dump(data, f)

# Top agencies by RIF
print("Top RIF agencies...")
rif_agencies = con.execute("""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT)) as rif_count
    FROM sep s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE s.SEP = 'SH' AND a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
    ORDER BY rif_count DESC
    LIMIT 20
""").fetchall()

rif_top = [{"code": r[0], "name": r[1], "rifCount": int(r[2])} for r in rif_agencies]
with open(f"{OUT}/rif-top.json", "w") as f:
    json.dump(rif_top, f)

print("Done gen2")
