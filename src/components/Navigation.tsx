"use client";
import Link from "next/link";
import { useState } from "react";

const topLinks = [
  { href: "/agencies", label: "Agencies" },
  { href: "/doge", label: "DOGE Impact" },
  { href: "/layoffs", label: "Separations" },
  { href: "/trends", label: "Trends" },
  { href: "/occupations", label: "Occupations" },
  { href: "/salaries", label: "Salaries" },
  { href: "/about", label: "About" },
];

const analysisLinks = [
  { href: "/workforce-analysis", label: "Deep Dive" },
  { href: "/findings", label: "Key Findings" },
  { href: "/demographics", label: "Demographics" },
];

const mobileTopLinks = [
  { href: "/", label: "Home" },
  { href: "/agencies", label: "Agencies" },
  { href: "/doge", label: "DOGE Impact" },
  { href: "/layoffs", label: "Separations" },
  { href: "/trends", label: "Trends" },
  { href: "/occupations", label: "Occupations" },
  { href: "/salaries", label: "Salaries" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAnalysisOpen, setMobileAnalysisOpen] = useState(false);

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
            {topLinks.slice(0, 4).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-accent rounded-md hover:bg-accent-50 transition-colors"
              >
                {l.label}
              </Link>
            ))}

            {/* Analysis dropdown — hover to open */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="px-3 py-2 text-sm text-gray-600 hover:text-accent rounded-md hover:bg-accent-50 transition-colors inline-flex items-center gap-1"
              >
                Analysis
                <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-1">
                  <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {analysisLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-accent hover:bg-accent-50 transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {topLinks.slice(4).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-accent rounded-md hover:bg-accent-50 transition-colors"
              >
                {l.label}
              </Link>
            ))}
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
          {mobileTopLinks.slice(0, 5).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent border-b border-gray-100"
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile Analysis expandable section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setMobileAnalysisOpen(!mobileAnalysisOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent"
            >
              <span>Analysis</span>
              <svg className={`w-4 h-4 transition-transform ${mobileAnalysisOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileAnalysisOpen && (
              <div className="bg-gray-50">
                {analysisLinks.map((l) => (
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

          {mobileTopLinks.slice(5).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent border-b border-gray-100"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
