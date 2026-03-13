"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS } from "@/lib/types";
import type { Job, PaginatedResponse } from "@/lib/types";

export default function AdminJobsPage() {
  const [data, setData] = useState<PaginatedResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.jobs.list({ page, limit: 20, sortBy: "createdAt", sortOrder: "desc" });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handlePublish = async (id: string) => {
    await api.jobs.publish(id);
    fetchJobs();
  };

  const handleClose = async (id: string) => {
    await api.jobs.close(id);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette offre ?")) return;
    await api.jobs.remove(id);
    fetchJobs();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-400";
      case "draft": return "bg-yellow-500/10 text-yellow-400";
      case "closed": return "bg-red-500/10 text-red-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des offres</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total || 0} offre{(data?.total || 0) > 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="px-5 py-2.5 bg-primary text-dark font-semibold rounded-lg text-sm hover:bg-primary-hover transition-colors"
        >
          + Nouvelle offre
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">Aucune offre pour le moment.</p>
            <Link href="/admin/jobs/new" className="text-primary hover:underline text-sm">
              Creer votre premiere offre &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-border">
                    <th className="px-6 py-3 font-medium">Titre</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Lieu</th>
                    <th className="px-6 py-3 font-medium">Statut</th>
                    <th className="px-6 py-3 font-medium">Vues</th>
                    <th className="px-6 py-3 font-medium">Cand.</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((job) => (
                    <tr key={job._id} className="border-b border-border/50 hover:bg-surface-light/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{JOB_TYPE_LABELS[job.type]}</td>
                      <td className="px-6 py-4 text-gray-400">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(job.status)}`}>
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{job.views}</td>
                      <td className="px-6 py-4 text-gray-500">{job.applicationsCount}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === "draft" && (
                            <button onClick={() => handlePublish(job._id)} className="text-xs text-green-400 hover:underline">
                              Publier
                            </button>
                          )}
                          {job.status === "published" && (
                            <button onClick={() => handleClose(job._id)} className="text-xs text-yellow-400 hover:underline">
                              Fermer
                            </button>
                          )}
                          <button onClick={() => handleDelete(job._id)} className="text-xs text-red-400 hover:underline">
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
              <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs rounded border border-border text-gray-400 disabled:opacity-30 transition-colors"
                >
                  Prec.
                </button>
                <span className="text-xs text-gray-500">{page} / {data.totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page >= data.totalPages}
                  className="px-3 py-1.5 text-xs rounded border border-border text-gray-400 disabled:opacity-30 transition-colors"
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
