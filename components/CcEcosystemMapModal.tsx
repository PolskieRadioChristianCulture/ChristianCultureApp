import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Globe,
  Radio,
  Play,
  BookOpen,
  Users,
  Shield,
  Heart,
  Info,
  ExternalLink,
  Map as MapIcon,
  ChevronRight,
  Music,
  Mic,
  Compass,
} from "lucide-react";
import { ALL_CHANNELS_YOUTUBE_URL, COACH_HOLISTYCZNY_URL } from "../types";

interface EcosystemNode {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "media" | "education" | "community" | "identity" | "support";
  action?: string;
  url?: string;
  color: string;
}

interface CcEcosystemMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: string) => void;
  appLanguage: string;
  isTickerExpanded?: boolean;
}

export const CcEcosystemMapModal: React.FC<CcEcosystemMapModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  appLanguage,
  isTickerExpanded = false,
}) => {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);

  const ecosystemNodes: EcosystemNode[] = [
    {
      id: "portal",
      label: "Główny Portal",
      description:
        "Brama do całego świata Christian Culture Network. Znajdziesz tu najświeższe informacje oraz dostęp do wszystkich kanałów misji.",
      icon: <Globe className="w-6 h-6" />,
      category: "media",
      url: "https://www.polskieradio.cc",
      color: "#C5A059",
    },
    {
      id: "radio",
      label: "Radio Christian Culture",
      description:
        "Twoje źródło inspiracji 24/7. Profesjonalna jakość dźwięku, najlepsi lektorzy i muzyka, która wielbi Jahwe.",
      icon: <Radio className="w-6 h-6" />,
      category: "media",
      url: "https://www.polskieradio.cc",
      color: "#C5A059",
    },
    {
      id: "tv",
      label: "Christian Culture TV",
      description:
        "Wideo, które buduje wiarę. Transmisje na żywo, reportaże oraz serie tematyczne (RCC TV 24, CC Men, CC Women).",
      icon: <Play className="w-6 h-6" />,
      category: "media",
      url: "https://www.polskieradio.cc",
      color: "#C5A059",
    },
    {
      id: "youtube-channels",
      label: "Kanały YouTube",
      description:
        "Wszystkie kanały Christian Culture Network na YouTube w jednym miejscu. Subskrybuj i wzrastaj.",
      icon: <Play className="w-6 h-6" />,
      category: "media",
      url: ALL_CHANNELS_YOUTUBE_URL,
      color: "#FF0000",
    },
    {
      id: "spotify",
      label: "Spotify CC",
      description:
        "Nasza muzyka i podcasty na najpopularniejszej platformie streamingowej. Wielbienie w każdym miejscu.",
      icon: <Music className="w-6 h-6" />,
      category: "media",
      action: "navigate:spotify",
      color: "#1DB954",
    },
    {
      id: "apokalipsa",
      label: "Apokalipsa",
      description:
        'Podcast "Apokalipsa dzień po dniu". Zgłębiaj proroctwa i znaki czasów w oparciu o Słowo Boże.',
      icon: <Mic className="w-6 h-6" />,
      category: "media",
      action: "navigate:spotify",
      color: "#1DB954",
    },
    {
      id: "biblia-audio",
      label: "Biblia Audio",
      description:
        "Pismo Święte w formie audio na Spotify. Słuchaj Słowa Bożego gdziekolwiek jesteś.",
      icon: <BookOpen className="w-6 h-6" />,
      category: "media",
      action: "navigate:spotify",
      color: "#1DB954",
    },
    {
      id: "coaching",
      label: "Holistyczny Coaching Pawła Murawskiego",
      description:
        "Zadbaj o rozwój swojego ciała, ducha i umysłu poprzez specjalistyczny coaching i wsparcie dopasowane do Twoich potrzeb.",
      icon: <Users className="w-6 h-6" />,
      category: "education",
      url: COACH_HOLISTYCZNY_URL,
      color: "#C5A059",
    },
    {
      id: "live-global",
      label: "Live Global (Ziemia 3D)",
      description:
        "Zobacz w czasie rzeczywistym interaktywny globus z naszymi słuchaczami z całego globu na żywo.",
      icon: <Globe className="w-6 h-6" />,
      category: "community",
      action: "navigate:live-global",
      color: "#C5A059",
    },
    {
      id: "school",
      label: "Szkoła Biblijna",
      description:
        "Systemowa nauka Pisma Świętego. Stopnie od Podstawowej po Akademię Teologiczną. Ucz się we własnym tempie.",
      icon: <BookOpen className="w-6 h-6" />,
      category: "education",
      action: "navigate:school",
      color: "#C5A059",
    },
    {
      id: "community",
      label: "Społeczność & Czat",
      description:
        "Globalny pokój modlitwy i rozmów. Nawiązuj relacje z innymi Wojownikami Bożej Sprawy na całym świecie.",
      icon: <Users className="w-6 h-6" />,
      category: "community",
      action: "navigate:chat",
      color: "#C5A059",
    },
    {
      id: "identity",
      label: "Identity Engine",
      description:
        "System wizytówek i profilowania Wojownika. Buduj swoją tożsamość w Chrystusie i dziel się świadectwem.",
      icon: <Shield className="w-6 h-6" />,
      category: "identity",
      action: "navigate:profile",
      color: "#C5A059",
    },
    {
      id: "warrior",
      label: "Mentorzy AI",
      description:
        "Dedykowani asystenci (Wojownik, Teolog, Pocieszyciel), którzy wspierają Cię w codziennej walce duchowej.",
      icon: <Users className="w-6 h-6" />,
      category: "identity",
      action: "navigate:mentor",
      color: "#C5A059",
    },
    {
      id: "testimonies",
      label: "Globalne Świadectwa",
      description:
        "Miejsce, gdzie Twoja historia spotyka się z historiami Wojowników z całego świata. Budujmy się wzajemnie!",
      icon: <Heart className="w-6 h-6" />,
      category: "community",
      action: "navigate:testimonies",
      color: "#C5A059",
    },
    {
      id: "helping-hand",
      label: appLanguage === "pl" ? "Pomocna Dłoń" : "Helping Hand",
      description:
        appLanguage === "pl"
          ? "Miejsce wsparcia, odnowy i rozwoju. Znajdź regenerację ciała oraz serca w ramach misji Christian Culture."
          : "A place of support, renewal, and growth. Find regeneration for body and heart within the Christian Culture mission.",
      icon: <Heart className="w-6 h-6" />,
      category: "support",
      action: "navigate:helping-hand",
      color: "#C5A059",
    },
    {
      id: "studio-ds",
      label: appLanguage === "pl" ? "Studio Słowa" : "Word Studio",
      description:
        appLanguage === "pl"
          ? "Inspirujące miejsce dla poszukiwaczy pasji i pragnących podnieść jakość swojego życia."
          : "An inspiring place for passion seekers who desire to elevate their quality of life.",
      icon: <Mic className="w-6 h-6" />,
      category: "support",
      action: "navigate:studio-ds",
      color: "#C5A059",
    },
    {
      id: "coaching",
      label:
        appLanguage === "pl" ? "Holistyczny Coaching" : "Holistic Coaching",
      description:
        appLanguage === "pl"
          ? "Odzyskaj harmonię i wewnętrzną wolność w oparciu o Słowo Boże. Paweł Murawski."
          : "Regain harmony and inner freedom based on the Word of God. Paweł Murawski.",
      icon: <Compass className="w-6 h-6" />,
      category: "support",
      action: "navigate:coaching",
      color: "#C5A059",
    },
    {
      id: "support",
      label: "Wsparcie Misji",
      description:
        "Zostań Patronem lub Mecenasem. Twoja cegiełka pomaga nam docierać z Ewangelią na krańce świata.",
      icon: <Heart className="w-6 h-6" />,
      category: "support",
      action: "navigate:support",
      color: "#C5A059",
    },
  ];

  const handleAction = (node: EcosystemNode) => {
    if (node.url) {
      window.open(node.url, "_blank", "noreferrer");
    } else if (node.action) {
      onNavigate(node.action);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden glassmorphism flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-[#C5A059]" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white tracking-tight leading-none">
                    {appLanguage === "pl"
                      ? "Mapa Ekosystemu CC"
                      : "CC Ecosystem Map"}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                    {appLanguage === "pl"
                      ? "Inteligentny Spis Treści Misji"
                      : "Mission Intelligent Content"}
                  </p>
                </div>
              </div>
              <button
                aria-label="Zamknij"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ecosystemNodes.map((node) => (
                  <motion.button
                    key={node.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-4 ${
                      selectedNode?.id === node.id
                        ? "bg-[#C5A059]/10 border-[#C5A059]/50"
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
                      <div className="text-[#C5A059]">{node.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {node.label}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
                        {node.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 bg-black/20 p-8 flex flex-col">
                <AnimatePresence mode="wait">
                  {selectedNode ? (
                    <motion.div
                      key={selectedNode.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col h-full"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center mb-6">
                        <div className="text-[#C5A059] scale-150">
                          {selectedNode.icon}
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {selectedNode.label}
                      </h4>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                        {selectedNode.description}
                      </p>

                      <div className="mt-auto space-y-3">
                        <button
                          aria-label="Dalej"
                          onClick={() => handleAction(selectedNode)}
                          className="w-full py-4 px-6 rounded-xl bg-[#C5A059] text-black font-bold flex items-center justify-between group transition-all hover:bg-[#B38E46]"
                        >
                          <span>
                            {selectedNode.url
                              ? appLanguage === "pl"
                                ? "Otwórz Portal"
                                : "Open Portal"
                              : appLanguage === "pl"
                                ? "Przejdź teraz"
                                : "Navigate Now"}
                          </span>
                          {selectedNode.url ? (
                            <ExternalLink className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          )}
                        </button>

                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center mt-4">
                          {appLanguage === "pl"
                            ? "Zrób to Dla Jezusa"
                            : "Do it For Jesus"}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4">
                        <Info className="w-6 h-6 text-zinc-600" />
                      </div>
                      <p className="text-zinc-500 text-sm">
                        {appLanguage === "pl"
                          ? "Wybierz element z mapy, aby poznać szczegóły"
                          : "Select an ecosystem element to see details"}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 text-center flex flex-col gap-4">
              <button
                onClick={onClose}
                className="w-full py-4 bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-700 transition-all shadow-lg active:scale-95 text-center border border-white/10"
              >
                {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
              </button>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                {appLanguage === "pl"
                  ? "Wszystko, co robisz, czyń z serca, jak dla Jahwe (Kolosan 3:23)"
                  : "Whatever you do, work heartily, as for the Lord (Colossians 3:23)"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
