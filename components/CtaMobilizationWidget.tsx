import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Heart,
  Users,
  X,
  Link2Off,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";
import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

export const CtaMobilizationWidget: React.FC<Props> = ({ appLanguage }) => {
  const areAllWidgetsHidden = useAppStore((state) => state.areAllWidgetsHidden);
  const {
    position,
    size,
    groupId,
    isGroupMinimized,
    onDrag,
    onDragStop,
    onResizeStop,
    ungroup,
    minimizeGroup,
  } = useWidgetSync(
    "cta_mobilization",
    { x: 400, y: 150 },
    { width: 340, height: "auto" },
  );

  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem("cc_widget_cta_mobilization_visible");
    return stored === "true";
  });

  const [calFrequency, setCalFrequency] = useState<"WEEKLY" | "MONTHLY">(
    "MONTHLY",
  );

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("cc_widget_cta_mobilization_visible");
      setIsVisible(stored === "true");
    };
    window.addEventListener("cc_widgets_updated", handleUpdate);
    return () => window.removeEventListener("cc_widgets_updated", handleUpdate);
  }, []);

  const closeWidget = () => {
    setIsVisible(false);
    localStorage.setItem("cc_widget_cta_mobilization_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  if (!isVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

  const content = {
    title: appLanguage === "pl" ? "Wezwanie do działania" : "Call to Action",
    subtitle:
      appLanguage === "pl" ? "Duchowa Mobilizacja" : "Spiritual Mobilization",
    mission:
      appLanguage === "pl"
        ? "Wesprzyj budowę autonomicznego systemu operacyjnego Christian Culture."
        : "Support the creation of the autonomous Christian Culture operating system.",
    supportPrayer: appLanguage === "pl" ? "Modlitwa" : "Prayer",
    supportPeople: appLanguage === "pl" ? "Zasoby Ludzkie" : "Human Resources",
    supportFinance:
      appLanguage === "pl" ? "Wsparcie Finansowe" : "Financial Support",
    calendarTitle:
      appLanguage === "pl" ? "Zaplanuj wsparcie" : "Schedule support",
    calendarWeekly: appLanguage === "pl" ? "Co tydzień" : "Weekly",
    calendarMonthly: appLanguage === "pl" ? "Co miesiąc" : "Monthly",
    calendarButton:
      appLanguage === "pl" ? "Dodaj do kalendarza" : "Add to calendar",
    ctaText:
      appLanguage === "pl"
        ? "Zrób to Dla Jezusa – On już czeka."
        : "Do it for Jesus – He is already waiting.",
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(
      appLanguage === "pl"
        ? "Wsparcie Misji Christian Culture"
        : "Supporting Christian Culture Mission",
    );
    const details = encodeURIComponent(
      appLanguage === "pl"
        ? "Przypomnienie o modlitwie i wsparciu budowy autonomicznego systemu Christian Culture. Zrób to Dla Jezusa."
        : "Reminder about prayer and support for building the Christian Culture autonomous system. Do it for Jesus.",
    );
    const freq =
      calFrequency === "WEEKLY" ? "RRULE:FREQ=WEEKLY" : "RRULE:FREQ=MONTHLY";

    // Google Calendar URL format
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=${freq}`;
    window.open(googleUrl, "_blank");
  };

  const supportLinks = [
    {
      name: "Patronite",
      url: "https://patronite.pl/osobowoscplus",
      color: "bg-[#FF5500] text-white",
    },
    {
      name: "Zrzutka",
      url: "https://zrzutka.pl/rs4g4v",
      color: "bg-[#FF3366] text-white",
    },
    {
      name: "Revolut",
      url: "https://revolut.me/christianculture",
      color: "bg-white text-black",
    },
    {
      name: "Blik",
      url: "tel:+48537147043",
      color: "bg-zinc-800 text-white",
      label: "+48 537 147 043",
    },
  ];

  const actionLinks = [
    {
      name: content.supportPrayer,
      icon: <Heart className="w-4 h-4 text-[#C5A059]" />,
      url: "https://chat.whatsapp.com/LGzSCB9K5Vp2jTF8dIALI6",
    },
    {
      name: content.supportPeople,
      icon: <Users className="w-4 h-4 text-[#C5A059]" />,
      url: "sms:+48783478280?body=Chcę%20służyć%20w%20misji%20dla%20Boga",
    },
  ];

  return createPortal(
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      minWidth={300}
      minHeight={250}
      bounds="window"
      className="!fixed z-[50]"
      cancel=".drag-cancel"
      dragHandleClassName="drag-handle"
    >
      <div className="w-full h-full relative rounded-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-3xl border-2 border-[#C5A059]/30 shadow-[0_0_50px_rgba(197,160,89,0.2)] overflow-hidden flex flex-col p-5 font-sans">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#C5A059]/10 via-transparent to-[#C5A059]/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4 drag-handle cursor-move">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C5A059] animate-pulse" />
            <div className="flex flex-col">
              <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                {content.title}
              </h3>
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest mt-1">
                {content.subtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 drag-cancel">
            {groupId && (
              <button
                aria-label="W dół"
                onClick={minimizeGroup}
                className="text-zinc-500 hover:text-[#C5A059] transition-colors p-1 hover:bg-white/5 rounded-full"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              aria-label="Zamknij"
              onClick={closeWidget}
              className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-grow py-2">
          <p className="text-zinc-300 text-[10px] text-center leading-relaxed mb-4 italic px-2">
            "{content.mission}"
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4 drag-cancel">
            {actionLinks.map((action) => (
              <a
                key={action.name}
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-3 flex flex-col items-center gap-1 group hover:border-[#C5A059]/50 transition-all active:scale-95"
              >
                {action.icon}
                <span className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-white transition-colors">
                  {action.name}
                </span>
              </a>
            ))}
          </div>

          <div className="mb-4 drag-cancel bg-white/5 rounded-xl p-3 border border-white/5">
            <h4 className="text-[9px] font-black uppercase text-[#C5A059] tracking-widest mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3" /> {content.calendarTitle}
            </h4>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setCalFrequency("WEEKLY")}
                className={`flex-1 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${calFrequency === "WEEKLY" ? "bg-[#C5A059] text-black" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}
              >
                {content.calendarWeekly}
              </button>
              <button
                onClick={() => setCalFrequency("MONTHLY")}
                className={`flex-1 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${calFrequency === "MONTHLY" ? "bg-[#C5A059] text-black" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}
              >
                {content.calendarMonthly}
              </button>
            </div>
            <button
              onClick={addToCalendar}
              className="w-full py-2 bg-zinc-100 hover:bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all group active:scale-95"
            >
              <Target className="w-3 h-3 group-hover:scale-110 transition-transform" />
              {content.calendarButton}
            </button>
          </div>

          <div className="space-y-2 drag-cancel">
            <h4 className="text-[9px] font-black uppercase text-[#C5A059] tracking-widest mb-2 flex items-center gap-2">
              <Heart className="w-3 h-3" /> {content.supportFinance}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${link.color}`}
                >
                  <span className="flex items-center gap-1">
                    {link.name}
                    <ExternalLink className="w-2 h-2 opacity-50" />
                  </span>
                  {link.label && (
                    <span className="text-[7px] opacity-70 mt-0.5">
                      {link.label}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-4 pt-4 border-t border-[#C5A059]/10 flex flex-col items-center gap-3">
          <p className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.15em] text-center animate-pulse">
            {content.ctaText}
          </p>

          <div className="flex items-center gap-4 drag-cancel">
            <div className="flex items-center gap-1 text-[8px] text-zinc-500 font-bold uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded-md bg-zinc-900/50">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />{" "}
              {appLanguage === "pl"
                ? "Bezpieczne połączenie"
                : "Secure Connection"}
            </div>
            {groupId && (
              <button
                onClick={ungroup}
                className="text-zinc-500 hover:text-red-400 transition-all active:scale-90 p-1 bg-white/5 rounded-md"
              >
                <Link2Off className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Rnd>,
    document.body,
  );
};
