// Federal Pay Plan descriptions
const PAY_PLANS: Record<string, string> = {
  'GS': 'General Schedule',
  'GM': 'General Schedule (Senior)',
  'GG': 'General Schedule (Defense)',
  'GL': 'General Schedule (Law Enforcement)',
  'GW': 'General Schedule (Workers)',
  'GP': 'General Practice (VA Physicians)',
  'VM': 'VA Title 38 (Medical)',
  'VN': 'VA Nurse',
  'VP': 'VA Podiatrist/Optometrist',
  'VH': 'VA Hybrid Title 38',
  'VC': 'VA Canteen',
  'AD': 'Administratively Determined',
  'AL': 'Administrative Law Judge',
  'EX': 'Executive Schedule',
  'ES': 'Senior Executive Service',
  'EI': 'Expert/Consultant',
  'EJ': 'Expert/Consultant (Senior)',
  'EK': 'Expert/Consultant (Defense)',
  'EL': 'Expert/Consultant (Limited)',
  'EF': 'Executive Fellow',
  'EG': 'Senior Level (Scientific)',
  'EH': 'Senior Level (Professional)',
  'EN': 'Executive (Non-career)',
  'SL': 'Senior Level',
  'ST': 'Scientific/Professional',
  'FP': 'Foreign Service Pay',
  'FO': 'Foreign Service Officer',
  'FE': 'Foreign Service Executive',
  'FV': 'FAA Core Compensation',
  'FG': 'Federal Wage System (Supervisory)',
  'WE': 'Wage Employee',
  'NH': 'DoD Acquisition (Professional)',
  'NJ': 'DoD Acquisition (Technical)',
  'NK': 'DoD Acquisition (Administrative)',
  'NM': 'DoD Acquisition (Senior)',
  'ND': 'DoD Science & Technology',
  'NB': 'DoD Business Management',
  'NC': 'DoD Cyber',
  'NG': 'DoD Intelligence',
  'NO': 'DoD Operational',
  'NP': 'DoD Medical',
  'NR': 'DoD Research',
  'NT': 'DoD Technology',
  'CG': 'Coast Guard',
  'CM': 'Commissioned Corps (PHS)',
  'CN': 'Commissioned (NOAA)',
  'CT': 'Commissioned (Title 10)',
  'CU': 'Commissioned (Uniformed)',
  'DA': 'Defense Civilian Intelligence',
  'DB': 'Defense Band',
  'DE': 'Defense Expeditionary',
  'DG': 'Defense Intelligence',
  'DJ': 'Defense Intelligence (Senior)',
  'DK': 'Defense Clandestine',
  'DO': 'Defense Intelligence (Operational)',
  'DP': 'Defense Intelligence (Professional)',
  'DR': 'Defense Intelligence (Research)',
  'DS': 'Defense Intelligence (Specialist)',
  'DT': 'Defense Intelligence (Technical)',
  'DU': 'Defense Intelligence (Ungraded)',
  'DX': 'Defense Intelligence (Executive)',
  'ED': 'Education (Gallaudet)',
  'IC': 'Intelligence Community',
  'IE': 'Intelligence (Executive)',
  'IJ': 'Intelligence (Expert)',
  'IM': 'Intelligence (Manager)',
  'IP': 'Intelligence (Professional)',
  'IR': 'Intelligence (Research)',
  'IT': 'Intelligence (Technical)',
  'LE': 'Law Enforcement',
  'PG': 'Postal (Graded)',
  'RA': 'Research Associate',
  'RF': 'Research Foundation',
  'RG': 'Research Grade',
  'RS': 'Research Scientist',
  'SK': 'Skilled Trades',
  'SP': 'Senior Professional',
  'SR': 'Statutory Rate',
  'SS': 'Special Staff',
  'SV': 'TSA Security',
  'TR': 'Transportation',
  'ZA': 'NIST (Professional)',
  'ZP': 'NIST (Scientific)',
  'ZS': 'NIST (Support)',
  'ZT': 'NIST (Technical)',
  'ZZ': 'Miscellaneous Pay Plan',
  'AA': 'Administrative Appeals',
  'BN': 'Botanic Garden',
};

export function explainGrade(grade: string): { plan: string; level: string; planName: string } {
  if (!grade) return { plan: '', level: '', planName: '' };
  const parts = grade.split('-');
  const plan = parts[0] || '';
  const level = parts[1] || '';
  const planName = PAY_PLANS[plan] || plan;
  return { plan, level, planName };
}

export function formatGrade(grade: string): string {
  if (!grade) return '';
  const { planName, level } = explainGrade(grade);
  if (level === '00' || level === 'PH') {
    return `${grade} — ${planName}${level === 'PH' ? ' (Physician)' : ''}`;
  }
  return `${grade} — ${planName}${level ? ', Grade ' + level : ''}`;
}

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
  'AR': 'Department of the Army',
  'AF': 'Department of the Air Force',
  'NV': 'Department of the Navy',
  'DD': 'Department of Defense',
  'Ar': 'Department of the Army',
  'Af': 'Department of the Air Force',
  'Nv': 'Department of the Navy',
  'Dd': 'Department of Defense',
  'U.s.agency for Global Media': 'U.S. Agency for Global Media',
  'U.S.AGENCY FOR GLOBAL MEDIA': 'U.S. Agency for Global Media',
  'U.s. International Trade Commission': 'U.S. International Trade Commission',
  'U.s. Holocaust Memorial Museum': 'U.S. Holocaust Memorial Museum',
  'U.s.-china Economic & Security Rev Cmsn': 'U.S.-China Economic and Security Review Commission',
  'U.s. Cmsn on Internatl Religious Freedom': 'U.S. Commission on International Religious Freedom',
  'U.s. Interagency Council on Homelessness': 'U.S. Interagency Council on Homelessness',
  'Dfc': 'U.S. International Development Finance Corporation',
  'Nat Aeronautics And Space Administration': 'NASA (National Aeronautics and Space Administration)',
  'Nat Archives And Records Administration': 'National Archives and Records Administration',
  'U.S. Agency For International Dev': 'U.S. Agency for International Development',
  'Court Services And Offendr Supervsn Agy': 'Court Services and Offender Supervision Agency',
  'Fed Mediation And Conciliation Service': 'Federal Mediation and Conciliation Service',
  'Fed Mediation and Conciliation Service': 'Federal Mediation and Conciliation Service',
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
  'Privacy And Civil Liberties Oversight': 'Privacy and Civil Liberties Oversight Board',
  'Department Of Treasury': 'Department of the Treasury',
  'Department Of Interior': 'Department of the Interior',
  'Department Of Health And Human Serv': 'Department of Health and Human Services',
  'Department of Health and Human Serv': 'Department of Health and Human Services',
  'Department Of Veterans Affair': 'Department of Veterans Affairs',
  'Department of Veterans Affair': 'Department of Veterans Affairs',
};

// Pre-compute lowercase lookup map for case-insensitive matching
const AGENCY_NAME_FIXES_LOWER: Record<string, string> = {};
for (const [k, v] of Object.entries(AGENCY_NAME_FIXES)) {
  AGENCY_NAME_FIXES_LOWER[k.toLowerCase()] = v;
}

export function fixAgencyName(name: string): string {
  // Check exact match first
  if (AGENCY_NAME_FIXES[name]) return AGENCY_NAME_FIXES[name];
  // Check case-insensitive
  const lower = name.toLowerCase();
  if (AGENCY_NAME_FIXES_LOWER[lower]) return AGENCY_NAME_FIXES_LOWER[lower];
  // Check title-cased version
  const tc = toTitleCase(name);
  if (AGENCY_NAME_FIXES[tc]) return AGENCY_NAME_FIXES[tc];
  const tcLower = tc.toLowerCase();
  if (AGENCY_NAME_FIXES_LOWER[tcLower]) return AGENCY_NAME_FIXES_LOWER[tcLower];
  return tc;
}
