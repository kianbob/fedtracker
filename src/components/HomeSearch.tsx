"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface SearchItem {
  label: string;
  href: string;
  type: "Agency" | "Occupation" | "State";
}

export function HomeSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, items]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const typeColors: Record<string, string> = {
    Agency: "bg-indigo-100 text-indigo-700",
    Occupation: "bg-emerald-100 text-emerald-700",
    State: "bg-amber-100 text-amber-700",
  };

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto mt-6">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search agencies, occupations, or states..."
          className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/30 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((item, i) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-2 text-sm transition-colors ${
                i === activeIndex
                  ? "bg-indigo-50 text-indigo-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{item.label}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${typeColors[item.type]}`}
              >
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
