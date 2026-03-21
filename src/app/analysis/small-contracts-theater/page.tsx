import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Small Contracts Theater — OpenFeds",
  description: "8,000 DOGE contract cuts that saved almost nothing.",
  alternates: { canonical: "/analysis/small-contracts-theater" },
};

export default function SmallContractsTheaterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
        Small Contracts Theater
      </h1>
      <p className="text-gray-600">Full article coming soon.</p>
    </div>
  );
}
