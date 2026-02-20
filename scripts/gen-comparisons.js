#!/usr/bin/env node
/**
 * Generate agency comparison JSON files.
 * Reads public/data/agency-risk.json and produces:
 *   - public/data/comparisons/[slug].json  (one per matchup)
 *   - public/data/comparisons/index.json   (summary list)
 */

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "public", "data");
const outDir = path.join(dataDir, "comparisons");
const riskPath = path.join(dataDir, "agency-risk.json");

// ── Agency name cleanup (mirrors src/lib/format.ts) ──────────────────────────

function toTitleCase(str) {
  const SMALL_WORDS = new Set([
    "a","an","the","and","but","or","for","nor","on","at","to","by","of","in","is",
  ]);
  return str
    .split(" ")
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i !== 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

const AGENCY_NAME_FIXES = {
  "Department of Housing and Urban Developm": "Department of Housing and Urban Development",
  "Department Of Housing And Urban Developm": "Department of Housing and Urban Development",
  "Department Of Treasury": "Department of the Treasury",
  "Department of Treasury": "Department of the Treasury",
  "Department Of Interior": "Department of the Interior",
  "Department of Interior": "Department of the Interior",
  "Department Of Health And Human Serv": "Department of Health and Human Services",
  "Department of Health and Human Serv": "Department of Health and Human Services",
  "Department Of Veterans Affair": "Department of Veterans Affairs",
  "Department of Veterans Affair": "Department of Veterans Affairs",
  "U.s.agency for Global Media": "U.S. Agency for Global Media",
  "U.s. International Trade Commission": "U.S. International Trade Commission",
  "U.s. Holocaust Memorial Museum": "U.S. Holocaust Memorial Museum",
  "U.s.-china Economic & Security Rev Cmsn": "U.S.-China Economic and Security Review Commission",
  "U.s. Cmsn on Internatl Religious Freedom": "U.S. Commission on International Religious Freedom",
  "U.s. Interagency Council on Homelessness": "U.S. Interagency Council on Homelessness",
  "U.S. Agency For International Dev": "U.S. Agency for International Development",
  "U.S. Agency for International Development": "U.S. Agency for International Development",
  "U.S. Agency for International Dev": "U.S. Agency for International Development",
  "U.S. Cmsn On Internatl Religious Freedom": "U.S. Commission on International Religious Freedom",
  "U.S.-China Economic & Security Rev Cmsn": "U.S.-China Economic and Security Review Commission",
  "Internat Boundary Cmsn: U.S. And Canada": "International Boundary Commission: U.S. and Canada",
  "Inter Bound And Water Comm U.S. Section": "International Boundary and Water Commission U.S. Section",
  "International Joint Cmsn: U.S. & Canada": "International Joint Commission: U.S. and Canada",
  "Fed Mediation And Conciliation Service": "Federal Mediation and Conciliation Service",
  "Fed Mediation and Conciliation Service": "Federal Mediation and Conciliation Service",
  "Corp For National And Community Service": "Corporation for National and Community Service",
  "Court Services And Offendr Supervsn Agy": "Court Services and Offender Supervision Agency",
  "Council of Insp. Gen. on Integ.& Effic.": "Council of Inspectors General on Integrity and Efficiency",
  "Ofc of the Nat Cyber Dir": "Office of the National Cyber Director",
  "Adv Council on Historic Preservation": "Advisory Council on Historic Preservation",
  "Cmte For Purch Frm Pple Blind Or Sev Dis": "Committee for Purchase From People Who Are Blind or Severely Disabled",
  "Cmte for Purch Frm Pple Blind or Sev Dis": "Committee for Purchase From People Who Are Blind or Severely Disabled",
  "Nat Cmsn On Libraries And Info Science": "National Commission on Libraries and Information Science",
  "Nat Foundation On Arts And Humanities": "National Foundation on the Arts and Humanities",
  "Privacy And Civil Liberties Oversight": "Privacy and Civil Liberties Oversight Board",
  "Federal Permitting Improvement Steer": "Federal Permitting Improvement Steering Council",
  "Federal Permitting Improvement Steering": "Federal Permitting Improvement Steering Council",
};

// Build case-insensitive lookup
const AGENCY_NAME_FIXES_LOWER = {};
for (const [k, v] of Object.entries(AGENCY_NAME_FIXES)) {
  AGENCY_NAME_FIXES_LOWER[k.toLowerCase()] = v;
}

function cleanAgencyName(name) {
  if (!name) return name;
  // Direct match
  if (AGENCY_NAME_FIXES[name]) return AGENCY_NAME_FIXES[name];
  // Case-insensitive match
  const lower = name.toLowerCase();
  if (AGENCY_NAME_FIXES_LOWER[lower]) return AGENCY_NAME_FIXES_LOWER[lower];
  // Title-case and check again
  const tc = toTitleCase(name);
  if (AGENCY_NAME_FIXES[tc]) return AGENCY_NAME_FIXES[tc];
  const tcLower = tc.toLowerCase();
  if (AGENCY_NAME_FIXES_LOWER[tcLower]) return AGENCY_NAME_FIXES_LOWER[tcLower];
  return tc;
}

// Short display name: strip "Department of (the) " prefix, "U.S. Agency for " etc.
function shortName(fullName) {
  return fullName
    .replace(/^Department of the /, "")
    .replace(/^Department of /, "")
    .replace(/^U\.S\. Agency for International Development$/, "USAID")
    .replace(/^National Aeronautics and Space Administration$/, "NASA")
    .replace(/^Environmental Protection Agency$/, "EPA")
    .replace(/^General Services Administration$/, "GSA")
    .replace(/^Office of Personnel Management$/, "OPM")
    .replace(/^Office of Management and Budget$/, "OMB")
    .replace(/^Small Business Administration$/, "SBA")
    .replace(/^Social Security Administration$/, "SSA")
    .replace(/^National Science Foundation$/, "NSF")
    .replace(/^Securities and Exchange Commission$/, "SEC")
    .replace(/^Commodity Futures Trading Commission$/, "CFTC")
    .replace(/^Federal Deposit Insurance Corporation$/, "FDIC")
    .replace(/^National Credit Union Administration$/, "NCUA")
    .replace(/^Federal Trade Commission$/, "FTC")
    .replace(/^Federal Communications Commission$/, "FCC")
    .replace(/^Nuclear Regulatory Commission$/, "NRC")
    .replace(/^Peace Corps$/, "Peace Corps");
}

// ── Hardcoded matchups ───────────────────────────────────────────────────────

const MATCHUPS = [
  { slug: "va-vs-dod",              codes: ["VA", "DD"] },
  { slug: "dhs-vs-doj",             codes: ["HS", "DJ"] },
  { slug: "nasa-vs-doe",            codes: ["NN", "DN"] },
  { slug: "hhs-vs-ed",              codes: ["HE", "ED"] },
  { slug: "epa-vs-doi",             codes: ["EP", "IN"] },
  { slug: "state-vs-usaid",         codes: ["ST", "AM"] },
  { slug: "gsa-vs-opm",             codes: ["GS", "OM"] },
  { slug: "usda-vs-doi",            codes: ["AG", "IN"] },
  { slug: "treasury-vs-ssa",        codes: ["TR", "SZ"] },
  { slug: "doj-vs-dhs",             codes: ["DJ", "HS"] },
  { slug: "navy-vs-army",           codes: ["NV", "AR"] },
  { slug: "army-vs-air-force",      codes: ["AR", "AF"] },
  { slug: "va-vs-hhs",              codes: ["VA", "HE"] },
  { slug: "ed-vs-labor",            codes: ["ED", "DL"] },
  { slug: "commerce-vs-agriculture",codes: ["CM", "AG"] },
  { slug: "dot-vs-dhs",             codes: ["TD", "HS"] },
  { slug: "epa-vs-energy",          codes: ["EP", "DN"] },
  { slug: "nasa-vs-nsf",            codes: ["NN", "NF"] },
  { slug: "hud-vs-ed",              codes: ["HU", "ED"] },
  { slug: "sba-vs-gsa",             codes: ["SB", "GS"] },
  { slug: "state-vs-doj",           codes: ["ST", "DJ"] },
  { slug: "treasury-vs-commerce",   codes: ["TR", "CM"] },
  { slug: "labor-vs-hhs",           codes: ["DL", "HE"] },
  { slug: "interior-vs-agriculture",codes: ["IN", "AG"] },
  { slug: "opm-vs-omb",             codes: ["OM", "BO"] },
  { slug: "sec-vs-cftc",            codes: ["SE", "CT"] },
  { slug: "fdic-vs-ncua",           codes: ["FD", "CU"] },
  { slug: "ftc-vs-fcc",             codes: ["FT", "FC"] },
  { slug: "nrc-vs-epa",             codes: ["NU", "EP"] },
  { slug: "usaid-vs-peace-corps",   codes: ["AM", "PU"] },
];

// ── Main ─────────────────────────────────────────────────────────────────────

const agencies = JSON.parse(fs.readFileSync(riskPath, "utf-8"));
const byCode = {};
for (const a of agencies) {
  byCode[a.code] = a;
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const index = [];

for (const { slug, codes } of MATCHUPS) {
  const [code1, code2] = codes;
  const raw1 = byCode[code1];
  const raw2 = byCode[code2];

  if (!raw1) {
    console.warn(`⚠  Skipping ${slug}: agency code ${code1} not found`);
    continue;
  }
  if (!raw2) {
    console.warn(`⚠  Skipping ${slug}: agency code ${code2} not found`);
    continue;
  }

  const name1 = cleanAgencyName(raw1.name);
  const name2 = cleanAgencyName(raw2.name);
  const title = `${shortName(name1)} vs ${shortName(name2)}`;

  const agency1 = { ...raw1, name: name1 };
  const agency2 = { ...raw2, name: name2 };

  const comparison = { slug, title, agency1, agency2 };

  const outPath = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(comparison, null, 2));

  index.push({
    slug,
    title,
    agency1Name: name1,
    agency2Name: name2,
  });
}

const indexPath = path.join(outDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log(`✓ Generated ${index.length} comparison files in public/data/comparisons/`);
