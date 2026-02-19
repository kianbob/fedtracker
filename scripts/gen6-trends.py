#!/usr/bin/env python3
"""Generate trends: accessions vs separations over time."""
import duckdb, json, os
from collections import defaultdict

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()

# Monthly separations
print("Monthly separations...")
seps = con.execute(f"""
    SELECT EFDATE as month, SUM(CAST(COUNT AS INT)) as total
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true)
    GROUP BY EFDATE ORDER BY EFDATE
""").fetchall()

# Monthly accessions
print("Monthly accessions...")
accs = con.execute(f"""
    SELECT EFDATE as month, SUM(CAST(COUNT AS INT)) as total
    FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true)
    GROUP BY EFDATE ORDER BY EFDATE
""").fetchall()

sep_map = {r[0]: int(r[1]) for r in seps}
acc_map = {r[0]: int(r[1]) for r in accs}
all_months = sorted(set(list(sep_map.keys()) + list(acc_map.keys())))

monthly = [{"month": m, "separations": sep_map.get(m, 0), "accessions": acc_map.get(m, 0),
            "net": acc_map.get(m, 0) - sep_map.get(m, 0)} for m in all_months]

# Net change by agency
print("Net change by agency...")
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

agency_seps = con.execute(f"""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT)) as total
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
""").fetchall()

agency_accs = con.execute(f"""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT)) as total
    FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
""").fetchall()

sep_by_agy = {r[0]: (r[1], int(r[2])) for r in agency_seps}
acc_by_agy = {r[0]: (r[1], int(r[2])) for r in agency_accs}

all_agys = set(list(sep_by_agy.keys()) + list(acc_by_agy.keys()))
net_by_agency = []
for code in all_agys:
    name = sep_by_agy.get(code, acc_by_agy.get(code, ("",)))[0]
    s = sep_by_agy.get(code, ("", 0))[1]
    a = acc_by_agy.get(code, ("", 0))[1]
    net_by_agency.append({"code": code, "name": name, "separations": s, "accessions": a, "net": a - s})

net_by_agency.sort(key=lambda x: x["net"])

trends = {
    "monthly": monthly,
    "netByAgency": net_by_agency
}

with open(f"{OUT}/trends.json", "w") as f:
    json.dump(trends, f)

print("Done gen6")
