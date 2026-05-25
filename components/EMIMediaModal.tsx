import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Info } from "lucide-react";
import { SupportedLanguage } from "../types";

interface EMIMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
}

export default function EMIMediaModal({
  isOpen,
  onClose,
  appLanguage,
}: EMIMediaModalProps) {
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

        <div className="w-full max-w-4xl h-[80vh] rounded-[2.5rem] border border-[#C5A059]/30 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex flex-col shadow-2xl shadow-[#C5A059]/10 p-8 overflow-y-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-[#C5A059] overflow-hidden bg-black shadow-lg">
              <img
                src="/EMI.webp"
                alt="EMI Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                EMI - Media Informacyjne
              </h1>
              <p className="text-[#C5A059] font-bold uppercase tracking-widest text-xs">
                Christian Culture Network
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#C5A059]" /> Najnowszy odcinek:
                EMI01
              </h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src="https://drive.google.com/file/d/16agzkEgHLf6eL-_zemSkIpRk1a716Xr4/preview"
                  title="EMI Media Wideo"
                  className="w-full h-full"
                  allow="autoplay"
                ></iframe>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5">
              <h3 className="text-[#C5A059] font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> O projekcie
              </h3>
              <p className="text-zinc-400 leading-relaxed font-lora mb-6">
                Media Informacyjne EMI to rzetelne źródło wiedzy o wydarzeniach
                w kontekście chrześcijańskim i globalnym. Christian Culture
                Network dba o dostarczanie treści budujących świadomość
                ewangeliczną.
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all border border-white/10"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
