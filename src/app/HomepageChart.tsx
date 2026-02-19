"use client";
import { TrendAreaChart } from "@/components/Charts";
import { formatMonth } from "@/lib/format";

interface MonthlyData {
  month: string;
  separations: number;
  accessions: number;
}

export function HomepageChart({ data }: { data: MonthlyData[] }) {
  const chartData = data.map((m) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  return (
    <TrendAreaChart
      data={chartData}
      lines={[
        { key: "accessions", color: "#10b981", name: "Accessions (Hiring)" },
        { key: "separations", color: "#ef4444", name: "Separations (Leaving)" },
      ]}
    />
  );
}
