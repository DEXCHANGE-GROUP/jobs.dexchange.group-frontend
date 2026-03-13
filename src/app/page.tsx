import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import { api } from "@/lib/api";
import { JOB_TYPE_LABELS } from "@/lib/types";
import type { Job } from "@/lib/types";

async function getRecentJobs(): Promise<Job[]> {
  try {
    const res = await api.jobs.list({ status: "published", limit: 6, sortBy: "createdAt", sortOrder: "desc" });
    return res.data;
  } catch {
    return [];
  }
}

const DEPARTMENTS = [
  { title: "Technologie", category: "Technologie", desc: "Engineering, Data, Infrastructure, Produit", letter: "T" },
  { title: "Finance & Compliance", category: "Finance & Compliance", desc: "Comptabilité, Audit, Conformité, KYC", letter: "F" },
  { title: "Commercial", category: "Commercial", desc: "Ventes, Business Dev, Partenariats", letter: "C" },
  { title: "Marketing", category: "Marketing", desc: "Marque, Contenu, Growth, Communication", letter: "M" },
  { title: "Operations", category: "Operations", desc: "Support, Process, Qualité, Logistique", letter: "O" },
  { title: "RH", category: "RH", desc: "Recrutement, Formation, Culture", letter: "R" },
  { title: "Juridique", category: "Juridique", desc: "Droit des affaires, Réglementaire", letter: "J" },
  { title: "Direction", category: "Direction", desc: "Management, Stratégie, Transformation", letter: "D" },
];

const PROCESS_STEPS = [
  { num: "01", title: "Candidature", desc: "Postulez en ligne en quelques minutes" },
  { num: "02", title: "Présélection RH", desc: "Notre équipe examine votre profil" },
  { num: "03", title: "Entretien métier", desc: "Échangez avec votre futur manager" },
  { num: "04", title: "Offre", desc: "Recevez et validez votre proposition" },
];

const ADVANTAGES = [
  {
    title: "Formation & croissance",
    desc: "Programmes de développement continu, mentoring par des experts, et opportunités d'évolution rapide dans un groupe en pleine expansion.",
  },
  {
    title: "Flexibilité & remote",
    desc: "Politique de travail flexible adaptée à votre rythme. Possibilité de télétravail et d'horaires aménagés selon les postes.",
  },
  {
    title: "Impact & mission",
    desc: "Contribuez à transformer l'infrastructure financière africaine. Votre travail a un impact concret sur des millions de personnes dans 4 pays.",
  },
];

export default async function HomePage() {
  const jobs = await getRecentJobs();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Section 1 — Hero + Recherche */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-20">
          <h1 className="text-4xl md:text-[3.25rem] font-bold text-dark leading-tight tracking-tight">
            Carrières chez DEXCHANGE <span className="text-primary">GROUP</span>
          </h1>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl leading-relaxed">
            Rejoignez l&apos;équipe qui construit l&apos;infrastructure fintech
            de référence en Afrique. Présents au Sénégal, au Cameroun,
            en Côte d&apos;Ivoire et en Guinée, nous recrutons des talents
            dans tous les domaines.
          </p>
          <HeroSearch />

          {/* Quick job links */}
          {jobs.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-gray-400 mb-3">Offres du moment</p>
              <div className="flex flex-wrap gap-2">
                {jobs.slice(0, 4).map((job) => (
                  <Link
                    key={job._id}
                    href={`/jobs/${job._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm hover:border-primary/40 transition-colors group"
                  >
                    <span className="font-medium text-dark group-hover:text-primary transition-colors">{job.title}</span>
                    <span className="text-gray-400">&middot;</span>
                    <span className="text-xs text-gray-400">{job.location}</span>
                    <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2 — Offres récentes */}
      {jobs.length > 0 && (
        <section className="bg-surface border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Recrutement</p>
                <h2 className="text-2xl font-bold text-dark">Offres récentes</h2>
              </div>
              <Link
                href="/jobs"
                className="hidden md:inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
              >
                Voir toutes les offres
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="bg-white border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-surface-light text-gray-500 border border-border">
                      {JOB_TYPE_LABELS[job.type] || job.type}
                    </span>
                    {job.remote && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-primary border border-blue-100">
                        Remote
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{job.company}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{job.location}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{job.category}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/jobs" className="text-primary text-sm font-medium hover:underline">
                Voir toutes les offres &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 3 — Départements */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Nos métiers</p>
          <h2 className="text-2xl font-bold text-dark mb-10">Explorez nos départements</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.category}
                href={`/jobs?category=${encodeURIComponent(dept.category)}`}
                className="border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mb-3">
                  {dept.letter}
                </div>
                <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors mb-1">
                  {dept.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{dept.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Processus de recrutement */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Processus</p>
          <h2 className="text-2xl font-bold text-dark mb-12">Comment nous recrutons</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 relative z-10">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-sm text-dark mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Avantages & Culture */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Avantages</p>
          <h2 className="text-2xl font-bold text-dark mb-10">Pourquoi nous rejoindre</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title} className="bg-white border border-border rounded-lg p-6">
                <h3 className="font-semibold text-dark mb-2">{adv.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — CTA final */}
      <section className="bg-dark">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Prêt à rejoindre l&apos;aventure ?
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            Consultez nos offres ouvertes et postulez en quelques minutes.
          </p>
          <Link
            href="/jobs"
            className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors text-sm"
          >
            Voir les offres
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
