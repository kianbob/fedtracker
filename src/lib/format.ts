export function formatNumber(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export function formatSalary(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "N/A";
  if (n === 0) return "$0";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatMonth(m: string): string {
  if (!m || m.length !== 6) return m;
  const year = m.slice(0, 4);
  const month = parseInt(m.slice(4, 6));
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month]} ${year}`;
}

const LOWERCASE_WORDS = ["OF", "THE", "AND", "FOR", "IN", "ON", "AT", "TO", "BY", "OR", "A", "AN"];

export function toTitleCase(s: string): string {
  if (!s || s === "REDACTED" || s === "INVALID" || s === "NO DATA REPORTED") return s;
  return s
    .split(/(\s+|-(?=[A-Za-z]))/)
    .map((word, i) => {
      if (/^\s+$/.test(word) || word === '-') return word;
      const upper = word.toUpperCase();
      if (i > 0 && LOWERCASE_WORDS.includes(upper)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bU\.s\./g, "U.S.")
    .replace(/\bNat\b/g, "National");
}

export const titleCase = toTitleCase;

export function cleanAgencyName(name: string): string {
  // Remove "XX-" prefix from agency names, then title-case
  return toTitleCase(name.replace(/^[A-Z0-9]+-/, ""));
}

// OPM agency name corrections (abbreviations/truncations in source data)
const AGENCY_NAME_FIXES: Record<string, string> = {
  'Dfc': 'U.S. International Development Finance Corporation',
  'Nat Aeronautics And Space Administration': 'NASA (National Aeronautics and Space Administration)',
  'Nat Archives And Records Administration': 'National Archives and Records Administration',
  'U.S. Agency For International Dev': 'U.S. Agency for International Development',
  'Court Services And Offendr Supervsn Agy': 'Court Services and Offender Supervision Agency',
  'Fed Mediation And Conciliation Service': 'Federal Mediation and Conciliation Service',
  'Corp For National And Community Service': 'Corporation for National and Community Service',
  'U.S. Cmsn On Internatl Religious Freedom': 'U.S. Commission on International Religious Freedom',
  'U.S.-China Economic & Security Rev Cmsn': 'U.S.-China Economic and Security Review Commission',
  'Internat Boundary Cmsn: U.S. And Canada': 'International Boundary Commission: U.S. and Canada',
  'Inter Bound And Water Comm U.S. Section': 'International Boundary and Water Commission U.S. Section',
  'International Joint Cmsn: U.S. & Canada': 'International Joint Commission: U.S. and Canada',
  'Department of Housing and Urban Developm': 'Department of Housing and Urban Development',
  'Federal Permitting Improvement Stee': 'Federal Permitting Improvement Steering Council',
  'Department Of Housing And Urban Developm': 'Department of Housing and Urban Development',
  'Federal Permitting Improvement Steering': 'Federal Permitting Improvement Steering Council',
  'Council of Insp. Gen. on Integ.& Effic.': 'Council of Inspectors General on Integrity and Efficiency',
  'Ofc of the Nat Cyber Dir': 'Office of the National Cyber Director',
  'Adv Council on Historic Preservation': 'Advisory Council on Historic Preservation',
  'Cmte For Purch Frm Pple Blind Or Sev Dis': 'Committee for Purchase From People Who Are Blind or Severely Disabled',
  'Nat Cmsn On Libraries And Info Science': 'National Commission on Libraries and Information Science',
  'Nat Foundation On Arts And Humanities': 'National Foundation on the Arts and Humanities',
  'Nat Aeronautics and Space Administration': 'National Aeronautics and Space Administration',
};

export function fixAgencyName(name: string): string {
  // Check exact match first
  if (AGENCY_NAME_FIXES[name]) return AGENCY_NAME_FIXES[name];
  // Check title-cased version
  const tc = toTitleCase(name);
  if (AGENCY_NAME_FIXES[tc]) return AGENCY_NAME_FIXES[tc];
  return tc;
}
