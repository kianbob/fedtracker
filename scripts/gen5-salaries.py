#!/usr/bin/env python3
"""Generate salary stats."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()
con.execute(f"""
CREATE VIEW emp AS
SELECT * FROM read_csv('{DATA}/March_2025_Employment_3.txt',
    delim='|', quote='"', header=true, all_varchar=true)
""")

print("Salary stats...")

# Salary distribution buckets
buckets = con.execute("""
    SELECT 
        CASE 
            WHEN TRY_CAST(SALARY AS DOUBLE) < 30000 THEN 'Under $30K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 50000 THEN '$30K-$50K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 75000 THEN '$50K-$75K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 100000 THEN '$75K-$100K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 125000 THEN '$100K-$125K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 150000 THEN '$125K-$150K'
            WHEN TRY_CAST(SALARY AS DOUBLE) < 200000 THEN '$150K-$200K'
            ELSE '$200K+'
        END as bracket,
        SUM(CAST(COUNT AS INT)) as employees
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
    GROUP BY bracket
""").fetchall()

# Top paid agencies
top_paid = con.execute("""
    SELECT AGY, AGYT,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary,
           SUM(CAST(COUNT AS INT)) as employees
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
    GROUP BY AGY, AGYT
    HAVING employees > 100
    ORDER BY avg_salary DESC LIMIT 20
""").fetchall()

# Top paid occupations
top_occ_paid = con.execute("""
    SELECT OCC, OCCT,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary,
           SUM(CAST(COUNT AS INT)) as employees
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL
    GROUP BY OCC, OCCT
    HAVING employees > 50
    ORDER BY avg_salary DESC LIMIT 20
""").fetchall()

# By grade
by_grade = con.execute("""
    SELECT GRD as grade,
           ROUND(SUM(TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT)) / NULLIF(SUM(CAST(COUNT AS INT)), 0)) as avg_salary,
           SUM(CAST(COUNT AS INT)) as employees
    FROM emp WHERE TRY_CAST(SALARY AS DOUBLE) IS NOT NULL AND GRD != '*'
    GROUP BY GRD
    ORDER BY grade
""").fetchall()

salary_stats = {
    "distribution": [{"bracket": r[0], "employees": int(r[1])} for r in buckets],
    "topPaidAgencies": [{"code": r[0], "name": r[1], "avgSalary": int(r[2]), "employees": int(r[3])} for r in top_paid],
    "topPaidOccupations": [{"code": r[0], "name": r[1], "avgSalary": int(r[2]), "employees": int(r[3])} for r in top_occ_paid],
    "byGrade": [{"grade": r[0], "avgSalary": int(r[1]), "employees": int(r[2])} for r in by_grade],
}

with open(f"{OUT}/salary-stats.json", "w") as f:
    json.dump(salary_stats, f)

print("Done gen5")
