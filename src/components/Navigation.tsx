"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { DarkModeToggle } from "./DarkModeToggle";

interface NavItem {
  href: string;
  title: string;
  description: string;
}

interface NavCategory {
  label: string;
  hubHref: string;
  items: NavItem[];
}

const categories: NavCategory[] = [
  {
    label: "Explore",
    hubHref: "/explore",
    items: [
      { href: "/agencies", title: "Agencies", description: "128 federal agencies" },
      { href: "/occupations", title: "Occupations", description: "540+ federal job series" },
      { href: "/states", title: "States", description: "Federal workers by state" },
      { href: "/subagencies", title: "Subagencies", description: "Agency subdivisions" },
      { href: "/lookup", title: "Agency Lookup", description: "Search any agency" },
    ],
  },
  {
    label: "Workforce",
    hubHref: "/workforce",
    items: [
      { href: "/trends", title: "Trends", description: "Employment over time" },
      { href: "/demographics", title: "Demographics", description: "Age, gender, veterans" },
      { href: "/salaries", title: "Salaries", description: "Pay analysis" },
      { href: "/appointments", title: "Appointments", description: "Hiring types" },
      { href: "/education", title: "Education & Pay", description: "Degree vs salary" },
      { href: "/spending", title: "Agency Spending", description: "Budget per employee" },
    ],
  },
  {
    label: "DOGE & Cuts",
    hubHref: "/cuts",
    items: [
      { href: "/doge", title: "DOGE Impact Dashboard", description: "Live impact tracker" },
      { href: "/layoffs", title: "Separations", description: "All departure types" },
      { href: "/who-got-cut", title: "Who Got Cut", description: "Detailed breakdown" },
      { href: "/risk", title: "Risk Scores", description: "Agency vulnerability" },
      { href: "/impact", title: "State Impact", description: "Geographic effects" },
      { href: "/timeline", title: "Timeline", description: "Month-by-month changes" },
      { href: "/occupation-impact", title: "Occupation Impact", description: "Jobs at risk" },
    ],
  },
  {
    label: "Analysis",
    hubHref: "/analysis",
    items: [
      { href: "/findings", title: "Key Findings", description: "Overview" },
      { href: "/workforce-analysis", title: "Workforce Deep Dive", description: "Comprehensive analysis" },
      { href: "/federal-bloat", title: "Federal Bloat", description: "Size & efficiency" },
      { href: "/salary-analysis", title: "Salary Analysis", description: "Pay patterns" },
      { href: "/brain-drain", title: "Brain Drain Index", description: "Who's really leaving" },
      { href: "/retirement-cliff", title: "Retirement Cliff", description: "Aging workforce risk" },
      { href: "/geographic-impact", title: "Geographic Impact", description: "Where federal jobs are" },
      { href: "/stem-workforce", title: "STEM Brain Drain", description: "Technical workforce analysis" },
      { href: "/salary-explorer", title: "Salary Explorer", description: "Interactive pay lookup" },
      { href: "/monthly-timeline", title: "Monthly Timeline", description: "Month-by-month changes" },
    ],
  },
  {
    label: "About",
    hubHref: "/about",
    items: [
      { href: "/about", title: "About", description: "About OpenFeds" },
      { href: "/downloads", title: "Downloads", description: "Download data files" },
      { href: "/updates", title: "Updates", description: "Latest changes" },
      { href: "/compare", title: "Compare", description: "Side-by-side comparison" },
      { href: "/workforce-analysis", title: "Workforce Analysis", description: "Comprehensive analysis" },
    ],
  },
];

function DesktopDropdown({
  category,
  open,
  onOpen,
  onClose,
}: {
  category: NavCategory;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(onClose, 150);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-indigo-400 rounded-md hover:bg-accent-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
      >
        {category.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="absolute top-full left-0 pt-1"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 150ms ease, transform 150ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          className="w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1"
          role="menu"
        >
          {category.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className="block px-4 py-2.5 hover:bg-accent-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            </Link>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
            <Link
              href={category.hubHref}
              onClick={onClose}
              className="block px-4 py-2 text-sm font-medium text-accent dark:text-indigo-400 hover:bg-accent-50 dark:hover:bg-gray-700 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAccordion({
  category,
  open,
  onToggle,
  onNavigate,
}: {
  category: NavCategory;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [open]);

  return (
    <div className="border-b border-gray-100 dark:border-gray-700">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-accent-50 dark:hover:bg-gray-800"
      >
        <span className="font-medium">{category.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight,
          transition: "max-height 200ms ease",
          overflow: "hidden",
        }}
      >
        <div className="bg-gray-50 dark:bg-gray-800/50">
          {category.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="block px-6 py-2.5 hover:bg-accent-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            </Link>
          ))}
          <Link
            href={category.hubHref}
            onClick={onNavigate}
            className="block px-6 py-2.5 text-sm font-medium text-accent dark:text-indigo-400 hover:bg-accent-50 dark:hover:bg-gray-700 transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="OpenFeds home">
            <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OF</span>
            </div>
            <span className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100">
              OpenFeds
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <DesktopDropdown
                key={cat.label}
                category={cat}
                open={openDropdown === cat.label}
                onOpen={() => setOpenDropdown(cat.label)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </div>

          {/* Right side: search, dark mode, hamburger */}
          <div className="flex items-center gap-1">
            <Link
              href="/lookup"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Search agencies"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
            <DarkModeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[calc(100vh-4rem)] overflow-y-auto"
          role="menu"
        >
          {categories.map((cat) => (
            <MobileAccordion
              key={cat.label}
              category={cat}
              open={openAccordion === cat.label}
              onToggle={() =>
                setOpenAccordion(openAccordion === cat.label ? null : cat.label)
              }
              onNavigate={closeMobile}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
