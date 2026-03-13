"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import type { Application, Job, Candidate, PaginatedResponse } from "@/lib/types";

const ALL_STATUSES = Object.keys(APPLICATION_STATUS_LABELS);

export default function AdminApplicationsPage() {
  const [data, setData] = useState<PaginatedResponse<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.applications.list({
        status: statusFilter || undefined,
        page,
        limit: 20,
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await api.applications.updateStatus(appId, { status: newStatus });
      fetchApps();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const statusColor = (status: string) => {
    if (status === "hired") return "bg-green-500/10 text-green-400";
    if (status === "rejected" || status === "withdrawn") return "bg-red-500/10 text-red-400";
    if (status === "on_hold") return "bg-yellow-500/10 text-yellow-400";
    return "bg-primary/10 text-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Candidatures</h1>
        <p className="text-gray-500 text-sm mt-1">{data?.total || 0} candidature{(data?.total || 0) > 1 ? "s" : ""}</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setStatusFilter(""); setPage(1); }}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
            !statusFilter ? "border-primary text-primary bg-primary/10" : "border-border text-gray-500 hover:text-white"
          }`}
        >
          Toutes
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              statusFilter === s ? "border-primary text-primary bg-primary/10" : "border-border text-gray-500 hover:text-white"
            }`}
          >
            {APPLICATION_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">Aucune candidature trouvee.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-border">
                    <th className="px-6 py-3 font-medium">Candidat</th>
                    <th className="px-6 py-3 font-medium">Poste</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((app) => {
                    const cand = app.candidateId as Candidate;
                    const job = app.jobId as Job;
                    return (
                      <tr key={app._id} className="border-b border-border/50 hover:bg-surface-light/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{typeof cand === "object" ? `${cand.firstName} ${cand.lastName}` : "-"}</p>
                            <p className="text-xs text-gray-500">{typeof cand === "object" ? cand.email : ""}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {typeof job === "object" ? job.title : "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-500 capitalize">{app.source}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor(app.status)}`}>
                            {APPLICATION_STATUS_LABELS[app.status] || app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="bg-dark border border-border rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-primary"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
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
