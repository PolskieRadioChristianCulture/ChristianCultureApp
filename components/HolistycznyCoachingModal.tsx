import React from "react";
import { ExternalLink } from "lucide-react";
import { SupportedLanguage } from "../types";

interface HolistycznyCoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const HolistycznyCoachingModal: React.FC<
  HolistycznyCoachingModalProps
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
              {appLanguage === "pl" ? "Holistyczny" : "Holistic"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Coaching" : "Coaching"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Paweł Murawski
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
                ? "Holistyczny Coaching w Duchu Biblijnym"
                : "Holistic Coaching in the Biblical Spirit"}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              {appLanguage === "pl"
                ? "Odzyskaj harmonię i wewnętrzną wolność dzięki wsparciu, które łączy rozwój duchowy, fizyczny i emocjonalny. W swojej pracy kieruję się mądrością Pisma Świętego, pomagając odnaleźć spokój i nową drogę życia."
                : "Regain harmony and inner freedom with support that combines spiritual, physical, and emotional development. In my work, I am guided by the wisdom of the Holy Scriptures, helping to find peace and a new way of life."}
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed font-semibold">
              {appLanguage === "pl"
                ? "Specjalizuję się w profesjonalnym wsparciu dla osób: pragnących całościowego rozwoju osobistego, zmagających się z uzależnieniami (alkoholizm, narkomania, hazard, seksoholizm), szukających wyjścia z życiowych kryzysów. Razem odkrywamy Boży plan dla Twojego życia."
                : "I specialize in professional support for people: desiring comprehensive personal development, struggling with addictions (alcoholism, drug addiction, gambling, sexaholism), looking for a way out of life crises. Together we discover God's plan for your life."}
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-3 mt-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mb-4">
              {appLanguage === "pl"
                ? "Rozpocznij swoją przemianę"
                : "Start your transformation"}
            </p>
            <a
              href="https://pawe-murawski-holistyczny-coaching-v1-1-4-dark-th-553245611022.us-west1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-3 w-full py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
            >
              <span className="text-[#C5A059] font-black uppercase tracking-widest text-lg">
                WCHODZĘ
              </span>
              <ExternalLink className="text-[#C5A059]" size={20} />
            </a>
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
