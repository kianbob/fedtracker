#!/usr/bin/env python3
"""Generate per-agency stats from December 2025 employment data."""
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

# Agency list with totals
print("Generating agency list...")
agencies = con.execute(f"""
    SELECT agency_code as code, agency as name,
           SUM(CAST(count AS INT)) as employees,
           ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT)) / 
                 NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE annualized_adjusted_basic_pay != 'REDACTED'
    GROUP BY agency_code, agency
    ORDER BY employees DESC
""").fetchall()

agency_list = []
for code, name, employees, avg_salary in agencies:
    agency_list.append({
        "code": code,
        "name": title_case(name),
        "employees": int(employees),
        "avgSalary": int(avg_salary) if avg_salary else 0
    })

# Also get total employees (including redacted salary rows)
all_agencies = con.execute(f"""
    SELECT agency_code as code, SUM(CAST(count AS INT)) as employees
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    GROUP BY agency_code
""").fetchall()
all_emp_map = {r[0]: int(r[1]) for r in all_agencies}

# Update employee counts to include all (not just non-redacted)
for a in agency_list:
    if a["code"] in all_emp_map:
        a["employees"] = all_emp_map[a["code"]]

# Sort by updated employees
agency_list.sort(key=lambda x: x["employees"], reverse=True)

with open(f"{OUT}/agency-list.json", "w") as f:
    json.dump(agency_list, f)
print(f"  {len(agency_list)} agencies")

# Per-agency detail files
os.makedirs(f"{OUT}/agencies", exist_ok=True)
for agency in agency_list[:300]:
    code = agency["code"]
    
    occs = con.execute(f"""
        SELECT occupational_series as name, SUM(CAST(count AS INT)) as cnt,
               ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary
        FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
        WHERE agency_code = '{code}' AND annualized_adjusted_basic_pay != 'REDACTED'
        GROUP BY occupational_series ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    
    states = con.execute(f"""
        SELECT duty_station_state as name, duty_station_state_abbreviation as code, SUM(CAST(count AS INT)) as cnt
        FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
        WHERE agency_code = '{code}' AND duty_station_state_abbreviation != 'REDACTED'
        GROUP BY duty_station_state, duty_station_state_abbreviation ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    
    edu = con.execute(f"""
        SELECT education_level as level, SUM(CAST(count AS INT)) as cnt
        FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
        WHERE agency_code = '{code}'
        GROUP BY education_level ORDER BY cnt DESC
    """).fetchall()
    
    detail = {
        **agency,
        "topOccupations": [{"name": title_case(r[0]), "count": int(r[1]), "avgSalary": int(r[2]) if r[2] else 0} for r in occs],
        "topStates": [{"name": title_case(r[0]), "code": r[1], "count": int(r[2])} for r in states],
        "education": [{"level": title_case(r[0]), "count": int(r[1])} for r in edu],
    }
    
    with open(f"{OUT}/agencies/{code}.json", "w") as f:
        json.dump(detail, f)

print("Done gen1")
