import React, { useState, useEffect } from "react";
import {
  ToastMessage,
  APP_VERSION,
  fixOrphans,
  ApostleReport,
  ApostleLog,
} from "../types";
import { apostleService } from "../services/apostleService";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: "pl" | "en";
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onOpenRadioMode: () => void;
  onOpenDashboard: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  appLanguage,
  addToast,
  onOpenRadioMode,
  onOpenDashboard,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [apostleReport, setApostleReport] = useState<ApostleReport | null>(
    null,
  );
  const [apostleLogs, setApostleLogs] = useState<ApostleLog[]>([]);
  const [isApostleLoading, setIsApostleLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadApostleData();
    }
  }, [isOpen]);

  const loadApostleData = async () => {
    setIsApostleLoading(true);
    try {
      const [report, logs] = await Promise.all([
        apostleService.getLatestReport(),
        apostleService.getLatestLogs(5),
      ]);
      setApostleReport(report);
      setApostleLogs(logs);
    } catch (err) {
      console.error("Failed to load apostle data", err);
    } finally {
      setIsApostleLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMsg || !adminPin) {
      addToast(
        appLanguage === "pl" ? "Wypełnij wszystkie pola!" : "Fill all fields!",
        "alert",
      );
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          body: broadcastMsg,
          pin: adminPin,
        }),
      });

      const data = await response.json();
      if (data.success) {
        addToast(
          appLanguage === "pl"
            ? "Globalne Wołanie wysłane pomyślnie!"
            : "Global Call sent successfully!",
          "success",
        );
        setBroadcastTitle("");
        setBroadcastMsg("");
      } else {
        addToast(data.error || "Error", "alert");
      }
    } catch (err) {
      addToast("Failed to connect to server", "alert");
    } finally {
      setIsSending(false);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    addToast(
      appLanguage === "pl"
        ? "Wyczyszczono pamięć podręczną aplikacji!"
        : "Application cache cleared!",
      "success",
    );
  };

  const handleResetOnboarding = () => {
    localStorage.setItem("onboarding_completed_cc_radio", "false");
    addToast(
      appLanguage === "pl"
        ? "Samouczek zostanie wyświetlony ponownie przy następnym uruchomieniu."
        : "Onboarding will be shown again on next launch.",
      "info",
    );
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[450px] dark bg-zinc-950 z-[250] transform transition-transform duration-500 ease-in-out shadow-4xl border-l border-white/5 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-8 sm:p-10 relative overflow-y-auto scrollbar-thin">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center w-full mb-6 flex-shrink-0 relative z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Panel" : "Admin"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Administratora" : "Panel"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
              {appLanguage === "pl"
                ? "Narzędzia administracyjne"
                : "Administrative tools"}
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-3 bg-zinc-900 rounded-full text-zinc-500 shadow-lg hover:bg-zinc-800 transition-all hover:text-[#C5A059] active:scale-90 border border-zinc-800"
            title={appLanguage === "pl" ? "Zamknij" : "Close"}
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

        <div className="flex-1 text-center py-12 px-4 relative z-10">
          <div className="w-24 h-24 mx-auto bg-[#C5A059]/10 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl border border-[#C5A059]/20">
            ⚙️
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
            {appLanguage === "pl"
              ? "Funkcje administracyjne"
              : "Admin Functions"}
          </h3>
          <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto mb-8">
            {fixOrphans(
              appLanguage === "pl"
                ? "Ostrożnie korzystaj z tych narzędzi. Mogą one wpłynąć na dane aplikacji."
                : "Use these tools carefully. They may affect application data.",
            )}
          </p>

          <div className="space-y-4 mb-10 text-left bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
            <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
              {appLanguage === "pl"
                ? "Apostoł Cyfrowy (Agent Strategiczny)"
                : "Digital Apostle (Strategic Agent)"}
            </h4>

            {isApostleLoading ? (
              <div className="py-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {apostleReport ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] p-4 rounded-xl border border-white/5">
                      <p className="text-[#C5A059] text-[10px] uppercase font-black tracking-widest mb-2">
                        {appLanguage === "pl"
                          ? "Ostatni Raport Strategiczny"
                          : "Latest Strategic Report"}
                      </p>
                      <p className="text-zinc-300 text-xs leading-relaxed italic">
                        "{apostleReport.summary}"
                      </p>
                      {apostleReport.strategicSuggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                            {appLanguage === "pl"
                              ? "Sugestie Rozwoju:"
                              : "Strategic Suggestions:"}
                          </p>
                          {apostleReport.strategicSuggestions.map((s, i) => (
                            <div
                              key={i}
                              className="flex gap-2 text-xs text-zinc-400"
                            >
                              <span className="text-[#C5A059] font-bold">
                                •
                              </span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-zinc-500 text-xs italic">
                    {appLanguage === "pl"
                      ? "Brak dostępnych raportów strategii."
                      : "No strategy reports available."}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[#C5A059] text-[10px] uppercase font-black tracking-widest mb-2 px-1">
                    {appLanguage === "pl"
                      ? "Ostatnie Akcje Agenta"
                      : "Recent Agent Actions"}
                  </p>
                  <div className="space-y-1">
                    {apostleLogs.length > 0 ? (
                      apostleLogs.map((l) => (
                        <div
                          key={l.id}
                          className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/50 p-2 px-3 rounded-lg flex justify-between items-center text-[10px]"
                        >
                          <span className="text-zinc-300 truncate max-w-[70%]">
                            {l.action}
                          </span>
                          <span className="text-zinc-600 font-mono">
                            {new Date(l.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-2 text-zinc-600 text-[10px] italic">
                        {appLanguage === "pl" ? "Brak logów." : "No logs."}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  aria-label="Ulubione"
                  onClick={loadApostleData}
                  className="w-full py-3 bg-zinc-900 border border-white/5 text-[#C5A059] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {appLanguage === "pl"
                    ? "ODŚWIEŻ ANALIZĘ"
                    : "REFRESH ANALYSIS"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-10 text-left bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
            <h4 className="text-[#C5A059] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
              {appLanguage === "pl"
                ? "Globalne Wołanie (Push)"
                : "Global Broadcast (Push)"}
            </h4>

            <input
              type="text"
              placeholder={
                appLanguage === "pl"
                  ? "Tytuł powiadomienia..."
                  : "Notification title..."
              }
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium"
            />

            <textarea
              placeholder={
                appLanguage === "pl" ? "Treść wiadomości..." : "Message body..."
              }
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              rows={3}
              className="w-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium resize-none"
            />

            <input
              type="password"
              placeholder={
                appLanguage === "pl" ? "PIN Administratora..." : "Admin PIN..."
              }
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A059] outline-none transition-all placeholder:text-zinc-600 font-medium"
            />

            <button
              aria-label="Ulubione"
              onClick={handleBroadcast}
              disabled={isSending}
              className={`w-full py-4 ${isSending ? "bg-zinc-800" : "bg-[#C5A059]"} text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2`}
            >
              {isSending
                ? "Słuchaj..."
                : appLanguage === "pl"
                  ? "WYŚLIJ GLOBALNE WOŁANIE"
                  : "SEND GLOBAL BROADCAST"}
              {!isSending && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleClearCache}
              className="w-full py-4 bg-red-600 border border-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-red-700 hover:text-white transition-all active:scale-95"
            >
              {appLanguage === "pl"
                ? "Wyczyść Pamięć Podręczną"
                : "Clear Cache"}
            </button>
            <button
              onClick={handleResetOnboarding}
              className="w-full py-4 bg-orange-600 border border-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-orange-700 hover:text-white transition-all active:scale-95"
            >
              {appLanguage === "pl" ? "Zresetuj Samouczek" : "Reset Onboarding"}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex flex-col items-center gap-4 flex-shrink-0 relative z-10 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] mt-auto">
          <button
            aria-label="Ulubione"
            onClick={() => {
              onClose();
              onOpenDashboard();
            }}
            className="w-full py-5 bg-zinc-900 border border-[#C5A059]/30 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-zinc-800"
          >
            <svg
              className="w-5 h-5 text-[#C5A059]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {appLanguage === "pl"
              ? "OTWÓRZ DASHBOARD / KALENDARZ"
              : "OPEN DASHBOARD / CALENDAR"}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenRadioMode();
            }}
            className="w-full py-6 bg-[#C5A059] text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>

        <footer className="py-4 text-center text-zinc-600 text-xs flex-shrink-0">
          Created by{" "}
          <a
            href="https://wa.me/48783478280"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] hover:text-[#E2B859] transition-all font-bold"
          >
            NAZIR
          </a>{" "}
          2025 • v{APP_VERSION}
        </footer>
      </div>
    </div>
  );
};
