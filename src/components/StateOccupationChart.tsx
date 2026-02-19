"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of")
    .replace(/\bThe\b/g, "the")
    .replace(/\bOr\b/g, "or")
    .replace(/\bIn\b/g, "in")
    .replace(/\bFor\b/g, "for")
    .replace(/^./, (c) => c.toUpperCase());
}

export function StateOccupationChart({ data }: { data: { name: string; employees: number }[] }) {
  const chartData = data.slice(0, 10).map((d) => ({
    name: toTitleCase(d.name).replace(/ Group$| Family$/, ""),
    employees: d.employees,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 200 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={195} />
        <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
        <Bar dataKey="employees" fill="#4F46E5" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
