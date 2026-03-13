"use client";

import { useState, useEffect, useCallback } from "react";
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
    try {
      const res = await api.candidates.list({
        search: search || undefined,
        page,
        limit: 20,
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidats</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total || 0} candidat{(data?.total || 0) > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Rechercher par nom, competences..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full max-w-md bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
      />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">Aucun candidat trouve.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-border">
                    <th className="px-6 py-3 font-medium">Nom</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Lieu</th>
                    <th className="px-6 py-3 font-medium">Competences</th>
                    <th className="px-6 py-3 font-medium">Experience</th>
                    <th className="px-6 py-3 font-medium">Disponibilite</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((c) => (
                    <tr key={c._id} className="border-b border-border/50 hover:bg-surface-light/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{c.firstName} {c.lastName}</p>
                        {c.headline && <p className="text-xs text-gray-500 mt-0.5">{c.headline}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{c.email}</td>
                      <td className="px-6 py-4 text-gray-400">{c.location || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.skills.slice(0, 3).map((s) => (
                            <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-surface-light text-gray-400">
                              {s}
                            </span>
                          ))}
                          {c.skills.length > 3 && (
                            <span className="text-xs text-gray-600">+{c.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {c.totalYearsExperience > 0 ? `${c.totalYearsExperience} ans` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          c.availability === "immediately" ? "bg-green-500/10 text-green-400" :
                          c.availability === "not_looking" ? "bg-red-500/10 text-red-400" :
                          "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {AVAILABILITY_LABELS[c.availability] || c.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.score?.global > 0 ? (
                          <span className={`text-sm font-semibold ${
                            c.score.global >= 80 ? "text-green-400" :
                            c.score.global >= 50 ? "text-yellow-400" :
                            "text-red-400"
                          }`}>
                            {c.score.global}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs rounded border border-border text-gray-400 disabled:opacity-30"
                >
                  Prec.
                </button>
                <span className="text-xs text-gray-500">{page} / {data.totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page >= data.totalPages}
                  className="px-3 py-1.5 text-xs rounded border border-border text-gray-400 disabled:opacity-30"
                >
                  Suiv.
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
