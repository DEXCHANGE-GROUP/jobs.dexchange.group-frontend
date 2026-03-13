"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import type { Application, Job, Candidate } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ total: number; byStatus: Record<string, number> } | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.applications.dashboardStats().catch(() => null),
      api.applications.list({ limit: 5 }).catch(() => ({ data: [], total: 0 })),
      api.jobs.list({ limit: 1 }).catch(() => ({ total: 0 })),
      api.candidates.list({ limit: 1 }).catch(() => ({ total: 0 })),
    ]).then(([s, apps, jobs, cands]) => {
      setStats(s);
      setRecentApps(apps.data);
      setJobCount(jobs.total);
      setCandidateCount(cands.total);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Offres", value: jobCount, href: "/admin/jobs", color: "text-primary" },
    { label: "Candidatures", value: stats?.total || 0, href: "/admin/applications", color: "text-blue-400" },
    { label: "Candidats", value: candidateCount, href: "/admin/candidates", color: "text-purple-400" },
    { label: "Recrutes", value: stats?.byStatus?.["hired"] || 0, href: "/admin/applications", color: "text-green-400" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble du recrutement</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-surface border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline */}
      {stats?.byStatus && Object.keys(stats.byStatus).length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Pipeline de recrutement</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="bg-dark rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{APPLICATION_STATUS_LABELS[status] || status}</p>
                <p className="text-xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent applications */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dernieres candidatures</h2>
          <Link href="/admin/applications" className="text-xs text-primary hover:underline">
            Voir tout &rarr;
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Aucune candidature pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-border">
                  <th className="px-6 py-3 font-medium">Candidat</th>
                  <th className="px-6 py-3 font-medium">Poste</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => {
                  const cand = app.candidateId as Candidate;
                  const job = app.jobId as Job;
                  return (
                    <tr key={app._id} className="border-b border-border/50 hover:bg-surface-light/30 transition-colors">
                      <td className="px-6 py-4">
                        {typeof cand === "object" ? `${cand.firstName} ${cand.lastName}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {typeof job === "object" ? job.title : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === "hired" ? "bg-green-500/10 text-green-400" :
                          app.status === "rejected" ? "bg-red-500/10 text-red-400" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {APPLICATION_STATUS_LABELS[app.status] || app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
