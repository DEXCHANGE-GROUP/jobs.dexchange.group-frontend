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

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const cards = [
    {
      label: "Offres actives", value: jobCount, href: "/admin/jobs", color: "text-primary", bg: "bg-primary/10",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      label: "Candidatures", value: stats?.total || 0, href: "/admin/applications", color: "text-blue-600", bg: "bg-blue-50",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      label: "Candidats", value: candidateCount, href: "/admin/candidates", color: "text-violet-600", bg: "bg-violet-50",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
      label: "Recrutés", value: stats?.byStatus?.["hired"] || 0, href: "/admin/applications", color: "text-green-600", bg: "bg-green-50",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const statusCls = (s: string) => {
    if (s === "hired") return "bg-green-50 text-green-600";
    if (s === "rejected" || s === "withdrawn") return "bg-red-50 text-red-500";
    if (s === "on_hold") return "bg-yellow-50 text-yellow-600";
    return "bg-blue-50 text-primary";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, href, color, bg, icon }) => (
          <Link key={label} href={href} className="bg-white border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-[18px] h-[18px] ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline */}
      {stats?.byStatus && Object.keys(stats.byStatus).length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-dark text-sm">Pipeline de recrutement</h2>
            <Link href="/admin/applications" className="text-xs text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="bg-surface rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">{APPLICATION_STATUS_LABELS[status] || status}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    status === "hired" ? "bg-green-50 text-green-600" :
                    status === "rejected" ? "bg-red-50 text-red-500" :
                    "bg-blue-50 text-primary"
                  }`}>{count}</span>
                </div>
                <p className="text-lg font-bold text-dark">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/jobs/new" className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 transition-colors flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Créer une offre</p>
            <p className="text-xs text-gray-400">Publier un nouveau poste</p>
          </div>
        </Link>
        <Link href="/admin/applications" className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 transition-colors flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Traiter les candidatures</p>
            <p className="text-xs text-gray-400">Gérer le pipeline</p>
          </div>
        </Link>
        <Link href="/admin/candidates" className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 transition-colors flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Vivier de talents</p>
            <p className="text-xs text-gray-400">Explorer les profils</p>
          </div>
        </Link>
      </div>

      {/* Recent applications */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-dark text-sm">Dernières candidatures</h2>
          <Link href="/admin/applications" className="text-xs text-primary hover:underline">Voir tout</Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Aucune candidature pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-border bg-surface/50">
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
                      <td className="px-6 py-3.5 text-gray-500">{typeof job === "object" ? job.title : "-"}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusCls(app.status)}`}>
                          {APPLICATION_STATUS_LABELS[app.status] || app.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-400">{new Date(app.createdAt).toLocaleDateString("fr-FR")}</td>
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
