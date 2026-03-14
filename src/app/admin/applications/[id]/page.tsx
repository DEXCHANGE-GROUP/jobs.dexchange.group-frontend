"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api, s3KeyFromUrl } from "@/lib/api";
import { APPLICATION_STATUS_LABELS, JOB_TYPE_LABELS } from "@/lib/types";
import type { Application, Job, Candidate } from "@/lib/types";

const ALL_STATUSES = Object.keys(APPLICATION_STATUS_LABELS);

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState("");
  const [cvPreviewUrl, setCvPreviewUrl] = useState("");
  const [cvDownloadUrl, setCvDownloadUrl] = useState("");

  useEffect(() => {
    api.applications.get(id).then((a) => {
      setApp(a);
      if (a.resumeUrl) {
        const key = s3KeyFromUrl(a.resumeUrl);
        api.upload.getSignedUrl(key, true).then((r) => setCvPreviewUrl(r.url)).catch(() => {});
        api.upload.getSignedUrl(key).then((r) => setCvDownloadUrl(r.url)).catch(() => {});
      }
    }).catch(() => setApp(null)).finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!app || newStatus === app.status) return;
    setUpdating(true);
    try {
      const updated = await api.applications.updateStatus(app._id, {
        status: newStatus,
        comment: comment || undefined,
      });
      setApp(updated);
      setComment("");
    } catch { /* ignore */ }
    finally { setUpdating(false); }
  };

  const statusCls = (s: string) => {
    if (s === "hired") return "bg-green-50 text-green-600 border-green-100";
    if (s === "rejected" || s === "withdrawn") return "bg-red-50 text-red-500 border-red-100";
    if (s === "on_hold") return "bg-yellow-50 text-yellow-600 border-yellow-100";
    if (s === "offer_sent") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-blue-50 text-primary border-blue-100";
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!app) return (
    <div className="text-center py-32">
      <p className="text-gray-400 mb-3">Candidature introuvable.</p>
      <Link href="/admin/applications" className="text-sm text-primary hover:underline">Retour aux candidatures</Link>
    </div>
  );

  const cand = app.candidateId as Candidate;
  const job = app.jobId as Job;
  const hasCand = typeof cand === "object";
  const hasJob = typeof job === "object";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/applications" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-gray-400 hover:text-primary hover:border-primary/30 transition-colors mt-1 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-dark">
              {hasCand ? `${cand.firstName} ${cand.lastName}` : "Candidat"}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${statusCls(app.status)}`}>
              {APPLICATION_STATUS_LABELS[app.status] || app.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            Candidature pour {hasJob ? job.title : "un poste"} &middot; {new Date(app.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidat */}
          {hasCand && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Informations du candidat</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                  {cand.firstName[0]}{cand.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark">{cand.firstName} {cand.lastName}</p>
                  {cand.headline && <p className="text-sm text-gray-500 mt-0.5">{cand.headline}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${cand.email}`} className="text-primary hover:underline truncate">{cand.email}</a>
                    </div>
                    {cand.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-600">{cand.phone}</span>
                      </div>
                    )}
                    {cand.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">{cand.location}</span>
                      </div>
                    )}
                    {cand.resumeUrl && cvDownloadUrl && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <a href={cvDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">Voir le CV</a>
                      </div>
                    )}
                  </div>
                  {cand.skills.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-gray-400 mb-2">Compétences</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.skills.map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-surface text-gray-600 border border-border">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lettre de motivation */}
          {app.coverLetter && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Lettre de motivation</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{app.coverLetter}</div>
            </div>
          )}

          {/* CV joint */}
          {app.resumeUrl && (
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <h2 className="text-sm font-semibold text-dark">CV joint à la candidature</h2>
                {cvDownloadUrl && (
                  <div className="flex items-center gap-2">
                    <a href={cvDownloadUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ouvrir
                    </a>
                    <a href={cvDownloadUrl} download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-surface rounded-md hover:bg-border/50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Télécharger
                    </a>
                  </div>
                )}
              </div>
              {cvPreviewUrl ? (
                <iframe
                  src={cvPreviewUrl}
                  className="w-full h-[600px] rounded-lg border border-border"
                  title="CV du candidat"
                />
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* Historique des statuts */}
          {app.statusHistory && app.statusHistory.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border mb-4">Historique</h2>
              <div className="space-y-0">
                {app.statusHistory.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-primary" : "bg-gray-300"}`} />
                      {i < app.statusHistory.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className="pb-4 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusCls(entry.status)}`}>
                          {APPLICATION_STATUS_LABELS[entry.status] || entry.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.changedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {entry.changedBy && <p className="text-xs text-gray-400 mt-1">Par {entry.changedBy}</p>}
                      {entry.comment && <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Changer le statut */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-dark mb-4">Changer le statut</h3>
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark focus:outline-none focus:border-primary transition-colors disabled:opacity-50 cursor-pointer mb-3"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire (optionnel)..."
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none mb-3"
            />
            <button
              onClick={() => handleStatusChange(app.status)}
              disabled={updating || !comment.trim()}
              className="w-full px-4 py-2 bg-surface text-sm text-gray-600 font-medium rounded-lg hover:bg-border/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {updating ? "Mise à jour..." : "Ajouter le commentaire"}
            </button>
          </div>

          {/* Poste */}
          {hasJob && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-dark mb-4">Poste concerné</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-dark">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.company}</p>
                </div>
                <dl className="space-y-2 pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Type</dt>
                    <dd className="text-dark">{JOB_TYPE_LABELS[job.type] || job.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Lieu</dt>
                    <dd className="text-dark">{job.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Remote</dt>
                    <dd className="text-dark">{job.remote ? "Oui" : "Non"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Département</dt>
                    <dd className="text-dark">{job.category}</dd>
                  </div>
                </dl>
                <Link href={`/jobs/${job._id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline pt-1">
                  Voir l&apos;offre
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Métadonnées */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-dark mb-4">Informations</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Source</dt>
                <dd className="text-dark capitalize">{app.source || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Reçue le</dt>
                <dd className="text-dark">{new Date(app.createdAt).toLocaleDateString("fr-FR")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Mise à jour</dt>
                <dd className="text-dark">{new Date(app.updatedAt).toLocaleDateString("fr-FR")}</dd>
              </div>
              {app.rating !== undefined && app.rating !== null && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">Note</dt>
                  <dd className="text-dark font-medium">{app.rating}/5</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Archivée</dt>
                <dd className="text-dark">{app.isArchived ? "Oui" : "Non"}</dd>
              </div>
            </dl>
          </div>

          {/* Notes RH */}
          {app.hrNotes && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-dark mb-3">Notes RH</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{app.hrNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
