#!/usr/bin/env python3
"""Generate per-agency stats from employment data."""
import duckdb
import json
import os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()

# Read employment data
emp = f"""
CREATE VIEW emp AS
SELECT * FROM read_csv('{DATA}/March_2025_Employment_3.txt',
    delim='|', quote='"', header=true,
    columns={{
        'AGY': 'VARCHAR', 'AGYT': 'VARCHAR', 'AGYSUB': 'VARCHAR', 'AGYSUBT': 'VARCHAR',
        'DATECODE': 'INT', 'AGELVLT': 'VARCHAR', 'EDLVL': 'VARCHAR', 'EDLVLT': 'VARCHAR',
        'LOS': 'VARCHAR', 'OCC': 'VARCHAR', 'OCCT': 'VARCHAR', 'OCCFAM': 'VARCHAR',
        'OCCFAMT': 'VARCHAR', 'PAYPLAN': 'VARCHAR', 'PAYPLANT': 'VARCHAR',
        'STEMAGGT': 'VARCHAR', 'STEMTYPT': 'VARCHAR', 'SUPERVIS': 'VARCHAR',
        'SUPERVIST': 'VARCHAR', 'TOA': 'VARCHAR', 'TOAT': 'VARCHAR',
        'WORKSCH': 'VARCHAR', 'WORKSCHT': 'VARCHAR', 'COUNT': 'INT',
        'LOC': 'VARCHAR', 'STATE': 'VARCHAR', 'STATET': 'VARCHAR',
        'COUNTRY': 'VARCHAR', 'COUNTRYT': 'VARCHAR', 'SALARY': 'VARCHAR', 'GRD': 'VARCHAR'
    }})
"""
con.execute(emp)

# Agency list with totals
print("Generating agency list...")
agencies = con.execute("""
    SELECT AGY as code, AGYT as name,
           SUM(COUNT) as employees,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * COUNT) / NULLIF(SUM(COUNT), 0)) as avg_salary
    FROM emp
    WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
    GROUP BY AGY, AGYT
    ORDER BY employees DESC
""").fetchall()

agency_list = []
for row in agencies:
    code, name, employees, avg_salary = row
    agency_list.append({
        "code": code,
        "name": name,
        "employees": int(employees),
        "avgSalary": int(avg_salary) if avg_salary else 0
    })

with open(f"{OUT}/agency-list.json", "w") as f:
    json.dump(agency_list, f)
print(f"  {len(agency_list)} agencies")

# Per-agency detail files
for agency in agency_list[:300]:  # top 300
    code = agency["code"]
    
    # Top occupations
    occs = con.execute(f"""
        SELECT OCCT as name, SUM(COUNT) as count,
               ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * COUNT) / NULLIF(SUM(COUNT), 0)) as avg_salary
        FROM emp WHERE AGY = '{code}' AND TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
        GROUP BY OCCT ORDER BY count DESC LIMIT 15
    """).fetchall()
    
    # Top states
    states = con.execute(f"""
        SELECT STATET as name, STATE as code, SUM(COUNT) as count
        FROM emp WHERE AGY = '{code}'
        GROUP BY STATET, STATE ORDER BY count DESC LIMIT 15
    """).fetchall()
    
    # Education breakdown
    edu = con.execute(f"""
        SELECT EDLVLT as level, SUM(COUNT) as count
        FROM emp WHERE AGY = '{code}'
        GROUP BY EDLVLT ORDER BY count DESC
    """).fetchall()
    
    detail = {
        **agency,
        "topOccupations": [{"name": r[0], "count": int(r[1]), "avgSalary": int(r[2]) if r[2] else 0} for r in occs],
        "topStates": [{"name": r[0], "code": r[1], "count": int(r[2])} for r in states],
        "education": [{"level": r[0], "count": int(r[1])} for r in edu],
    }
    
    os.makedirs(f"{OUT}/agencies", exist_ok=True)
    with open(f"{OUT}/agencies/{code}.json", "w") as f:
        json.dump(detail, f)

print("Done gen1")
