#!/usr/bin/env python3
"""Generate separation stats combining FY2020-2024 + Dec 2025 data."""
import duckdb, json, os
from collections import defaultdict

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

def title_case(s):
    if not s: return s
    small = {'of','the','and','for','in','on','at','to','by'}
    words = s.split()
    result = []
    for i, w in enumerate(words):
        if i > 0 and w.lower() in small:
            result.append(w.lower())
        else:
            result.append(w.capitalize())
    return ' '.join(result)

con = duckdb.connect()

sep_types = {
    'SA': 'Transfer Out', 'SB': 'Transfer Out (Mass)', 'SC': 'Quit',
    'SD': 'Voluntary Retirement', 'SE': 'Early Retirement', 'SF': 'Disability Retirement',
    'SG': 'Other Retirement', 'SH': 'RIF', 'SJ': 'Termination', 'SK': 'Death', 'SL': 'Other'
}

# Old data: monthly by type
print("Loading old separations (FY2020-2024)...")
old_monthly = con.execute(f"""
    SELECT EFDATE as month, SEP as type, SUM(CAST(COUNT AS INT)) as count
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true)
    GROUP BY EFDATE, SEP
""").fetchall()

by_month = defaultdict(dict)
for month, typ, count in old_monthly:
    by_month[month][typ] = int(count)

# New data: Dec 2025
print("Loading new separations (Dec 2025)...")
new_monthly = con.execute(f"""
    SELECT personnel_action_effective_date_yyyymm as month, separation_category_code as type,
           SUM(CAST(count AS INT)) as count
    FROM read_json_auto('{DATA}/separations-dec2025.json', format='newline_delimited')
    GROUP BY personnel_action_effective_date_yyyymm, separation_category_code
""").fetchall()

for month, typ, count in new_monthly:
    by_month[month][typ] = by_month[month].get(typ, 0) + int(count)

separations = {
    "types": sep_types,
    "monthly": [{"month": m, **{t: by_month[m].get(t, 0) for t in sep_types}} for m in sorted(by_month.keys())]
}

with open(f"{OUT}/separations.json", "w") as f:
    json.dump(separations, f)
print(f"  {len(by_month)} months")

# Per-agency separations
print("Per-agency separations...")

# Old: need DTagy lookup for agency codes
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

old_agency = con.execute(f"""
    SELECT a.AGY as code, a.AGYT as name, s.EFDATE as month, s.SEP as type, SUM(CAST(s.COUNT AS INT)) as count
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT, s.EFDATE, s.SEP
""").fetchall()

by_agency = defaultdict(lambda: defaultdict(dict))
agency_names = {}
for code, name, month, typ, count in old_agency:
    by_agency[code][month][typ] = int(count)
    agency_names[code] = name

# New agency seps
new_agency = con.execute(f"""
    SELECT agency_code as code, agency as name, personnel_action_effective_date_yyyymm as month,
           separation_category_code as type, SUM(CAST(count AS INT)) as count
    FROM read_json_auto('{DATA}/separations-dec2025.json', format='newline_delimited')
    GROUP BY agency_code, agency, personnel_action_effective_date_yyyymm, separation_category_code
""").fetchall()

for code, name, month, typ, count in new_agency:
    by_agency[code][month][typ] = by_agency[code][month].get(typ, 0) + int(count)
    agency_names[code] = name

os.makedirs(f"{OUT}/agency-separations", exist_ok=True)
for code, months in by_agency.items():
    data = {
        "code": code,
        "name": title_case(agency_names.get(code, code)),
        "monthly": [{"month": m, **{t: months[m].get(t, 0) for t in sep_types}} for m in sorted(months.keys())]
    }
    with open(f"{OUT}/agency-separations/{code}.json", "w") as f:
        json.dump(data, f)

# Top RIF agencies (all time)
print("Top RIF agencies...")
rif_data = defaultdict(int)
rif_names = {}
for code, months in by_agency.items():
    for m, types in months.items():
        if 'SH' in types:
            rif_data[code] += types['SH']
            rif_names[code] = agency_names.get(code, code)

rif_top = sorted([{"code": c, "name": title_case(rif_names[c]), "rifCount": n} for c, n in rif_data.items()], 
                 key=lambda x: x["rifCount"], reverse=True)[:20]
with open(f"{OUT}/rif-top.json", "w") as f:
    json.dump(rif_top, f)

print("Done gen2")
