"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface MonthRow {
  month: string;
  accessions: number;
  separations: number;
  net_change: number;
  retirements?: number;
  quits?: number;
  rifs?: number;
}

export function MonthlyTimelineClient() {
  const [data, setData] = useState<MonthRow[]>([]);

  useEffect(() => {
    fetch("/data/monthly-timeline.json")
      .then((r) => r.json())
      .then((d: MonthRow[]) => setData(d))
      .catch(() => setData([]));
  }, []);

  if (!data.length) {
    return <div className="text-gray-400 py-12 text-center">Loading timeline data…</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Monthly Change</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => typeof value === "number" ? value.toLocaleString() : String(value ?? "")} />
            <Legend />
            <Line type="monotone" dataKey="accessions" stroke="#6366f1" name="Accessions" dot={false} />
            <Line type="monotone" dataKey="separations" stroke="#ef4444" name="Separations" dot={false} />
            <Line type="monotone" dataKey="net_change" stroke="#10b981" name="Net Change" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
