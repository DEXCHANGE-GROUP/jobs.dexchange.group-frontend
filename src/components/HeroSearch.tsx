"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Rechercher un poste, une compétence..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-border rounded-lg pl-12 pr-32 py-3 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
