const SITE_URL = "https://www.openfeds.org";

const pages = [
  {
    title: "DOGE Impact Dashboard — 217K Federal Positions Restructured",
    description:
      "Data-driven analysis of the 2025 federal workforce restructuring under DOGE: 217,177 net positions reduced, 10,721 RIFs, hiring reduced 54%.",
    url: "/doge",
    date: "2025-02-01",
  },
  {
    title: "Who Got Cut: The DOGE Workforce Reduction",
    description:
      "335,000 federal separations in 2025 — a 67% increase. RIFs surged from 46 to 10,721. Here's who was affected and where the jobs disappeared.",
    url: "/who-got-cut",
    date: "2025-02-01",
  },
  {
    title: "Key Findings — The Real State of the Federal Workforce",
    description:
      "Data-driven analysis of the federal workforce in 2025: the DOGE effect, retirement cliff, experience drain, STEM brain drain, and more.",
    url: "/findings",
    date: "2025-01-15",
  },
  {
    title: "Is the Federal Workforce Too Big?",
    description:
      "The federal workforce is smaller than in 1960, but spending per employee has exploded. The real bloat isn't headcount — it's the shadow contractor workforce.",
    url: "/federal-bloat",
    date: "2025-01-15",
  },
  {
    title: "Federal Pay: Are Government Workers Overpaid?",
    description:
      "The average federal salary is $116,751 — but most workers earn $60-100K. The real story is a system that rewards longevity over performance.",
    url: "/salary-analysis",
    date: "2025-01-15",
  },
  {
    title: "The Brain Drain Index: Who's Really Leaving Government?",
    description:
      "Senior employees leaving earn $49K more than new hires replacing them. The federal brain drain is real — and the data proves it.",
    url: "/brain-drain",
    date: "2025-02-15",
  },
  {
    title: "The Federal Retirement Cliff: Which Agencies Are Next?",
    description:
      "54.5% of Selective Service employees are near retirement. Dozens of agencies face a demographic tsunami on top of DOGE cuts.",
    url: "/retirement-cliff",
    date: "2025-02-15",
  },
  {
    title: "Geographic Impact: Where Federal Jobs Are Disappearing",
    description:
      "DC, California, and Georgia lost the most federal workers. But the Beltway Bubble means the real impact is felt nationwide.",
    url: "/geographic-impact",
    date: "2025-02-15",
  },
  {
    title: "The STEM Brain Drain: Are We Losing America's Technical Workforce?",
    description:
      "552K federal STEM workers across 128 agencies. Engineers, scientists, and healthcare professionals — who employs them and what happens when they leave.",
    url: "/stem-workforce",
    date: "2025-02-15",
  },
  {
    title: "Month by Month: How the Federal Workforce Changed (FY2020-2024)",
    description:
      "48 months of federal workforce data reveals the patterns annual numbers hide: seasonal hiring waves, COVID disruptions, and the DOGE effect.",
    url: "/monthly-timeline",
    date: "2025-02-15",
  },
  {
    title: "Occupation Impact: Which Federal Jobs Were Hit Hardest by DOGE",
    description:
      "Administrative, clerical, and medical roles bore the brunt of federal workforce reductions. See which occupations lost the most people.",
    url: "/occupation-impact",
    date: "2025-02-15",
  },
  {
    title: "Career vs. Temporary: Appointment Types and Who Got Cut",
    description:
      "Career employees made up the bulk of RIFs, but temporary and Schedule A workers were disproportionately affected by DOGE reductions.",
    url: "/appointments",
    date: "2025-02-15",
  },
  {
    title: "Education & Salary: Does a Degree Pay Off in Government?",
    description:
      "Federal pay by education level: Bachelor's, Master's, PhD, and Professional degrees. How education affects federal salaries across agencies.",
    url: "/education",
    date: "2025-02-15",
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = pages
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}${p.url}</link>
      <guid>${SITE_URL}${p.url}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenFeds — Federal Workforce Data</title>
    <link>${SITE_URL}</link>
    <description>Data-driven analysis of the federal workforce: employees, salaries, layoffs, and hiring across all agencies.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
