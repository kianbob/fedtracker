import { AppointmentsClient } from "./AppointmentsClient";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Appointment Type Impact — Career vs Temporary: Who Got Cut — OpenFeds",
  description: "How DOGE cuts affected different federal appointment types: career, career-conditional, excepted service, SES, and temporary employees.",
  alternates: { canonical: "/appointments" },
};

function getData() {
  try {
    const p = path.join(process.cwd(), "public", "data", "appointment-impact.json");
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return null; }
}

export default function AppointmentsPage() {
  return <AppointmentsClient data={getData()} />;
}
