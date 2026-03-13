"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    exact: true,
  },
  {
    href: "/admin/jobs",
    label: "Offres",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    href: "/admin/applications",
    label: "Candidatures",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    href: "/admin/candidates",
    label: "Candidats",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-lg font-bold">
            <span className="text-primary">DEX</span>CHANGE
            <span className="text-primary/60 text-[10px] font-medium ml-1.5 uppercase tracking-widest">RH</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR_LINKS.map(({ href, label, icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-surface-light"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="text-sm font-bold">
          <span className="text-primary">DEX</span>CHANGE <span className="text-primary/60 text-[10px]">RH</span>
        </Link>
        <div className="flex gap-3">
          {SIDEBAR_LINKS.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs px-2 py-1 rounded ${
                isActive(href, exact) ? "text-primary bg-primary/10" : "text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:p-8 p-4 pt-18 lg:pt-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
