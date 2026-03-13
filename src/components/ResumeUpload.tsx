"use client";

import { useState, useCallback } from "react";

export default function ResumeUpload() {
  const [step, setStep] = useState<'upload' | 'processing' | 'validate' | 'dashboard'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Mock extracted data
  const [formData, setFormData] = useState({
    firstName: "Den**", // Mock
    lastName: "**ver", // Mock
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
         setTimeout(() => setStep('validate'), 2000);
      } else {
         alert("Veuillez déposer un fichier PDF.");
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
    <div className="w-full max-w-4xl mx-auto p-6" id="upload-section">
      {step === 'upload' || step === 'processing' ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? "border-[#00E0FF] bg-[#00E0FF]/10 scale-[1.02]" 
              : "border-[#113A64] bg-[#0A2540]/50 hover:bg-[#113A64]/30 hover:border-[#00E0FF]/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-[#00E0FF]/20 text-[#00E0FF]' : 'bg-[#113A64] text-[#00E0FF]/70'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
               <h3 className="text-xl font-semibold mb-2">Déposez votre CV ici</h3>
               <p className="text-gray-400 text-sm mb-6">Format supporté: PDF (Max 5MB)</p>
            </div>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf,application/pdf"
                onChange={handleManualUpload}
                disabled={step === 'processing'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="file-upload"
              />
              <button disabled={step === 'processing'} className="px-6 py-3 bg-[#0A2540] border border-[#00E0FF] text-[#00E0FF] rounded-full font-medium hover:bg-[#00E0FF] hover:text-[#0A2540] transition-colors disabled:opacity-50">
                Ou parcourez vos fichiers
              </button>
            </div>
          </div>
          
          {step === 'processing' && (
             <div className="mt-8 p-4 bg-[#113A64] rounded-lg animate-pulse flex items-center justify-center gap-3 text-[#00E0FF]">
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyse du CV par l'IA DEXCHANGE...
             </div>
          )}
        </div>
      ) : step === 'validate' ? (
        <form onSubmit={handleSubmit} className="bg-[#113A64]/30 border border-[#113A64] p-8 rounded-2xl animate-fade-in-up">
           <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#113A64]">
             <h3 className="text-2xl font-bold flex items-center gap-2">
                 <span className="text-[#00E0FF]">✓</span> CV Analysé
             </h3>
             <button 
                 type="button" 
                 onClick={resetProcess}
                 className="text-gray-400 hover:text-white text-sm underline"
              >
                 Changer de fichier
             </button>
           </div>

           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Prénom</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#0A2540] border border-[#113A64] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E0FF] transition-colors"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Nom</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#0A2540] border border-[#113A64] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E0FF] transition-colors"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#0A2540] border border-[#113A64] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E0FF] transition-colors"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Téléphone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#0A2540] border border-[#113A64] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E0FF] transition-colors"
                    />
                 </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-4">
                 <button 
                   type="submit"
                   className="px-8 py-3 bg-[#00E0FF] text-[#0A2540] font-bold rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(0,224,255,0.3)]"
                 >
                   Confirmer & Découvrir mon Score
                 </button>
              </div>
           </div>
        </form>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          <div className="bg-[#113A64]/30 border border-[#113A64] p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center justify-between shadow-[0_0_20px_rgba(0,224,255,0.05)]">
             <div className="relative flex items-center justify-center w-40 h-40 rounded-full border border-[rgba(0,224,255,0.2)] bg-[#113A64]/50 shrink-0">
               <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 160 160">
                   <circle cx="80" cy="80" r="74" fill="transparent" stroke="#00E0FF" strokeWidth="8" strokeDasharray="465" strokeDashoffset="37" className="transition-all duration-1000 ease-out" strokeLinecap="round" />
               </svg>
               <div className="text-center flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-[#00E0FF] drop-shadow-[0_0_10px_rgba(0,224,255,0.4)]">92%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Match tech</span>
               </div>
             </div>
             
             <div className="text-left flex-1 pl-4 md:border-l border-[#113A64]">
               <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                 <span className="text-[#00E0FF]">✦</span> Rapport d'Adéquation
               </h3>
               <div className="bg-[#0A2540]/80 p-5 rounded-xl border border-[#113A64] mb-2">
                 <strong className="text-white block mb-2">Pourquoi ce score ?</strong>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   Vos compétences extraites (React, Node.js, Typescript) matchent remarquablement avec le profil métier recherché. La structure globale suggère une aisance à s'adapter aux squads de paiement mobile DEXCHANGE.
                 </p>
               </div>
             </div>
          </div>

          <div className="bg-[#0A2540] border border-[#00E0FF]/30 p-8 rounded-2xl text-center shadow-[0_0_30px_rgba(0,224,255,0.1)] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-[#00E0FF]/5 to-transparent pointer-events-none"></div>
             {!npsSubmitted ? (
               <div className="relative z-10">
                 <h4 className="text-xl font-bold mb-2">Votre avis compte pour nous</h4>
                 <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm">Sur une échelle de 0 à 10, dans quelle mesure recommanderiez-vous ce parcours de candidature tech à un développeur de votre réseau ?</p>
                 <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mb-8">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(score => (
                      <button
                        key={score}
                        onClick={() => setNpsScore(score)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold transition-all duration-200 ${
                          npsScore === score 
                            ? "bg-[#00E0FF] text-[#0A2540] scale-110 shadow-[0_0_15px_rgba(0,224,255,0.5)] border border-transparent" 
                            : "bg-[#113A64]/50 border border-[#113A64] text-gray-300 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/50 hover:text-[#00E0FF]"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                 </div>
                 <button 
                   onClick={handleNpsSubmit}
                   disabled={npsScore === null}
                   className="px-8 py-3 bg-[#00E0FF] text-[#0A2540] font-bold rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,224,255,0.2)]"
                 >
                   Envoyer mon avis (30s)
                 </button>
               </div>
             ) : (
               <div className="py-8 animate-fade-in-up relative z-10">
                 <div className="text-[#00E0FF] text-6xl mb-4 drop-shadow-[0_0_15px_rgba(0,224,255,0.4)]">✓</div>
                 <h4 className="text-2xl font-bold mb-2">Merci pour votre retour !</h4>
                 <p className="text-gray-400 mb-8 max-w-md mx-auto">Votre dossier est maintenant entre les mains de l'équipe Recrutement DEXCHANGE. Vous serez recontacté(e) d'ici 48h ouvrées.</p>
                 <button onClick={resetProcess} className="text-[#00E0FF] hover:text-white transition-colors underline font-medium">
                   Déposer le CV d'un nouveau candidat potentiel
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
