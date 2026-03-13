"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { removeToken } from "@/lib/auth";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", exact: true },
  { href: "/admin/jobs", label: "Offres", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/admin/applications", label: "Candidatures", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/admin/candidates", label: "Candidats", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    removeToken();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex-col shrink-0 hidden lg:flex">
        <div className="p-5 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/dexchange-logo.png" alt="DEXCHANGE" width={32} height={32} className="rounded-lg" />
            <div>
              <span className="font-bold text-dark text-sm block leading-tight">DEXCHANGE</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Espace RH</span>
            </div>
          </Link>
        </div>

        <div className="p-3">
          <Link
            href="/admin/jobs/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle offre
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {LINKS.map(({ href, label, icon, exact }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(href, exact) ? "bg-primary/5 text-primary font-medium" : "text-gray-500 hover:text-dark hover:bg-surface"
            }`}>
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors w-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/dexchange-logo.png" alt="DEXCHANGE" width={28} height={28} className="rounded-md" />
            <span className="text-xs font-bold text-dark">Espace RH</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-border px-4 py-3 space-y-1 bg-white">
            {LINKS.map(({ href, label, exact }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  isActive(href, exact) ? "text-primary font-medium bg-primary/5" : "text-gray-500"
                }`}>{label}</Link>
            ))}
            <Link href="/admin/jobs/new" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-primary font-medium">
              + Nouvelle offre
            </Link>
            <button onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-500">
              Déconnexion
            </button>
          </nav>
        )}
      </div>

      <main className="flex-1 min-w-0 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
