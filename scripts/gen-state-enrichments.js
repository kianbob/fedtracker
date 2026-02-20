const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const STATE_DETAIL_DIR = path.join(DATA_DIR, 'state-detail');

// Load source data
const geoImpact = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'geographic-impact.json'), 'utf8'));
const states = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'states.json'), 'utf8'));

// Build separations lookup from geographic-impact.json
const separationsMap = {};
for (const entry of geoImpact.separations_by_location) {
  separationsMap[entry.state] = entry.separations;
}

// Compute national average salary from states.json: sum(employees*avgSalary)/sum(employees)
// Exclude invalid/NDR entries
const validStates = states.filter(s => s.code !== '*' && s.code !== 'NDR');
let totalWeightedSalary = 0;
let totalEmployees = 0;
for (const s of validStates) {
  totalWeightedSalary += s.employees * s.avgSalary;
  totalEmployees += s.employees;
}
const nationalAvgSalary = Math.round(totalWeightedSalary / totalEmployees);

console.log(`National average salary: $${nationalAvgSalary.toLocaleString()}`);
console.log(`Total employees: ${totalEmployees.toLocaleString()}`);

// DOGE narratives for key states
const dogeNarratives = {
  DC: 'The Beltway Bubble — DC has the highest concentration of federal workers and felt DOGE cuts most directly. With over 100,000 federal employees, the district is ground zero for workforce reduction efforts.',
  VA: 'As part of the Pentagon corridor, Virginia houses DOD, intelligence agencies, and a massive contractor workforce. DOGE-driven cuts ripple through Northern Virginia communities deeply tied to federal spending.',
  MD: 'Maryland sits at the heart of the federal establishment, home to NIH, NSA, and dozens of agencies along the Baltimore-Washington corridor. Workforce reductions here impact both government and the surrounding economy.',
  CA: 'Home to major military bases, VA hospitals, and federal research labs like NASA JPL, California has one of the largest federal footprints outside the Beltway.',
  TX: 'Military installations, NASA Johnson Space Center, and border security operations make Texas a critical federal employment hub. DOGE cuts here affect national defense and immigration enforcement.',
  GA: 'CDC headquarters in Atlanta and major military installations like Fort Liberty make Georgia a key state for federal employment in healthcare and defense.',
  FL: 'VA healthcare facilities, military bases like MacDill AFB, and space operations at Cape Canaveral give Florida a diverse federal workforce vulnerable to DOGE restructuring.',
};

function formatSalary(n) {
  return '$' + n.toLocaleString();
}

// Process each state-detail file
const files = fs.readdirSync(STATE_DETAIL_DIR).filter(f => f.endsWith('.json'));
let enriched = 0;

for (const file of files) {
  const filePath = path.join(STATE_DETAIL_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const code = data.code;

  // Separations
  const separations = separationsMap[code] || 0;
  data.separations2025 = separations;

  // National avg and comparison
  data.nationalAvgSalary = nationalAvgSalary;
  const pctDiff = data.avgSalary
    ? Math.round(((data.avgSalary - nationalAvgSalary) / nationalAvgSalary) * 1000) / 10
    : 0;
  data.salaryVsNational = pctDiff;

  // DOGE narrative
  if (dogeNarratives[code]) {
    data.dogeNarrative = dogeNarratives[code];
  } else {
    const aboveBelow = pctDiff >= 0 ? `${pctDiff}% above` : `${Math.abs(pctDiff)}% below`;
    data.dogeNarrative = `${data.name} employs ${data.employees.toLocaleString()} federal workers with an average salary of ${formatSalary(data.avgSalary)}, ${aboveBelow} the national average. DOGE workforce reductions in 2025 resulted in ${separations.toLocaleString()} separations statewide.`;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  enriched++;
  console.log(`  ✓ ${code} — separations: ${separations}, salary vs national: ${pctDiff > 0 ? '+' : ''}${pctDiff}%`);
}

console.log(`\nDone! Enriched ${enriched} state files.`);
