import React, { useCallback } from "react";
import {
  ToastMessage,
  fixOrphans,
  CHRISTIAN_CULTURE_HOMEPAGE_URL,
  SupportedLanguage,
} from "../types";
import { Browser } from "@capacitor/browser";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onReturnToTop: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  addToast,
  appLanguage,
  isTickerExpanded = false,
}) => {
  if (!isOpen) return null;

  const handleCopyBlik = () => {
    navigator.clipboard.writeText("537 147 043");
    addToast(
      appLanguage === "pl" ? "Numer BLIK skopiowany!" : "BLIK number copied!",
      "success",
    );
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[3000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[3rem] shadow-3xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Wesprzyj" : "Support"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Misję" : "Mission"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Razem głosimy Ewangelię
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
          <div className="bg-[#C5A059]/10 p-6 rounded-[2rem] border border-[#C5A059]/20 text-center">
            <p className="text-zinc-300 text-sm leading-relaxed italic">
              {fixOrphans(
                appLanguage === "pl"
                  ? "Twoje dobrowolne wsparcie pozwala nam na rozwój aplikacji, utrzymanie radia i docieranie z Dobrą Nowiną do tysięcy serc. Dziękujemy za każdą cegiełkę!"
                  : "Your voluntary support allows us to develop the app, maintain the radio, and reach thousands of hearts with the Good News. Thank you for every contribution!",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zrzutka 1: Budowa aplikacji */}
            <button
              onClick={async () =>
                await Browser.open({ url: "https://zrzutka.pl/3bbxzn" })
              }
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-[#C5A059]/50 transition-all text-left"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                🚀
              </span>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">
                Zrzutka: Aplikacja
              </h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Budowa i utrzymanie CC Lite
              </p>
            </button>

            {/* Zrzutka 2: Misja Globalna */}
            <button
              onClick={async () =>
                await Browser.open({ url: "https://zrzutka.pl/rs4g4v" })
              }
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-[#C5A059]/50 transition-all text-left"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                🌍
              </span>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">
                Zrzutka: Misja
              </h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Wsparcie działań globalnych
              </p>
            </button>

            {/* BLIK */}
            <button
              onClick={handleCopyBlik}
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-[#C5A059]/50 transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-[8px] font-black text-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity">
                KLIKNIJ BY KOPIOWAĆ
              </div>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                📲
              </span>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">
                Wsparcie BLIK
              </h4>
              <p className="text-[11px] text-[#C5A059] font-black tracking-widest">
                537 147 043
              </p>
            </button>

            {/* Revolut */}
            <button
              onClick={async () =>
                await Browser.open({
                  url: "https://revolut.me/christianculture",
                })
              }
              className="group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-[#C5A059]/50 transition-all text-left"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                💳
              </span>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">
                Revolut Link
              </h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Bezpieczne wpłaty online
              </p>
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={async () =>
                await Browser.open({
                  url: "https://www.paypal.me/CezaryRogowski",
                })
              }
              className="w-full py-5 bg-blue-900/40 border border-blue-500/30 text-blue-200 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl">🅿️</span> PAYPAL SUPPORT
            </button>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-center">
                Numer Konta Bankowego
              </p>
              <p className="text-[11px] font-mono text-zinc-300 text-center select-all">
                48 2910 0006 0000 0000 0527 2629
              </p>
              <p className="text-[8px] text-zinc-600 text-center mt-2 uppercase tracking-tighter">
                Tytuł: Darowizna na cele misyjne
              </p>
            </div>
          </div>

          {/* Bug Report / Suggestions WhatsApp Section */}
          <div className="mt-6 p-6 bg-[#25D366]/5 border border-[#25D366]/20 rounded-3xl text-center">
            <h5 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              {appLanguage === "pl"
                ? "PROBLEMY TECHNICZNE?"
                : "TECHNICAL ISSUES?"}
            </h5>
            <p className="text-zinc-500 text-[10px] leading-relaxed mb-4 italic">
              {appLanguage === "pl"
                ? "Aplikacja cały czas rozwija się dla Ciebie. Napisz nam, co powinniśmy naprawić!"
                : "The app is constantly evolving for you. Let us know what we should fix!"}
            </p>
            <a
              href="https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.411-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.658zm6.25-3.358l.369.219c1.472.874 3.156 1.335 4.884 1.335 5.539 0 10.048-4.51 10.051-10.05.001-2.684-1.045-5.207-2.946-7.108-1.901-1.901-4.42-2.947-7.103-2.947-5.541 0-10.051 4.509-10.054 10.05-.001 1.77.464 3.491 1.345 5.009l.241.415-.999 3.644 3.738-.971zm10.743-7.531c-.301-.15-1.781-.879-2.056-.979-.275-.1-.475-.15-.675.15s-.775.979-.95 1.179-.35.225-.65.075c-.3-.15-1.265-.467-2.41-1.488-.891-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.463.13-.612.134-.133.301-.351.451-.526.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.675-1.626-.925-2.226-.243-.585-.49-.506-.675-.516-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.501s1.075 2.901 1.225 3.101c.15.2 2.115 3.226 5.122 4.526.715.31 1.274.495 1.71.634.717.229 1.37.197 1.886.12.574-.085 1.781-.726 2.031-1.426.25-.7 0-1.275-.075-1.426-.075-.15-.275-.25-.575-.401z" />
              </svg>
              {appLanguage === "pl" ? "NAPISZ NA CZACIE" : "WRITE ON CHAT"}
            </a>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-5 bg-[#C5A059] text-white font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl text-xs hover:scale-[1.02] active:scale-95 transition-all"
          >
            {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>
      </div>
    </div>
  );
};
