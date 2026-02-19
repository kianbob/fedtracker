import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function readJson(filename: string) {
  const filePath = path.join(process.cwd(), "public", "data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function formatMonth(m: string) {
  const year = m.slice(0, 4);
  const month = parseInt(m.slice(4, 6));
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month - 1]} ${year}`;
}

function toTitleCase(str: string) {
  return str
    .replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\b(And|Of|The|Or|In|For)\b/g, (w) => w.toLowerCase());
}

function wrapHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="public, max-age=3600">
  <meta http-equiv="Expires" content="${new Date(Date.now() + 3600000).toUTCString()}">
  <title>${title} — FedTracker</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #1f2937; padding: 20px; position: relative; min-height: 100vh; }
    h2 { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #111827; }
    .watermark { position: fixed; bottom: 8px; right: 12px; font-size: 11px; color: #9ca3af; text-decoration: none; }
    .watermark:hover { color: #4F46E5; }
    .bar-row { display: flex; align-items: center; margin-bottom: 6px; font-size: 12px; }
    .bar-label { width: 220px; text-align: right; padding-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #374151; flex-shrink: 0; }
    .bar-container { flex: 1; height: 22px; background: #f3f4f6; border-radius: 4px; overflow: hidden; position: relative; }
    .bar-fill { height: 100%; background: #4F46E5; border-radius: 4px; transition: width 0.3s; }
    .bar-value { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 11px; color: #6b7280; }
    @media (max-width: 600px) {
      .bar-label { width: 140px; font-size: 11px; }
      .bar-row { margin-bottom: 4px; }
    }
  </style>
</head>
<body>
  ${body}
  <a href="https://fedtracker.org" target="_blank" rel="noopener" class="watermark">FedTracker</a>
</body>
</html>`;
}

function dogeTimelineEmbed() {
  const data = readJson("doge-timeline.json");
  const maxSep = Math.max(...data.map((d: any) => d.separations));
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d: any, i: number) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.separations / maxSep) * chartH;
    return { x, y, month: d.month, sep: d.separations };
  });

  const linePath = points.map((p: any, i: number) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${points[points.length - 1].x.toFixed(1)},${(padding.top + chartH).toFixed(1)} L${points[0].x.toFixed(1)},${(padding.top + chartH).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const val = Math.round(maxSep * pct);
    const y = padding.top + chartH - pct * chartH;
    return { val, y };
  });

  // X-axis labels (every 6 months)
  const xLabels = points.filter((_: any, i: number) => i % 6 === 0);

  const svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;height:auto;">
    ${yTicks.map((t) => `<line x1="${padding.left}" y1="${t.y}" x2="${width - padding.right}" y2="${t.y}" stroke="#e5e7eb" /><text x="${padding.left - 8}" y="${t.y + 4}" text-anchor="end" font-size="11" fill="#6b7280">${t.val >= 1000 ? (t.val / 1000).toFixed(0) + "K" : t.val}</text>`).join("")}
    <path d="${areaPath}" fill="#4F46E5" fill-opacity="0.15" />
    <path d="${linePath}" fill="none" stroke="#4F46E5" stroke-width="2" />
    ${xLabels.map((p: any) => `<text x="${p.x}" y="${padding.top + chartH + 20}" text-anchor="middle" font-size="10" fill="#6b7280">${formatMonth(p.month)}</text>`).join("")}
  </svg>`;

  return wrapHtml("DOGE Timeline — Monthly Separations", `<h2>Monthly Federal Separations</h2>${svg}`);
}

function riskScoresEmbed() {
  const data = readJson("agency-risk.json").slice(0, 20);
  const maxScore = Math.max(...data.map((d: any) => d.riskScore));

  const bars = data.map((d: any) => {
    const pct = (d.riskScore / maxScore) * 100;
    return `<div class="bar-row">
      <div class="bar-label" title="${d.name}">${d.name}</div>
      <div class="bar-container">
        <div class="bar-fill" style="width:${pct}%"></div>
        <span class="bar-value">${d.riskScore}</span>
      </div>
    </div>`;
  }).join("");

  return wrapHtml("Agency Risk Scores", `<h2>Top 20 Agency Risk Scores</h2>${bars}`);
}

function stateImpactEmbed() {
  const raw = readJson("state-impact.json")
    .filter((d: any) => d.state !== "NO DATA REPORTED" && d.state !== "INVALID")
    .slice(0, 15);
  const maxSeps = Math.max(...raw.map((d: any) => d.seps2025));

  const bars = raw.map((d: any) => {
    const pct = (d.seps2025 / maxSeps) * 100;
    const name = toTitleCase(d.state);
    return `<div class="bar-row">
      <div class="bar-label" title="${name}">${name}</div>
      <div class="bar-container">
        <div class="bar-fill" style="width:${pct}%"></div>
        <span class="bar-value">${d.seps2025.toLocaleString()}</span>
      </div>
    </div>`;
  }).join("");

  return wrapHtml("State Impact — Job Losses", `<h2>Top 15 States by 2025 Separations</h2>${bars}`);
}

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  let html: string;
  try {
    switch (type) {
      case "doge-timeline":
        html = dogeTimelineEmbed();
        break;
      case "risk-scores":
        html = riskScoresEmbed();
        break;
      case "state-impact":
        html = stateImpactEmbed();
        break;
      default:
        return NextResponse.json({ error: "Unknown chart type. Valid: doge-timeline, risk-scores, state-impact" }, { status: 404 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
