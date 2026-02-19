#!/usr/bin/env python3
"""Generate state-level stats from December 2025 employment data."""
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

print("State stats...")
states = con.execute(f"""
    SELECT duty_station_state_abbreviation as code, duty_station_state as name,
           SUM(CAST(count AS INT)) as employees,
           ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE annualized_adjusted_basic_pay != 'REDACTED' AND duty_station_state_abbreviation != 'REDACTED' AND duty_station_state_abbreviation != ''
    GROUP BY duty_station_state_abbreviation, duty_station_state
    ORDER BY employees DESC
""").fetchall()

state_list = [{"code": r[0], "name": title_case(r[1]), "employees": int(r[2]),
               "avgSalary": int(r[3]) if r[3] else 0} for r in states]

with open(f"{OUT}/states.json", "w") as f:
    json.dump(state_list, f)

# Per-state detail
os.makedirs(f"{OUT}/state-detail", exist_ok=True)
for state in state_list:
    code = state["code"]
    
    top_agencies = con.execute(f"""
        SELECT agency as name, agency_code as code, SUM(CAST(count AS INT)) as employees
        FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
        WHERE duty_station_state_abbreviation = '{code}'
        GROUP BY agency, agency_code ORDER BY employees DESC LIMIT 15
    """).fetchall()
    
    top_occs = con.execute(f"""
        SELECT occupational_series as name, SUM(CAST(count AS INT)) as employees,
               ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary
        FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
        WHERE duty_station_state_abbreviation = '{code}' AND annualized_adjusted_basic_pay != 'REDACTED'
        GROUP BY occupational_series ORDER BY employees DESC LIMIT 15
    """).fetchall()
    
    detail = {
        **state,
        "topAgencies": [{"name": title_case(r[0]), "code": r[1], "employees": int(r[2])} for r in top_agencies],
        "topOccupations": [{"name": title_case(r[0]), "employees": int(r[1]), "avgSalary": int(r[2]) if r[2] else 0} for r in top_occs],
    }
    
    with open(f"{OUT}/state-detail/{code}.json", "w") as f:
        json.dump(detail, f)

print(f"  {len(state_list)} states/territories")
print("Done gen4")
