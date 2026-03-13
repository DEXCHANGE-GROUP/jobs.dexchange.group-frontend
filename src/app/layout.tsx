import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "DEXCHANGE JOBS — Recrutement | Infrastructure financiere pour l'Afrique",
  description: "Rejoignez DEXCHANGE GROUP : paiements, APIs, Mobile Money, ERP, KYC. Nous recrutons dans 6 pays africains. Consultez nos offres.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
