"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import type { Application, Job, Candidate, PaginatedResponse } from "@/lib/types";

const ALL_STATUSES = Object.keys(APPLICATION_STATUS_LABELS);

export default function AdminApplicationsPage() {
  const [data, setData] = useState<PaginatedResponse<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.applications.list({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        limit: 20,
      }));
    } catch { setData(null); }
    finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const statusCls = (s: string) => {
    if (s === "hired") return "bg-green-50 text-green-600 border-green-100";
    if (s === "rejected" || s === "withdrawn") return "bg-red-50 text-red-500 border-red-100";
    if (s === "on_hold") return "bg-yellow-50 text-yellow-600 border-yellow-100";
    if (s === "offer_sent") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-blue-50 text-primary border-blue-100";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark">Candidatures</h1>
        <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} candidature{(data?.total || 0) > 1 ? "s" : ""} au total</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Rechercher un candidat..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => { setStatusFilter(""); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
              !statusFilter ? "border-primary text-primary bg-primary/5" : "border-border text-gray-400 hover:text-dark hover:bg-surface"
            }`}>
            Toutes
          </button>
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                statusFilter === s ? "border-primary text-primary bg-primary/5" : "border-border text-gray-400 hover:text-dark hover:bg-surface"
              }`}>
              {APPLICATION_STATUS_LABELS[s]}
            </button>
          ))}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucune candidature trouvée.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-border bg-surface/50">
                    <th className="px-6 py-3 font-medium">Candidat</th>
                    <th className="px-6 py-3 font-medium">Poste</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((app) => {
                    const cand = app.candidateId as Candidate;
                    const job = app.jobId as Job;
                    return (
                      <tr key={app._id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                              {typeof cand === "object" ? `${cand.firstName[0]}${cand.lastName[0]}` : "?"}
                            </div>
                            <div>
                              <p className="font-medium text-dark">{typeof cand === "object" ? `${cand.firstName} ${cand.lastName}` : "-"}</p>
                              <p className="text-xs text-gray-400">{typeof cand === "object" ? cand.email : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-dark">{typeof job === "object" ? job.title : "-"}</p>
                          <p className="text-xs text-gray-400">{typeof job === "object" ? job.location : ""}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-xs text-gray-400 capitalize">{app.source || "-"}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusCls(app.status)}`}>
                            {APPLICATION_STATUS_LABELS[app.status] || app.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-xs text-gray-400">
                          {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-3.5">
                          <select value={app.status}
                            onChange={async (e) => { await api.applications.updateStatus(app._id, { status: e.target.value }); fetchApps(); }}
                            className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-600 focus:outline-none focus:border-primary transition-colors cursor-pointer">
                            {ALL_STATUSES.map((s) => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-3.5">
                          <Link href={`/admin/applications/${app._id}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                            Voir
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
