#!/usr/bin/env python3
"""Rebuild separations.json from old bulk file + new monthly files."""
import csv
import json
import os
import glob
from collections import defaultdict

SEP_TYPES = ["SA","SB","SC","SD","SE","SF","SG","SH","SJ","SK","SL"]
TYPE_NAMES = {
    "SA": "Transfer Out", "SB": "Transfer Out (Mass)", "SC": "Quit",
    "SD": "Voluntary Retirement", "SE": "Early Retirement", "SF": "Disability Retirement",
    "SG": "Other Retirement", "SH": "RIF", "SJ": "Termination", "SK": "Death", "SL": "Other"
}

# Step 1: Read old bulk file (through Sep 2023)
old_file = os.path.expanduser("~/Projects/fedtracker-data/extracted/SEPDATA_FY2020-2024.TXT")
monthly = defaultdict(lambda: defaultdict(int))

print("Reading old bulk file...")
with open(old_file, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        month = row['EFDATE'].strip()
        sep = row['SEP'].strip()
        count = int(row['COUNT'].strip())
        if sep in SEP_TYPES and month <= "202309":
            monthly[month][sep] += count

print(f"Old data: {len(monthly)} months, range {min(monthly)}-{max(monthly)}")

# Step 2: Read new monthly files (Oct 2023 onward)
monthly_dir = os.path.expanduser("~/Projects/fedtracker-data/monthly/")
files = sorted(glob.glob(os.path.join(monthly_dir, "separations_*.txt")))
print(f"Found {len(files)} monthly files")

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
            if sep in SEP_TYPES:
                monthly[month][sep] += count

print(f"Total: {len(monthly)} months, range {min(monthly)}-{max(monthly)}")

# Step 3: Build output
result = {
    "types": TYPE_NAMES,
    "monthly": []
}

for month in sorted(monthly.keys()):
    entry = {"month": month}
    for sep in SEP_TYPES:
        entry[sep] = monthly[month].get(sep, 0)
    result["monthly"].append(entry)

# Sanity check
for entry in result["monthly"]:
    if entry["month"] in ("202310", "202501", "202505"):
        total = sum(entry[s] for s in SEP_TYPES)
        print(f"  {entry['month']}: total={total}")

out_path = os.path.expanduser("~/Projects/fedtracker-app/public/data/separations.json")
with open(out_path, 'w') as f:
    json.dump(result, f)
print(f"Written to {out_path} ({os.path.getsize(out_path)} bytes)")
