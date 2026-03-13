"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AVAILABILITY_LABELS } from "@/lib/types";
import type { Candidate, PaginatedResponse } from "@/lib/types";

export default function AdminCandidatesPage() {
  const [data, setData] = useState<PaginatedResponse<Candidate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try { setData(await api.candidates.list({ search: search || undefined, page, limit: 20 })); }
    catch { setData(null); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const availabilityCls = (a: string) => {
    if (a === "immediately") return "bg-green-50 text-green-600 border-green-100";
    if (a === "not_looking") return "bg-red-50 text-red-500 border-red-100";
    return "bg-yellow-50 text-yellow-600 border-yellow-100";
  };

  const scoreCls = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark">Vivier de candidats</h1>
        <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} candidat{(data?.total || 0) > 1 ? "s" : ""} au total</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" placeholder="Rechercher par nom, email, compétence..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full border border-border rounded-lg pl-9 pr-4 py-2 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
        />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucun candidat trouvé.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-border bg-surface/50">
                    <th className="px-6 py-3 font-medium">Candidat</th>
                    <th className="px-6 py-3 font-medium">Lieu</th>
                    <th className="px-6 py-3 font-medium">Compétences</th>
                    <th className="px-6 py-3 font-medium">Disponibilité</th>
                    <th className="px-6 py-3 font-medium">Candidatures</th>
                    <th className="px-6 py-3 font-medium text-center">Score</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((c) => (
                    <tr key={c._id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                            {c.firstName[0]}{c.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-dark">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                            {c.headline && <p className="text-xs text-gray-400 mt-0.5">{c.headline}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">{c.location || "-"}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.skills.slice(0, 3).map((s) => (
                            <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-surface text-gray-500 border border-border">{s}</span>
                          ))}
                          {c.skills.length > 3 && <span className="text-[11px] text-gray-400 px-1">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${availabilityCls(c.availability)}`}>
                          {AVAILABILITY_LABELS[c.availability] || c.availability}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="text-sm font-medium text-dark">{c.totalApplications}</span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {c.score?.global > 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-1.5 bg-surface rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${c.score.global >= 80 ? "bg-green-500" : c.score.global >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${c.score.global}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${scoreCls(c.score.global)}`}>{c.score.global}</span>
                          </div>
                        ) : <span className="text-gray-300 text-xs">-</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/candidates/${c._id}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                          Voir
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
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
