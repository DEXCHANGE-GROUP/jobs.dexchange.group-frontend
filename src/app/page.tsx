import ResumeUpload from "@/components/ResumeUpload";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A2540] text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E0FF] rounded-full mix-blend-screen mix-blend-color-dodge opacity-20 filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#113A64] rounded-full mix-blend-screen opacity-50 filter blur-[100px] pointer-events-none"></div>

      <header className="fixed top-0 w-full px-8 py-5 flex justify-between items-center z-50 transition-all duration-300 glass-panel !rounded-none !border-t-0 !border-x-0 bg-[#0A2540]/60 backdrop-blur-xl">
        <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-[#00E0FF] drop-shadow-[0_0_10px_rgba(0,224,255,0.4)]">
          DEXCHANGE<span className="text-white">.JOBS</span>
        </h1>
        <nav className="space-x-8 text-sm font-semibold tracking-wide hidden md:block">
          <a href="#jobs" className="text-gray-300 hover:text-[#00E0FF] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-[#00E0FF] hover:after:w-full after:transition-all">Carrières</a>
          <a href="#about" className="text-gray-300 hover:text-[#00E0FF] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-[#00E0FF] hover:after:w-full after:transition-all">L'ADN Fintech</a>
        </nav>
      </header>
      
      <main className="relative z-10 pt-40 md:pt-48 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col items-center justify-center space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-fade-in-up md:max-w-4xl mx-auto">
           <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]">
            Codez la future<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-[#00c3ff] to-blue-500 drop-shadow-[0_0_15px_rgba(0,224,255,0.3)]">
              Fintech Africaine.
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
             Impactez la vie de millions d'utilisateurs. Architecte, développez et scalez l'infrastructure de paiements et mobile money de DEXCHANGE GROUP.
          </p>
        </section>

        {/* Upload Container */}
        <section className="w-full max-w-5xl mx-auto -mt-8 relative z-20" id="jobs">
          <div className="glass-panel p-1 sm:p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
             <ResumeUpload />
          </div>
        </section>
        
        {/* Footer spacing */}
        <div className="h-32"></div>
      </main>
    </div>
  );
}
