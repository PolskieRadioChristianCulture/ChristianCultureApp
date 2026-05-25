import React, { useState, useEffect } from "react";
import { X, Calendar, Save, Check, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SupportedLanguage } from "../types";

interface YellowCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
}

export const YellowCardModal: React.FC<YellowCardModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
}) => {
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
    if (isOpen) {
      setNoteContent(localStorage.getItem("cc_yellow_card_content") || "");
      setCardColor(localStorage.getItem("cc_yellow_card_color") || "yellow");
      setFontSize(localStorage.getItem("cc_yellow_card_font_size") || "sm");
    }
  }, [isOpen]);

  const saveNote = () => {
    localStorage.setItem("cc_yellow_card_content", noteContent);
    localStorage.setItem("cc_yellow_card_color", cardColor);
    localStorage.setItem("cc_yellow_card_font_size", fontSize);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    window.dispatchEvent(new Event("cc_yellow_card_updated"));
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
        return "bg-orange-500/90";
      case "green":
        return "bg-emerald-500/90";
      case "black":
        return "bg-zinc-900/95";
      case "pink":
        return "bg-pink-500/90";
      case "blue":
        return "bg-blue-500/90";
      default:
        return "bg-yellow-400/90";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-2xl h-[80vh] rounded-[2.5rem] relative overflow-hidden flex flex-col p-8 border border-white/10 shadow-2xl ${getColorClass(cardColor)}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black/10 rounded-2xl">
              <StickyNote
                className={`w-6 h-6 ${cardColor === "black" ? "text-white" : "text-zinc-950"}`}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-black uppercase tracking-widest ${cardColor === "black" ? "text-white" : "text-zinc-950"}`}
              >
                {appLanguage === "pl" ? "TWÓJ NOTATNIK" : "YOUR NOTEBOOK"}
              </h3>
              <p
                className={`text-[10px] font-bold opacity-60 ${cardColor === "black" ? "text-zinc-400" : "text-zinc-950"}`}
              >
                {appLanguage === "pl"
                  ? "Dla Jezusa - zapisz co ważne"
                  : "For Jesus - write what matters"}
              </p>
            </div>
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-3 hover:bg-black/10 rounded-full transition-all"
          >
            <X
              className={`w-6 h-6 ${cardColor === "black" ? "text-white" : "text-zinc-950"}`}
            />
          </button>
        </div>

        {/* Content */}
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder={
            appLanguage === "pl"
              ? "Wpisz swoje myśli, plany, modlitwy..."
              : "Write your thoughts, plans, prayers..."
          }
          className={`w-full flex-grow bg-transparent border-none outline-none resize-none font-medium placeholder:opacity-30 ${cardColor === "black" ? "text-white" : "text-zinc-950"} ${
            fontSize === "sm"
              ? "text-lg"
              : fontSize === "lg"
                ? "text-2xl"
                : "text-4xl"
          }`}
        />

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-black/10">
          <div className="flex items-center gap-3">
            <button
              onClick={saveNote}
              className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${
                isSaved
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-zinc-800 active:scale-95"
              }`}
            >
              {isSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {appLanguage === "pl" ? "ZAPISZ" : "SAVE"}
            </button>
            <button
              onClick={addToCalendar}
              className="p-3 bg-black/5 hover:bg-black/10 rounded-xl transition-all"
              title={
                appLanguage === "pl" ? "Dodaj do kalendarza" : "Add to calendar"
              }
            >
              <Calendar
                className={`w-5 h-5 ${cardColor === "black" ? "text-white" : "text-zinc-950"}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Font size */}
            <div className="flex gap-1 bg-black/5 p-1 rounded-lg">
              {(["sm", "lg", "xl"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-3 py-2 rounded-md text-[10px] font-black transition-all ${
                    fontSize === s
                      ? "bg-black text-white shadow-lg"
                      : "hover:bg-black/10 opacity-60"
                  }`}
                >
                  {s === "sm" ? "T" : s === "lg" ? "TT" : "TTT"}
                </button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex gap-2">
              {(
                ["yellow", "orange", "green", "black", "pink", "blue"] as const
              ).map((c) => (
                <button
                  key={c}
                  onClick={() => setCardColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${cardColor === c ? "scale-125 border-white shadow-xl" : "border-transparent opacity-60"} ${
                    c === "yellow"
                      ? "bg-yellow-400"
                      : c === "orange"
                        ? "bg-orange-500"
                        : c === "green"
                          ? "bg-emerald-500"
                          : c === "black"
                            ? "bg-zinc-800"
                            : c === "pink"
                              ? "bg-pink-500"
                              : "bg-blue-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
