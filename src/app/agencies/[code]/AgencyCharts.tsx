"use client";
import { SeparationsChart } from "@/components/Charts";
import { formatMonth } from "@/lib/format";

export function AgencyCharts({ seps }: { seps: any }) {
  const data = seps.monthly.map((m: any) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Separations Over Time</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <SeparationsChart data={data} />
      </div>
    </section>
  );
}
