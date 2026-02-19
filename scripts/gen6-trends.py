#!/usr/bin/env python3
"""Generate trends: accessions vs separations over time (FY2020-2024 + Dec 2025)."""
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

# Monthly separations (old + new)
print("Monthly separations...")
sep_map = defaultdict(int)

for month, total in con.execute(f"""
    SELECT EFDATE, SUM(CAST(COUNT AS INT)) FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true)
    GROUP BY EFDATE
""").fetchall():
    sep_map[month] = int(total)

for month, total in con.execute(f"""
    SELECT personnel_action_effective_date_yyyymm, SUM(CAST(count AS INT))
    FROM read_json_auto('{DATA}/separations-dec2025.json', format='newline_delimited')
    GROUP BY personnel_action_effective_date_yyyymm
""").fetchall():
    sep_map[month] = sep_map.get(month, 0) + int(total)

# Monthly accessions (old + new)
print("Monthly accessions...")
acc_map = defaultdict(int)

for month, total in con.execute(f"""
    SELECT EFDATE, SUM(CAST(COUNT AS INT)) FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true)
    GROUP BY EFDATE
""").fetchall():
    acc_map[month] = int(total)

for month, total in con.execute(f"""
    SELECT personnel_action_effective_date_yyyymm, SUM(CAST(count AS INT))
    FROM read_json_auto('{DATA}/accessions-dec2025.json', format='newline_delimited')
    GROUP BY personnel_action_effective_date_yyyymm
""").fetchall():
    acc_map[month] = acc_map.get(month, 0) + int(total)

all_months = sorted(set(list(sep_map.keys()) + list(acc_map.keys())))
monthly = [{"month": m, "separations": sep_map.get(m, 0), "accessions": acc_map.get(m, 0),
            "net": acc_map.get(m, 0) - sep_map.get(m, 0)} for m in all_months]

# Net change by agency
print("Net change by agency...")
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

# Old data agency totals
agency_seps = {}
for code, name, total in con.execute(f"""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT))
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
""").fetchall():
    agency_seps[code] = (name, int(total))

agency_accs = {}
for code, name, total in con.execute(f"""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT))
    FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
""").fetchall():
    agency_accs[code] = (name, int(total))

# Add new data
for code, name, total in con.execute(f"""
    SELECT agency_code, agency, SUM(CAST(count AS INT))
    FROM read_json_auto('{DATA}/separations-dec2025.json', format='newline_delimited')
    GROUP BY agency_code, agency
""").fetchall():
    prev = agency_seps.get(code, (name, 0))
    agency_seps[code] = (name, prev[1] + int(total))

for code, name, total in con.execute(f"""
    SELECT agency_code, agency, SUM(CAST(count AS INT))
    FROM read_json_auto('{DATA}/accessions-dec2025.json', format='newline_delimited')
    GROUP BY agency_code, agency
""").fetchall():
    prev = agency_accs.get(code, (name, 0))
    agency_accs[code] = (name, prev[1] + int(total))

all_agys = set(list(agency_seps.keys()) + list(agency_accs.keys()))
net_by_agency = []
for code in all_agys:
    name = agency_seps.get(code, agency_accs.get(code, ("",)))[0]
    s = agency_seps.get(code, ("", 0))[1]
    a = agency_accs.get(code, ("", 0))[1]
    net_by_agency.append({"code": code, "name": title_case(name), "separations": s, "accessions": a, "net": a - s})

net_by_agency.sort(key=lambda x: x["net"])

trends = {"monthly": monthly, "netByAgency": net_by_agency}
with open(f"{OUT}/trends.json", "w") as f:
    json.dump(trends, f)

print("Done gen6")
