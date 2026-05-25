import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Music,
  Mic2,
  FileAudio,
  Sparkles,
  Send,
  Play,
  Pause,
  Save,
  Share2,
  Wand2,
  Piano,
  Crown,
  Heart,
  Star,
  Users,
  Calendar,
  Gift,
  Volume2,
  Settings,
  Zap,
  Headphones,
  Languages,
  ChevronRight,
  Download,
  FileText,
  Video,
  Award,
  X,
  Activity,
  Sliders,
  Layout,
  MessageSquare,
  Repeat,
  Globe,
  UserCheck,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useAppStore } from "../useAppStore";

interface SongCreatorProps {
  onBack: () => void;
  uiLang?: "pl" | "en";
}

interface Occasion {
  id: string;
  name: string;
  en: string;
  icon: any;
  prompt: string;
}

const OCCASIONS: Occasion[] = [
  {
    id: "thanksgiving",
    name: "Dziękczynienie",
    en: "Thanksgiving",
    icon: Heart,
    prompt: "Wdzięczność za Bożą opatrzność...",
  },
  {
    id: "worship",
    name: "Uwielbienie",
    en: "Worship",
    icon: Crown,
    prompt: "Wywyższanie imienia Jahwe...",
  },
  {
    id: "petition",
    name: "Prośba / Modlitwa",
    en: "Petition",
    icon: Sparkles,
    prompt: "Błaganie o wsparcie i pokój...",
  },
  {
    id: "consolation",
    name: "Pocieszenie",
    en: "Consolation",
    icon: Star,
    prompt: "Budowanie nadziei w trudnym czasie...",
  },
  {
    id: "wedding",
    name: "Ślub / Małżeństwo",
    en: "Wedding",
    icon: Gift,
    prompt: "Przymierze przed obliczem Boga...",
  },
];

const STYLES = [
  {
    id: "biblical-ambient",
    name: "Biblical Ambient",
    pl: "Biblical Ambient",
    mood: "Kontemplacyjne tła",
    bpm: "60-80",
  },
  {
    id: "modern-worship",
    name: "Modern Worship",
    pl: "Modern Worship",
    mood: "Dynamiczne, radiowe",
    bpm: "110-125",
  },
  {
    id: "gospel-soul",
    name: "Gospel / Soul",
    pl: "Gospel / Soul",
    mood: "Emocjonalne wokale",
    bpm: "90-115",
  },
  {
    id: "neoclassical",
    name: "Neoclassical",
    pl: "Neoclassical",
    mood: "Fortepian i smyczki",
    bpm: "70-95",
  },
];

const VOICES = [
  { id: "male-deep", name: "Męski Majestatyczny", en: "Male Majestic" },
  { id: "male-soft", name: "Męski Intymny", en: "Male Intimate" },
  { id: "female-angelic", name: "Żeński Anielski", en: "Female Angelic" },
  { id: "female-power", name: "Żeński Mocny", en: "Female Power" },
];

const SongCreator: React.FC<SongCreatorProps> = ({ onBack, uiLang = "pl" }) => {
  const [activeStep, setActiveStep] = useState<"recipe" | "studio" | "output">(
    "recipe",
  );
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [tempo, setTempo] = useState(80);
  const [intensity, setIntensity] = useState(50);

  const [recipientName, setRecipientName] = useState("");
  const [baseVerse, setBaseVerse] = useState("");
  const [backgroundVocals, setBackgroundVocals] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");

  const [selectedPackage, setSelectedPackage] = useState<"psalm" | "hymn">(
    "psalm",
  );

  const t = (pl: string, en: string) => (uiLang === "pl" ? pl : en);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLyrics(
        `[Refren]\nTwoja łaska jak rzeka płynie do ${recipientName || "nas"},\n` +
          `Święty, Święty, Jahwe Zastępów.\n` +
          `${baseVerse ? `Pamiętamy słowo: "${baseVerse}"\n` : ""}` +
          `W Twoim świetle widzimy światło.`,
      );
      setIsGenerating(false);
      setActiveStep("studio");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[9000] bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-500 hover:text-[#D4AF37] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">
              {t("Zamknij", "Close")}
            </span>
          </button>

          <div className="w-px h-8 bg-white/5 mx-2" />

          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#D4AF37] leading-none">
              Song Creator AI
            </h1>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
              {t("Osobista Pieśń Uwielbienia", "Personal Worship Song")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
            <UserCheck className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">
              {t("Joshua as Producer", "Joshua as Producer")}
            </span>
          </div>

          <button
            aria-label="Zamknij"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* STEP 1: RECIPE PANEL */}
        <AnimatePresence mode="wait">
          {activeStep === "recipe" && (
            <motion.div
              key="recipe"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex"
            >
              <aside className="w-96 border-r border-white/5 bg-[#050505] p-8 overflow-y-auto space-y-12">
                <section className="space-y-6">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("1. Fundament Duchowy", "1. Spiritual Foundation")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ.id}
                        onClick={() => setSelectedOccasion(occ)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                          selectedOccasion.id === occ.id
                            ? "bg-[#D4AF37]/10 border-[#D4AF37]"
                            : "bg-black border-white/5 opacity-60"
                        }`}
                      >
                        <occ.icon
                          className={`w-5 h-5 ${selectedOccasion.id === occ.id ? "text-[#D4AF37]" : "text-zinc-500"}`}
                        />
                        <span className="text-[9px] font-black uppercase tracking-tight text-center">
                          {t(occ.name, occ.en)}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("2. Personalizacja", "2. Personalization")}
                  </label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-600 font-black uppercase">
                        {t("Dla kogo?", "For whom?")}
                      </span>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder={t(
                          "Imię / Wspólnota...",
                          "Name / Community...",
                        )}
                        className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-600 font-black uppercase">
                        {t("Tekst źródłowy / Werset", "Source text / Verse")}
                      </span>
                      <textarea
                        value={baseVerse}
                        onChange={(e) => setBaseVerse(e.target.value)}
                        placeholder={t(
                          "Wklej ulubiony tekst...",
                          "Paste favorite text...",
                        )}
                        rows={3}
                        className="w-full bg-zinc-900/50 border border-white/5 p-3 rounded-xl text-sm focus:border-[#D4AF37] outline-none resize-none"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    {t("3. Dynamika", "3. Dynamics")}
                  </label>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                        <span className="text-zinc-600">Tempo (BPM)</span>
                        <span className="text-[#D4AF37]">{tempo}</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                        className="w-full accent-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                        <span className="text-zinc-600">
                          {t("Intensywność", "Intensity")}
                        </span>
                        <span className="text-[#D4AF37]">{intensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full accent-[#D4AF37]"
                      />
                    </div>
                  </div>
                </section>
              </aside>

              <main className="flex-1 bg-[#020202] relative flex flex-col items-center justify-center p-12">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full animate-pulse" />
                </div>

                <div className="z-10 w-full max-w-xl space-y-12 text-center">
                  <div className="relative inline-block">
                    <div className="w-48 h-48 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] rounded-full border border-[#D4AF37]/20 flex items-center justify-center shadow-2xl">
                      <Music className="w-20 h-20 text-[#D4AF37] animate-float" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 10,
                        ease: "linear",
                      }}
                      className="absolute inset-[-20px] border border-dashed border-[#D4AF37]/30 rounded-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                      {t(
                        "Wybierz Styl Swojej Pieśni",
                        "Select Your Song Style",
                      )}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {STYLES.map((style) => (
                        <button
                          aria-label="Głośność"
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                            selectedStyle.id === style.id
                              ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                              : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10"
                          }`}
                        >
                          <div className="relative z-10">
                            <h4 className="text-sm font-black uppercase tracking-widest">
                              {style.name}
                            </h4>
                            <p
                              className={`text-[10px] mt-1 font-bold ${selectedStyle.id === style.id ? "text-black/60" : "text-zinc-600"}`}
                            >
                              {style.mood}
                            </p>
                          </div>
                          <Volume2
                            className={`absolute right-4 bottom-4 w-12 h-12 opacity-10 group-hover:scale-110 transition-transform ${selectedStyle.id === style.id ? "text-black" : "text-white"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartGeneration}
                    disabled={isGenerating}
                    className="h-16 px-12 bg-[#D4AF37] text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center gap-4 mx-auto disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Repeat className="w-5 h-5 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    {isGenerating
                      ? t("Analizowanie przepisu...", "Analyzing recipe...")
                      : t(
                          "Projektuj Architekturę Brzmienia",
                          "Design Sound Architecture",
                        )}
                  </button>
                </div>
              </main>
            </motion.div>
          )}

          {/* STEP 2: STUDIO PANEL */}
          {activeStep === "studio" && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* Left: Lyric Engine */}
              <aside className="w-80 border-r border-white/5 bg-[#080808] p-8 flex flex-col">
                <header className="mb-8 space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {t("Liryczna Kolumna", "Lyric Column")}
                  </h3>
                  <p className="text-[8px] text-zinc-600 uppercase font-bold">
                    {t("AI Text Assistant", "AI Text Assistant")}
                  </p>
                </header>

                <div className="flex-1 space-y-8 overflow-y-auto">
                  <div className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] p-6 rounded-3xl border border-white/5 shadow-inner">
                    <pre className="text-sm font-sans font-black text-zinc-300 whitespace-pre-wrap leading-relaxed tracking-wide italic">
                      {lyrics}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] text-zinc-600 font-black uppercase">
                      {t("Zaproponuj rym do:", "Suggest rhyme for:")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-black border border-white/5 rounded-lg p-2 text-xs"
                      />
                      <button
                        aria-label="Przycisk"
                        className="p-2 bg-[#D4AF37] text-black rounded-lg"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {t("Analiza Jozuego", "Joshua Analysis")}
                    </h4>
                    <div className="p-4 bg-zinc-900 border border-blue-500/20 rounded-2xl flex gap-3">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                        {t(
                          '"Tonacja m-moll lepiej odda głębię dziękczynienia w tym tempie."',
                          '"m-minor key will better reflect the depth of thanksgiving at this tempo."',
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Center: The Mixer / Visualizer */}
              <main className="flex-1 bg-[#020202] flex flex-col overflow-hidden">
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="w-full max-w-4xl space-y-12">
                    {/* THE BIG VISUALIZER */}
                    <div className="h-64 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent" />

                      <div className="flex items-end gap-1 px-8">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={
                              isDemoPlaying
                                ? {
                                    height: [20, Math.random() * 150 + 20, 20],
                                  }
                                : { height: 20 }
                            }
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              delay: i * 0.05,
                            }}
                            className="w-2 bg-[#D4AF37]/40 rounded-full"
                          />
                        ))}
                      </div>

                      <button
                        aria-label="Odtwarzaj"
                        onClick={() => setIsDemoPlaying(!isDemoPlaying)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all"
                      >
                        {isDemoPlaying ? (
                          <Pause className="w-8 h-8 fill-current" />
                        ) : (
                          <Play className="w-8 h-8 ml-1 fill-current" />
                        )}
                      </button>

                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[10px] font-mono font-black text-[#D4AF37]">
                          00:15 DEMO LO-FI
                        </span>
                        <div className="w-px h-3 bg-white/20" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {selectedStyle.name}
                        </span>
                      </div>
                    </div>

                    {/* DESKTOP MIXER SLIDERS */}
                    <div className="grid grid-cols-4 gap-6 px-12">
                      {[
                        { label: "Reverb", icon: Globe },
                        { label: "Harmony", icon: Users },
                        { label: "Biblical SFX", icon: Sparkles },
                        { label: "Ambience", icon: Activity },
                      ].map((knob) => (
                        <div key={knob.label} className="space-y-4 text-center">
                          <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center relative">
                            <knob.icon className="w-6 h-6 text-zinc-500" />
                            <div className="absolute inset-0 border-2 border-[#D4AF37]/30 rounded-full border-t-transparent animate-spin-slow" />
                          </div>
                          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                            {knob.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <footer className="h-32 border-t border-white/5 bg-[#050505] flex items-center justify-between px-16">
                  <div className="flex gap-4">
                    <button className="h-14 px-8 rounded-2xl glass border border-white/10 text-zinc-400 hover:text-white transition-all text-sm font-black uppercase tracking-widest">
                      {t("Resetuj", "Reset")}
                    </button>
                    <div className="flex items-center gap-3 px-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                      <input
                        type="checkbox"
                        id="hebVocal"
                        checked={backgroundVocals}
                        onChange={() => setBackgroundVocals(!backgroundVocals)}
                        className="w-4 h-4 accent-[#D4AF37]"
                      />
                      <label
                        htmlFor="hebVocal"
                        className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] cursor-pointer"
                      >
                        {t(
                          "Background Hebrew Vocals",
                          "Background Hebrew Vocals",
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    aria-label="Dalej"
                    onClick={() => setActiveStep("output")}
                    className="h-16 px-12 bg-[#D4AF37] text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:translate-x-2 transition-all flex items-center gap-4"
                  >
                    <ChevronRight className="w-5 h-5" />
                    {t("Generuj Pakiet Legacy", "Generate Legacy Package")}
                  </button>
                </footer>
              </main>

              {/* Right: Technical Settings */}
              <aside className="w-80 border-l border-white/5 bg-[#080808] p-8 space-y-10">
                <header>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {t("Techniczny Panel", "Technical Panel")}
                  </h3>
                </header>

                <section className="space-y-4">
                  <label className="text-[9px] text-zinc-600 font-black uppercase">
                    {t("Wybór Głosu", "Voice selection")}
                  </label>
                  <div className="space-y-2">
                    {VOICES.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          selectedVoice.id === voice.id
                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                            : "bg-black border-white/5 text-zinc-500"
                        }`}
                      >
                        <div className="text-[10px] font-black uppercase tracking-wider">
                          {t(voice.name, voice.en)}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <label className="text-[9px] text-zinc-600 font-black uppercase">
                    {t("Instrumentacja", "Instrumentation")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Piano", "Organ", "Cello", "Pad"].map((inst) => (
                      <button
                        key={inst}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-zinc-600">Sample Rate</span>
                    <span className="text-white">48 kHz / 24-bit</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-zinc-600">Latency</span>
                    <span className="text-green-500">12ms (Optimal)</span>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* STEP 3: OUTPUT / PACKAGE PANEL */}
          {activeStep === "output" && (
            <motion.div
              key="output"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-12 overflow-y-auto"
            >
              <div className="w-full max-w-5xl space-y-12">
                <header className="text-center space-y-4">
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">
                      {t("Twoja Pieśń Jest Gotowa", "Your Song is Ready")}
                    </span>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter italic">
                    "Psalm dla {recipientName}"
                  </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Package Comparison */}
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-8 space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-widest text-white">
                          {t("Wybierz Pakiet", "Select Package")}
                        </h3>
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={() => setSelectedPackage("psalm")}
                          className={`w-full p-6 rounded-3xl border transition-all text-left flex justify-between items-center ${
                            selectedPackage === "psalm"
                              ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                              : "bg-black border-white/5 text-zinc-500"
                          }`}
                        >
                          <div>
                            <div className="text-lg font-black uppercase tracking-widest">
                              Pakiet "Psalm"
                            </div>
                            <div className="text-[10px] font-bold uppercase opacity-60">
                              Basic Legacy (60-90s)
                            </div>
                          </div>
                          <div className="text-xl font-black">49 PLN</div>
                        </button>

                        <button
                          onClick={() => setSelectedPackage("hymn")}
                          className={`w-full p-6 rounded-3xl border transition-all text-left flex justify-between items-center relative overflow-hidden ${
                            selectedPackage === "hymn"
                              ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                              : "bg-black border-white/5 text-zinc-500"
                          }`}
                        >
                          <div className="absolute top-0 right-0 px-4 py-1 bg-white/20 rounded-bl-xl text-[8px] font-black uppercase">
                            Most Popular
                          </div>
                          <div>
                            <div className="text-lg font-black uppercase tracking-widest">
                              Pakiet "Hymn"
                            </div>
                            <div className="text-[10px] font-bold uppercase opacity-60">
                              Full Premium (3-4 min)
                            </div>
                          </div>
                          <div className="text-xl font-black">129 PLN</div>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          Zawartość Pakietu:
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { icon: FileAudio, label: "High-Res WAV" },
                            {
                              icon: FileText,
                              label: t("Zapis nutowy", "Sheet Music"),
                            },
                            { icon: Video, label: "Lyric Video 1080p" },
                            {
                              icon: Award,
                              label: t("Certyfikat Unikalności", "Certificate"),
                            },
                          ].map((cecha) => (
                            <div
                              key={cecha.label}
                              className="flex items-center gap-3"
                            >
                              <cecha.icon className="w-4 h-4 text-[#D4AF37]" />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {cecha.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] rounded-[3rem] border border-[#D4AF37]/20 relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-10" />
                      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#D4AF37]/10 blur-3xl rounded-full" />

                      <div className="relative z-10 space-y-6">
                        <div className="w-32 h-32 mx-auto rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                          <Music className="w-12 h-12 text-[#D4AF37]" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-black uppercase tracking-tighter text-[#D4AF37]">
                            Legacy Premium
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                            {t(
                              "Certyfikat Autentyczności No. 8832",
                              "Certificate of Authenticity No. 8832",
                            )}
                          </p>
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <div className="flex justify-center gap-8">
                          <div className="text-center">
                            <div className="text-xs font-black">48 kHz</div>
                            <div className="text-[8px] text-zinc-600 uppercase">
                              Quality
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-black">24-bit</div>
                            <div className="text-[8px] text-zinc-600 uppercase">
                              Depth
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 px-12 py-6 bg-[#D4AF37] text-black rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl">
                      Total: {selectedPackage === "psalm" ? "49" : "129"} PLN
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-12">
                  <button className="h-16 px-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                    <ShoppingCart className="w-5 h-5" />
                    {t("Sfinalizuj Zamówienie", "Finalize Order")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SongCreator;
