#!/usr/bin/env node
/**
 * Generate CSV versions of key JSON data files.
 * Reads from public/data/ and writes to public/data/csv/
 */

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "public", "data");
const csvDir = path.join(dataDir, "csv");

if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir, { recursive: true });
}

function escapeCsv(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function writeCsv(filename, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCsv).join(","));
  }
  const outPath = path.join(csvDir, filename);
  fs.writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`  ${filename} (${rows.length} rows)`);
}

// 1. Agency list
function generateAgencies() {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, "agency-list.json"), "utf8"));
  const headers = ["code", "name", "employees", "avg_salary"];
  const rows = data.map((a) => [a.code, a.name, a.employees, a.avgSalary]);
  writeCsv("agencies.csv", headers, rows);
}

// 2. Occupations list
function generateOccupations() {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, "occupations.json"), "utf8"));
  const headers = ["code", "name", "family", "employees", "avg_salary"];
  const rows = data
    .filter((o) => o.code !== "*" && o.name.toLowerCase() !== "invalid")
    .map((o) => [o.code, o.name, o.family, o.employees, o.avgSalary]);
  writeCsv("occupations.csv", headers, rows);
}

// 3. Separation summary — aggregate totals by type from monthly data
function generateSeparations() {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, "separations.json"), "utf8"));
  const types = data.types;
  const codes = Object.keys(types);

  // Sum across all months
  const totals = {};
  for (const code of codes) totals[code] = 0;
  for (const month of data.monthly) {
    for (const code of codes) {
      totals[code] += month[code] || 0;
    }
  }

  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const headers = ["code", "type", "count", "percentage"];
  const rows = codes
    .sort((a, b) => totals[b] - totals[a])
    .map((code) => [code, types[code], totals[code], ((totals[code] / grandTotal) * 100).toFixed(1)]);
  writeCsv("separations.csv", headers, rows);
}

// 4. State impact
function generateStates() {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, "state-impact.json"), "utf8"));
  const headers = ["state", "current_employees", "separations_2025", "separations_2024", "change_pct", "rifs", "quits", "impact_pct"];
  const rows = data
    .filter((s) => s.state !== "INVALID" && s.state !== "NO DATA REPORTED")
    .map((s) => [s.state, s.currentEmployees, s.seps2025, s.seps2024, s.sepChange, s.rifs, s.quits, s.impactPct]);
  writeCsv("state-impact.csv", headers, rows);
}

console.log("Generating CSV files...");
generateAgencies();
generateOccupations();
generateSeparations();
generateStates();
console.log("Done!");
