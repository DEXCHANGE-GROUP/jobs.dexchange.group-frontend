"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/jobs", label: "Offres" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">DX</span>
          </div>
          <span className="font-bold text-dark text-sm">
            DEXCHANGE <span className="text-gray-400 font-normal">JOBS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname.startsWith(href) ? "text-primary font-medium" : "text-gray-500 hover:text-dark"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/jobs"
            className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Postuler
          </Link>
        </nav>

        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border px-6 py-4 space-y-3 bg-white">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block text-sm text-gray-600 hover:text-primary">
              {label}
            </Link>
          ))}
          <Link href="/jobs" onClick={() => setOpen(false)} className="block text-sm text-primary font-medium">
            Postuler
          </Link>
        </nav>
      )}
    </header>
  );
}
