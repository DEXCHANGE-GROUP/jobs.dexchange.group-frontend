import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/dexchange-logo.png" alt="DEXCHANGE" width={28} height={28} className="rounded-md" />
              <span className="font-bold text-dark text-sm">DEXCHANGE GROUP</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Infrastructure de paiement et de services digitaux pour l&apos;Afrique.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark mb-3">Navigation</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Offres d&apos;emploi</Link></li>
              <li><a href="https://dexchange.group" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Site corporate</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark mb-3">Présence</p>
            <ul className="space-y-1.5 text-gray-500 text-xs">
              <li>Sénégal · Côte d&apos;Ivoire</li>
              <li>Bénin · Cameroun</li>
              <li>Guinée · Togo</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark mb-3">Contact</p>
            <p className="text-xs text-gray-500">contact@dexchange.group</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} DEXCHANGE GROUP. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
