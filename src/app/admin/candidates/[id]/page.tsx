"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api, s3KeyFromUrl } from "@/lib/api";
import { AVAILABILITY_LABELS, APPLICATION_STATUS_LABELS, JOB_TYPE_LABELS } from "@/lib/types";
import type { Candidate, Application, Job } from "@/lib/types";

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    Promise.all([
      api.candidates.get(id).catch(() => null),
      api.applications.list({ candidateId: id, limit: 50 }).catch(() => ({ data: [] })),
    ]).then(([c, apps]) => {
      setCandidate(c);
      setApplications(apps.data);
      if (c?.resumeUrl) {
        api.upload.getSignedUrl(s3KeyFromUrl(c.resumeUrl)).then((r) => setCvUrl(r.url)).catch(() => {});
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const availabilityCls = (a: string) => {
    if (a === "immediately") return "bg-green-50 text-green-600 border-green-100";
    if (a === "not_looking") return "bg-red-50 text-red-500 border-red-100";
    return "bg-yellow-50 text-yellow-600 border-yellow-100";
  };

  const statusCls = (s: string) => {
    if (s === "hired") return "bg-green-50 text-green-600 border-green-100";
    if (s === "rejected" || s === "withdrawn") return "bg-red-50 text-red-500 border-red-100";
    if (s === "on_hold") return "bg-yellow-50 text-yellow-600 border-yellow-100";
    return "bg-blue-50 text-primary border-blue-100";
  };

  const scoreCls = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-500";
    if (score >= 50) return "text-yellow-600 bg-yellow-500";
    return "text-red-500 bg-red-500";
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!candidate) return (
    <div className="text-center py-32">
      <p className="text-gray-400 mb-3">Candidat introuvable.</p>
      <Link href="/admin/candidates" className="text-sm text-primary hover:underline">Retour au vivier</Link>
    </div>
  );

  const c = candidate;
  const scoreItems = [
    { label: "Compétences", value: c.score?.skills },
    { label: "Expérience", value: c.score?.experience },
    { label: "Culture", value: c.score?.culture },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/candidates" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-gray-400 hover:text-primary hover:border-primary/30 transition-colors mt-1 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-dark">{c.firstName} {c.lastName}</h1>
            <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${availabilityCls(c.availability)}`}>
              {AVAILABILITY_LABELS[c.availability] || c.availability}
            </span>
            {!c.isActive && (
              <span className="text-[11px] px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-500 font-medium">Inactif</span>
            )}
          </div>
          {c.headline && <p className="text-sm text-gray-500 mt-0.5">{c.headline}</p>}
          <p className="text-xs text-gray-400 mt-1">
            Inscrit le {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Coordonnées</h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-lg font-semibold text-gray-500 shrink-0">
                {c.firstName[0]}{c.lastName[0]}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${c.email}`} className="text-primary hover:underline truncate">{c.email}</a>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{c.phone}</span>
                  </div>
                )}
                {c.location && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{c.location}</span>
                  </div>
                )}
                {c.remoteOnly && (
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Remote uniquement</span>
                  </div>
                )}
                {c.resumeUrl && cvUrl && (
                  <div className="flex items-center gap-2.5 sm:col-span-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Voir le CV</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CV */}
          {c.resumeUrl && cvUrl && (
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <h2 className="text-sm font-semibold text-dark">Curriculum Vitae</h2>
                <div className="flex items-center gap-2">
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ouvrir
                  </a>
                  <a href={cvUrl} download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-surface rounded-md hover:bg-border/50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger
                  </a>
                </div>
              </div>
              <iframe
                src={cvUrl}
                className="w-full h-[600px] rounded-lg border border-border"
                title="CV du candidat"
              />
            </div>
          )}

          {/* Résumé */}
          {c.summary && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Résumé</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{c.summary}</p>
            </div>
          )}

          {/* Compétences & Langues */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Compétences & langues</h2>
            {c.skills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-surface text-gray-600 border border-border">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {c.languages.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Langues</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.languages.map((l) => (
                    <span key={l} className="text-xs px-2.5 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">{l}</span>
                  ))}
                </div>
              </div>
            )}
            {c.skills.length === 0 && c.languages.length === 0 && (
              <p className="text-sm text-gray-400">Aucune compétence renseignée.</p>
            )}
          </div>

          {/* Candidatures */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-dark">Candidatures ({applications.length})</h2>
            </div>
            {applications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">Aucune candidature.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {applications.map((app) => {
                  const job = app.jobId as Job;
                  const hasJob = typeof job === "object";
                  return (
                    <div key={app._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-surface/30 transition-colors">
                      <div className="min-w-0">
                        <p className="font-medium text-dark text-sm">{hasJob ? job.title : "-"}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          {hasJob && <span>{job.company} &middot; {job.location}</span>}
                          {hasJob && <span>&middot;</span>}
                          {hasJob && <span>{JOB_TYPE_LABELS[job.type] || job.type}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusCls(app.status)}`}>
                          {APPLICATION_STATUS_LABELS[app.status] || app.status}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString("fr-FR")}</span>
                        <Link href={`/admin/applications/${app._id}`} className="text-xs text-primary font-medium hover:underline">
                          Voir
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Score */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-dark mb-4">Score global</h3>
            {c.score?.global > 0 ? (
              <>
                <div className="text-center mb-5">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${
                    c.score.global >= 80 ? "bg-green-50 text-green-600" :
                    c.score.global >= 50 ? "bg-yellow-50 text-yellow-600" :
                    "bg-red-50 text-red-500"
                  }`}>
                    {c.score.global}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">sur 100</p>
                </div>
                <div className="space-y-3">
                  {scoreItems.map(({ label, value }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">{label}</span>
                        <span className={`font-semibold ${scoreCls(value || 0).split(" ")[0]}`}>{value || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreCls(value || 0).split(" ")[1]}`}
                          style={{ width: `${value || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Pas encore évalué</p>
            )}
          </div>

          {/* Infos */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-dark mb-4">Informations</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Disponibilité</dt>
                <dd className="text-dark">{AVAILABILITY_LABELS[c.availability] || c.availability}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Expérience</dt>
                <dd className="text-dark">{c.totalYearsExperience} an{c.totalYearsExperience > 1 ? "s" : ""}</dd>
              </div>
              {c.expectedSalary !== undefined && c.expectedSalary > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">Salaire attendu</dt>
                  <dd className="text-dark">{new Intl.NumberFormat("fr-FR").format(c.expectedSalary)} FCFA</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Candidatures</dt>
                <dd className="text-dark font-medium">{c.totalApplications}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Statut</dt>
                <dd className="text-dark">{c.isActive ? "Actif" : "Inactif"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Inscrit le</dt>
                <dd className="text-dark">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</dd>
              </div>
            </dl>
          </div>

          {/* Talent Pool */}
          {c.talentPool && (c.talentPool.status || c.talentPool.tags?.length > 0) && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-dark mb-4">Vivier de talents</h3>
              {c.talentPool.status && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Statut</p>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-surface text-gray-600 border border-border capitalize">{c.talentPool.status}</span>
                </div>
              )}
              {c.talentPool.tags?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.talentPool.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/10">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
