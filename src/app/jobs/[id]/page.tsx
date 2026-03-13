import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS } from "@/lib/types";

function formatSalary(salary?: { min?: number; max?: number; currency?: string }) {
  if (!salary?.min && !salary?.max) return null;
  const cur = salary.currency || "XOF";
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} ${cur}`;
  if (salary.min) return `À partir de ${fmt(salary.min)} ${cur}`;
  return `Jusqu'à ${fmt(salary.max!)} ${cur}`;
}

function timeAgo(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jours`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job;
  try { job = await api.jobs.get(id); } catch { notFound(); }

  const salary = formatSalary(job.salary);
  const isExpired = job.expiresAt ? new Date(job.expiresAt) < new Date() : false;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Header */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li>/</li>
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Offres</Link></li>
              <li>/</li>
              <li className="text-gray-600 truncate max-w-[200px]">{job.title}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">
              {JOB_TYPE_LABELS[job.type] || job.type}
            </span>
            {job.remote && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-600 font-medium">Remote</span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-md bg-white text-gray-500 border border-border">{job.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeAgo(job.createdAt)}
            </span>
            {salary && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {salary}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="font-semibold text-dark mb-4">Description du poste</h2>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</div>
            </section>

            {job.requirements.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="font-semibold text-dark mb-4">Exigences</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="font-semibold text-dark mb-4">Compétences requises</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-md bg-surface text-gray-600 border border-border">{s}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="border border-border rounded-lg p-6 bg-surface">
              {isExpired ? (
                <>
                  <div className="w-full text-center px-6 py-3 bg-gray-100 text-gray-400 font-medium rounded-lg text-sm cursor-not-allowed">
                    Dépôt clôturé
                  </div>
                  <p className="text-xs text-red-500 mt-3 text-center">
                    La date limite de dépôt est dépassée ({new Date(job.expiresAt!).toLocaleDateString("fr-FR")}).
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href={`/jobs/${job._id}/apply`}
                    className="block w-full text-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors text-sm"
                  >
                    Postuler à cette offre
                  </Link>
                  {job.expiresAt && (
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Date limite : {new Date(job.expiresAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                  {job.contactEmail && (
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Ou envoyez votre CV à{" "}
                      <a href={`mailto:${job.contactEmail}`} className="text-primary hover:underline">{job.contactEmail}</a>
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-dark mb-4">Détails du poste</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Type</dt>
                  <dd className="text-dark font-medium">{JOB_TYPE_LABELS[job.type]}</dd>
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
                {salary && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Salaire</dt>
                    <dd className="text-dark">{salary}</dd>
                  </div>
                )}
                {job.expiresAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Date limite</dt>
                    <dd className={`font-medium ${new Date(job.expiresAt) < new Date() ? "text-red-500" : "text-dark"}`}>
                      {new Date(job.expiresAt).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-dark mb-2">{job.company}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Infrastructure de paiement et de services digitaux pour l&apos;Afrique.
                Présent au Sénégal, en Côte d&apos;Ivoire, au Bénin, au Cameroun, en Guinée et au Togo.
              </p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-gray-400">
                <span>{job.views} vues</span>
                <span>&middot;</span>
                <span>{job.applicationsCount} candidature{job.applicationsCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
