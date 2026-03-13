"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Job } from "@/lib/types";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", location: "", coverLetter: "",
  });

  useEffect(() => {
    api.jobs.get(id).then(setJob).catch(() => setJob(null)).finally(() => setLoading(false));
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleFile = (file: File) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setError("Format accepté : PDF, DOC ou DOCX uniquement.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 5 Mo.");
      return;
    }
    setError("");
    setResume(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const uploadResume = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${API_BASE}/upload/cv`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Échec de l'upload du CV");
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setError("Veuillez joindre votre CV.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const resumeUrl = await uploadResume(resume);
      const candidate = await api.candidates.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        location: form.location || undefined,
        resumeUrl,
      });
      await api.applications.create({
        jobId: id,
        candidateId: candidate._id,
        source: "direct",
        coverLetter: form.coverLetter || undefined,
        resumeUrl,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      if (msg.includes("already exists")) setError("Un compte avec cet email existe déjà.");
      else if (msg.includes("already applied")) setError("Vous avez déjà postulé à cette offre.");
      else setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors";

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center text-gray-400">Offre introuvable.</div>
    </div>
  );

  const isExpired = job.expiresAt ? new Date(job.expiresAt) < new Date() : false;

  if (isExpired) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Dépôt clôturé</h2>
          <p className="text-gray-500 text-sm mb-6">
            La date limite de dépôt pour le poste de <strong>{job.title}</strong> est dépassée
            (le {new Date(job.expiresAt!).toLocaleDateString("fr-FR")}).
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/jobs" className="px-5 py-2.5 border border-border rounded-lg text-sm text-gray-500 hover:text-primary transition-colors">
              Voir les offres
            </Link>
            <Link href={`/jobs/${id}`} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg text-sm hover:bg-primary-hover transition-colors">
              Retour à l&apos;offre
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Candidature envoyée</h2>
          <p className="text-gray-500 text-sm mb-6">
            Merci pour votre intérêt pour le poste de <strong>{job.title}</strong>.
            Notre équipe reviendra vers vous rapidement.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/jobs" className="px-5 py-2.5 border border-border rounded-lg text-sm text-gray-500 hover:text-primary transition-colors">
              Autres offres
            </Link>
            <button onClick={() => router.push("/")} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg text-sm hover:bg-primary-hover transition-colors">
              Accueil
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Header */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-gray-400">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Offres</Link></li>
              <li>/</li>
              <li>
                <Link href={`/jobs/${id}`} className="hover:text-primary transition-colors truncate max-w-[160px] inline-block align-bottom">
                  {job.title}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-600">Postuler</li>
            </ol>
          </nav>
          <h1 className="text-xl font-bold text-dark mb-1">Postuler : {job.title}</h1>
          <p className="text-sm text-gray-500">
            {job.company} &middot; {job.location}
            {job.expiresAt && (
              <span className="ml-2 text-xs text-gray-400">
                &middot; Date limite : {new Date(job.expiresAt).toLocaleDateString("fr-FR")}
              </span>
            )}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">{error}</div>
          )}

          {/* Informations personnelles */}
          <section>
            <h2 className="text-base font-semibold text-dark mb-1">Informations personnelles</h2>
            <p className="text-xs text-gray-400 mb-5">Les champs marqués d&apos;un * sont obligatoires.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Prénom *</label>
                <input type="text" required value={form.firstName} onChange={set("firstName")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Nom *</label>
                <input type="text" required value={form.lastName} onChange={set("lastName")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Email *</label>
                <input type="email" required value={form.email} onChange={set("email")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Téléphone</label>
                <input type="tel" value={form.phone} onChange={set("phone")} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1.5">Ville</label>
                <input type="text" value={form.location} onChange={set("location")} placeholder="Ex : Dakar" className={inputCls} />
              </div>
            </div>
          </section>

          {/* CV Upload */}
          <section className="border-t border-border pt-8">
            <h2 className="text-base font-semibold text-dark mb-1">Curriculum Vitae *</h2>
            <p className="text-xs text-gray-400 mb-5">Format accepté : PDF, DOC ou DOCX. Taille maximale : 5 Mo.</p>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : resume
                    ? "border-green-300 bg-green-50/50"
                    : "border-border hover:border-primary/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
              {resume ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{resume.name}</p>
                    <p className="text-xs text-gray-400">{(resume.size / 1024 / 1024).toFixed(2)} Mo</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResume(null); }}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-1">
                    Glissez-déposez votre CV ici ou <span className="text-primary font-medium">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-400">PDF, DOC, DOCX — max. 5 Mo</p>
                </>
              )}
            </div>
          </section>

          {/* Lettre de motivation */}
          <section className="border-t border-border pt-8">
            <h2 className="text-base font-semibold text-dark mb-1">Lettre de motivation</h2>
            <p className="text-xs text-gray-400 mb-5">Optionnel. Expliquez pourquoi ce poste vous intéresse.</p>
            <textarea
              rows={6}
              value={form.coverLetter}
              onChange={set("coverLetter")}
              placeholder="Décrivez votre motivation et ce que vous apporteriez à l'équipe..."
              className={`${inputCls} resize-none`}
            />
          </section>

          {/* Submit */}
          <div className="border-t border-border pt-8 flex items-center justify-between">
            <Link href={`/jobs/${id}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
              &larr; Retour à l&apos;offre
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
