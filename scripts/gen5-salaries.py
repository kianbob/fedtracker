#!/usr/bin/env python3
"""Generate salary stats from December 2025 employment data."""
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

SALARY_FILTER = "annualized_adjusted_basic_pay != 'REDACTED'"
SALARY_CAST = "CAST(annualized_adjusted_basic_pay AS DOUBLE)"

print("Salary distribution...")
buckets = con.execute(f"""
    SELECT 
        CASE 
            WHEN {SALARY_CAST} < 30000 THEN 'Under $30K'
            WHEN {SALARY_CAST} < 50000 THEN '$30K-$50K'
            WHEN {SALARY_CAST} < 75000 THEN '$50K-$75K'
            WHEN {SALARY_CAST} < 100000 THEN '$75K-$100K'
            WHEN {SALARY_CAST} < 125000 THEN '$100K-$125K'
            WHEN {SALARY_CAST} < 150000 THEN '$125K-$150K'
            WHEN {SALARY_CAST} < 200000 THEN '$150K-$200K'
            ELSE '$200K+'
        END as bracket,
        SUM(CAST(count AS INT)) as employees
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE {SALARY_FILTER}
    GROUP BY bracket
""").fetchall()

print("Top paid agencies...")
top_paid = con.execute(f"""
    SELECT agency_code, agency,
           ROUND(SUM({SALARY_CAST} * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary,
           SUM(CAST(count AS INT)) as employees
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE {SALARY_FILTER}
    GROUP BY agency_code, agency
    HAVING employees > 100
    ORDER BY avg_salary DESC LIMIT 20
""").fetchall()

print("Top paid occupations...")
top_occ_paid = con.execute(f"""
    SELECT occupational_series_code, occupational_series,
           ROUND(SUM({SALARY_CAST} * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary,
           SUM(CAST(count AS INT)) as employees
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE {SALARY_FILTER}
    GROUP BY occupational_series_code, occupational_series
    HAVING employees > 50
    ORDER BY avg_salary DESC LIMIT 20
""").fetchall()

print("By grade...")
by_grade = con.execute(f"""
    SELECT grade,
           ROUND(SUM({SALARY_CAST} * CAST(count AS INT)) / NULLIF(SUM(CAST(count AS INT)), 0)) as avg_salary,
           SUM(CAST(count AS INT)) as employees
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
    WHERE {SALARY_FILTER} AND grade != '' AND grade != '*'
    GROUP BY grade
    ORDER BY grade
""").fetchall()

salary_stats = {
    "distribution": [{"bracket": r[0], "employees": int(r[1])} for r in buckets],
    "topPaidAgencies": [{"code": r[0], "name": title_case(r[1]), "avgSalary": int(r[2]), "employees": int(r[3])} for r in top_paid],
    "topPaidOccupations": [{"code": r[0], "name": title_case(r[1]), "avgSalary": int(r[2]), "employees": int(r[3])} for r in top_occ_paid],
    "byGrade": [{"grade": r[0], "avgSalary": int(r[1]), "employees": int(r[2])} for r in by_grade],
}

with open(f"{OUT}/salary-stats.json", "w") as f:
    json.dump(salary_stats, f)

print("Done gen5")
