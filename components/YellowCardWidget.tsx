import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  StickyNote,
  Calendar,
  X,
  Link2Off,
  ChevronDown,
  Check,
  Save,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { SupportedLanguage } from "../types";
import { useWidgetSync } from "../hooks/useWidgetSync";

import { useAppStore } from "../useAppStore";

interface Props {
  appLanguage: SupportedLanguage;
}

export const YellowCardWidget: React.FC<Props> = ({ appLanguage }) => {
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
    "yellow_card",
    { x: 400, y: 300 },
    { width: 300, height: 350 },
  );

  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem("cc_widget_yellow_card_visible");
    return stored === "true";
  });

  const [noteContent, setNoteContent] = useState(() => {
    return localStorage.getItem("cc_yellow_card_content") || "";
  });

  const [cardColor, setCardColor] = useState(() => {
    return localStorage.getItem("cc_yellow_card_color") || "yellow";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("cc_yellow_card_font_size") || "sm";
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("cc_yellow_card_color", cardColor);
  }, [cardColor]);

  useEffect(() => {
    localStorage.setItem("cc_yellow_card_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("cc_widget_yellow_card_visible");
      setIsVisible(stored === "true");
    };
    window.addEventListener("cc_widgets_updated", handleUpdate);
    return () => window.removeEventListener("cc_widgets_updated", handleUpdate);
  }, []);

  const closeWidget = () => {
    setIsVisible(false);
    localStorage.setItem("cc_widget_yellow_card_visible", "false");
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  const saveNote = () => {
    localStorage.setItem("cc_yellow_card_content", noteContent);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addToCalendar = () => {
    if (!noteContent) return;
    const title = encodeURIComponent(
      appLanguage === "pl"
        ? "Notatka: Christian Culture"
        : "Note: Christian Culture",
    );
    const details = encodeURIComponent(noteContent);
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(googleUrl, "_blank");
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-orange-500/80";
      case "green":
        return "bg-emerald-500/80";
      case "black":
        return "bg-zinc-800/80";
      case "pink":
        return "bg-pink-500/80";
      case "blue":
        return "bg-blue-500/80";
      case "yellow":
      default:
        return "bg-yellow-400/80";
    }
  };

  if (!isVisible || !position || isGroupMinimized || areAllWidgetsHidden)
    return null;

  return createPortal(
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      minWidth={250}
      minHeight={200}
      bounds="window"
      className="!fixed z-[50]"
      cancel=".drag-cancel"
      dragHandleClassName="drag-handle"
    >
      <div className="w-full h-full relative rounded-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/90 border border-[#C5A059]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-4 font-sans border-b-4 border-r-4">
        {/* Premium texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.webp')]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4 drag-handle cursor-move border-b border-[#C5A059]/20 pb-2">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em]">
              {appLanguage === "pl" ? "Żółta Kartka" : "Sticky Note"}
            </h3>
          </div>
          <div className="flex items-center gap-2 drag-cancel">
            {groupId && (
              <button
                aria-label="W dół"
                onClick={minimizeGroup}
                className="text-[#C5A059]/50 hover:text-[#C5A059] transition-colors p-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              aria-label="Zamknij"
              onClick={closeWidget}
              className="text-[#C5A059]/50 hover:text-red-500 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area - Colored Center */}
        <div
          className={`relative z-10 flex-grow flex flex-col gap-3 rounded-xl transition-colors duration-500 p-3 shadow-inner ${getColorClass(cardColor)}`}
        >
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onBlur={saveNote}
            placeholder={
              appLanguage === "pl"
                ? "Wpisz swoje myśli, plany, modlitwy..."
                : "Write your thoughts, plans, prayers..."
            }
            className={`w-full flex-grow bg-transparent border-none outline-none resize-none font-medium placeholder:opacity-30 drag-cancel ${cardColor === "black" ? "text-white" : "text-zinc-950"} ${
              fontSize === "sm"
                ? "text-sm"
                : fontSize === "lg"
                  ? "text-lg"
                  : "text-2xl"
            }`}
          />

          <div className="flex items-center justify-between pt-2 border-t border-black/10 drag-cancel">
            <div className="flex gap-2">
              <button
                onClick={saveNote}
                className={`p-2 rounded-lg transition-all ${isSaved ? "bg-green-600 text-white" : "bg-black/20 text-current hover:bg-black/30"}`}
                title={appLanguage === "pl" ? "Zapisz" : "Save"}
              >
                {isSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={addToCalendar}
                className="p-2 bg-black/20 text-current hover:bg-black/30 rounded-lg transition-all"
                title={
                  appLanguage === "pl"
                    ? "Dodaj do kalendarza"
                    : "Add to calendar"
                }
              >
                <Calendar className="w-4 h-4" />
              </button>

              {/* Font Size Selector */}
              <div className="flex gap-1 ml-1 items-center">
                {(["sm", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`w-6 h-6 flex items-center justify-center rounded border border-black/10 text-[10px] font-bold transition-all ${
                      fontSize === s
                        ? cardColor === "black"
                          ? "bg-white/20 text-white"
                          : "bg-black/30 text-zinc-950"
                        : "bg-black/5 text-current/60 hover:bg-black/10"
                    }`}
                  >
                    {s === "sm" ? "T" : s === "lg" ? "TT" : "TTT"}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex gap-1">
              {(
                ["yellow", "orange", "green", "black", "pink", "blue"] as const
              ).map((color) => (
                <button
                  key={color}
                  onClick={() => setCardColor(color)}
                  className={`w-3 h-3 rounded-full border border-white/20 transition-transform ${cardColor === color ? "scale-125 border-white shadow-lg" : "hover:scale-110"} ${
                    color === "yellow"
                      ? "bg-yellow-400"
                      : color === "orange"
                        ? "bg-orange-500"
                        : color === "green"
                          ? "bg-emerald-500"
                          : color === "black"
                            ? "bg-zinc-800"
                            : color === "pink"
                              ? "bg-pink-500"
                              : "bg-blue-500"
                  }`}
                />
              ))}
            </div>

            {groupId && (
              <button
                onClick={ungroup}
                className="text-black/30 hover:text-red-700 transition-all p-1"
                title={appLanguage === "pl" ? "Rozgruppuj" : "Ungroup"}
              >
                <Link2Off className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-2 text-[8px] text-[#C5A059]/40 uppercase font-black tracking-widest text-right">
          {appLanguage === "pl" ? "ZROB TO DLA JEZUSA" : "DO IT FOR JESUS"}
        </div>
      </div>
    </Rnd>,
    document.body,
  );
};
