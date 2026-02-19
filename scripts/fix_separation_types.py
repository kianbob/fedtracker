#!/usr/bin/env python3
"""Generate separation-types/{CODE}.json detail files."""
import csv
import json
import os
import glob
from collections import defaultdict

SEP_TYPES = {
    "SA": ("Transfer Out", "Employees who transferred to another federal agency"),
    "SB": ("Transfer Out (Mass)", "Mass transfers between agencies due to reorganization"),
    "SC": ("Quit", "Voluntary resignations from federal service"),
    "SD": ("Voluntary Retirement", "Standard voluntary retirements"),
    "SE": ("Early Retirement", "Early-out retirements, often offered during downsizing"),
    "SF": ("Disability Retirement", "Retirements due to disability"),
    "SG": ("Other Retirement", "Other types of retirement"),
    "SH": ("RIF", "Reduction in Force - involuntary separations due to budget/reorganization"),
    "SJ": ("Termination", "Involuntary terminations including probationary and for-cause"),
    "SK": ("Death", "Deaths of federal employees"),
    "SL": ("Other", "Other types of separations"),
}

AGENCY_NAMES = {}
# Load agency names from agency-list.json if available
agency_list_path = os.path.expanduser("~/Projects/fedtracker-app/public/data/agency-list.json")
if os.path.exists(agency_list_path):
    with open(agency_list_path) as f:
        for a in json.load(f):
            AGENCY_NAMES[a.get("code", "")] = a.get("name", "")

# Monthly trend from old + new
monthly_by_type = defaultdict(lambda: defaultdict(int))
# Agency totals per type
agency_by_type = defaultdict(lambda: defaultdict(int))
# For new monthly files only: demographics
occ_by_type = defaultdict(lambda: defaultdict(int))
age_by_type = defaultdict(lambda: defaultdict(int))
salary_by_type = defaultdict(lambda: {"total_salary": 0, "total_count": 0})
los_by_type = defaultdict(lambda: {"total_los": 0.0, "total_count": 0})

# Old bulk file
old_file = os.path.expanduser("~/Projects/fedtracker-data/extracted/SEPDATA_FY2020-2024.TXT")
print("Reading old bulk file...")
with open(old_file, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        month = row['EFDATE'].strip()
        sep = row['SEP'].strip()
        count = int(row['COUNT'].strip())
        if sep not in SEP_TYPES or month > "202309":
            continue
        monthly_by_type[sep][month] += count
        agysub = row['AGYSUB'].strip()[:2]
        agency_by_type[sep][agysub] += count
        # Salary/LOS from old file
        try:
            sal = float(row['SALARY'].strip())
            salary_by_type[sep]["total_salary"] += sal * count
            salary_by_type[sep]["total_count"] += count
        except:
            pass
        try:
            los = float(row['LOS'].strip())
            los_by_type[sep]["total_los"] += los * count
            los_by_type[sep]["total_count"] += count
        except:
            pass

# New monthly files
monthly_dir = os.path.expanduser("~/Projects/fedtracker-data/monthly/")
files = sorted(glob.glob(os.path.join(monthly_dir, "separations_*.txt")))
print(f"Reading {len(files)} monthly files...")
for fpath in files:
    basename = os.path.basename(fpath)
    month = basename.replace("separations_", "").replace(".txt", "")
    if month <= "202309":
        continue
    with open(fpath, 'r') as f:
        reader = csv.DictReader(f, delimiter='|')
        for row in reader:
            sep = row['separation_category_code'].strip()
            count = int(row['count'].strip())
            if sep not in SEP_TYPES:
                continue
            monthly_by_type[sep][month] += count
            # Agency
            agency_code = row.get('agency_code', '').strip()
            if agency_code:
                agency_by_type[sep][agency_code] += count
                if agency_code not in AGENCY_NAMES:
                    AGENCY_NAMES[agency_code] = row.get('agency', '').strip()
            # Occupation
            occ_name = row.get('occupational_series', '').strip()
            if occ_name:
                occ_by_type[sep][occ_name] += count
            # Age
            age = row.get('age_bracket', '').strip()
            if age and age != 'REDACTED':
                age_by_type[sep][age] += count

# Build output
out_dir = os.path.expanduser("~/Projects/fedtracker-app/public/data/separation-types")
os.makedirs(out_dir, exist_ok=True)

for code, (name, desc) in SEP_TYPES.items():
    total = sum(monthly_by_type[code].values())
    trend = [{"month": m, "count": monthly_by_type[code][m]}
             for m in sorted(monthly_by_type[code].keys())]
    
    top_agencies = sorted(agency_by_type[code].items(), key=lambda x: -x[1])[:20]
    top_agencies = [{"code": c, "name": AGENCY_NAMES.get(c, c), "count": n} for c, n in top_agencies]
    
    top_occs = sorted(occ_by_type[code].items(), key=lambda x: -x[1])[:20]
    top_occs = [{"name": n, "count": c} for n, c in top_occs]
    
    age_dist = sorted(age_by_type[code].items(), key=lambda x: x[0])
    age_dist = [{"label": a, "count": c} for a, c in age_dist]
    
    avg_salary = 0
    s = salary_by_type[code]
    if s["total_count"] > 0:
        avg_salary = round(s["total_salary"] / s["total_count"])
    
    avg_los = 0
    l = los_by_type[code]
    if l["total_count"] > 0:
        avg_los = round(l["total_los"] / l["total_count"], 1)
    
    result = {
        "code": code, "name": name, "description": desc,
        "totalCount": total,
        "monthlyTrend": trend,
        "topAgencies": top_agencies,
        "topOccupations": top_occs,
        "byAge": age_dist,
        "avgSalaryAtSeparation": avg_salary,
        "avgLOS": avg_los
    }
    
    out_path = os.path.join(out_dir, f"{code}.json")
    with open(out_path, 'w') as f:
        json.dump(result, f)
    print(f"  {code} ({name}): {total:,} total, {len(trend)} months")

print("Done!")
