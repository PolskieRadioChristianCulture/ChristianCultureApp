import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppStore } from "../useAppStore";
import {
  AlarmClock,
  Search,
  Globe,
  Book,
  Layers,
  Zap,
  X,
  Radio,
  ShoppingBag,
  MessageSquare,
  Heart,
  GraduationCap,
  User,
  LifeBuoy,
  Calendar,
  Music,
  Cpu,
  Mail,
  ShieldCheck,
  Image as ImageIcon,
  Mic,
  Sparkles,
} from "lucide-react";
import { SupportedLanguage, SearchMode } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { APP_INDEX, AppFeature } from "../appIndex";

interface EcosystemResult {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  primaryAction: { label: string; action: string };
  secondaryAction?: { label: string; action: string };
  type: string;
}

interface GlobalSearchProps {
  dimmed: boolean;
  appLanguage: SupportedLanguage;
  onOpenNotifications?: () => void;
  onBibleSearch: (query: string) => void;
  onEcosystemAction?: (action: string) => void;
  unreadCount?: number;
  isAlarmEnabled?: boolean;
  hasSOS?: boolean;
  onSOSClick?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  dimmed,
  appLanguage,
  onOpenNotifications,
  onBibleSearch,
  onEcosystemAction,
  unreadCount = 0,
  isAlarmEnabled = false,
  hasSOS = false,
  onSOSClick,
}) => {
  const { userPersona } = useAppStore();
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("ECOSYSTEM");
  const [showResults, setShowResults] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        appLanguage === "pl"
          ? "Wyszukiwanie głosowe nie jest wspierane w tej przeglądarce."
          : "Voice search is not supported in this browser.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = appLanguage === "pl" ? "pl-PL" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const lowText = transcript.toLowerCase().trim();
      setQuery(transcript);
      setIsListening(false);

      // Voice Commands Parser
      const commands: Record<string, string[]> = {
        "radio:play": [
          "włącz radio",
          "puść radio",
          "graj radio",
          "play radio",
          "włącz muzykę",
        ],
        "radio:stop": [
          "zatrzymaj radio",
          "wyłącz radio",
          "stop radio",
          "stop music",
        ],
        "open:business_card": [
          "otwórz moją wizytówkę",
          "pokaż wizytówkę",
          "moja wizytówka",
          "otwórz profil",
          "open business card",
          "wizytówka/profil",
          "profil",
          "wizytówka",
        ],
        "navigate:prayer": [
          "ściana modlitwy",
          "otwórz ścianę modlitwy",
          "intencje modlitewne",
          "prayer wall",
          "modlitwa",
          "modlitwy",
        ],
        "open:zbyszek_gieron": [
          "otwórz opowiadania",
          "opowiadania z morałem",
          "opowiadania",
          "zbyszek gieroń",
          "wizytówka zbyszka",
        ],
        "open:yellow_card": [
          "otwórz notatnik",
          "żółta kartka",
          "notatki",
          "open notes",
        ],
        "open:slideshow": [
          "pokaz slajdów",
          "uruchom slajdy",
          "slajdy",
          "slideshow",
        ],
        "open:notifications": [
          "pokaż powiadomienia",
          "powiadomienia",
          "show notifications",
        ],
        "open:daily_reflections_pdf": [
          "cykl rozważań",
          "codzienne rozważania",
          "cykl rozważania",
          "rozważania pdf",
          "daily reflections",
        ],
        "open:bible": [
          "otwórz biblię",
          "biblia",
          "szukaj w biblii",
          "open bible",
        ],
        "open:bible_courses": [
          "kursy biblijne",
          "szkoła biblijna",
          "kursy",
          "bible courses",
        ],
        "open:morning_inspirations": [
          "pobudki poranne",
          "pobudki",
          "poranne inspiracje",
          "morning wakeups",
        ],
        "open:christian_inspirations": [
          "chrześcijańskie inspiracje",
          "subskrypcja sms",
          "wiadomości",
          "christian inspirations",
        ],
        "open:resources_cc": [
          "otwórz zasoby",
          "zasoby cc",
          "pliki do pobrania",
          "dzwonki",
          "dzwonek",
          "open resources",
          "cc resources",
        ],
        "open:media_player_page": [
          "odtwarzacz multimedialny",
          "odtwarzacz cc",
          "media player",
          "muzyka",
          "wideo",
          "filmy",
          "centrum multimedialne",
        ],
        "open:instrumental_music": [
          "muzyka instrumentalna",
          "instrumentalna",
          "instrumental music",
        ],
        "navigate:radio": ["idź do radia", "ekran radia"],
        "open:admin_panel": [
          "centrum dowodzenia",
          "panel administratora",
          "zaloguj admin",
          "admin log",
          "admin login",
          "admin panel",
        ],
      };

      for (const [action, phrases] of Object.entries(commands)) {
        if (phrases.some((p) => lowText.includes(p))) {
          if (onEcosystemAction) onEcosystemAction(action);
          setQuery(""); // Clear query if command found
          return;
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Radio: <Radio className="w-6 h-6 text-[#C5A059]" />,
    Music: <Music className="w-6 h-6 text-[#C5A059]" />,
    Zap: <Zap className="w-6 h-6 text-[#C5A059]" />,
    ShoppingBag: <ShoppingBag className="w-6 h-6 text-[#C5A059]" />,
    Globe: <Globe className="w-6 h-6 text-[#C5A059]" />,
    Book: <Book className="w-6 h-6 text-[#C5A059]" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-[#C5A059]" />,
    Heart: <Heart className="w-6 h-6 text-[#C5A059]" />,
    Cpu: <Cpu className="w-6 h-6 text-[#C5A059]" />,
    MessageSquare: <MessageSquare className="w-6 h-6 text-[#C5A059]" />,
    User: <User className="w-6 h-6 text-[#C5A059]" />,
    LifeBuoy: <LifeBuoy className="w-6 h-6 text-[#C5A059]" />,
    Calendar: <Calendar className="w-6 h-6 text-[#C5A059]" />,
    Mail: <Mail className="w-6 h-6 text-[#C5A059]" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
    Layers: <Layers className="w-6 h-6 text-[#C5A059]" />,
    ImageIcon: <ImageIcon className="w-6 h-6 text-[#C5A059]" />,
  };

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ecosystemResults = useMemo(() => {
    const lowQ = query.toLowerCase().trim();
    if (!lowQ) return [];

    const results: EcosystemResult[] = [];

    // On mobile, always suggest Miriam as the first option in Ecosystem mode if integrated
    if (isMobile) {
      results.push({
        title: appLanguage === "pl" ? "Zapytaj Miriam CC" : "Ask Miriam CC",
        subtitle:
          appLanguage === "pl"
            ? "Inteligentna asystentka misji"
            : "Intelligent mission assistant",
        icon: <Sparkles className="w-6 h-6 text-[#C5A059]" />,
        type: "AI",
        primaryAction: {
          label: appLanguage === "pl" ? "Rozmawiaj" : "Chat",
          action: "open:miriam_chat_with_query",
        },
      });
    }

    // 1. Filter APP_INDEX (Features and Public Profiles)
    const filteredFeatures = APP_INDEX.filter((feature) => {
      const inKeywords = feature.keywords[appLanguage].some(
        (k) => lowQ.includes(k.toLowerCase()) || k.toLowerCase().includes(lowQ),
      );
      const inTitle = feature.title[appLanguage].toLowerCase().includes(lowQ);
      const inSubtitle = feature.subtitle[appLanguage]
        .toLowerCase()
        .includes(lowQ);
      return inKeywords || inTitle || inSubtitle;
    }).map((feature) => ({
      title: feature.title[appLanguage],
      subtitle: feature.subtitle[appLanguage],
      icon: iconMap[feature.icon] || (
        <Layers className="w-6 h-6 text-[#C5A059]" />
      ),
      type: feature.category,
      primaryAction: {
        label: feature.primaryAction.label[appLanguage],
        action: feature.primaryAction.action,
      },
      secondaryAction: feature.secondaryAction
        ? {
            label: feature.secondaryAction.label[appLanguage],
            action: feature.secondaryAction.action,
          }
        : undefined,
    }));

    results.push(...filteredFeatures);

    // 2. Add current user profile if it matches
    const userFullName =
      `${userPersona.name || ""} ${userPersona.surname || ""}`.trim();
    const matchesUserName = userFullName.toLowerCase().includes(lowQ);
    const matchesUserDisplay = (userPersona.displayName || "")
      .toLowerCase()
      .includes(lowQ);
    const matchesUserBio = (userPersona.bio || "").toLowerCase().includes(lowQ);
    const matchesUserStatus = (userPersona.userPersonalStatus || "")
      .toLowerCase()
      .includes(lowQ);

    const alreadyInFeatures = results.some(
      (r) =>
        r.title.toLowerCase().includes(userFullName.toLowerCase()) &&
        userFullName.length > 2,
    );

    if (
      (matchesUserName ||
        matchesUserDisplay ||
        matchesUserBio ||
        matchesUserStatus) &&
      userFullName &&
      !alreadyInFeatures
    ) {
      results.unshift({
        title:
          userPersona.displayName ||
          userFullName ||
          (appLanguage === "pl" ? "Mój Profil" : "My Profile"),
        subtitle:
          userPersona.userPersonalStatus ||
          (appLanguage === "pl"
            ? "Wizytówka użytkownika"
            : "User business card"),
        icon: <User className="w-6 h-6 text-[#C5A059]" />,
        type: "COMMUNITY",
        primaryAction: {
          label: appLanguage === "pl" ? "Otwórz Profil" : "Open Profile",
          action: "open:business_card",
        },
      });
    }

    return results;
  }, [query, appLanguage, userPersona]);

  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const phrases =
      appLanguage === "pl"
        ? ["Powiedz czego szukasz", "Zapytaj Asystentkę CC"]
        : ["Say what you're looking for", "Ask CC Assistant"];

    const currentPhrase = phrases[typewriterIndex];
    const typingSpeed = isDeleting ? 40 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypewriterText(
          currentPhrase.substring(0, typewriterText.length + 1),
        );
        if (typewriterText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setTypewriterText(
          currentPhrase.substring(0, typewriterText.length - 1),
        );
        if (typewriterText === "") {
          setIsDeleting(false);
          setTypewriterIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, typewriterIndex, appLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!query.trim()) {
      e.preventDefault();
      return;
    }

    // Direct exact match
    const lowQ = query.toLowerCase().trim();
    if (lowQ === "wizytówka/profil" || lowQ === "wizytowka/profil") {
      e.preventDefault();
      if (onEcosystemAction) onEcosystemAction("open:business_card");
      setQuery("");
      setShowResults(false);
      return;
    }

    if (searchMode === "BIBLE") {
      e.preventDefault();
      onBibleSearch(query);
      setQuery("");
      setShowResults(false);
    } else if (searchMode === "MIRIAM") {
      e.preventDefault();
      // Trigger global event or callback for Miriam Chat
      const event = new CustomEvent("cc_open_miriam_chat", {
        detail: { query: query.trim() },
      });
      window.dispatchEvent(event);
      setQuery("");
      setShowResults(false);
    } else if (searchMode === "ECOSYSTEM") {
      e.preventDefault();
      setShowResults(true);
    }
  };

  const getPlaceholder = () => {
    if (hasSOS)
      return isMobile
        ? "Ktoś potrzebuje modlitwy"
        : "SOS: Właśnie teraz ktoś potrzebuje Twojej modlitwy.";
    if (searchMode === "GOOGLE")
      return appLanguage === "pl" ? "Szukaj w Google..." : "Search Google...";
    if (searchMode === "BIBLE")
      return appLanguage === "pl" ? "Szukaj w Słowie..." : "Search Word...";
    if (searchMode === "MIRIAM")
      return appLanguage === "pl"
        ? "Zapytaj Asystentkę CC..."
        : "Ask CC Assistant...";
    return typewriterText + (blink ? "|" : "");
  };

  return (
    <div
      ref={searchRef}
      id="search-wrapper"
      className={`w-full transition-all duration-700 ease-in-out relative z-[60] ${dimmed ? "opacity-25 scale-95 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className={`flex justify-center gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isMobile && !showResults
            ? "max-h-0 opacity-0 mb-0"
            : "max-h-12 opacity-100 mb-3"
        }`}
      >
        {[
          {
            id: "GOOGLE",
            label: "Google",
            icon: <Globe className="w-3 h-3" />,
          },
          {
            id: "MIRIAM",
            label: "Miriam CC",
            icon: <Mic className="w-3 h-3" />,
          },
          {
            id: "ECOSYSTEM",
            label: appLanguage === "pl" ? "Aplikacja" : "App",
            icon: <Layers className="w-3 h-3" />,
          },
          {
            id: "BIBLE",
            label: appLanguage === "pl" ? "Biblia" : "Bible",
            icon: <Book className="w-3 h-3" />,
          },
        ]
          .filter((tab) => !isMobile || tab.id !== "MIRIAM")
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSearchMode(tab.id as SearchMode);
                setShowResults(false);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                searchMode === tab.id
                  ? "bg-[#C5A059] text-black shadow-[0_0_15px_#C5A059]"
                  : "bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
      </div>

      <form
        action={
          searchMode === "GOOGLE" && !hasSOS
            ? "https://www.google.com/search"
            : "#"
        }
        method={searchMode === "GOOGLE" && !hasSOS ? "GET" : undefined}
        target="_blank"
        onSubmit={
          hasSOS
            ? (e) => {
                e.preventDefault();
                onSOSClick?.();
              }
            : handleSubmit
        }
        className={`relative group transition-all duration-500 rounded-full p-[2px] flex items-center overflow-hidden ${
          hasSOS
            ? "shadow-[0_0_30px_rgba(255,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.2)] animate-pulse"
            : searchMode === "GOOGLE"
              ? "shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              : "shadow-[0_0_20px_rgba(197,160,89,0.2),inset_0_0_10px_rgba(197,160,89,0.1)]"
        }`}
      >
        {/* Animated glowing snake border */}
        {!hasSOS && (
          <div
            className="absolute inset-[-500%] z-0 rounded-full animate-[spin_8s_linear_infinite]"
            style={{
              background:
                searchMode === "GOOGLE"
                  ? "conic-gradient(from 0deg, transparent 0 270deg, #4285F4 270deg 292deg, #34A853 292deg 315deg, #FBBC05 315deg 337deg, #EA4335 337deg 360deg)"
                  : "conic-gradient(from 0deg, transparent 0 270deg, rgba(197,160,89,0.1) 270deg 330deg, #C5A059 360deg)",
            }}
          />
        )}
        {hasSOS && (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-red-600/40 via-white/20 to-red-600/40 animate-[pulse_1.5s_ease-in-out_infinite]" />
        )}

        {/* Inner background blocking the snake except for the rim */}
        <div
          className={`absolute inset-[2px] rounded-full z-0 pointer-events-none backdrop-blur-xl ${
            hasSOS
              ? "bg-red-950/80"
              : searchMode === "GOOGLE"
                ? "bg-[#050505]/50"
                : "bg-[#000000]/50"
          }`}
        />

        <div className="relative z-10 w-full flex items-center h-full">
          <div className="pl-1 sm:pl-2 flex items-center gap-1 flex-shrink-0">
            {!hasSOS ? (
              <div
                className={`flex items-center justify-center rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] ${searchMode !== "GOOGLE" ? "bg-transparent text-[#C5A059]" : "bg-transparent text-zinc-500"}`}
                onClick={() => {
                  const modes: SearchMode[] = ["ECOSYSTEM", "BIBLE", "GOOGLE"];
                  setSearchMode(
                    modes[(modes.indexOf(searchMode) + 1) % modes.length],
                  );
                }}
              >
                {searchMode === "GOOGLE" ? (
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
            ) : (
              <div
                className="animate-pulse flex items-center justify-center rounded-full cursor-pointer hover:bg-white/20 w-[44px] h-[44px] sm:w-[48px] sm:h-[48px]"
                onClick={() => {
                  if (onSOSClick) onSOSClick();
                }}
              >
                <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
            {!hasSOS && isAlarmEnabled ? (
              <div className="animate-pulse">
                <AlarmClock className="w-4 h-4 text-red-500" />
              </div>
            ) : null}
          </div>

          <input
            type="text"
            name={searchMode === "GOOGLE" && !hasSOS ? "q" : ""}
            value={
              hasSOS
                ? isMobile
                  ? "Ktoś potrzebuje modlitwy"
                  : "SOS: Właśnie teraz ktoś potrzebuje Twojej modlitwy."
                : query
            }
            readOnly={hasSOS}
            onClick={() => {
              if (hasSOS && onSOSClick) {
                onSOSClick();
              } else {
                setShowResults(true);
              }
            }}
            onFocus={() => {
              if (!hasSOS) setShowResults(true);
            }}
            onChange={(e) => {
              if (!hasSOS) {
                setQuery(e.target.value);
                setShowResults(true);
              }
            }}
            placeholder={getPlaceholder()}
            className={`flex-1 w-full min-w-0 bg-transparent px-2 sm:px-4 py-3 sm:py-4 text-white text-xs sm:text-sm focus:outline-none font-sans ${hasSOS ? "cursor-pointer text-white font-bold" : "font-medium placeholder-zinc-500"}`}
            autoComplete="off"
          />

          <div className="pr-1 sm:pr-2 flex items-center gap-1 flex-shrink-0">
            {!hasSOS && (
              <button
                aria-label="Wyszukiwanie głosowe"
                type="button"
                onClick={startListening}
                className={`flex items-center justify-center rounded-full transition-all w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-transparent text-zinc-500 hover:text-[#C5A059] hover:bg-[#C5A059]/10"}`}
                title={
                  appLanguage === "pl" ? "Wyszukiwanie głosowe" : "Voice search"
                }
              >
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {!hasSOS && query && (
              <button
                aria-label="Zamknij"
                type="button"
                onClick={() => {
                  setQuery("");
                  setShowResults(false);
                }}
                className="flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-full w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] transition-all"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <button
              aria-label={hasSOS ? "Modlę się" : "Szukaj"}
              type="submit"
              className={`flex items-center justify-center rounded-full transition-all px-2 w-auto min-w-[44px] h-[44px] sm:h-[48px] bg-transparent hover:bg-white/10 ${hasSOS ? "text-white font-bold uppercase tracking-wider text-xs" : searchMode !== "GOOGLE" ? "text-[#C5A059] hover:bg-zinc-800/50 w-[44px] sm:w-[48px]" : "text-blue-500 hover:bg-zinc-800/50 w-[44px] sm:w-[48px]"}`}
            >
              {hasSOS ? (
                <span className="px-2">MODLĘ SIĘ</span>
              ) : (
                <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showResults && searchMode === "ECOSYSTEM" && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-4 p-[1.5px] bg-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[70]"
          >
            {/* Results Frame Glow */}
            <div
              className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] opacity-30"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0 270deg, #C5A059 360deg)",
              }}
            />

            <div className="relative bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/90 backdrop-blur-3xl rounded-[2.5rem] p-5 max-h-[60vh] overflow-y-auto no-scrollbar border border-white/5">
              {ecosystemResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-black mb-2 opacity-50 px-2 sticky top-0 bg-transparent py-1">
                    {appLanguage === "pl"
                      ? "ODPOWIEDZI EKOSYSTEMU"
                      : "ECOSYSTEM ANSWERS"}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ecosystemResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-[#C5A059]/40 transition-all group"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-[#C5A059]/10 rounded-xl group-hover:scale-110 transition-transform">
                            {result.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white">
                              {result.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-medium">
                              {result.subtitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (
                                result.primaryAction.action ===
                                "open:miriam_chat_with_query"
                              ) {
                                const event = new CustomEvent(
                                  "cc_open_miriam_chat",
                                  { detail: { query: query.trim() } },
                                );
                                window.dispatchEvent(event);
                              } else if (onEcosystemAction) {
                                onEcosystemAction(result.primaryAction.action);
                              }
                              setShowResults(false);
                              setQuery("");
                            }}
                            className="flex-1 py-2 bg-[#C5A059] text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-lg"
                          >
                            {result.primaryAction.label}
                          </button>
                          {result.secondaryAction && (
                            <button
                              onClick={() => {
                                if (onEcosystemAction)
                                  onEcosystemAction(
                                    result.secondaryAction!.action,
                                  );
                                setShowResults(false);
                                setQuery("");
                              }}
                              className="flex-1 py-2 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all border border-white/10"
                            >
                              {result.secondaryAction.label}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center px-4">
                  <div className="text-2xl mb-4">🤔</div>
                  <div className="text-zinc-400 text-xs font-medium mb-6 leading-relaxed max-w-sm mx-auto">
                    {appLanguage === "pl"
                      ? "Nie znalazłem tego modułu. Napisz nam na naszym czacie (WhatsApp), czego Ci brakuje w aplikacji, a my postaramy się to stworzyć Dla Jezusa!"
                      : "I didn't find this module. Write to us on our chat (WhatsApp) what you are missing in the app, and we will try to create it For Jesus!"}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#128C7E] transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] flex items-center gap-2 group"
                    >
                      <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {appLanguage === "pl" ? "NAPISZ" : "WRITE"}
                    </a>
                    <button
                      onClick={() => onEcosystemAction?.("navigate:biblia")}
                      className="px-8 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                      {appLanguage === "pl" ? "SPRÓBUJ BIBLIĘ" : "TRY BIBLE"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
