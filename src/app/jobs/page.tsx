"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS } from "@/lib/types";
import type { Job, PaginatedResponse } from "@/lib/types";

function formatSalary(salary?: { min?: number; max?: number; currency?: string }) {
  if (!salary?.min && !salary?.max) return null;
  const cur = salary.currency || "XOF";
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)} ${cur}`;
  if (salary.min) return `A partir de ${fmt(salary.min)} ${cur}`;
  return `Jusqu'a ${fmt(salary.max!)} ${cur}`;
}

export default function JobsPage() {
  const [data, setData] = useState<PaginatedResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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

  const resetFilters = () => {
    setSearch(""); setCategory(""); setType(""); setLocation(""); setRemote(undefined); setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <h1 className="text-3xl font-bold mb-8">Offres d&apos;emploi</h1>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Rechercher un poste..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Categorie"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Tous les types</option>
              {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Ville"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remote === true}
                onChange={(e) => { setRemote(e.target.checked ? true : undefined); setPage(1); }}
                className="accent-primary"
              />
              Teletravail uniquement
            </label>
            <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-white transition-colors">
              Reinitialiser
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">Aucune offre trouvee</p>
            <p className="text-sm">Essayez de modifier vos criteres de recherche.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{data.total} offre{data.total > 1 ? "s" : ""} trouvee{data.total > 1 ? "s" : ""}</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="group block bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-all animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {JOB_TYPE_LABELS[job.type] || job.type}
                    </span>
                    {job.remote && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Remote</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{job.company} &middot; {job.location}</p>
                  {formatSalary(job.salary) && (
                    <p className="text-sm text-gray-400 mb-3">{formatSalary(job.salary)}</p>
                  )}
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {job.skills.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded bg-surface-light text-gray-400">
                          {s}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-xs text-gray-600">+{job.skills.length - 4}</span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-2 text-sm rounded-lg border border-border text-gray-400 hover:text-white hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Precedent
                </button>
                <span className="text-sm text-gray-500 px-4">
                  {page} / {data.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page >= data.totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-border text-gray-400 hover:text-white hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
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
