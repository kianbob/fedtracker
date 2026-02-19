"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function STEMCategoryChart({
  data,
}: {
  data: { category: string; employees: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
          }
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fontSize: 12 }}
          width={110}
        />
        <Tooltip
          formatter={(v: any) => [v.toLocaleString(), "Employees"]}
        />
        <Bar dataKey="employees" fill="#4F46E5" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
