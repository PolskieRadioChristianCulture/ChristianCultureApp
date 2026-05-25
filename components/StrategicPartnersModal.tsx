import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Handshake } from "lucide-react";
import { EditableImage } from "./EditableImage";

interface StrategicPartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: string;
  isTickerExpanded?: boolean;
}

export const StrategicPartnersModal: React.FC<StrategicPartnersModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[8000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in ${isTickerExpanded ? "pt-[calc(52px+env(safe-area-inset-top,0px))] sm:pt-[calc(140px+env(safe-area-inset-top,0px))]" : "pt-[calc(28px+env(safe-area-inset-top,0px))] sm:pt-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#C5A059]/10 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#C5A059]/20 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
              <Handshake className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {appLanguage === "pl"
                  ? "Partnerzy Strategiczni"
                  : "Strategic Partners"}
              </h2>
              <p className="text-zinc-400 text-sm">
                {appLanguage === "pl"
                  ? "Organizacje i inicjatywy wspierające misję Christian Culture Network"
                  : "Organizations and initiatives supporting the Christian Culture Network mission"}
              </p>
            </div>
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#C5A059] transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Osobowość Plus */}
            <a
              href="https://youtube.com/@osobowoscplus?si=SL8oLxRCD8Gx4gfl"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-zinc-900 rounded-3xl border border-white/5 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 block shadow-xl hover:shadow-[#C5A059]/20"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-black flex items-center justify-center p-4">
                <EditableImage
                  storageKey="osobowosc_plus_img"
                  defaultSrc="/Osobowość Plus.webp"
                  alt="Osobowość Plus"
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 border-t border-white/5 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors mb-2">
                  Osobowość Plus
                </h3>
                <p className="text-sm text-zinc-400">
                  {appLanguage === "pl"
                    ? "Kanał YouTube oferujący wartościowe rozmowy i inspirujące treści rozwijające osobowość."
                    : "YouTube channel offering valuable conversations and inspiring content developing personality."}
                </p>
              </div>
            </a>

            {/* Your Imagination Studio */}
            <a
              href="https://www.facebook.com/UbierzSlowaWobraz?locale=pl_PL"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-zinc-900 rounded-3xl border border-white/5 hover:border-[#C5A059]/50 overflow-hidden transition-all duration-300 block shadow-xl hover:shadow-[#C5A059]/20"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-black flex items-center justify-center p-4">
                <EditableImage
                  storageKey="yis_img"
                  defaultSrc="/YIS.webp"
                  alt="Your Imagination Studio"
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 border-t border-white/5 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors mb-2">
                  Your Imagination Studio
                </h3>
                <p className="text-sm text-zinc-400">
                  {appLanguage === "pl"
                    ? "Projektowanie odzieży chrześcijańskiej i grafik."
                    : "Christian apparel and graphics design."}
                </p>
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
