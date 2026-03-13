"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Job } from "@/lib/types";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    coverLetter: "",
  });

  useEffect(() => {
    api.jobs.get(id).then(setJob).catch(() => setJob(null)).finally(() => setLoading(false));
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Create candidate then application
      const candidate = await api.candidates.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        location: form.location || undefined,
      });

      await api.applications.create({
        jobId: id,
        candidateId: candidate._id,
        source: "direct",
        coverLetter: form.coverLetter || undefined,
      });

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      if (message.includes("already exists")) {
        setError("Un compte avec cet email existe deja. Votre candidature a peut-etre deja ete soumise.");
      } else if (message.includes("already applied")) {
        setError("Vous avez deja postule a cette offre.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Offre introuvable.
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Candidature envoyee !</h2>
            <p className="text-gray-400 mb-8">
              Merci pour votre interet pour le poste de <strong className="text-white">{job.title}</strong>.
              Notre equipe reviendra vers vous rapidement.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/jobs" className="px-6 py-2.5 border border-border rounded-lg text-sm text-gray-400 hover:text-white hover:border-primary/30 transition-colors">
                Voir d&apos;autres offres
              </Link>
              <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-primary text-dark font-medium rounded-lg text-sm hover:bg-primary-hover transition-colors">
                Accueil
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-10 w-full flex-1">
        <nav className="mb-8 text-sm">
          <Link href={`/jobs/${id}`} className="text-gray-500 hover:text-primary transition-colors">
            &larr; Retour a l&apos;offre
          </Link>
        </nav>

        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <h1 className="text-xl font-bold mb-1">Postuler : {job.title}</h1>
          <p className="text-sm text-gray-500">{job.company} &middot; {job.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Prenom *</label>
              <input
                type="text" required value={form.firstName} onChange={set("firstName")}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nom *</label>
              <input
                type="text" required value={form.lastName} onChange={set("lastName")}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email *</label>
              <input
                type="email" required value={form.email} onChange={set("email")}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Telephone</label>
              <input
                type="tel" value={form.phone} onChange={set("phone")}
                className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Ville</label>
            <input
              type="text" value={form.location} onChange={set("location")}
              placeholder="Ex: Dakar"
              className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Lettre de motivation</label>
            <textarea
              rows={5} value={form.coverLetter} onChange={set("coverLetter")}
              placeholder="Pourquoi ce poste vous interesse-t-il ?"
              className="w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
