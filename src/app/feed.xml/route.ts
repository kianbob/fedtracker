const SITE_URL = "https://openfeds.org";

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
