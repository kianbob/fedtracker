#!/usr/bin/env python3
"""Update agency-separations JSON files with new monthly data (Oct 2023+)."""
import csv
import json
import os
import glob
from collections import defaultdict

SEP_TYPES = ["SA","SB","SC","SD","SE","SF","SG","SH","SJ","SK","SL"]
out_dir = os.path.expanduser("~/Projects/fedtracker-app/public/data/agency-separations")

# Step 1: Read old bulk file for agency-level monthly data through Sep 2023
old_file = os.path.expanduser("~/Projects/fedtracker-data/extracted/SEPDATA_FY2020-2024.TXT")
# agency -> month -> sep -> count
data = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
agency_names = {}

# Load existing agency names from files
for fn in os.listdir(out_dir):
    if fn.endswith('.json'):
        code = fn.replace('.json', '')
        try:
            with open(os.path.join(out_dir, fn)) as f:
                # Read just the first 200 chars to get the name
                content = f.read(200)
                import re
                m = re.search(r'"name":\s*"([^"]+)"', content)
                if m:
                    agency_names[code] = m.group(1)
        except:
            pass

print("Reading old bulk file...")
with open(old_file, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        month = row['EFDATE'].strip()
        sep = row['SEP'].strip()
        count = int(row['COUNT'].strip())
        agysub = row['AGYSUB'].strip()[:2]
        if sep in SEP_TYPES and month <= "202309":
            data[agysub][month][sep] += count

print(f"Old data: {len(data)} agencies")

# Step 2: Add new monthly data
monthly_dir = os.path.expanduser("~/Projects/fedtracker-data/monthly/")
files = sorted(glob.glob(os.path.join(monthly_dir, "separations_*.txt")))
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
            agency_code = row.get('agency_code', '').strip()
            if sep in SEP_TYPES and agency_code:
                data[agency_code][month][sep] += count
                if agency_code not in agency_names:
                    agency_names[agency_code] = row.get('agency', '').strip()

print(f"Total: {len(data)} agencies after adding new monthly data")

# Step 3: Write out
for agency_code in data:
    months = sorted(data[agency_code].keys())
    monthly_list = []
    for m in months:
        entry = {"month": m}
        for sep in SEP_TYPES:
            entry[sep] = data[agency_code][m].get(sep, 0)
        monthly_list.append(entry)
    
    result = {
        "code": agency_code,
        "name": agency_names.get(agency_code, agency_code),
        "monthly": monthly_list
    }
    
    out_path = os.path.join(out_dir, f"{agency_code}.json")
    with open(out_path, 'w') as f:
        json.dump(result, f)

print(f"Written {len(data)} agency separation files")
