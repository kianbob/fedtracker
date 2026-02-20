#!/usr/bin/env node
/**
 * Fix brain-drain.json agency_brain_drain names.
 * Entries currently have raw subagency codes (e.g. "DJ15") as names.
 * This script maps them to real names using agency-list.json and agency-subagencies/*.json.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

// Load data
const brainDrain = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'brain-drain.json'), 'utf8'));
const agencyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'agency-list.json'), 'utf8'));

// Build code→name map from agency-list (top-level agencies)
const agencyNameMap = {};
for (const a of agencyList) {
  agencyNameMap[a.code] = a.name;
}

// Build subagency code→name map from agency-subagencies/*.json
const subagencyNameMap = {};
const subagencyDir = path.join(DATA_DIR, 'agency-subagencies');
const subFiles = fs.readdirSync(subagencyDir).filter(f => f.endsWith('.json'));
for (const file of subFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(subagencyDir, file), 'utf8'));
  if (data.subagencies) {
    for (const sub of data.subagencies) {
      subagencyNameMap[sub.code] = sub.name;
    }
  }
}

// Also load agencies/*.json for subagency names (may have additional mappings)
const agenciesDir = path.join(DATA_DIR, 'agencies');
const agencyFiles = fs.readdirSync(agenciesDir).filter(f => f.endsWith('.json'));
for (const file of agencyFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(agenciesDir, file), 'utf8'));
  if (data.subagencies) {
    for (const sub of data.subagencies) {
      if (!subagencyNameMap[sub.code]) {
        subagencyNameMap[sub.code] = sub.name;
      }
    }
  }
}

// Title Case helper (converts "BUREAU OF ALCOHOL, TOBACCO..." → "Bureau of Alcohol, Tobacco...")
function toTitleCase(str) {
  const smallWords = new Set(['of', 'the', 'and', 'for', 'in', 'on', 'at', 'to', 'a', 'an', 'by', 'or']);
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-/,(])\S/g, (match) => match.toUpperCase())
    .replace(/\b(\w+)\b/g, (word, _, offset) => {
      if (offset > 0 && smallWords.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word;
    })
    // Re-capitalize first word always
    .replace(/^./, c => c.toUpperCase())
    // Fix "U.s." → "U.S."
    .replace(/\bU\.s\./g, 'U.S.');
}

// Fix names
let fixed = 0;
let fallbackToParent = 0;
let notFound = 0;

for (const entry of brainDrain.agency_brain_drain) {
  const code = entry.code;

  // 1. Try exact subagency match
  if (subagencyNameMap[code]) {
    entry.name = toTitleCase(subagencyNameMap[code]);
    fixed++;
    continue;
  }

  // 2. Try exact top-level agency match
  if (agencyNameMap[code]) {
    entry.name = agencyNameMap[code]; // already Title Case from agency-list
    fixed++;
    continue;
  }

  // 3. Fallback: use parent agency (first 2 chars of code)
  const parentCode = code.substring(0, 2);
  if (agencyNameMap[parentCode]) {
    entry.name = agencyNameMap[parentCode];
    fallbackToParent++;
    continue;
  }

  // 4. Check if parent has a subagencies file
  const parentSubFile = path.join(subagencyDir, `${parentCode}.json`);
  if (fs.existsSync(parentSubFile)) {
    const parentData = JSON.parse(fs.readFileSync(parentSubFile, 'utf8'));
    entry.name = toTitleCase(parentData.parentName);
    fallbackToParent++;
    continue;
  }

  notFound++;
  console.log(`  WARNING: No name found for code "${code}"`);
}

// Write updated file
fs.writeFileSync(path.join(DATA_DIR, 'brain-drain.json'), JSON.stringify(brainDrain, null, 2) + '\n');

console.log(`\nDone! Updated ${brainDrain.agency_brain_drain.length} entries:`);
console.log(`  Exact match: ${fixed}`);
console.log(`  Fallback to parent: ${fallbackToParent}`);
console.log(`  Not found: ${notFound}`);
console.log(`\nSample entries:`);
brainDrain.agency_brain_drain.slice(0, 10).forEach(e =>
  console.log(`  ${e.code} → ${e.name}`)
);
