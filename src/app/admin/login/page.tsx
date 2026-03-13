"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/auth/setup-status`)
      .then((r) => r.json())
      .then((d) => setNeedsSetup(d.needsSetup))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Identifiants invalides");

      // Initial setup → token returned directly
      if (data.access_token) {
        setToken(data.access_token);
        router.push("/admin");
        return;
      }

      if (data.requiresVerification) {
        setStep("code");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Code invalide");
      setToken(data.access_token);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">DX</span>
          </div>
          <h1 className="text-lg font-bold text-dark">
            {needsSetup ? "Configuration initiale" : "Espace RH"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {needsSetup
              ? "Créez votre compte administrateur"
              : step === "credentials"
                ? "Connectez-vous pour accéder au panel"
                : "Entrez le code envoyé par email"}
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          {step === "credentials" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {needsSetup && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-2">
                  <p className="text-xs text-primary leading-relaxed">
                    Aucun compte détecté. Entrez l&apos;email et le mot de passe qui serviront de
                    compte administrateur principal.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@dexchange.group"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {loading
                  ? needsSetup ? "Création..." : "Connexion..."
                  : needsSetup ? "Créer le compte admin" : "Se connecter"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Un code de vérification a été envoyé à<br />
                  <span className="font-medium text-dark">careers@dexchange.group</span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Code à 6 chiffres</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-white text-dark text-center tracking-[0.3em] font-mono text-lg placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="000000"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("credentials"); setCode(""); setError(""); }}
                className="w-full text-xs text-gray-400 hover:text-primary transition-colors"
              >
                Retour à la connexion
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
