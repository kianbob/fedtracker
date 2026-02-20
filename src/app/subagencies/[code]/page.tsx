import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNumber, formatSalary, toTitleCase } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import subagencies from "../../../../public/data/subagencies.json";

interface Subagency {
  code: string;
  name: string;
  parentCode: string;
  parentName: string;
  employees: number;
  avgSalary: number;
}

const allSubs = subagencies as Subagency[];
const sorted = [...allSubs].sort((a, b) => b.employees - a.employees);
const rankMap = new Map(sorted.map((s, i) => [s.code, i + 1]));
const byCode = new Map(allSubs.map((s) => [s.code.toLowerCase(), s]));

export const dynamicParams = true;

export function generateStaticParams() {
  return sorted.slice(0, 200).map((s) => ({ code: s.code.toLowerCase() }));
}

function findSub(code: string): Subagency | undefined {
  return byCode.get(code.toLowerCase()) ?? allSubs.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const sub = findSub(code);
  if (!sub) return { title: "Sub-Agency Not Found — OpenFeds" };
  const name = toTitleCase(sub.name);
  const parent = toTitleCase(sub.parentName);
  return {
    title: `${name} — ${formatNumber(sub.employees)} Employees — OpenFeds`,
    description: `${name} is a sub-agency of ${parent} with ${formatNumber(sub.employees)} employees and an average salary of ${formatSalary(sub.avgSalary)}. Explore workforce data on OpenFeds.`,
    openGraph: {
      title: `${name} — Federal Sub-Agency — OpenFeds`,
      description: `${formatNumber(sub.employees)} employees · Avg salary ${formatSalary(sub.avgSalary)} · Part of ${parent}`,
    },
  };
}

export default async function SubagencyDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const sub = findSub(code);
  if (!sub) notFound();

  const name = toTitleCase(sub.name);
  const parentName = toTitleCase(sub.parentName);
  const rank = rankMap.get(sub.code) ?? 0;
  const siblings = allSubs
    .filter((s) => s.parentCode === sub.parentCode && s.code !== sub.code)
    .sort((a, b) => b.employees - a.employees)
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "Subagencies", href: "/subagencies" },
          { label: name },
        ]}
      />

      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">{name}</h1>
      <p className="text-gray-500 mb-8">
        Part of{" "}
        <Link href={`/agencies/${sub.parentCode}`} className="text-indigo-600 hover:underline">
          {parentName}
        </Link>
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">Employees</div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(sub.employees)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">Average Salary</div>
          <div className="text-3xl font-bold text-gray-900">{formatSalary(sub.avgSalary)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-sm text-gray-500 mb-1">Rank by Size</div>
          <div className="text-3xl font-bold text-gray-900">#{rank}</div>
          <div className="text-xs text-gray-400">of {allSubs.length} sub-agencies</div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <p className="text-gray-700 leading-relaxed">
          {name} is a sub-agency of {parentName} with{" "}
          <strong>{sub.employees.toLocaleString()}</strong> employees and an average salary of{" "}
          <strong>{formatSalary(sub.avgSalary)}</strong>. It ranks{" "}
          <strong>#{rank}</strong> by workforce size among all {allSubs.length} federal sub-agencies.
        </p>
      </div>

      {/* Parent Agency Card */}
      <section className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Parent Agency</h2>
        <Link
          href={`/agencies/${sub.parentCode}`}
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
            {parentName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">View full agency profile with workforce data, occupations, and trends.</p>
          <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
        </Link>
      </section>

      {/* Sibling Sub-Agencies */}
      {siblings.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Sibling Sub-Agencies
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {siblings.map((s) => (
              <Link
                key={s.code}
                href={`/subagencies/${s.code}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-gray-900 font-medium">{toTitleCase(s.name)}</span>
                <span className="text-sm text-gray-500">{formatNumber(s.employees)} employees</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Links */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/subagencies", title: "All Subagencies", desc: "Browse all federal sub-agencies by parent department." },
            { href: "/agencies", title: "Agency Explorer", desc: "Compare workforce data across all federal agencies." },
            { href: "/states", title: "State Explorer", desc: "See where federal employees work across all 50 states." },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-serif font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
              <span className="text-indigo-600 text-sm font-medium mt-2 inline-block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
