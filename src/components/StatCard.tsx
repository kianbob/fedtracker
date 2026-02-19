export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const textSize = value.length > 20 ? "text-sm" : value.length > 12 ? "text-xl" : "text-3xl";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 ${textSize} font-serif font-bold text-gray-900 break-words`}>{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}
