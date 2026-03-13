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
  if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)} ${cur}`;
  if (salary.min) return `A partir de ${fmt(salary.min)} ${cur}`;
  return `Jusqu'a ${fmt(salary.max!)} ${cur}`;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jours`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job;
  try {
    job = await api.jobs.get(id);
  } catch {
    notFound();
  }

  const salary = formatSalary(job.salary);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/jobs" className="text-gray-500 hover:text-primary transition-colors">
            &larr; Toutes les offres
          </Link>
        </nav>

        {/* Header */}
        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {JOB_TYPE_LABELS[job.type] || job.type}
            </span>
            {job.remote && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">Remote</span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-surface-light text-gray-400">
              {job.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-400 mb-6">{job.company} &middot; {job.location}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            {salary && <span>{salary}</span>}
            <span>Publiee {timeAgo(job.createdAt)}</span>
            <span>{job.views} vues</span>
            <span>{job.applicationsCount} candidature{job.applicationsCount !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-surface border border-border rounded-xl p-8">
              <h2 className="text-lg font-semibold mb-4">Description du poste</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <section className="bg-surface border border-border rounded-xl p-8">
                <h2 className="text-lg font-semibold mb-4">Exigences</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply CTA */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <Link
                href={`/jobs/${job._id}/apply`}
                className="block w-full text-center px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Postuler maintenant
              </Link>
              {job.contactEmail && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Ou envoyez votre CV a {job.contactEmail}
                </p>
              )}
            </div>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-3">Competences</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-surface-light text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-300">{JOB_TYPE_LABELS[job.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lieu</span>
                <span className="text-gray-300">{job.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Remote</span>
                <span className="text-gray-300">{job.remote ? "Oui" : "Non"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Categorie</span>
                <span className="text-gray-300">{job.category}</span>
              </div>
              {job.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Expire le</span>
                  <span className="text-gray-300">{new Date(job.expiresAt).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
