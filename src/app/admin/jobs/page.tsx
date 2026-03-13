"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS } from "@/lib/types";
import type { Job, PaginatedResponse } from "@/lib/types";

const STATUS_TABS = [
  { value: "", label: "Toutes" },
  { value: "published", label: "Publiées" },
  { value: "draft", label: "Brouillon" },
  { value: "closed", label: "Fermées" },
];

export default function AdminJobsPage() {
  const [data, setData] = useState<PaginatedResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.jobs.list({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      }));
    } catch { setData(null); }
    finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const statusCls = (s: string) => {
    if (s === "published") return "bg-green-50 text-green-600 border-green-100";
    if (s === "draft") return "bg-yellow-50 text-yellow-600 border-yellow-100";
    if (s === "closed") return "bg-red-50 text-red-500 border-red-100";
    return "bg-gray-50 text-gray-500 border-gray-100";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark">Gestion des offres</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} offre{(data?.total || 0) > 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/admin/jobs/new" className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle offre
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-border rounded-lg p-1">
          {STATUS_TABS.map(({ value, label }) => (
            <button key={value} onClick={() => { setStatusFilter(value); setPage(1); }}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                statusFilter === value ? "bg-primary text-white" : "text-gray-500 hover:text-dark hover:bg-surface"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Rechercher une offre..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-1">Aucune offre trouvée</p>
            <Link href="/admin/jobs/new" className="text-sm text-primary hover:underline">Créer une offre</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-border bg-surface/50">
                    <th className="px-6 py-3 font-medium">Offre</th>
                    <th className="px-6 py-3 font-medium">Catégorie</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium text-center">Candidatures</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((job) => (
                    <tr key={job._id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-dark">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.company} &middot; {job.location}</p>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">{job.category}</td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">{JOB_TYPE_LABELS[job.type]}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="text-sm font-medium text-dark">{job.applicationsCount}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusCls(job.status)}`}>
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-400">
                        {new Date(job.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {job.status === "draft" && (
                            <button onClick={async () => { await api.jobs.publish(job._id); fetchJobs(); }}
                              className="px-2.5 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                              Publier
                            </button>
                          )}
                          {job.status === "published" && (
                            <button onClick={async () => { await api.jobs.close(job._id); fetchJobs(); }}
                              className="px-2.5 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors">
                              Fermer
                            </button>
                          )}
                          {job.status === "closed" && (
                            <button onClick={async () => { await api.jobs.reopen(job._id); fetchJobs(); }}
                              className="px-2.5 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                              Réouvrir
                            </button>
                          )}
                          <Link href={`/admin/jobs/${job._id}/edit`}
                            className="px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                            Modifier
                          </Link>
                          <button onClick={async () => { if (confirm("Supprimer cette offre ?")) { await api.jobs.remove(job._id); fetchJobs(); } }}
                            className="px-2.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface/30">
                <span className="text-xs text-gray-400">Page {page} sur {data.totalPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-xs rounded-md border border-border text-gray-500 hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    Précédent
                  </button>
                  <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page >= data.totalPages}
                    className="px-3 py-1.5 text-xs rounded-md border border-border text-gray-500 hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
