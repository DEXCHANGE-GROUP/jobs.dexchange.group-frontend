"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS } from "@/lib/types";
import type { Job, PaginatedResponse } from "@/lib/types";

const CATEGORIES = [
  "Technologie",
  "Finance & Compliance",
  "Commercial",
  "Marketing",
  "Operations",
  "RH",
  "Juridique",
  "Direction",
];

function formatSalary(salary?: { min?: number; max?: number; currency?: string }) {
  if (!salary?.min && !salary?.max) return null;
  const cur = salary.currency || "XOF";
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} ${cur}`;
  if (salary.min) return `À partir de ${fmt(salary.min)} ${cur}`;
  return `Jusqu'à ${fmt(salary.max!)} ${cur}`;
}

function JobsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState<boolean | undefined>();
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.jobs.list({
        status: "published",
        search: search || undefined,
        category: category || undefined,
        type: type || undefined,
        location: location || undefined,
        remote,
        page,
        limit: 12,
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [search, category, type, location, remote, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setPage(1);
  }, [searchParams]);

  const resetFilters = () => {
    setSearch(""); setCategory(""); setType(""); setLocation(""); setRemote(undefined); setPage(1);
  };

  const hasFilters = search || category || type || location || remote;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-dark">Offres d&apos;emploi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Trouvez le poste qui correspond à vos ambitions au sein du groupe DEXCHANGE.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">
        {/* Filters */}
        <div className="bg-white border border-border rounded-lg p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="Rechercher un poste..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Tous les départements</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Tous les types</option>
              {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input
              type="text" placeholder="Ville" value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" checked={remote === true} onChange={(e) => { setRemote(e.target.checked ? true : undefined); setPage(1); }} className="accent-primary" />
              Télétravail uniquement
            </label>
            {hasFilters && (
              <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-primary transition-colors">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-base text-gray-500 mb-1">Aucune offre trouvée</p>
            <p className="text-sm text-gray-400">Essayez de modifier vos critères de recherche.</p>
            {hasFilters && (
              <button onClick={resetFilters} className="mt-4 text-sm text-primary hover:underline">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">{data.total} offre{data.total > 1 ? "s" : ""} disponible{data.total > 1 ? "s" : ""}</p>
            <div className="space-y-3">
              {data.data.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="flex items-center justify-between border border-border rounded-lg px-6 py-5 hover:border-primary/40 transition-colors group animate-fade-in"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors">{job.title}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-surface-light text-gray-500 border border-border">
                        {JOB_TYPE_LABELS[job.type] || job.type}
                      </span>
                      {job.remote && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-primary border border-blue-100">Remote</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {job.company} &middot; {job.location} &middot; {job.category}
                      {formatSalary(job.salary) ? ` — ${formatSalary(job.salary)}` : ""}
                    </p>
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.skills.slice(0, 5).map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-surface text-gray-500">{s}</span>
                        ))}
                        {job.skills.length > 5 && <span className="text-[11px] text-gray-400">+{job.skills.length - 5}</span>}
                      </div>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 ml-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                  className="px-4 py-2.5 text-sm rounded-lg border border-border text-gray-500 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Précédent
                </button>
                <span className="text-sm text-gray-400 px-4">Page {page} sur {data.totalPages}</span>
                <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page >= data.totalPages}
                  className="px-4 py-2.5 text-sm rounded-lg border border-border text-gray-500 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsContent />
    </Suspense>
  );
}
