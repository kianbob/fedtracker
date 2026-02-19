#!/usr/bin/env python3
"""Generate occupation stats from December 2025 employment data."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
EMP = f"{DATA}/employment-dec2025.txt"
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

print("Occupation stats...")
occs = con.execute(f"""
    SELECT occupational_series_code as code, occupational_series as name, occupational_group as family,
           SUM(CAST(count AS INT)) as employees,
           ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE annualized_adjusted_basic_pay != 'REDACTED'
    GROUP BY occupational_series_code, occupational_series, occupational_group
    ORDER BY employees DESC
""").fetchall()

occ_list = [{"code": r[0], "name": title_case(r[1]), "family": title_case(r[2]), "employees": int(r[3]),
             "avgSalary": int(r[4]) if r[4] else 0} for r in occs]

with open(f"{OUT}/occupations.json", "w") as f:
    json.dump(occ_list, f)

print(f"  {len(occ_list)} occupations")
print("Done gen3")
