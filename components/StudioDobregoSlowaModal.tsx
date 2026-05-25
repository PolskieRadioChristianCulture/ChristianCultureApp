import React from "react";
import { X, MapPin, Phone, Mail, Globe } from "lucide-react";
import { SupportedLanguage } from "../types";

interface StudioDobregoSlowaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const StudioDobregoSlowaModal: React.FC<
  StudioDobregoSlowaModalProps
> = ({ isOpen, onClose, appLanguage, isTickerExpanded }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[3000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[3rem] shadow-3xl flex flex-col max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Studio Dobrego" : "Good Word"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Słowa" : "Studio"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              {appLanguage === "pl"
                ? "Inspirujące miejsce dla poszukiwaczy pasji"
                : "An inspiring place for passion seekers"}
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-3 bg-zinc-900 text-zinc-500 hover:text-white rounded-full transition-all border border-zinc-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          <div className="bg-[#C5A059]/10 p-6 rounded-[2rem] border border-[#C5A059]/20">
            <h3 className="text-white font-black text-lg mb-4">
              🌿{" "}
              {appLanguage === "pl"
                ? "Studio Słowa - Twój czas na przebudzenie!"
                : "Word Studio - Your time to awaken!"}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {appLanguage === "pl"
                ? "Studio Dobrego Słowa - Inspirujące miejsce dla współczesnych poszukiwaczy pasji. Chcemy dzielić się praktyczną wiedzą, aby podnieść jakość życia drugiego człowieka na wyższy poziom, budząc go tym samym z egzystencjonalnej pasywności i postawy rezygnacji."
                : "Good Word Studio - An inspiring place for modern passion seekers. We want to share practical knowledge to raise the quality of another person's life to a higher level, thereby waking them from existential passivity and a posture of resignation."}
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-3 mt-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mb-2">
              {appLanguage === "pl"
                ? "Odwiedź nas i obudź swoją pasję!"
                : "Visit us and awaken your passion!"}
            </p>
            <div className="flex flex-col gap-2 text-xs text-zinc-300">
              <a
                href="https://maps.app.goo.gl/8x6qxZMmzDas8aye9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <MapPin className="text-[#C5A059]" size={16} />
                <span>11 Listopada 6, Piła 64-920</span>
              </a>
              <a
                href="tel:+48608337477"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <Phone className="text-[#C5A059]" size={16} />
                <span>+48 608 337 477</span>
              </a>
              <a
                href="mailto:kontakt@studiods.pl"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <Mail className="text-[#C5A059]" size={16} />
                <span>kontakt@studiods.pl</span>
              </a>
              <a
                href="https://studiods.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <Globe className="text-[#C5A059]" size={16} />
                <span>studiods.pl</span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex flex-col gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="w-full py-3 bg-white/5 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
          >
            {appLanguage === "pl"
              ? "Udostępnij tę treść"
              : "Share this content"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl text-xs hover:scale-[1.02] active:scale-95 transition-all"
          >
            {appLanguage === "pl" ? "WRÓĆ DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>
      </div>
    </div>
  );
};
