#!/usr/bin/env python3
"""Generate occupation-detail/{CODE}.json from employment data using DuckDB."""
import duckdb
import json
import os

emp_file = os.path.expanduser("~/Projects/fedtracker-data/extracted/employment-dec2025.txt")
out_dir = os.path.expanduser("~/Projects/fedtracker-app/public/data/occupation-detail")
os.makedirs(out_dir, exist_ok=True)

con = duckdb.connect(':memory:')
con.execute("SET memory_limit='4GB'")

print("Loading employment data...")
con.execute(f"""
CREATE TABLE emp AS 
SELECT * FROM read_csv('{emp_file}', delim='|', header=true, 
    ignore_errors=true, sample_size=-1)
""")

row_count = con.execute("SELECT count(*) FROM emp").fetchone()[0]
print(f"Loaded {row_count:,} rows")

# Get occupations with 100+ employees
occs = con.execute("""
    SELECT occupational_series_code as code, 
           occupational_series as name,
           occupational_group as grp,
           SUM(CAST(count AS INTEGER)) as total
    FROM emp 
    WHERE occupational_series_code IS NOT NULL 
      AND occupational_series_code != ''
    GROUP BY code, name, grp
    HAVING total >= 100
    ORDER BY total DESC
""").fetchall()

print(f"Found {len(occs)} occupations with 100+ employees")

# Process in batches
for i, (code, name, group, total) in enumerate(occs):
    if i % 50 == 0:
        print(f"  Processing {i}/{len(occs)}...")
    
    # Avg salary
    avg_sal = con.execute(f"""
        SELECT ROUND(SUM(CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INTEGER)) 
               / NULLIF(SUM(CAST(count AS INTEGER)), 0))
        FROM emp 
        WHERE occupational_series_code = '{code}'
          AND annualized_adjusted_basic_pay NOT IN ('REDACTED', '')
          AND TRY_CAST(annualized_adjusted_basic_pay AS DOUBLE) IS NOT NULL
    """).fetchone()[0]
    
    # Top agencies
    top_agencies = con.execute(f"""
        SELECT agency_code as code, agency as name, 
               SUM(CAST(count AS INTEGER)) as cnt,
               ROUND(SUM(CASE WHEN TRY_CAST(annualized_adjusted_basic_pay AS DOUBLE) IS NOT NULL 
                              AND annualized_adjusted_basic_pay NOT IN ('REDACTED','')
                         THEN CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INTEGER) ELSE 0 END)
                     / NULLIF(SUM(CASE WHEN TRY_CAST(annualized_adjusted_basic_pay AS DOUBLE) IS NOT NULL
                                           AND annualized_adjusted_basic_pay NOT IN ('REDACTED','')
                                      THEN CAST(count AS INTEGER) ELSE 0 END), 0)) as avg_sal
        FROM emp WHERE occupational_series_code = '{code}'
        GROUP BY agency_code, agency ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    
    # Top states
    top_states = con.execute(f"""
        SELECT duty_station_state_abbreviation as state, SUM(CAST(count AS INTEGER)) as cnt
        FROM emp WHERE occupational_series_code = '{code}'
          AND duty_station_state_abbreviation NOT IN ('REDACTED', '')
          AND duty_station_state_abbreviation IS NOT NULL
        GROUP BY state ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    
    # Age distribution
    age_dist = con.execute(f"""
        SELECT age_bracket as label, SUM(CAST(count AS INTEGER)) as cnt
        FROM emp WHERE occupational_series_code = '{code}'
          AND age_bracket NOT IN ('REDACTED', '') AND age_bracket IS NOT NULL
        GROUP BY label ORDER BY label
    """).fetchall()
    
    # Education
    edu_dist = con.execute(f"""
        SELECT education_level as label, SUM(CAST(count AS INTEGER)) as cnt
        FROM emp WHERE occupational_series_code = '{code}'
          AND education_level NOT IN ('REDACTED', '') AND education_level IS NOT NULL
        GROUP BY label ORDER BY cnt DESC
    """).fetchall()
    
    # Salary by grade
    sal_by_grade = con.execute(f"""
        SELECT pay_plan_code || '-' || grade as grade_label, 
               SUM(CAST(count AS INTEGER)) as cnt,
               ROUND(SUM(CASE WHEN TRY_CAST(annualized_adjusted_basic_pay AS DOUBLE) IS NOT NULL
                              AND annualized_adjusted_basic_pay NOT IN ('REDACTED','')
                         THEN CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INTEGER) ELSE 0 END)
                     / NULLIF(SUM(CASE WHEN TRY_CAST(annualized_adjusted_basic_pay AS DOUBLE) IS NOT NULL
                                           AND annualized_adjusted_basic_pay NOT IN ('REDACTED','')
                                      THEN CAST(count AS INTEGER) ELSE 0 END), 0)) as avg_sal
        FROM emp WHERE occupational_series_code = '{code}'
          AND grade IS NOT NULL AND grade != '' AND grade != 'REDACTED'
        GROUP BY grade_label ORDER BY cnt DESC LIMIT 20
    """).fetchall()
    
    result = {
        "code": code,
        "name": name or code,
        "group": group or "",
        "employees": total,
        "avgSalary": int(avg_sal) if avg_sal else 0,
        "topAgencies": [{"code": r[0], "name": r[1], "count": r[2], "avgSalary": int(r[3]) if r[3] else 0} for r in top_agencies],
        "topStates": [{"state": r[0], "count": r[1]} for r in top_states],
        "ageDistribution": [{"label": r[0], "count": r[1]} for r in age_dist],
        "educationDistribution": [{"label": r[0], "count": r[1]} for r in edu_dist],
        "salaryByGrade": [{"grade": r[0], "count": r[1], "avgSalary": int(r[2]) if r[2] else 0} for r in sal_by_grade]
    }
    
    with open(os.path.join(out_dir, f"{code}.json"), 'w') as f:
        json.dump(result, f)

print(f"Done! Created {len(occs)} occupation detail files")
con.close()
