#!/usr/bin/env python3
"""Generate occupation stats."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()
con.execute(f"""
CREATE VIEW emp AS
SELECT * FROM read_csv('{DATA}/March_2025_Employment_3.txt',
    delim='|', quote='"', header=true, all_varchar=true)
""")

print("Occupation stats...")
occs = con.execute("""
    SELECT OCC as code, OCCT as name, OCCFAMT as family,
           SUM(CAST(COUNT AS INT)) as employees,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
    GROUP BY OCC, OCCT, OCCFAMT
    ORDER BY employees DESC
""").fetchall()

occ_list = [{"code": r[0], "name": r[1], "family": r[2], "employees": int(r[3]),
             "avgSalary": int(r[4]) if r[4] else 0} for r in occs]

with open(f"{OUT}/occupations.json", "w") as f:
    json.dump(occ_list, f)

print(f"  {len(occ_list)} occupations")
print("Done gen3")
