#!/usr/bin/env node
/**
 * Fix geographic-impact.json separations_by_location.
 * Entries use FIPS numeric codes — convert to state abbreviations to match current_by_state.
 * Overseas/territory codes get descriptive names.
 * Remove aggregate entries (US, **).
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const gi = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'geographic-impact.json'), 'utf8'));

const fipsToState = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

// Overseas/territory codes
const specialCodes = {
  'RQ': 'PR', // Puerto Rico (use PR to match standard abbreviation)
  'GQ': 'GU', // Guam
};

// Codes to drop (aggregate/overseas non-matchable)
const dropCodes = new Set(['US', '**', 'GM', 'JA', 'KS', 'IT', 'UK']);

const converted = [];
let dropped = 0;

for (const entry of gi.separations_by_location) {
  const code = entry.code;

  if (dropCodes.has(code)) {
    dropped++;
    console.log(`  Dropped: ${code} (${entry.separations} separations)`);
    continue;
  }

  if (fipsToState[code]) {
    converted.push({ state: fipsToState[code], separations: entry.separations });
  } else if (specialCodes[code]) {
    converted.push({ state: specialCodes[code], separations: entry.separations });
  } else {
    console.log(`  WARNING: Unknown code "${code}" — keeping as-is`);
    converted.push({ state: code, separations: entry.separations });
  }
}

gi.separations_by_location = converted;

fs.writeFileSync(path.join(DATA_DIR, 'geographic-impact.json'), JSON.stringify(gi, null, 2) + '\n');

console.log(`\nDone! Converted ${converted.length} entries, dropped ${dropped}`);
console.log(`\nSample entries:`);
converted.slice(0, 10).forEach(e => console.log(`  ${e.state}: ${e.separations} separations`));
