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
    title: "", description: "", company: "DEXCHANGE GROUP", location: "Dakar",
    remote: false, category: "", type: "full_time",
    skills: "", requirements: "", salaryMin: "", salaryMax: "", salaryCurrency: "XOF", contactEmail: "",
    deadline: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.create({
        title: form.title, description: form.description, company: form.company,
        location: form.location, remote: form.remote, category: form.category,
        type: form.type as "full_time",
        skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        requirements: form.requirements ? form.requirements.split("\n").map(s => s.trim()).filter(Boolean) : [],
        salary: form.salaryMin || form.salaryMax ? { min: form.salaryMin ? Number(form.salaryMin) : undefined, max: form.salaryMax ? Number(form.salaryMax) : undefined, currency: form.salaryCurrency } : undefined,
        contactEmail: form.contactEmail || undefined,
        expiresAt: form.deadline || undefined,
      });
      router.push("/admin/jobs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally { setSubmitting(false); }
  };

  const cls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark">Nouvelle offre</h1>
          <p className="text-sm text-gray-400">L&apos;offre sera créée en brouillon. Publiez-la ensuite.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">{error}</div>}

        {/* Section: Informations générales */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border">Informations générales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1.5">Titre du poste *</label>
              <input type="text" required value={form.title} onChange={set("title")} placeholder="Ex : Responsable Marketing Digital" className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Entreprise *</label>
              <input type="text" required value={form.company} onChange={set("company")} className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Département *</label>
              <select required value={form.category} onChange={set("category")} className={cls}>
                <option value="">Choisir un département</option>
                <option value="Technologie">Technologie</option>
                <option value="Finance & Compliance">Finance & Compliance</option>
                <option value="Commercial">Commercial</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="RH">Ressources Humaines</option>
                <option value="Juridique">Juridique</option>
                <option value="Direction">Direction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Lieu *</label>
              <input type="text" required value={form.location} onChange={set("location")} className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Type de contrat</label>
              <select value={form.type} onChange={set("type")} className={cls}>
                <option value="full_time">CDI</option>
                <option value="part_time">Temps partiel</option>
                <option value="contract">CDD</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Stage</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.remote} onChange={set("remote")} className="accent-primary w-4 h-4" />
                Télétravail possible
              </label>
            </div>
          </div>
        </div>

        {/* Section: Description & Exigences */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border">Description du poste</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Description * <span className="text-gray-400 font-normal">(min. 50 caractères)</span>
            </label>
            <textarea required rows={10} value={form.description} onChange={set("description")} placeholder="Décrivez le poste, les missions et le contexte..." className={`${cls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Exigences <span className="text-gray-400 font-normal">(une par ligne)</span>
            </label>
            <textarea rows={5} value={form.requirements} onChange={set("requirements")} placeholder={"3+ ans d'expérience\nAnglais courant\nMaîtrise de Excel"} className={`${cls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Compétences <span className="text-gray-400 font-normal">(séparées par virgule)</span>
            </label>
            <input type="text" value={form.skills} onChange={set("skills")} placeholder="Management, Excel, Anglais, Python" className={cls} />
          </div>
        </div>

        {/* Section: Rémunération & Contact */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-dark pb-3 border-b border-border">Rémunération & contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Salaire minimum</label>
              <input type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="Ex : 500000" className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Salaire maximum</label>
              <input type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="Ex : 800000" className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Devise</label>
              <select value={form.salaryCurrency} onChange={set("salaryCurrency")} className={cls}>
                <option value="XOF">XOF (FCFA)</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Email de contact</label>
              <input type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="recrutement@dexchange.group" className={cls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Date limite de dépôt</label>
              <input type="date" value={form.deadline} onChange={set("deadline")} className={cls} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : "Créer l'offre"}
          </button>
          <Link href="/admin/jobs" className="px-5 py-2.5 text-sm text-gray-500 hover:text-dark transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
