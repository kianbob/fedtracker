import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-xs text-gray-400 mb-6">
      <Link href="/" className="hover:text-accent">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="mx-1.5">&gt;</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
