"use client";
import Link from "next/link";
import { useState } from "react";

const topLinks = [
  { href: "/agencies", label: "Agencies" },
  { href: "/doge", label: "DOGE Impact" },
  { href: "/layoffs", label: "Separations" },
  { href: "/findings", label: "Key Findings" },
  { href: "/about", label: "About" },
];

const moreLinks = [
  { href: "/trends", label: "Trends" },
  { href: "/workforce-analysis", label: "Deep Dive" },
  { href: "/occupations", label: "Occupations" },
  { href: "/demographics", label: "Demographics" },
  { href: "/salaries", label: "Salaries" },
  { href: "/states", label: "States" },
  { href: "/subagencies", label: "Subagencies" },
];

const mobileMainLinks = [
  { href: "/", label: "Home" },
  { href: "/agencies", label: "Agencies" },
  { href: "/doge", label: "DOGE Impact" },
  { href: "/layoffs", label: "Separations" },
  { href: "/findings", label: "Key Findings" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-serif text-xl font-bold text-gray-900">FedTracker</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-accent rounded-md hover:bg-accent-50 transition-colors"
              >
                {l.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className="px-3 py-2 text-sm text-gray-600 hover:text-accent rounded-md hover:bg-accent-50 transition-colors inline-flex items-center gap-1"
              >
                More
                <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 pt-1">
                  <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {moreLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-accent hover:bg-accent-50 transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {mobileMainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent border-b border-gray-100"
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile More expandable section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent"
            >
              <span>More</span>
              <svg className={`w-4 h-4 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileMoreOpen && (
              <div className="bg-gray-50">
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-8 py-2.5 text-sm text-gray-600 hover:text-accent hover:bg-accent-50 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
