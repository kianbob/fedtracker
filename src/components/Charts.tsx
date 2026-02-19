"use client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#3730a3", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export function TrendAreaChart({ data, lines }: { data: any[]; lines: { key: string; color: string; name: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
        <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
        {lines.map((l) => (
          <Area key={l.key} type="monotone" dataKey={l.key} stroke={l.color} fill={l.color} fillOpacity={0.1} name={l.name} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, dataKey, nameKey, color = "#3730a3" }: { data: any[]; dataKey: string; nameKey: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 150 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
        <YAxis type="category" dataKey={nameKey} tick={{ fontSize: 11 }} width={140} />
        <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimplePieChart({ data, dataKey, nameKey }: { data: any[]; dataKey: string; nameKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="40%" outerRadius={100} label={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SeparationsChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
        <Tooltip formatter={(v: any) => Number(v).toLocaleString()} />
        <Legend />
        <Area type="monotone" dataKey="SH" name="RIF (Layoffs)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} stackId="1" />
        <Area type="monotone" dataKey="SJ" name="Termination" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} stackId="1" />
        <Area type="monotone" dataKey="SC" name="Quit" stroke="#3730a3" fill="#3730a3" fillOpacity={0.1} stackId="1" />
        <Area type="monotone" dataKey="SD" name="Voluntary Retirement" stroke="#10b981" fill="#10b981" fillOpacity={0.1} stackId="1" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
