#!/usr/bin/env python3
"""Generate homepage site stats."""
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

print("Site stats...")
emp_stats = con.execute(f"""
    SELECT SUM(CAST(count AS INT)) as total_employees,
           ROUND(SUM(CASE WHEN annualized_adjusted_basic_pay != 'REDACTED' 
                      THEN CAST(annualized_adjusted_basic_pay AS DOUBLE) * CAST(count AS INT) END) / 
                 NULLIF(SUM(CASE WHEN annualized_adjusted_basic_pay != 'REDACTED' THEN CAST(count AS INT) END), 0)) as avg_salary,
           COUNT(DISTINCT agency_code) as agency_count
    FROM read_csv('{EMP}', delim='|', header=true, all_varchar=true)
""").fetchone()

# Total seps = old + new
sep_old = con.execute(f"""
    SELECT SUM(CAST(COUNT AS INT)) FROM read_csv('{DATA}/SEPDATA_FY2020-2024.TXT', header=true, all_varchar=true)
""").fetchone()[0]
sep_new = con.execute(f"""
    SELECT SUM(CAST(count AS INT)) FROM read_json_auto('{DATA}/separations-dec2025.json', format='newline_delimited')
""").fetchone()[0]

acc_old = con.execute(f"""
    SELECT SUM(CAST(COUNT AS INT)) FROM read_csv('{DATA}/ACCDATA_FY2020-2024.TXT', header=true, all_varchar=true)
""").fetchone()[0]
acc_new = con.execute(f"""
    SELECT SUM(CAST(count AS INT)) FROM read_json_auto('{DATA}/accessions-dec2025.json', format='newline_delimited')
""").fetchone()[0]

# Load rif-top from already-generated file
rif_top = json.load(open(f"{OUT}/rif-top.json"))

# Top quit rate agencies
con.execute(f"""
CREATE VIEW agy AS
SELECT DISTINCT AGYSUB, AGY, AGYT FROM read_csv('{DATA}/DTagy.txt', header=true, all_varchar=true)
""")

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
    "totalSeparations": int(sep_old) + int(sep_new),
    "totalAccessions": int(acc_old) + int(acc_new),
    "topRifAgencies": rif_top[:10],
    "topQuitRates": [{"code": r[0], "name": title_case(r[1]), "quits": int(r[2]), "totalSeps": int(r[3]),
                       "quitRate": round(int(r[2]) / int(r[3]) * 100, 1)} for r in quit_rates],
}

with open(f"{OUT}/site-stats.json", "w") as f:
    json.dump(site_stats, f)

print(f"  Total employees: {site_stats['totalEmployees']:,}")
print(f"  Avg salary: ${site_stats['avgSalary']:,}")
print(f"  Agencies: {site_stats['agencyCount']}")
print("Done gen7")
