#!/usr/bin/env python3
"""Generate doge-impact.json from separation and accession files."""
import duckdb, json, glob, os

con = duckdb.connect()
MONTHLY = os.path.expanduser("~/Projects/fedtracker-data/monthly")
OLD = os.path.expanduser("~/Projects/fedtracker-data/extracted")
OUT = os.path.expanduser("~/Projects/fedtracker-app/public/data/doge-impact.json")

# --- Load new monthly separations (Oct 2023 - Nov 2025) ---
sep_files = sorted(glob.glob(f"{MONTHLY}/separations_*.txt"))
print(f"Found {len(sep_files)} monthly separation files")

# Check separation category codes
r = con.sql(f"""
    SELECT DISTINCT separation_category_code, separation_category 
    FROM read_csv('{sep_files[0]}', delim='|', header=true)
    ORDER BY separation_category_code
""").fetchall()
print("Sep codes:", r)

# Build union of all monthly sep files with month extracted
sep_union_parts = []
for f in sep_files:
    month = f.split('_')[-1].replace('.txt','')
    sep_union_parts.append(f"SELECT agency_code, separation_category_code, CAST(count AS INTEGER) as cnt, '{month}' as month FROM read_csv('{f}', delim='|', header=true)")
sep_union = " UNION ALL ".join(sep_union_parts)
con.sql(f"CREATE TABLE new_seps AS {sep_union}")

# --- Load old separations (FY2020-2024) ---
old_sep = f"{OLD}/SEPDATA_FY2020-2024.TXT"
con.sql(f"""
    CREATE TABLE old_seps AS 
    SELECT SUBSTR(AGYSUB,1,2) as agency_code, SEP as separation_category_code, 
           CAST(COUNT AS INTEGER) as cnt, EFDATE as month
    FROM read_csv('{old_sep}', header=true, all_varchar=true)
""")

# --- Load new monthly accessions ---
acc_files = sorted(glob.glob(f"{MONTHLY}/accessions_*.txt"))
print(f"Found {len(acc_files)} monthly accession files")
acc_union_parts = []
for f in acc_files:
    month = f.split('_')[-1].replace('.txt','')
    acc_union_parts.append(f"SELECT agency_code, CAST(count AS INTEGER) as cnt, '{month}' as month FROM read_csv('{f}', delim='|', header=true)")
acc_union = " UNION ALL ".join(acc_union_parts)
con.sql(f"CREATE TABLE new_accs AS {acc_union}")

# --- Load old accessions ---
old_acc = f"{OLD}/ACCDATA_FY2020-2024.TXT"
con.sql(f"""
    CREATE TABLE old_accs AS 
    SELECT SUBSTR(AGYSUB,1,2) as agency_code, CAST(COUNT AS INTEGER) as cnt, EFDATE as month
    FROM read_csv('{old_acc}', header=true, all_varchar=true)
""")

# --- Compute metrics ---

# Total seps 2025 vs 2024 (Jan-Nov for fair comparison since we have Jan-Nov 2025)
max_month_2025 = con.sql("SELECT MAX(month) FROM new_seps WHERE month LIKE '2025%'").fetchone()[0]
print(f"Latest 2025 sep month: {max_month_2025}")
last_mm = max_month_2025[4:]  # e.g. '11'

# 2025 seps from new_seps
seps_2025 = con.sql(f"SELECT SUM(cnt) FROM new_seps WHERE month LIKE '2025%'").fetchone()[0]

# 2024 seps: Jan-Sep from old, Oct+ from new
seps_2024_old = con.sql(f"SELECT SUM(cnt) FROM old_seps WHERE month >= '202401' AND month <= '202409'").fetchone()[0] or 0
seps_2024_new = con.sql(f"SELECT SUM(cnt) FROM new_seps WHERE month >= '202410' AND month <= '2024{last_mm}'").fetchone()[0] or 0
seps_2024 = seps_2024_old + seps_2024_new
print(f"Seps 2025: {seps_2025}, Seps 2024 (same period): {seps_2024}")

# Accessions 2025 vs 2024
max_acc_2025 = con.sql("SELECT MAX(month) FROM new_accs WHERE month LIKE '2025%'").fetchone()[0]
print(f"Latest 2025 acc month: {max_acc_2025}")

accs_2025 = con.sql(f"SELECT SUM(cnt) FROM new_accs WHERE month LIKE '2025%'").fetchone()[0]
accs_2024_old = con.sql(f"SELECT SUM(cnt) FROM old_accs WHERE month >= '202401' AND month <= '202409'").fetchone()[0] or 0
accs_2024_new = con.sql(f"SELECT SUM(cnt) FROM new_accs WHERE month >= '202410' AND month <= '2024{last_mm}'").fetchone()[0] or 0
accs_2024 = accs_2024_old + accs_2024_new
print(f"Accs 2025: {accs_2025}, Accs 2024 (same period): {accs_2024}")

# Net change since Jan 2025
net_2025 = (accs_2025 or 0) - (seps_2025 or 0)

# Monthly breakdown 2025
monthly_2025 = con.sql("""
    SELECT s.month,
           COALESCE(s.seps, 0) as separations,
           COALESCE(a.accs, 0) as accessions,
           COALESCE(a.accs, 0) - COALESCE(s.seps, 0) as net
    FROM (SELECT month, SUM(cnt) as seps FROM new_seps WHERE month LIKE '2025%' GROUP BY month) s
    FULL OUTER JOIN (SELECT month, SUM(cnt) as accs FROM new_accs WHERE month LIKE '2025%' GROUP BY month) a
    ON s.month = a.month
    ORDER BY COALESCE(s.month, a.month)
""").fetchall()

# Top 10 agencies by net loss in 2025
top_loss = con.sql("""
    WITH seps AS (SELECT agency_code, SUM(cnt) as total_seps FROM new_seps WHERE month LIKE '2025%' GROUP BY agency_code),
         accs AS (SELECT agency_code, SUM(cnt) as total_accs FROM new_accs WHERE month LIKE '2025%' GROUP BY agency_code)
    SELECT COALESCE(s.agency_code, a.agency_code) as code,
           COALESCE(a.total_accs, 0) - COALESCE(s.total_seps, 0) as net_change,
           COALESCE(s.total_seps, 0) as separations,
           COALESCE(a.total_accs, 0) as accessions
    FROM seps s FULL OUTER JOIN accs a ON s.agency_code = a.agency_code
    ORDER BY net_change ASC
    LIMIT 10
""").fetchall()

# RIF counts by agency 2025 - check what code means RIF
# In old data SEP codes: SA=quit, SB=retirement, etc. Let's check
rif_codes_old = con.sql("SELECT DISTINCT separation_category_code FROM old_seps WHERE separation_category_code LIKE 'S%' ORDER BY 1").fetchall()
print("Old sep codes sample:", rif_codes_old[:20])

# In new data
rif_codes_new = con.sql("SELECT DISTINCT separation_category_code FROM new_seps ORDER BY 1").fetchall()
print("New sep codes:", rif_codes_new)

# RIF is typically 'SN' in old OPM data, let's check new data
# New data uses descriptive codes like 'SN' or specific codes
# Let's look at actual separation_category values from first file
r2 = con.sql(f"""
    SELECT DISTINCT separation_category_code, separation_category 
    FROM read_csv('{sep_files[-1]}', delim='|', header=true)
    ORDER BY 1
""").fetchall()
print("Latest file sep categories:", r2)

# RIF codes: SN = RIF in old data, in new data look for 'REMOVAL' or 'RIF'
# From the output we'll identify the right code
# Common: SA=quit, SB/SC/SD=retirement, SE/SF=termination, SN=RIF, SP=transfer

# For new monthly files, check if there's a RIF category
rif_new_code = None
for code, name in r2:
    if name and 'REDUCTION' in name.upper():
        rif_new_code = code
        print(f"RIF code in new data: {code} = {name}")
        break

# RIF by agency 2025
if rif_new_code:
    rif_2025 = con.sql(f"""
        SELECT agency_code, SUM(cnt) as rif_count 
        FROM new_seps WHERE month LIKE '2025%' AND separation_category_code = '{rif_new_code}'
        GROUP BY agency_code ORDER BY rif_count DESC LIMIT 15
    """).fetchall()
else:
    # Try SN
    rif_2025 = con.sql("""
        SELECT agency_code, SUM(cnt) as rif_count 
        FROM new_seps WHERE month LIKE '2025%' AND separation_category_code = 'SN'
        GROUP BY agency_code ORDER BY rif_count DESC LIMIT 15
    """).fetchall()

# RIF total by year (old + new)
rif_by_year_old = con.sql("""
    SELECT SUBSTR(month,1,4) as year, SUM(cnt) as rif_count 
    FROM old_seps WHERE separation_category_code = 'SN'
    GROUP BY SUBSTR(month,1,4) ORDER BY year
""").fetchall()

rif_by_year_new = con.sql(f"""
    SELECT SUBSTR(month,1,4) as year, SUM(cnt) as rif_count 
    FROM new_seps WHERE separation_category_code = '{rif_new_code or "SN"}'
    GROUP BY SUBSTR(month,1,4) ORDER BY year
""").fetchall()

print("RIF by year (old):", rif_by_year_old)
print("RIF by year (new):", rif_by_year_new)

# DRP - Deferred Resignation Program, check if identifiable
drp_check = [c for c, n in r2 if n and 'DEFERRED' in n.upper()]
print("DRP codes:", drp_check)

# Check for any resignation-related
resign_cats = [(c, n) for c, n in r2 if n and ('RESIGN' in n.upper() or 'DEFERRED' in n.upper())]
print("Resignation categories:", resign_cats)

# Get agency names from agency-list.json
try:
    with open(os.path.expanduser("~/Projects/fedtracker-app/public/data/agency-list.json")) as f:
        agency_list = json.load(f)
    agency_names = {a['code']: a['name'] for a in agency_list}
except:
    agency_names = {}

# Build output
result = {
    "comparisonPeriod": f"Jan-{max_month_2025[4:]} (2025 vs 2024)",
    "separations2025": int(seps_2025),
    "separations2024": int(seps_2024),
    "separationChange": int(seps_2025 - seps_2024),
    "separationChangePct": round((seps_2025 - seps_2024) / seps_2024 * 100, 1),
    "accessions2025": int(accs_2025),
    "accessions2024": int(accs_2024),
    "accessionChange": int(accs_2025 - accs_2024),
    "accessionChangePct": round((accs_2025 - accs_2024) / accs_2024 * 100, 1),
    "netChangeSinceJan2025": int(net_2025),
    "monthlyBreakdown2025": [
        {"month": m, "separations": int(s), "accessions": int(a), "net": int(n)}
        for m, s, a, n in monthly_2025
    ],
    "topAgenciesByNetLoss": [
        {"code": c, "name": agency_names.get(c, c), "netChange": int(n), "separations": int(s), "accessions": int(a)}
        for c, n, s, a in top_loss
    ],
    "rifByAgency2025": [
        {"code": c, "name": agency_names.get(c, c), "rifCount": int(r)}
        for c, r in rif_2025
    ],
    "rifByYear": {**(dict(rif_by_year_old)), **(dict(rif_by_year_new))},
    "drpIdentifiable": len(drp_check) > 0,
    "generatedAt": "2026-02-18"
}

with open(OUT, 'w') as f:
    json.dump(result, f, indent=2)
print(f"\nWrote {OUT}")
print(json.dumps(result, indent=2)[:2000])
