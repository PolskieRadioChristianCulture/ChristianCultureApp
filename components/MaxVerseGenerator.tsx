import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  Sparkles,
  Image as ImageIcon,
  Type,
  Maximize2,
  Download,
  Share2,
  Crown,
  Languages,
  Layout,
  Palette,
  ShieldCheck,
  Zap,
  ArrowLeft,
  ChevronRight,
  Check,
  History,
  Heart,
  Star,
  Smartphone,
  Monitor,
  Tablet,
  Layers,
  Upload,
  Info,
  MessageSquare,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";

interface MaxVerseGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialVerse?: any;
  uiLang?: "pl" | "en";
}

const CATEGORIES = [
  { id: "hope", label: "Nadzieja", en: "Hope" },
  { id: "love", label: "Miłość", en: "Love" },
  { id: "strength", label: "Siła", en: "Strength" },
  { id: "peace", label: "Pokój", en: "Peace" },
];

const RATIOS = [
  { id: "1:1", label: "Instagram (1:1)", icon: Tablet },
  { id: "9:16", label: "Stories (9:16)", icon: Smartphone },
  { id: "16:9", label: "YouTube (16:9)", icon: Monitor },
];

const BG_LIBRARIES = [
  { id: "minimalism", label: "Minimalizm", en: "Minimalism" },
  { id: "sacrum", label: "Sacrum", en: "Sacrum" },
  { id: "nature", label: "Natura", en: "Nature" },
  { id: "uploads", label: "Moje Zdjęcia", en: "My Photos" },
];

const FONT_PAIRS = [
  {
    id: "classic",
    name: "Lora + Inter",
    primary: '"Lora", serif',
    secondary: '"Inter", sans-serif',
  },
  {
    id: "modern",
    name: "Montserrat + Lora",
    primary: '"Montserrat", sans-serif',
    secondary: '"Lora", serif',
  },
  {
    id: "luxury",
    name: "Cinzel + Bodoni",
    primary: '"Cinzel", serif',
    secondary: '"Bodoni Moda", serif',
  },
];

const MaxVerseGenerator: React.FC<MaxVerseGeneratorProps> = ({
  isOpen,
  onClose,
  initialVerse,
  uiLang = "pl",
}) => {
  const [step, setStep] = useState<"words" | "studio" | "share">("words");
  const [activeRatio, setActiveRatio] = useState("1:1");
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [verseText, setVerseText] = useState(initialVerse?.text || "");
  const [reference, setReference] = useState(initialVerse?.reference || "");
  const [activeFontPair, setActiveFontPair] = useState(FONT_PAIRS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCCTagVisible, setIsCCTagVisible] = useState(true);
  const [userHandle, setUserHandle] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);

  const t = (pl: string, en: string) => (uiLang === "pl" ? pl : en);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9500] bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={step === "words" ? onClose : () => setStep("words")}
            className="group flex items-center gap-2 text-zinc-500 hover:text-[#C5A059] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#C5A059]/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">
              {step === "words" ? t("Zamknij", "Close") : t("Wróć", "Back")}
            </span>
          </button>

          <div className="w-px h-8 bg-white/5 mx-2" />

          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#C5A059] leading-none">
              Verse Generator{" "}
              <span className="text-[#C5A059]/50 font-serif">MAX</span>
            </h1>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
              Christian Culture | Digital Light
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5">
            <Zap className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[9px] font-black uppercase text-[#C5A059] tracking-widest">
              {t("Art Director: Joshua AI", "Art Director: Joshua AI")}
            </span>
          </div>

          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* STEP PROGRESS */}
      <div className="h-1 w-full bg-white/5 flex">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-full transition-all duration-700 ${
              (i === 1 && step === "words") ||
              (i === 2 && step === "studio") ||
              (i === 3 && step === "share")
                ? "flex-1 bg-[#C5A059]"
                : "w-2 bg-white/5"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* STEP 1: WORDS */}
        <AnimatePresence mode="wait">
          {step === "words" && (
            <motion.div
              key="words"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto"
            >
              <div className="w-full max-w-2xl space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                    {t(
                      "Czego szukasz w Słowie?",
                      "What are you seeking in The Word?",
                    )}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium">
                    {t(
                      "Wpisz temat, werset lub pozwól, by Słowo znalazło Ciebie.",
                      "Enter a topic, a verse, or let The Word find you.",
                    )}
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute inset-[-2px] bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent rounded-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                  <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-2 flex items-center">
                    <div className="w-14 h-14 flex items-center justify-center text-zinc-500">
                      <Search className="w-6 h-6" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-zinc-700"
                      placeholder={t(
                        "np. Nadzieja, Strach, J 3,16...",
                        "e.g. Hope, Fear, John 3:16...",
                      )}
                    />
                    <button className="h-12 px-6 bg-[#C5A059] text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
                      {t("Szukaj", "Search")}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className="p-6 bg-zinc-900 border border-white/5 rounded-3xl hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 transition-all text-center group"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-[#C5A059]">
                        {t(cat.label, cat.en)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5">
                  <button
                    aria-label="Dalej"
                    onClick={() => {
                      setVerseText(
                        "Bo tak Bóg umiłował świat, że Syna swego jednorodzonego dał, aby każdy, kto weń wierzy, nie zginął, ale miał żywot wieczny.",
                      );
                      setReference("Ewangelia Jana 3:16");
                      setStep("studio");
                    }}
                    className="w-full p-8 bg-zinc-900/50 border border-[#C5A059]/20 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-[-4px] transition-all"
                  >
                    <div className="w-20 h-20 bg-[#C5A059] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(197,160,89,0.3)]">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-widest">
                        {t(
                          "Kuratela Christian Culture",
                          "Christian Culture Curated",
                        )}
                      </span>
                      <h3 className="text-xl font-black uppercase tracking-tight mt-1">
                        {t("Werset Dnia", "Verse of the Day")}
                      </h3>
                      <p className="text-zinc-500 text-xs italic mt-2">
                        "Albowiem ja wiem, jakie myśli mam o was - mówi
                        Jahwe..."
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-700 ml-auto group-hover:text-[#C5A059] transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: STUDIO */}
          {step === "studio" && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* Side Toolbar */}
              <aside className="w-20 md:w-80 h-full border-r border-white/5 bg-[#050505] flex overflow-hidden">
                <div className="w-20 h-full border-r border-white/5 flex flex-col items-center py-8 gap-8">
                  {[
                    { id: "text", icon: Type, label: t("Słowo", "Word") },
                    { id: "bg", icon: ImageIcon, label: t("Tło", "BG") },
                    { id: "font", icon: Palette, label: t("Styl", "Style") },
                    { id: "crop", icon: Layout, label: t("Format", "Ratio") },
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      className="group flex flex-col items-center gap-2 text-zinc-600 hover:text-[#C5A059] transition-all"
                    >
                      <tool.icon className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 space-y-10 overflow-y-auto hidden md:block">
                  <section className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                      {t("Tłumaczenie", "Translation")}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Biblia Warszawska",
                        "UBG",
                        "B. Tysiąclecia",
                        "Original (Hebrew)",
                      ].map((tr) => (
                        <button
                          key={tr}
                          className="p-3 rounded-xl border border-white/5 bg-zinc-900 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:border-[#C5A059]/30 transition-all"
                        >
                          {tr}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                      {t("Biblioteka Teł", "Backgrounds")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BG_LIBRARIES.map((lib) => (
                        <button
                          key={lib.id}
                          className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500"
                        >
                          {t(lib.label, lib.en)}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-zinc-900 rounded-xl border border-white/5 hover:border-[#C5A059] overflow-hidden cursor-pointer transition-all"
                        >
                          <img
                            src={`/backgrounds/${i + 1}.jpg`}
                            className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                      {t("Auto-Formatowanie", "Auto-Layout")}
                    </label>
                    <div className="space-y-2">
                      {RATIOS.map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setActiveRatio(ratio.id)}
                          className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                            activeRatio === ratio.id
                              ? "bg-[#C5A059] text-black border-[#C5A059]"
                              : "bg-black border-white/5 text-zinc-500"
                          }`}
                        >
                          <ratio.icon className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {ratio.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </aside>

              {/* Center Canvas */}
              <main className="flex-1 bg-[#020202] relative flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/5 blur-[200px] rounded-full" />
                </div>

                <div
                  className="relative group transition-all duration-700"
                  style={{
                    width:
                      activeRatio === "1:1"
                        ? "80%"
                        : activeRatio === "9:16"
                          ? "45%"
                          : "90%",
                    maxWidth: "800px",
                    aspectRatio:
                      activeRatio === "1:1"
                        ? "1/1"
                        : activeRatio === "9:16"
                          ? "9/16"
                          : "16/9",
                  }}
                >
                  <div className="absolute inset-0 bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center p-12 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop"
                      className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                    <div className="relative z-10 space-y-8 max-w-[80%]">
                      <p className="text-3xl font-serif italic text-white/90 leading-snug drop-shadow-2xl">
                        "{verseText}"
                      </p>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-px bg-[#C5A059]" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-[#C5A059]">
                          {reference}
                        </span>
                      </div>
                    </div>

                    {/* Branding */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 select-none">
                      <div className="w-6 h-6 rounded-lg bg-[#C5A059] flex items-center justify-center text-black font-black text-[8px]">
                        CC
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.4em]">
                        Christian Culture
                      </span>
                    </div>
                  </div>
                </div>

                {/* Joshua's Real-time Feedback */}
                <div className="absolute top-8 right-8 w-64 p-4 glass rounded-2xl border border-[#C5A059]/20 space-y-3 animate-slide-left">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] font-black uppercase text-[#C5A059]">
                      {t("Opieka Jozuego", "Joshua Guidance")}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-400 italic">
                    {t(
                      '"Złoty tekst na tym tle ma idealny kontrast. Font Lora dodaje powagi Słowu."',
                      '"Gold text on this background has ideal contrast. Lora font adds gravity to The Word."',
                    )}
                  </p>
                </div>

                <div className="absolute bottom-10 flex gap-4">
                  <button
                    aria-label="Dalej"
                    onClick={() => setStep("share")}
                    className="h-14 px-12 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                  >
                    {t("Finalizuj Projekt", "Finalize Project")}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </main>

              {/* Configuration Tools */}
              <aside className="w-80 border-l border-white/5 bg-[#080808] p-8 space-y-10 overflow-y-auto">
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                    {t("Personalizacja", "Personalization")}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] text-zinc-600 font-black uppercase">
                        Font Pair
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {FONT_PAIRS.map((pair) => (
                          <button
                            key={pair.id}
                            onClick={() => setActiveFontPair(pair)}
                            className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                              activeFontPair.id === pair.id
                                ? "border-[#C5A059] bg-[#C5A059]/10"
                                : "border-white/5"
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {pair.name}
                            </span>
                            {activeFontPair.id === pair.id && (
                              <Check className="w-3 h-3 text-[#C5A059]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-zinc-600 font-black uppercase">
                        Color Scheme
                      </label>
                      <div className="flex gap-3">
                        {["#C5A059", "#FFFFFF", "#000000", "#71717a"].map(
                          (color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border-2 border-zinc-800"
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-zinc-600 font-black uppercase">
                        Sign as:
                      </label>
                      <input
                        type="text"
                        value={userHandle}
                        onChange={(e) => setUserHandle(e.target.value)}
                        placeholder="@twojeimie_cc"
                        className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs placeholder:text-zinc-800"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-10 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    {t("Ustawienia Zaawansowane", "Advanced Settings")}
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Logo CC
                    </span>
                    <button className="w-10 h-5 bg-[#C5A059] rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Auto-Center
                    </span>
                    <button
                      aria-label="Przycisk"
                      className="w-10 h-5 bg-zinc-700 rounded-full relative"
                    >
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </section>
              </aside>
            </motion.div>
          )}

          {/* STEP 3: SHARE */}
          {step === "share" && (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto"
            >
              <div className="w-full max-w-4xl space-y-12">
                <header className="text-center space-y-4">
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059]">
                    <Crown className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">
                      {t("Twoje Dzieło Jest Gotowe", "Your Creation is Ready")}
                    </span>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter italic">
                    {t("Rozjaśnij Mrok", "Illuminate The Darkness")}
                  </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {/* Preview */}
                  <div className="aspect-square bg-zinc-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative group">
                    <img
                      src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop"
                      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
                    />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <p className="text-xl font-serif italic text-white/90 leading-snug">
                        "{verseText}"
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                        {reference}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <button
                        aria-label="Pobierz"
                        className="w-full h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <Download className="w-6 h-6" />
                        {t("Zapisz w Galerii", "Save to Gallery")}
                      </button>
                      <button
                        aria-label="Udostępnij"
                        className="w-full h-20 bg-[#C5A059] text-black rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(197,160,89,0.3)]"
                      >
                        <Share2 className="w-6 h-6" />
                        {t("Udostępnij Dalej", "Share Now")}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-zinc-900 border border-white/5 rounded-3xl flex flex-col items-center gap-3 group hover:border-[#C5A059]/30 transition-all">
                        <History className="w-6 h-6 text-zinc-600 group-hover:text-[#C5A059]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                          {t("Zapisz Projekt", "Save Project")}
                        </span>
                      </button>
                      <button className="p-6 bg-zinc-900 border border-white/5 rounded-3xl flex flex-col items-center gap-3 group hover:border-[#C5A059]/30 transition-all">
                        <Layers className="w-6 h-6 text-zinc-600 group-hover:text-[#C5A059]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                          {t("Generuj Warianty", "Generate Variants")}
                        </span>
                      </button>
                    </div>

                    <div className="p-6 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-3xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="w-4 h-4 text-[#C5A059]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                          {t("Przetestuj Premium", "Explore Premium")}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        {t(
                          "W wersji Premium: wszystkie formaty, brak znaku wodnego i dostęp do pełnej biblioteki Sacrum Art.",
                          "Premium version: all formats, no watermark, and access to the full Sacrum Art library.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER ACTION (ONLY ON STEP 1) */}
      <AnimatePresence>
        {step === "words" && (
          <motion.footer
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="h-24 border-t border-white/5 bg-[#050505] flex items-center justify-between px-16 shrink-0"
          >
            <div className="flex items-center gap-4 text-zinc-600">
              <Info className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                {t(
                  "Każda grafika to cyfrowa ambona",
                  "Every graphic is a digital pulpit",
                )}
              </span>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                  Pro: Verse Engine Online
                </span>
              </div>
              <button
                aria-label="Dalej"
                onClick={() => setStep("studio")}
                className="h-14 px-12 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {t("Zacznij Projektować", "Start Designing")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaxVerseGenerator;
