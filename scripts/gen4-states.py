#!/usr/bin/env python3
"""Generate state-level stats."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()
con.execute(f"""
CREATE VIEW emp AS
SELECT * FROM read_csv('{DATA}/March_2025_Employment_3.txt',
    delim='|', quote='"', header=true, all_varchar=true)
""")

print("State stats...")
states = con.execute("""
    SELECT STATE as code, STATET as name,
           SUM(CAST(COUNT AS INT)) as employees,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL AND STATE != ''
    GROUP BY STATE, STATET
    ORDER BY employees DESC
""").fetchall()

state_list = [{"code": r[0], "name": r[1], "employees": int(r[2]),
               "avgSalary": int(r[3]) if r[3] else 0} for r in states]

with open(f"{OUT}/states.json", "w") as f:
    json.dump(state_list, f)

# Per-state detail
os.makedirs(f"{OUT}/state-detail", exist_ok=True)
for state in state_list:
    code = state["code"]
    
    top_agencies = con.execute(f"""
        SELECT AGYT as name, AGY as code, SUM(CAST(COUNT AS INT)) as employees
        FROM emp WHERE STATE = '{code}'
        GROUP BY AGYT, AGY ORDER BY employees DESC LIMIT 15
    """).fetchall()
    
    top_occs = con.execute(f"""
        SELECT OCCT as name, SUM(CAST(COUNT AS INT)) as employees,
               ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary
        FROM emp WHERE STATE = '{code}' AND TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
        GROUP BY OCCT ORDER BY employees DESC LIMIT 15
    """).fetchall()
    
    detail = {
        **state,
        "topAgencies": [{"name": r[0], "code": r[1], "employees": int(r[2])} for r in top_agencies],
        "topOccupations": [{"name": r[0], "employees": int(r[1]), "avgSalary": int(r[2]) if r[2] else 0} for r in top_occs],
    }
    
    with open(f"{OUT}/state-detail/{code}.json", "w") as f:
        json.dump(detail, f)

print(f"  {len(state_list)} states/territories")
print("Done gen4")
