"use client";

import { useState, useCallback } from "react";

export default function ResumeUpload() {
  const [step, setStep] = useState<'upload' | 'processing' | 'validate' | 'dashboard'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Mock extracted data
  const [formData, setFormData] = useState({
    firstName: "Denver", // Mock
    lastName: "**", // Mock
    email: "denver@dexchange.group", // Mock
    phone: "+221 77 000 00 00", // Mock
  });

  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [npsSubmitted, setNpsSubmitted] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
  };

  const handleFile = (droppedFile: File) => {
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
         setFile(droppedFile);
         setStep('processing');
         setTimeout(() => setStep('validate'), 2200);
      } else {
         alert("Format non autorisé. Les systèmes DEXCHANGE n'acceptent que le PDF.");
      }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('dashboard');
  };

  const handleNpsSubmit = () => {
     if (npsScore !== null) {
         setNpsSubmitted(true);
     }
  };

  const resetProcess = () => {
      setFile(null);
      setNpsScore(null);
      setNpsSubmitted(false);
      setStep('upload');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 relative" id="upload-section">
      {step === 'upload' || step === 'processing' ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center transition-all duration-500 glass-panel ${
            isDragging 
              ? "border-[#00E0FF] bg-[#00E0FF]/15 scale-[1.03] shadow-[0_0_30px_rgba(0,224,255,0.3)]" 
              : "border-[#113A64]/80 bg-[#0A2540]/30 hover:bg-[#113A64]/40 hover:border-[#00E0FF]/60"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
            <div className={`p-6 rounded-2xl backdrop-blur-md transition-all duration-300 ${isDragging ? 'bg-[#00E0FF]/25 text-[#00E0FF] shadow-[0_0_20px_rgba(0,224,255,0.5)]' : 'bg-[#113A64]/60 text-[#00E0FF]/80 border border-[#113A64]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">Initialiser l'Upload DEXCHANGE</h3>
               <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto">Glissez le CV (Systèmes supportés: PDF Max 5MB). L'IA d"analyse s'occupe du reste.</p>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                accept=".pdf,application/pdf"
                onChange={handleManualUpload}
                disabled={step === 'processing'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                id="file-upload"
              />
              <button disabled={step === 'processing'} className="relative z-10 px-8 py-4 bg-transparent border-2 border-[#00E0FF] text-[#00E0FF] rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#00E0FF] hover:text-[#0A2540] transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,224,255,0.4)]">
                Localiser le fichier
              </button>
            </div>
          </div>
          
          {step === 'processing' && (
             <div className="absolute inset-0 bg-[#0A2540]/90 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center space-y-6 z-50 transition-opacity animate-fade-in-up border border-[#00E0FF]/30">
                 <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-t-4 border-[#00E0FF] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-4 border-[#00E0FF]/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <svg className="absolute inset-0 w-8 h-8 m-auto text-[#00E0FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                 </div>
                 <div className="text-center">
                    <h4 className="text-[#00E0FF] text-xl font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(0,224,255,0.2)]">Analyse Core System...</h4>
                    <p className="text-gray-400 mt-2 font-mono text-sm max-w-xs mx-auto">Extraction des vecteurs de compétences et mapping des données DEXCHANGE AI.</p>
                 </div>
             </div>
          )}
        </div>
      ) : step === 'validate' ? (
        <form onSubmit={handleSubmit} className="glass-panel p-8 sm:p-12 animate-fade-in-up relative overflow-hidden">
           <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00E0FF] rounded-full mix-blend-screen mix-blend-color-dodge opacity-10 filter blur-[80px] pointer-events-none"></div>

           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-[rgba(0,224,255,0.1)] gap-4">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#00E0FF]/10 flex items-center justify-center border border-[#00E0FF]/30">
                    <span className="text-[#00E0FF] text-xl">✓</span>
                 </div>
                 <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Paramètres Candidat</h3>
                    <p className="text-gray-400 text-sm mt-1">Données extraites avec succès. Vérifiez l'intégrité.</p>
                 </div>
             </div>
             <button 
                 type="button" 
                 onClick={resetProcess}
                 className="text-gray-400 hover:text-[#00E0FF] text-sm uppercase tracking-wider font-semibold underline underline-offset-4 transition-colors p-2 rounded-lg hover:bg-[#00E0FF]/10"
              >
                 Changer la source
             </button>
           </div>

           <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <div className="space-y-3">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Prénom / First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-5 py-4 text-white text-lg transition-all focus:scale-[1.01]"
                      required
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Nom / Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-5 py-4 text-white text-lg transition-all focus:scale-[1.01]"
                      required
                    />
                 </div>
                 <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">ID Utilisateur / Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-5 py-4 text-white text-lg font-mono transition-all focus:scale-[1.01]"
                      required
                    />
                 </div>
                 <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Contact Réseau</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-5 py-4 text-white text-lg font-mono transition-all focus:scale-[1.01]"
                    />
                 </div>
              </div>
              
              <div className="pt-8 flex flex-col sm:flex-row justify-end gap-6 items-center border-t border-[rgba(0,224,255,0.1)]">
                 <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Connexion Sécurisée AES-256</span>
                 <button 
                   type="submit"
                   className="w-full sm:w-auto px-10 py-4 primary-button rounded-xl font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3"
                 >
                   Analyser le Match <span className="text-xl">→</span>
                 </button>
              </div>
           </div>
        </form>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          <div className="glass-panel p-8 sm:p-12 flex flex-col lg:flex-row gap-12 items-center justify-between relative overflow-hidden">
             
             {/* Circular Progress High-Tech */}
             <div className="relative flex items-center justify-center w-56 h-56 rounded-full shrink-0 group">
               <div className="absolute inset-0 bg-[#00E0FF]/10 rounded-full blur-2xl group-hover:bg-[#00E0FF]/25 transition-all duration-1000"></div>
               <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(0,224,255,0.3)]" viewBox="0 0 200 200">
                   <circle cx="100" cy="100" r="92" fill="rgba(10,37,64,0.5)" stroke="rgba(17,58,100,1)" strokeWidth="6" />
                   <circle cx="100" cy="100" r="92" fill="transparent" stroke="url(#gradient)" strokeWidth="6" strokeDasharray="578" strokeDashoffset="46" className="transition-all duration-[2000ms] ease-out shadow-neon" strokeLinecap="round" />
                   <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#00E0FF" />
                       <stop offset="100%" stopColor="#0088CC" />
                     </linearGradient>
                   </defs>
               </svg>
               <div className="text-center flex flex-col items-center z-10">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#00E0FF] drop-shadow-[0_0_10px_rgba(0,224,255,0.6)] tracking-tighter">92%</span>
                  <span className="text-xs text-[#00E0FF] font-black uppercase tracking-[0.3em] mt-2 shadow-black drop-shadow-md">Score DEX</span>
               </div>
             </div>
             
             <div className="text-left flex-1 lg:pl-10 space-y-6">
               <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
                 Rapport d'Adéquation Tech
               </h3>
               <div className="bg-[#0A2540]/60 p-6 rounded-2xl border border-[rgba(0,224,255,0.15)] backdrop-blur-md shadow-inner">
                 <strong className="text-[#00E0FF] text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00E0FF] rounded-full animate-pulse"></span>
                    Analyse Data Driven
                 </strong>
                 <p className="text-gray-300 text-base leading-relaxed">
                   Vos vecteurs de compétences extraits matchent à un niveau remarquable avec l'infrastructure DEXCHANGE GROUP. Votre expertise technique souligne une excellente capacité à scaler nos systèmes de paiements B2B haute disponibilité.
                 </p>
               </div>
             </div>
          </div>

          <div className="glass-panel p-10 sm:p-14 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E0FF]/50 to-transparent"></div>
             
             {!npsSubmitted ? (
               <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                 <h4 className="text-3xl font-black mb-4 tracking-tight">Candidature Sécurisée</h4>
                 <p className="text-gray-400 mb-10 text-lg">Sur une échelle de 0 à 10, dans quelle mesure recommanderiez-vous ce parcours UX/tech à un pair développeur ?</p>
                 <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(score => (
                      <button
                        key={score}
                        onClick={() => setNpsScore(score)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 ${
                          npsScore === score 
                            ? "primary-button text-[#0A2540] scale-[1.15]" 
                            : "glass-input text-gray-300 hover:bg-[#113A64]/80 hover:border-[#00E0FF]/50 hover:text-[#00E0FF] hover:-translate-y-1"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                 </div>
                 <button 
                   onClick={handleNpsSubmit}
                   disabled={npsScore === null}
                   className="px-12 py-5 bg-white text-[#0A2540] font-black rounded-xl uppercase tracking-widest hover:bg-[#00E0FF] hover:text-[#0A2540] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base border border-transparent disabled:hover:border-transparent hover:shadow-[0_0_30px_rgba(0,224,255,0.4)]"
                 >
                   Envoyer le Télémètre (30s)
                 </button>
               </div>
             ) : (
               <div className="py-12 animate-fade-in-up relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-[#00E0FF]/10 rounded-full border border-[#00E0FF]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,224,255,0.3)] text-[#00E0FF]">
                     <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                 </div>
                 <h4 className="text-3xl font-black mb-4 tracking-tight">Télémétrie Reçue.</h4>
                 <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">Payload envoyé aux serveurs RH DEXCHANGE. Temps de réponse est estimé à 48h ouvrées. Préparez-vous à disrupter.</p>
                 <button onClick={resetProcess} className="secondary-button px-8 py-3 rounded-xl uppercase tracking-widest text-sm font-bold">
                   Initialiser nouvelle session
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
