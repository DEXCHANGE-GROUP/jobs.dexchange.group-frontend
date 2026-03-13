import ResumeUpload from "@/components/ResumeUpload";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A2540] text-white font-sans">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center border-b border-[#113A64] bg-[#0A2540]/90 backdrop-blur-sm z-50">
        <h1 className="text-2xl font-bold tracking-tighter text-[#00E0FF]">
          DEXCHANGE<span className="text-white"> JOBS</span>
        </h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#jobs" className="hover:text-[#00E0FF] transition-colors">Offres d'emploi</a>
        </nav>
      </header>
      
      <main className="pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center space-y-16">
        <section className="text-center space-y-6">
           <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Rejoignez la révolution<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-blue-400">Fintech Africaine</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
             Construisez l'avenir des paiements et du mobile money avec DEXCHANGE GROUP.
          </p>
          <div className="pt-8 w-full max-w-4xl mx-auto">
             <ResumeUpload />
          </div>
        </section>
      </main>
    </div>
  );
}
