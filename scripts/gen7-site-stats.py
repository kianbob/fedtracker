#!/usr/bin/env python3
"""Generate homepage site stats."""
import duckdb, json, os

DATA = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data")

con = duckdb.connect()

print("Site stats...")
emp_stats = con.execute(f"""
    SELECT SUM(CAST(COUNT AS INT)) as total_employees,
           ROUND(SUM(CASE WHEN TRY_CAST(SALARY AS DOUBLE) IS NOT NULL THEN TRY_CAST(SALARY AS DOUBLE) * CAST(COUNT AS INT) END) / 
                 NULLIF(SUM(CASE WHEN TRY_CAST(SALARY AS DOUBLE) IS NOT NULL THEN CAST(COUNT AS INT) END), 0)) as avg_salary,
           COUNT(DISTINCT AGY) as agency_count
    FROM read_csv('{DATA}/March_2025_Employment_3.txt',
        delim='|', quote='"', header=true, all_varchar=true)
""").fetchone()

sep_total = con.execute(f"""
    SELECT SUM(CAST(COUNT AS INT))
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true)
""").fetchone()[0]

acc_total = con.execute(f"""
    SELECT SUM(CAST(COUNT AS INT))
    FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true)
""").fetchone()[0]

# Top RIF agencies for homepage
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

rif_top = con.execute(f"""
    SELECT a.AGY, a.AGYT, SUM(CAST(s.COUNT AS INT)) as rif_count
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE s.SEP = 'SH' AND a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
    ORDER BY rif_count DESC LIMIT 10
""").fetchall()

# Top quit rate agencies (quit / total seps)
quit_rates = con.execute(f"""
    SELECT a.AGY, a.AGYT,
           SUM(CASE WHEN s.SEP = 'SC' THEN CAST(s.COUNT AS INT) ELSE 0 END) as quits,
           SUM(CAST(s.COUNT AS INT)) as total_seps
    FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true) s
    LEFT JOIN agy a ON s.AGYSUB = a.AGYSUB
    WHERE a.AGY IS NOT NULL
    GROUP BY a.AGY, a.AGYT
    HAVING total_seps > 500
    ORDER BY (quits * 1.0 / total_seps) DESC LIMIT 10
""").fetchall()

site_stats = {
    "totalEmployees": int(emp_stats[0]),
    "avgSalary": int(emp_stats[1]),
    "agencyCount": int(emp_stats[2]),
    "totalSeparations": int(sep_total),
    "totalAccessions": int(acc_total),
    "topRifAgencies": [{"code": r[0], "name": r[1], "rifCount": int(r[2])} for r in rif_top],
    "topQuitRates": [{"code": r[0], "name": r[1], "quits": int(r[2]), "totalSeps": int(r[3]),
                       "quitRate": round(int(r[2]) / int(r[3]) * 100, 1)} for r in quit_rates],
}

with open(f"{OUT}/site-stats.json", "w") as f:
    json.dump(site_stats, f)

print(f"  Total employees: {site_stats['totalEmployees']:,}")
print(f"  Avg salary: ${site_stats['avgSalary']:,}")
print(f"  Agencies: {site_stats['agencyCount']}")
print("Done gen7")
