"use client";
import { SimpleBarChart } from "@/components/Charts";

export function ImpactChart({ data }: { data: { name: string; value: number }[] }) {
  return <SimpleBarChart data={data} dataKey="value" nameKey="name" color="#4F46E5" />;
}
