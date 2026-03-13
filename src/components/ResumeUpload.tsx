"use client";

import { useState, useCallback } from "react";

export default function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Mock extracted data
  const [formData, setFormData] = useState({
    firstName: "Den**", // Mock
    lastName: "**ver", // Mock
    email: "denver@example.com", // Mock
    phone: "+221 77 000 00 00", // Mock
  });

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
         setFile(droppedFile);
         // Simulate parsing delay
         setTimeout(() => setShowValidation(true), 1500);
      } else {
         alert("Veuillez déposer un fichier PDF.");
      }
    }
  }, []);

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        setTimeout(() => setShowValidation(true), 1500);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Candidature envoyée avec succès ! (Simulation)");
      setFile(null);
      setShowValidation(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6" id="upload-section">
      {!showValidation ? (
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <button className="px-6 py-3 bg-[#0A2540] border border-[#00E0FF] text-[#00E0FF] rounded-full font-medium hover:bg-[#00E0FF] hover:text-[#0A2540] transition-colors">
                Ou parcourez vos fichiers
              </button>
            </div>
          </div>
          
          {file && !showValidation && (
             <div className="mt-8 p-4 bg-[#113A64] rounded-lg animate-pulse flex items-center justify-center gap-3 text-[#00E0FF]">
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyse du CV par l'IA DEXCHANGE...
             </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#113A64]/30 border border-[#113A64] p-8 rounded-2xl animate-fade-in-up">
           <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#113A64]">
             <h3 className="text-2xl font-bold flex items-center gap-2">
                 <span className="text-[#00E0FF]">✓</span> CV Analysé
             </h3>
             <button 
                 type="button" 
                 onClick={() => { setFile(null); setShowValidation(false); }}
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
                   Confirmer & Postuler
                 </button>
              </div>
           </div>
        </form>
      )}
    </div>
  );
}
