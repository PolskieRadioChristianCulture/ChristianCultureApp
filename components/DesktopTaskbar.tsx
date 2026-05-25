import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database,
  Calendar,
  HardDrive,
  Image as ImageIcon,
  CheckSquare,
  Lightbulb,
  Cloud,
  Settings,
  ShieldCheck,
  BrainCircuit,
  Lock,
  X,
} from "lucide-react";
import { UserPersona, SupportedLanguage, ManagementTab } from "../types";
import { PersistenceService } from "../services/persistenceService";

interface DesktopTaskbarProps {
  userPersona: UserPersona;
  gapiSignedIn: boolean;
  appLanguage: SupportedLanguage;
  onOpenManagement: (tab: ManagementTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopTaskbar: React.FC<DesktopTaskbarProps> = ({
  userPersona,
  gapiSignedIn,
  appLanguage,
  onOpenManagement,
  isOpen,
  onClose,
}) => {
  const hasCloudApi = !!userPersona.googleClientId;
  const isCalendarActive =
    gapiSignedIn && userPersona.isGoogleCalendarConnected;
  const isDriveActive =
    gapiSignedIn && userPersona.joshuaSystem?.driveSyncEnabled;
  const isPhotosActive = gapiSignedIn && userPersona.isGooglePhotosConnected;
  const isTasksActive = gapiSignedIn && userPersona.isGoogleTasksConnected;
  const isKeepActive = gapiSignedIn && userPersona.isGoogleKeepConnected;

  const manualGeminiKey = PersistenceService.loadGeminiApiKey();
  const hasGeminiApi =
    (manualGeminiKey && manualGeminiKey.trim().length > 10) ||
    !!import.meta.env.VITE_GEMINI_API_KEY;

  const activeIntegrations = [
    {
      id: "gemini",
      active: hasGeminiApi,
      icon: BrainCircuit,
      label: "Gemini AI",
      color: "text-purple-400",
      tab: "preferences" as ManagementTab,
    },
    {
      id: "api",
      active: hasCloudApi,
      icon: Database,
      label: "Cloud API",
      color: "text-[#E2B859]",
      tab: "cloud" as ManagementTab,
    },
    {
      id: "calendar",
      active: isCalendarActive,
      icon: Calendar,
      label: "Calendar",
      color: "text-blue-400",
      tab: "cloud" as ManagementTab,
    },
    {
      id: "drive",
      active: isDriveActive,
      icon: HardDrive,
      label: "Drive Sync",
      color: "text-yellow-400",
      tab: "cloud" as ManagementTab,
    },
    {
      id: "photos",
      active: isPhotosActive,
      icon: ImageIcon,
      label: "Photos",
      color: "text-zinc-400",
      tab: "cloud" as ManagementTab,
    },
    {
      id: "tasks",
      active: isTasksActive,
      icon: CheckSquare,
      label: "Tasks",
      color: "text-indigo-400",
      tab: "cloud" as ManagementTab,
    },
    {
      id: "keep",
      active: isKeepActive,
      icon: Lightbulb,
      label: "Notes",
      color: "text-amber-400",
      tab: "cloud" as ManagementTab,
    },
  ].filter((item) => item.active);

  return (
    <>
      {/* Invisible trigger area (height increased for easier activation) */}
      <div className="fixed bottom-0 left-0 right-0 h-8 z-[4900] pointer-events-none" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-3xl border-t border-[#C5A059]/30 z-[5000] flex items-center justify-between px-6 shadow-[0_-10px_60px_rgba(0,0,0,0.9)]"
          >
            {/* Left Section: Active Integrations */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 pr-4 border-r border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onOpenManagement("cloud")}
              >
                <Cloud
                  className={`w-5 h-5 ${gapiSignedIn ? "text-emerald-500 animate-pulse" : "text-zinc-600"}`}
                />
                <span className="text-[10px] font-black text-white uppercase tracking-widest hidden lg:block">
                  {appLanguage === "pl" ? "Status Chmury" : "Cloud Status"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeIntegrations.length > 0 ? (
                  activeIntegrations.map((integration) => (
                    <motion.button
                      key={integration.id}
                      initial={{ scale: 0, x: -10 }}
                      animate={{ scale: 1, x: 0 }}
                      whileHover={{
                        scale: 1.15,
                        y: -4,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      title={integration.label}
                      onClick={() => onOpenManagement(integration.tab)}
                      className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${integration.color} shadow-lg transition-all outline-none`}
                    >
                      <integration.icon size={20} strokeWidth={2.5} />
                    </motion.button>
                  ))
                ) : (
                  <button
                    onClick={() => onOpenManagement("cloud")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <Lock
                      size={12}
                      className="text-zinc-600 transition-colors group-hover:text-zinc-400"
                    />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest italic">
                      {appLanguage === "pl"
                        ? "Prywatny Tryb Lokalny"
                        : "Private Local Mode"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Middle Section: Centered Brand Name (Optional, but adds Windows layout feel) */}
            <div className="hidden xl:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] pointer-events-none select-none">
                Christian Culture OS
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
            </div>

            {/* Right Section: System Controls Quick Access */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Ustawienia"
                onClick={() => onOpenManagement("profile")}
                className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/10 transition-all hover:border-[#C5A059]/30 group"
              >
                <Settings
                  size={14}
                  className="group-hover:rotate-90 transition-transform duration-700"
                />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                  {appLanguage === "pl" ? "System" : "System"}
                </span>
              </button>

              <div
                className="hidden md:flex flex-col items-end pr-1 border-r border-white/10 mr-1"
                title={
                  appLanguage === "pl"
                    ? "Twoje dane są bezpieczne"
                    : "Your data is safe"
                }
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                    Verified
                  </span>
                </div>
                <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">
                  TLS 1.3 + E2EE
                </span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-[#C5A059] font-black text-[10px]">
                <span className="animate-pulse">●</span>
                LIVE
              </div>

              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="ml-2 p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-red-900/50 transition-all border border-zinc-700/50"
                title={appLanguage === "pl" ? "Zamknij OS" : "Close OS"}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
