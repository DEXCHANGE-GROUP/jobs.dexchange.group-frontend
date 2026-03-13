import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-3">
              <span className="text-primary">DEX</span>CHANGE GROUP
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Infrastructure de paiement et de services digitaux pour l&apos;Afrique.
              Paiements, APIs, Mobile Money, ERP, KYC et actifs numeriques.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://linkedin.com/company/dexchangegroup" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://twitter.com/dexchangegroup" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="text-gray-500 hover:text-primary transition-colors">Offres d&apos;emploi</Link></li>
              <li><Link href="/admin" className="text-gray-500 hover:text-primary transition-colors">Espace RH</Link></li>
              <li><a href="https://dexchange.group" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">Site principal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Presence</h4>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li>Senegal (Siege)</li>
              <li>Cote d&apos;Ivoire</li>
              <li>Benin &middot; Cameroun</li>
              <li>Guinee &middot; Togo</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">contact@dexchange.group</p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <span>&copy; {new Date().getFullYear()} DEXCHANGE GROUP. Tous droits reserves.</span>
          <span>Build payment and digital services infrastructure for Africa.</span>
        </div>
      </div>
    </footer>
  );
}
