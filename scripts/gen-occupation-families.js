const fs = require('fs');
const path = require('path');

const occupations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'occupations.json'), 'utf-8')
);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const familyMap = {};

for (const occ of occupations) {
  if (!occ.family || occ.family === 'Invalid' || occ.code === '*') continue;
  if (!familyMap[occ.family]) {
    familyMap[occ.family] = { name: occ.family, slug: slugify(occ.family), occupations: [] };
  }
  familyMap[occ.family].occupations.push(occ);
}

const families = Object.values(familyMap).map(f => {
  const totalEmployees = f.occupations.reduce((s, o) => s + o.employees, 0);
  const weightedSalary = f.occupations.reduce((s, o) => s + o.avgSalary * o.employees, 0);
  const avgSalary = totalEmployees > 0 ? Math.round(weightedSalary / totalEmployees) : 0;
  const sorted = [...f.occupations].sort((a, b) => b.employees - a.employees);
  return {
    slug: f.slug,
    name: f.name,
    totalEmployees,
    avgSalary,
    occupationCount: f.occupations.length,
    topOccupations: sorted.slice(0, 10).map(o => ({ code: o.code, name: o.name, employees: o.employees, avgSalary: o.avgSalary })),
    allOccupations: sorted.map(o => ({ code: o.code, name: o.name, employees: o.employees, avgSalary: o.avgSalary })),
  };
}).sort((a, b) => b.totalEmployees - a.totalEmployees);

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'data', 'occupation-families.json'),
  JSON.stringify(families, null, 2)
);

console.log(`Generated ${families.length} occupation families`);
