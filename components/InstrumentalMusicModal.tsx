import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Music, Disc3 } from "lucide-react";
import { SupportedLanguage } from "../types";

interface InstrumentalMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
}

const TRACKS = [
  { id: "18ODRiN7HVAFDklVgJ6DSxGP6ecFXvCXs", name: "Utwór 1 (Instrumental)" },
  { id: "1ZxSxaDtIIj3p3x6u6Y1bWY6KDD6ACEi8", name: "Utwór 2 (Instrumental)" },
  { id: "1YHArIMu_JUu6EpC_gd-wRNK1WGLnY9BY", name: "Utwór 3 (Instrumental)" },
  { id: "1uwgEdqVsEDOAYqdGT4wfxXxLL5AeC0MY", name: "Utwór 4 (Instrumental)" },
  { id: "16CiNTNsPWrw7q6MxfECUYH0-wf72xbM8", name: "Utwór 5 (Instrumental)" },
];

export default function InstrumentalMusicModal({
  isOpen,
  onClose,
  appLanguage,
}: InstrumentalMusicModalProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
      >
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-[#C5A059] hover:text-black transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-5xl h-[90vh] md:h-[80vh] rounded-[2.5rem] border border-[#C5A059]/30 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex flex-col shadow-2xl shadow-[#C5A059]/10 p-8 overflow-y-auto">
          <div className="flex items-center gap-6 mb-8 flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#C5A059] overflow-hidden bg-black shadow-lg flex items-center justify-center">
              <Music className="w-10 h-10 md:w-12 md:h-12 text-[#C5A059]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                {appLanguage === "pl" ? "Muzyka Instrumentalna" : "Instrumental Music"}
              </h1>
              <p className="text-[#C5A059] font-bold uppercase tracking-widest text-xs">
                Christian Culture Network
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
            <div className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden h-[300px] md:h-auto">
              <h2 className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 flex-shrink-0">
                <Music className="w-4 h-4" /> 
                {appLanguage === "pl" ? "Lista Odtwarzania" : "Playlist"}
              </h2>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {TRACKS.map((track, i) => (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrackIndex(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      currentTrackIndex === i 
                        ? "bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059]" 
                        : "bg-black/40 hover:bg-white/10 border border-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Disc3 className={`w-5 h-5 flex-shrink-0 ${currentTrackIndex === i ? "animate-spin" : ""}`} style={{ animationDuration: '3s' }} />
                    <span className="text-sm font-bold truncate">
                      {track.name}
                    </span>
                    {currentTrackIndex === i && (
                      <Play className="w-4 h-4 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-black border border-white/10 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center relative">
              <iframe
                src={`https://drive.google.com/file/d/${TRACKS[currentTrackIndex].id}/preview`}
                title="Google Drive Player"
                className="w-full h-full absolute inset-0"
                style={{ border: "none" }}
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
