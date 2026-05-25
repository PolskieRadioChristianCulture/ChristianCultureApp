import React, { useState, useEffect, useMemo } from "react";
import {
  Prayer,
  YouTubeChannel,
  APP_VERSION,
  SHOP_URL,
  RADIO_LISTEN_NUMBER_PL,
  RADIO_LISTEN_NUMBER_EN,
  HOTLINE_NADZIEJA_NUMBER,
  RadioStreamType,
  CENTRUM_CC_URL,
  CENTRUM_LOGO_URL,
  SupportedLanguage,
  VisualMode,
} from "../types";
import { useAppStore } from "../useAppStore";
import { AboutSection } from "./AboutSection";
import { Separator } from "./Separator";
import { nativeService } from "../services/nativeService";
import { mediaPlayerService } from "../services/mediaPlayerService";
import { ImpactStyle } from "@capacitor/haptics";

interface SidebarProps {
  prayers: Prayer[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isRadioPlaying: boolean;
  onToggleRadio: () => void;
  onClose?: () => void;
  onShareRadio: () => void;
  addToast: (message: string, type?: "info" | "success" | "news") => void;
  eqMode: "Auto" | "Vocal" | "Worship" | "Gospel";
  setEqMode: (mode: "Auto" | "Vocal" | "Worship" | "Gospel") => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onOpenManagement: (tab: any) => void;
  onOpenTutorialPanel: () => void;
  onOpenBiblicalSchool: () => void;
  appLanguage: SupportedLanguage;
  onOpenRadioMode: () => void;
  onOpenDashboard: () => void;
  onInstallApp?: () => void;
  onShareApp: () => void;
  installStatus?: "install" | "installed" | "update";
  activeStream: RadioStreamType;
  visualMode: VisualMode;
  onOpenSupport: () => void;
  onOpenEcosystemMap: () => void;
  onOpenWeeklySchedule: () => void;
  onOpenWidgetPreview?: () => void;
  onOpenImaginationStudio?: () => void;
  onOpenSongCreator?: () => void;
  onOpenStrategicPartners?: () => void;
}

const YT_CHANNELS: YouTubeChannel[] = [
  {
    id: "osobowosc-plus",
    name: "Osobowość Plus",
    url: "https://www.youtube.com/@osobowo%C5%9B%C4%87PLUS",
    description: "Rozwój i wiara",
    icon: "🧠",
  },
  {
    id: "cc-tv",
    name: "Christian Culture TV",
    url: "https://www.youtube.com/@ChristianCultureTV",
    description: "Telewizja wartości",
    icon: "📺",
  },
  {
    id: "cc-radio-yt",
    name: "Radio CC Polska",
    url: "https://www.youtube.com/@RadioChristianCulture",
    description: "Transmisje na żywo",
    icon: "📻",
  },
];

const SpectrumAnalyzer: React.FC<{ active: boolean; label: string }> = ({
  active,
  label,
}) => {
  const [bars, setBars] = useState<number[]>(new Array(12).fill(5));

  useEffect(() => {
    if (!active) {
      setBars(new Array(12).fill(5));
      return;
    }
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.floor(Math.random() * 100)));
    }, 80);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex-1 space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[7px] font-mono text-[#C5A059]">
          {active ? "HI-RES" : "OFF"}
        </span>
      </div>
      <div className="h-10 bg-zinc-900/50 rounded-lg overflow-hidden border border-white/5 flex items-end gap-[2px] p-1.5">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-[1px] transition-all duration-75 ${active ? "bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]" : "bg-zinc-800"}`}
            style={{
              height: `${active ? height : 5}%`,
              opacity: active ? 0.4 + height / 200 : 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isRadioPlaying,
  onToggleRadio,
  onClose,
  onShareRadio,
  addToast,
  eqMode,
  setEqMode,
  scrollRef,
  onScroll,
  onOpenManagement,
  onOpenTutorialPanel,
  onOpenBiblicalSchool,
  appLanguage,
  onOpenRadioMode,
  onOpenDashboard,
  onInstallApp,
  onShareApp,
  installStatus = "install",
  activeStream,
  visualMode,
  onOpenSupport,
  onOpenEcosystemMap,
  onOpenWeeklySchedule,
  onOpenWidgetPreview,
  onOpenImaginationStudio,
  onOpenSongCreator,
  onOpenStrategicPartners,
}) => {
  const dynamicDB = useAppStore((state) => state.dynamicDB);
  const [hdOn, setHdOn] = useState(true);

  const displayHotline = useMemo(() => {
    const numMatch = dynamicDB["Kontakt tel."]?.match(
      /Infolinia.*?(\+48\s?\d{9,11})/i,
    );
    return numMatch ? numMatch[1] : HOTLINE_NADZIEJA_NUMBER;
  }, [dynamicDB]);

  const displayYTChannels = useMemo(() => {
    const channels = [...YT_CHANNELS];
    // Add dynamic channel if present and not already there
    if (dynamicDB["Kanały YouTube"]?.includes("Osobowość Plus")) {
      const urlMatch = dynamicDB["Kanały YouTube"].match(
        /https:\/\/youtube\.com\/@[\w?=&%-]+/i,
      );
      if (urlMatch && !channels.some((c) => c.id === "plus-dynamic")) {
        channels.unshift({
          id: "plus-dynamic",
          name: "Osobowość Plus",
          url: urlMatch[0],
          description: "Rozwój i Wiara",
          icon: "🧠",
        });
      }
    }
    return channels;
  }, [dynamicDB]);

  const streamName = useMemo(() => {
    if (activeStream === "BIBLIA") return "BIBLIA AUDIO";
    if (activeStream === "PL") return "HALLELUYAH RADIO";
    return "CHRISTIAN CULTURE GLOBAL";
  }, [activeStream]);

  const renderInstallButton = () => {
    if (installStatus === "installed") return null;

    let text = appLanguage === "pl" ? "Zainstaluj Aplikację" : "Install App";
    let icon = (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    );
    let bgColor = "bg-gold-dark";
    let textColor = "text-white";
    let pulse = "animate-pulse-slow";

    if (installStatus === "update") {
      text = appLanguage === "pl" ? "Aktualizuj Aplikację" : "Update App";
      icon = (
        <svg
          className="w-5 h-5 animate-spin-slow"
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
      );
      bgColor = "bg-red-600";
      textColor = "text-white";
      pulse = "animate-bounce";
    }

    return (
      <div className="space-y-4 mb-8">
        <button
          onClick={onInstallApp}
          className={`w-full py-3 ${bgColor} ${textColor} font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl ${pulse} border-2 border-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3`}
        >
          {icon}
          {text}
        </button>

        <button
          aria-label="Ulubione"
          onClick={onOpenSupport}
          className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl border-2 border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {appLanguage === "pl" ? "Wspieraj CC" : "Support CC"}
        </button>

        <button
          aria-label="Ulubione"
          onClick={onShareApp}
          className="w-full py-3 glass text-[#C5A059] font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl border border-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {appLanguage === "pl" ? "Udostępnij Aplikację" : "Share App"}
        </button>
      </div>
    );
  };

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="px-6 pb-20 pt-safe flex flex-col h-full glass-dark text-zinc-100 overflow-y-auto relative scroll-smooth border-r border-white/10"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        <div className="flex items-start justify-between mb-8 mt-4 flex-shrink-0 animate-fade-in-down">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-[#C5A059]/20 border border-white/5 group">
              <img
                src="https://drive.google.com/thumbnail?id=1dHi9QX86UWj21YAIk3I8xyAXalzQkZpj&sz=w512"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="CC Logo"
              />
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-100 uppercase tracking-widest">
                CC Radio
              </h2>
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-tighter">
                v{APP_VERSION}
              </p>
            </div>
          </div>
          <button
            aria-label="Ulubione"
            onClick={() => {
              nativeService.hapticImpact(ImpactStyle.Light);
              onClose?.();
            }}
            className="p-3 text-zinc-400 glass rounded-xl border border-white/5 shadow-lg hover:text-white transition-colors"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* PORTAL HUB LINK - STABILNA KARTA */}
        <button
          aria-label="Ulubione"
          onClick={() => window.open(CENTRUM_CC_URL, "_blank")}
          className="w-full mb-6 relative group active:scale-[0.98] transition-all animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059] to-[#A68043] rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass-gold rounded-2xl p-4 flex items-center gap-4 shadow-2xl overflow-hidden">
            {/* Animated Glow Border Segment */}
            <style>{`
            @keyframes goldGlowSubtle { 0% { box-shadow: 0 0 10px rgba(197, 160, 89, 0.3); } 100% { box-shadow: 0 0 20px rgba(197, 160, 89, 0.6); } }
            .animate-gold-glow-subtle { animation: goldGlowSubtle 3s infinite alternate ease-in-out; }
          `}</style>

            <div className="w-11 h-11 rounded-xl bg-black border border-[#C5A059]/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={CENTRUM_LOGO_URL}
                alt="CC Hub"
                className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                CENTRUM CC
              </h3>
              <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-tight mt-0.5">
                {appLanguage === "pl"
                  ? "PORTAL USŁUG GLOBAL"
                  : "GLOBAL SERVICES PORTAL"}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-[#C5A059] opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </button>

        {/* USUNIĘTO SAMOUCZEK - USTAWIENIA TERAZ NA PEŁNĄ SZEROKOŚĆ */}
        <div
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            aria-label="Ulubione"
            onClick={() => onOpenManagement("cloud")}
            className="w-full flex items-center justify-center gap-4 py-4 glass rounded-2xl border border-white/10 hover:border-[#C5A059]/50 text-zinc-400 hover:text-white transition-all group shadow-xl"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">
              {appLanguage === "pl" ? "Integracje" : "Integrations"}
            </span>
          </button>
        </div>

        {renderInstallButton()}

        <div
          className="mb-6 flex-shrink-0 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isRadioPlaying ? "bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "bg-zinc-800"}`}
                ></span>
                {streamName}
              </div>
            </div>
          </div>
          <div
            className={`p-6 rounded-[2.5rem] border transition-all duration-700 glass-dark ${isRadioPlaying ? "border-[#C5A059]/40 shadow-2xl" : "border-white/5"}`}
          >
            <div className="flex gap-4 mb-6">
              <SpectrumAnalyzer active={isRadioPlaying} label="CH-L" />
              <SpectrumAnalyzer active={isRadioPlaying} label="CH-R" />
            </div>
            <div className="flex items-center justify-around">
              <button
                aria-label="Equalizer"
                onClick={() =>
                  setEqMode(eqMode === "Gospel" ? "Worship" : "Gospel")
                }
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${eqMode !== "Auto" ? "border-[#C5A059] text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.2)]" : "border-zinc-700 text-zinc-400 group-hover:border-zinc-500"}`}
                >
                  EQ
                </div>
                <span className="text-[7px] font-black uppercase text-zinc-500">
                  {eqMode}
                </span>
              </button>
              <button
                aria-label={
                  isRadioPlaying ? "Zatrzymaj radio" : "Odtwarzaj radio"
                }
                onClick={() => {
                  onToggleRadio();
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-4 ${isRadioPlaying ? "bg-black border-red-600 scale-110 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : "bg-zinc-800 border-zinc-700 hover:border-zinc-500"}`}
              >
                {isRadioPlaying ? (
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-5 bg-[#C5A059] rounded-full"></div>
                    <div className="w-1.5 h-5 bg-[#C5A059] rounded-full"></div>
                  </div>
                ) : (
                  <svg
                    className="w-8 h-8 text-zinc-400 translate-x-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setHdOn(!hdOn)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${hdOn ? "border-[#C5A059] text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.2)]" : "border-zinc-700 text-zinc-400 group-hover:border-zinc-500"}`}
                >
                  HD
                </div>
                <span className="text-[7px] font-black uppercase text-zinc-500">
                  HI-RES
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5 mt-6">
              <a
                href={`tel:${displayHotline.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 py-3.5 bg-blue-700/80 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all border border-blue-400/30 hover:bg-blue-600"
              >
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {appLanguage === "pl" ? "INFOLINIA" : "HOTLINE"}
              </a>
              <a
                href={`tel:${RADIO_LISTEN_NUMBER_PL}`}
                className="flex items-center justify-center gap-2 py-3.5 bg-blue-700/80 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all border border-blue-400/30 hover:bg-blue-600"
              >
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {appLanguage === "pl" ? "ZADZWOŃ" : "CALL"}
              </a>
            </div>
          </div>
        </div>

        <div className="mb-12 flex-shrink-0">
          <Separator
            text={appLanguage === "pl" ? "KANAŁY YOUTUBE" : "YOUTUBE CHANNELS"}
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4">
            {displayYTChannels.map((channel) => (
              <button
                aria-label="Ulubione"
                key={channel.id}
                onClick={() => window.open(channel.url, "_blank")}
                className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/5 hover:border-[#C5A059]/50 transition-all group shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                  {channel.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="text-[11px] font-black text-zinc-100 uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {channel.name}
                  </div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {channel.description}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-zinc-600 group-hover:text-[#C5A059] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <nav className="space-y-3 mb-10 flex-shrink-0">
          <button
            onClick={() => {
              onOpenRadioMode();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-[#C5A059] border border-[#C5A059]/20 shadow-2xl active:scale-95 transition-all"
          >
            <span className="text-3xl">📻</span>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl" ? "Radio" : "Radio"}
            </span>
          </button>
          <button
            onClick={() => {
              onOpenEcosystemMap();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-[#C5A059] border border-[#C5A059]/40 shadow-[0_0_15px_rgba(197,160,89,0.2)] active:scale-95 transition-all"
          >
            <span className="text-3xl">🗺️</span>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl" ? "Mapa Ekosystemu CC" : "CC Ecosystem Map"}
            </span>
          </button>
          <button
            onClick={onOpenBiblicalSchool}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-zinc-400 border border-white/5 hover:border-white/20 shadow-xl active:scale-95 transition-all"
          >
            <span className="text-3xl">🎓</span>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl" ? "Szkoła Biblijna" : "Biblical School"}
            </span>
          </button>
          <button
            onClick={() => {
              onOpenWeeklySchedule();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-emerald-400 border border-emerald-500/20 shadow-xl active:scale-95 transition-all"
          >
            <span className="text-3xl">📅</span>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl" ? "Dziś w programie" : "Today in program"}
            </span>
          </button>
          <button
            onClick={() => {
              onOpenDashboard();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-zinc-400 border border-white/5 hover:border-white/20 shadow-xl active:scale-95 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              📅
            </div>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl"
                ? "Planer / Kalendarz"
                : "Planner / Calendar"}
            </span>
          </button>

          {/* NOWE USŁUGI PREMIUM */}
          <button
            onClick={() => {
              onOpenImaginationStudio?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-[#D4AF37] border border-[#D4AF37]/20 shadow-xl active:scale-95 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              🎨
            </div>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl"
                ? "Your Imagination Studio"
                : "Your Imagination Studio"}
            </span>
          </button>
          <button
            onClick={() => {
              onOpenSongCreator?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-6 px-6 py-4 rounded-3xl glass text-[#D4AF37] border border-[#D4AF37]/20 shadow-xl active:scale-95 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              🎵
            </div>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl" ? "Osobista Piosenka" : "Personal Song"}
            </span>
          </button>
        </nav>

        <div className="mt-auto pt-8 flex-shrink-0 space-y-4">
          <button
            onClick={onOpenStrategicPartners}
            className="w-full flex items-center justify-center gap-4 py-4 glass rounded-[2rem] border border-[#C5A059]/30 hover:border-[#C5A059]/60 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)] active:scale-95 transition-all group"
          >
            <span className="text-2xl">🤝</span>
            <span className="text-sm font-black tracking-tight uppercase">
              {appLanguage === "pl"
                ? "Partnerzy Strategiczni"
                : "Strategic Partners"}
            </span>
          </button>

          <button
            onClick={
              visualMode === "sabbath"
                ? undefined
                : () => window.open(SHOP_URL, "_blank")
            }
            disabled={visualMode === "sabbath"}
            className={`w-full flex items-center gap-4 p-4 rounded-[2rem] border transition-all group ${visualMode === "sabbath" ? "bg-zinc-900 text-zinc-600 border-white/5 grayscale cursor-not-allowed" : "bg-gold-dark text-white border-gold-dark hover:bg-gold shadow-lg shadow-gold/20"}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
              🛍️
            </div>
            <div className="text-left flex-1">
              <div className="text-xs font-black uppercase tracking-tight leading-none mb-1">
                {visualMode === "sabbath"
                  ? appLanguage === "pl"
                    ? "Sklep (Zamknięty)"
                    : "Store (Closed)"
                  : appLanguage === "pl"
                    ? "Sklep CC"
                    : "CC Store"}
              </div>
              <div className="text-[10px] font-bold opacity-90 uppercase tracking-tighter leading-tight">
                {visualMode === "sabbath"
                  ? appLanguage === "pl"
                    ? "Odpoczynek Szabatowy"
                    : "Sabbath Rest"
                  : appLanguage === "pl"
                    ? "Chrześcijańska Grafika"
                    : "Christian Graphics"}
              </div>
            </div>
          </button>
        </div>

        <Separator
          text={appLanguage === "pl" ? "O NAS" : "ABOUT US"}
          className="mt-8"
        />
        <AboutSection appLanguage={appLanguage} />
        <div className="flex justify-center my-4">
          <a
            href="https://patronite.pl/osobowoscplus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.patronite.pl/widget/buttons/dark/button-dark.svg"
              alt="Wspieraj Autora na Patronite"
            />
          </a>
        </div>
        <div className="mb-8">
          <button
            aria-label="Ulubione"
            onClick={() => {
              onOpenRadioMode();
              onClose?.();
            }}
            className="w-full flex items-center justify-center gap-4 py-4 glass rounded-2xl border border-white/10 hover:border-[#C5A059]/50 text-zinc-400 hover:text-white transition-all group shadow-xl"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">
              {appLanguage === "pl" ? "Panel Główny" : "Main Panel"}
            </span>
          </button>
        </div>
        <div className="mb-8">
          <button
            onClick={onOpenWidgetPreview}
            className="w-full flex items-center justify-center gap-4 py-4 glass rounded-2xl border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] transition-all group shadow-xl"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📱
            </div>
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">
              {appLanguage === "pl" ? "Podgląd Widżetu" : "Widget Preview"}
            </span>
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-zinc-900/50 border border-[#C5A059]/20 p-4 rounded-xl text-center shadow-lg">
            <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2">
              {appLanguage === "pl" ? "Złota Przestrzeń" : "Golden Space"}
            </h4>
            <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight mb-2">
              {appLanguage === "pl"
                ? "W TYM MIEJSCU MOŻESZ PROMOWAĆ SWOJE CHRZEŚCIJAŃSKIE INICJATYWY"
                : "YOU CAN PROMOTE YOUR CHRISTIAN INITIATIVES HERE"}
            </p>
            <a
              href="mailto:polskiercctv@gmail.com"
              className="text-[9px] font-bold text-blue-400 hover:text-blue-300 uppercase underline tracking-widest block"
            >
              polskiercctv@gmail.com
            </a>
          </div>
        </div>
        <footer className="py-4 text-center text-zinc-500 dark:text-zinc-600 text-xs flex-shrink-0 relative">
          <button
            onClick={() => {
              mediaPlayerService.emit("openModal", "emi_media");
            }}
            className="absolute bottom-4 left-4 flex flex-col items-center gap-1 group"
          >
            <img
              src="/EMI.webp"
              alt="EMI"
              className="w-10 h-10 rounded-full border-2 border-[#C5A059] shadow-lg group-hover:scale-110 transition-transform"
            />
            <span className="text-[8px] font-black uppercase text-[#C5A059] tracking-widest leading-none">
              EMI
            </span>
            <span className="text-[6px] font-bold uppercase text-zinc-400">
              NEWS
            </span>
          </button>
          Created by NAZIR 2026 | v{APP_VERSION}
        </footer>
      </div>
    </div>
  );
};
