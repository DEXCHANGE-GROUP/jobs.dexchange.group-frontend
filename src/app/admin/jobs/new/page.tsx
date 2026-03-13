"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function NewJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "DEXCHANGE GROUP",
    location: "Dakar",
    remote: false,
    category: "",
    type: "full_time",
    skills: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "XOF",
    contactEmail: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        remote: form.remote,
        category: form.category,
        type: form.type as 'full_time',
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        requirements: form.requirements ? form.requirements.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        salary: form.salaryMin || form.salaryMax ? {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
          currency: form.salaryCurrency,
        } : undefined,
        contactEmail: form.contactEmail || undefined,
      };

      await api.jobs.create(payload);
      router.push("/admin/jobs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la creation");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href="/admin/jobs" className="text-sm text-gray-500 hover:text-primary transition-colors">
          &larr; Retour aux offres
        </Link>
        <h1 className="text-2xl font-bold mt-3">Nouvelle offre d&apos;emploi</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6 max-w-3xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Titre du poste *</label>
            <input type="text" required value={form.title} onChange={set("title")} placeholder="Ex: Developpeur Full-Stack Senior" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Entreprise *</label>
            <input type="text" required value={form.company} onChange={set("company")} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Categorie *</label>
            <input type="text" required value={form.category} onChange={set("category")} placeholder="Ex: Engineering, Design, Marketing" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Lieu *</label>
            <input type="text" required value={form.location} onChange={set("location")} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Type de contrat</label>
            <select value={form.type} onChange={set("type")} className={inputCls}>
              <option value="full_time">CDI</option>
              <option value="part_time">Temps partiel</option>
              <option value="contract">CDD</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Stage</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.remote} onChange={set("remote")} className="accent-primary" />
              Teletravail possible
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Description *</label>
            <textarea
              required rows={8} value={form.description} onChange={set("description")}
              placeholder="Decrivez le poste en detail (min. 50 caracteres)..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Exigences (une par ligne)</label>
            <textarea
              rows={4} value={form.requirements} onChange={set("requirements")}
              placeholder="3+ ans d'experience en React&#10;Maitrise de TypeScript&#10;Anglais courant"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Competences (separees par des virgules)</label>
            <input type="text" value={form.skills} onChange={set("skills")} placeholder="React, TypeScript, Node.js, MongoDB" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Salaire min</label>
            <input type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="Ex: 500000" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Salaire max</label>
            <input type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="Ex: 1200000" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Devise</label>
            <select value={form.salaryCurrency} onChange={set("salaryCurrency")} className={inputCls}>
              <option value="XOF">XOF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email de contact</label>
            <input type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="recrutement@dexchange.group" className={inputCls} />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-dark font-semibold rounded-lg text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {submitting ? "Creation..." : "Creer l'offre"}
          </button>
          <p className="text-xs text-gray-500">L&apos;offre sera creee en brouillon. Publiez-la ensuite depuis la liste.</p>
        </div>
      </form>
    </div>
  );
}
