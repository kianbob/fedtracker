import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "data", "agencies");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const agencies = files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return {
      code: data.code,
      name: data.name,
      employees: data.employees || 0,
      avgSalary: data.avgSalary || 0,
      topOccupations: (data.topOccupations || []).slice(0, 10),
    };
  });
  return NextResponse.json(agencies);
}
