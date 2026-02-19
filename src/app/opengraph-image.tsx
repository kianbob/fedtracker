import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OpenFeds — Federal Workforce Data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #3730a3 0%, #6366f1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            OF
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            OpenFeds
          </span>
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Track the Federal Workforce
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "rgba(199,210,254,0.9)",
            lineHeight: 1.4,
          }}
        >
          2M+ employees · 128 agencies · Salaries, layoffs, trends
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "rgba(199,210,254,0.6)",
            marginTop: "32px",
          }}
        >
          Data from OPM FedScope · December 2025
        </div>
      </div>
    ),
    { ...size }
  );
}
