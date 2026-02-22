import fs from "fs";
import path from "path";
import Link from "next/link";
import { Suspense } from "react";
import { CompareClient } from "./CompareClient";

export const metadata = {
  title: "Compare Federal Agencies — Side-by-Side Analysis — OpenFeds",
  description:
  alternates: { canonical: "/compare" },
    "Compare two federal agencies side-by-side on employees, salaries, risk scores, RIF counts, and more. Browse popular agency comparisons or build your own.",
};

interface IndexEntry {
  slug: string;
  title: string;
  agency1Name: string;
  agency2Name: string;
}

function getIndex(): IndexEntry[] {
  const filePath = path.join(process.cwd(), "public/data/comparisons/index.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function ComparePage() {
  const comparisons = getIndex();

  return (
    <>
      <Suspense>
        <CompareClient />
      </Suspense>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl font-bold mb-2">Popular Comparisons</h2>
        <p className="text-gray-500 mb-6">
          Browse pre-built side-by-side comparisons of the most commonly compared federal agencies.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="block p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition"
            >
              <span className="text-sm font-semibold text-indigo-600">{c.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
