export function formatNumber(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export function formatSalary(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "N/A";
  if (n === 0) return "$0";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatMonth(m: string): string {
  if (!m || m.length !== 6) return m;
  const year = m.slice(0, 4);
  const month = parseInt(m.slice(4, 6));
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month]} ${year}`;
}

export function cleanAgencyName(name: string): string {
  // Remove "XX-" prefix from agency names
  return name.replace(/^[A-Z0-9]+-/, "").replace(/\b\w+/g, (w) => {
    if (["OF", "THE", "AND", "FOR", "IN", "ON", "AT", "TO", "BY"].includes(w)) return w.toLowerCase();
    return w.charAt(0) + w.slice(1).toLowerCase();
  }).replace(/^./, (c) => c.toUpperCase());
}
