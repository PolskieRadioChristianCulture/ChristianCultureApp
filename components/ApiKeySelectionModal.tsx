import React, { useState } from "react";
import { SupportedLanguage } from "../types";
import { PersistenceService } from "../services/persistenceService";

interface ApiKeySelectionModalProps {
  isOpen: boolean;
  onSelectKey: () => void;
  onKeySaved: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const ApiKeySelectionModal: React.FC<ApiKeySelectionModalProps> = ({
  isOpen,
  onSelectKey,
  onKeySaved,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const [manualKey, setManualKey] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  if (!isOpen) return null;

  const handleSaveManualKey = () => {
    if (manualKey.trim().length > 10) {
      PersistenceService.saveGeminiApiKey(manualKey.trim());
      setShowStatus(true);
      setTimeout(() => {
        setShowStatus(false);
        onKeySaved();
      }, 1500);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[6000] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-6 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div className="relative w-full max-w-md bg-zinc-900 border border-[#E2B859]/30 rounded-[3rem] p-10 sm:p-12 shadow-[0_30px_100px_rgba(0,0,0,1)] text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#E2B859] to-[#A68043] rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl mb-8 animate-floating-button-pulse">
          🔑
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
          {appLanguage === "pl"
            ? "Wymagany Twój Klucz API"
            : "Your API Key Required"}
        </h2>

        <p className="text-zinc-400 text-xs leading-relaxed mb-6">
          {appLanguage === "pl"
            ? "Nasz miesięczny limit zapytań do silnika AI na ten moment się wyczerpał. Aby odblokować Asystenta CC, wprowadź swój prywatny, darmowy klucz Gemini API. Twój klucz jest zapisany bezpiecznie i wyłącznie na Twoim urządzeniu."
            : "Our monthly quota for the AI engine has currently run out. To unlock Assistant CC, please enter your private, free Gemini API key. Your key is stored securely and locally on your device."}
        </p>

        <p className="text-[#C5A059] text-xs font-bold leading-relaxed mb-8 italic">
          {appLanguage === "pl"
            ? "Wesprzyj naszą misję jako Patron CC, co pozwoli nam w przyszłości zwiększyć globalne limity zapytań dla wszystkich użytkowników aplikacji!"
            : "Support our mission as a CC Patron, which will allow us to increase global request limits for all app users in the future!"}
        </p>

        <div className="space-y-4 mb-8">
          <div className="relative group">
            <input
              type="password"
              placeholder={
                appLanguage === "pl"
                  ? "Wklej klucz API (np. AIza...)"
                  : "Paste API key (e.g., AIza...)"
              }
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#E2B859] transition-all placeholder:text-zinc-700"
            />
          </div>
          <button
            onClick={handleSaveManualKey}
            disabled={manualKey.trim().length < 10}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
              manualKey.trim().length > 10
                ? "bg-[#E2B859] text-black shadow-lg shadow-[#E2B859]/20 hover:scale-[1.02]"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {showStatus
              ? appLanguage === "pl"
                ? "ZAPISANO! ✅"
                : "SAVED! ✅"
              : appLanguage === "pl"
                ? "ZAPISZ I ODBLOKUJ"
                : "SAVE AND UNLOCK"}
          </button>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            {appLanguage === "pl"
              ? "ALTERNATYWA (DLA DEVELOPERÓW):"
              : "ALTERNATIVE (FOR DEVELOPERS):"}
          </p>
          <button
            onClick={onSelectKey}
            className="w-full py-3 glass border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-white/5 transition-all"
          >
            {appLanguage === "pl"
              ? "WYBIERZ Z PROJEKTU CLOUD"
              : "SELECT FROM CLOUD PROJECT"}
          </button>

          <div className="flex flex-col gap-2 pt-4">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-[#E2B859] hover:underline uppercase tracking-widest"
            >
              {appLanguage === "pl"
                ? "POBIERZ DARMOWY KLUCZ"
                : "GET FREE API KEY"}
            </a>
            <p className="text-[8px] text-zinc-700 font-mono uppercase tracking-tighter">
              Solus Christus • Sola Scriptura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
