import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  APP_VERSION,
  SHOP_URL,
  UserPersona,
  BibleVerse,
  fixOrphans,
  normalizeBibleReference,
  ToastMessage,
  MIRIAM_AVATAR_URL,
  RadioAlarm,
  HOTLINE_NADZIEJA_NUMBER,
  PAWEL_COACH_NUMBER,
  MARIUSZ_PRIEST_NUMBER,
  ManagementTab,
  COACH_HOLISTYCZNY_URL,
  RadioStreamType,
  CHRISTIAN_DATING_APP_URL,
  CZAREK_AVATAR_URL,
  OnlineUser,
  CHRISTIAN_CULTURE_HOMEPAGE_URL,
  CENTRUM_LOGO_URL,
  CENTRUM_CC_URL,
  VisualMode,
  splitVerseIntoLines,
  SpatialMode,
  EqualizerSettings,
  SupportedLanguage,
  LiveUser,
  ChatMessage,
} from "../types";
import { useAppStore } from "../useAppStore";
import { Separator } from "./Separator";
import {
  AlarmClock,
  Play,
  Pause,
  Cast,
  Volume2,
  VolumeX,
  MessageSquare,
  Waves,
  Music,
  Mic2,
  Headphones,
  Radio as RadioIcon,
  RotateCcw,
  Share,
  Contact,
  X,
  Share2,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Download,
  Bell,
  Gamepad2,
  Monitor,
  MoreHorizontal,
  BookOpen,
  BookText,
  Eye,
} from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { UserWidget } from "./UserWidget";
import { ViewUserCardModal } from "./ViewUserCardModal";
import { SlideshowModal } from "./SlideshowModal";
import { CastService, CastSessionState } from "../services/castService"; // Import CastService and State type
import { STREAMS } from "../config";
import { useTranslation } from "react-i18next";
import { nativeService } from "../services/nativeService";
import { ImpactStyle } from "@capacitor/haptics";
import { useMetadata } from "../useMetadata";
import { Button } from "./ui/button";
import { FloatingChatBubble } from "./FloatingChatBubble";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { LocalMediaPlayerWidget } from "./LocalMediaPlayerWidget";
import { SpiritualMotivationWidget } from "./SpiritualMotivationWidget";
import { DidYouKnowWidget } from "./DidYouKnowWidget";
import { GoldenThoughtsWidget } from "./GoldenThoughtsWidget";
import { CtaMobilizationWidget } from "./CtaMobilizationWidget";
import { YellowCardWidget } from "./YellowCardWidget";
import { VerseImageGeneratorModal } from "./VerseImageGeneratorModal";
import { CommunityService } from "../services/communityService";
import { MusicNewsWidget } from "./MusicNewsWidget";
import { EmiNewsWidget } from "./EmiNewsWidget";
import { FloatingWidgetWrapper } from "./FloatingWidgetWrapper";

const EqualizerGraph: React.FC<{
  equalizer: EqualizerSettings;
  className?: string;
}> = ({ equalizer, className }) => {
  const bands = ["low", "midLow", "mid", "midHigh", "high"] as const;
  const width = 200;
  const height = 60;

  const getY = (val: number) => height / 2 - (val / 12) * (height / 2);

  const points = bands.map((band, i) => {
    const x = (i / (bands.length - 1)) * width;
    const y = getY(equalizer[band]);
    return { x, y };
  });

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cp1x = p1.x + (p2.x - p1.x) / 2;
    const cp2x = p1.x + (p2.x - p1.x) / 2;
    d += ` C ${cp1x} ${p1.y}, ${cp2x} ${p2.y}, ${p2.x} ${p2.y}`;
  }

  return (
    <div
      className={
        className ||
        "w-full bg-black/60 rounded-xl border border-gold/20 p-3 mb-4 h-24 relative overflow-hidden shadow-inner"
      }
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,160,89,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.2) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(197,160,89,0.2)"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <path
          d={d}
          fill="none"
          stroke="#C5A059"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(197,160,89,0.6)] transition-all duration-300"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#000"
              stroke="#C5A059"
              strokeWidth="1.5"
            />
            <circle cx={p.x} cy={p.y} r="1.5" fill="#F2D08C" />
          </g>
        ))}
      </svg>
    </div>
  );
};

// Ulepszony komponent ekualizera (Spectrum Analyzer) - Premium Black & Gold
const SpectrumAnalyzer: React.FC<{ active: boolean; label: string }> = ({
  active,
  label,
}) => {
  const barCount = 24;
  const [bars, setBars] = useState<number[]>(new Array(barCount).fill(5));
  const [peaks, setPeaks] = useState<number[]>(new Array(barCount).fill(5));

  useEffect(() => {
    if (!active) {
      setBars(new Array(barCount).fill(5));
      setPeaks(new Array(barCount).fill(5));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((curr, i) => {
          // Tworzymy bardziej naturalny ruch widma (fale)
          const target = 15 + Math.random() * 85;
          // Płynne przejście do celu
          return curr + (target - curr) * 0.4;
        }),
      );
    }, 60);

    return () => clearInterval(interval);
  }, [active]);

  // Logika opadania szczytów (peaks)
  useEffect(() => {
    if (!active) return;
    const peakInterval = setInterval(() => {
      setPeaks((prev) =>
        prev.map((p, i) => {
          const currentBar = bars[i];
          if (currentBar > p) return currentBar;
          return Math.max(5, p - 2); // Powolne opadanie
        }),
      );
    }, 40);
    return () => clearInterval(peakInterval);
  }, [active, bars]);

  return (
    <div className="flex-1 space-y-1.5 group/analyzer">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1 h-1 rounded-full ${active ? "bg-red-600 animate-pulse shadow-[0_0_5px_#dc2626]" : "bg-zinc-700"}`}
          ></div>
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover/analyzer:text-[#C5A059] transition-colors">
            {label}
          </span>
        </div>
        <span className="text-[8px] font-mono text-[#C5A059]/80 tracking-tighter">
          {active ? "24-BIT / 192KHZ" : "STANDBY"}
        </span>
      </div>
      <div className="h-20 sm:h-28 bg-black border border-[#C5A059]/10 rounded-xl sm:rounded-2xl overflow-hidden flex items-end gap-[2px] sm:gap-[3px] p-2 sm:p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
        {/* Siatka tła (Grid) */}
        <div className="absolute inset-0 flex flex-col justify-between p-2 sm:p-3 pointer-events-none opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-[#C5A059]"></div>
          ))}
        </div>

        {/* Gradientowy blask u dołu */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none"></div>

        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 h-full relative flex flex-col justify-end"
          >
            {/* Wskaźnik szczytowy (Peak) */}
            {active && (
              <div
                className="absolute w-full h-[2px] bg-[#F2D08C] shadow-[0_0_8px_#C5A059] transition-all duration-300"
                style={{ bottom: `${peaks[i]}%` }}
              />
            )}
            {/* Słupek widma */}
            <div
              className={`w-full rounded-t-[1px] sm:rounded-t-sm transition-all duration-100 ${active ? "bg-gradient-to-t from-[#8B7344] via-[#C5A059] to-[#F2D08C] shadow-[0_0_15px_rgba(197,160,89,0.2)]" : "bg-zinc-900/40"}`}
              style={{ height: `${active ? height : 5}%` }}
            >
              {/* Efekt szklanego połysku na słupku */}
              {active && (
                <div className="w-full h-full bg-white/10 opacity-30"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RadioModePlayerProps {
  isRadioPlaying: boolean;
  onToggleRadio: () => void;
  onOpenSupport: () => void;
  onShareRadio: () => void;
  appLanguage: SupportedLanguage;
  activeStream: RadioStreamType;
  onSwitchStream: (stream: RadioStreamType) => void;
  onOpenLeftPanel: () => void;
  onOpenRightPanel: () => void;
  onOpenManagement: (tab: ManagementTab) => void;
  onOpenBiblicalSchool: () => void;
  onOpenVerseSearch: () => void;
  addToast?: (msg: string, type?: ToastMessage["type"]) => void;
  userPersona: UserPersona;
  dailyVerse: BibleVerse | null;
  onRefreshDailyVerse: () => void;
  onOpenVoiceAssistant?: () => void;
  isMiriamUnlocked?: boolean;
  radioAlarm: RadioAlarm | null;
  installStatus: "install" | "installed" | "update";
  onInstallClick: () => void;
  onOpenDailyVerseModal: (verse: BibleVerse) => void;
  onOpenSmsSubscriptionModal: () => void;
  onOpenStore?: () => void;
  onOpenYouTubeLiveModal?: () => void;
  unreadNotificationsCount?: number;
  onBibleSearch: (query: string) => void;
  onEcosystemAction?: (action: string) => void;
  onOpenPrayerIntentions?: () => void;
  visualMode: VisualMode;
  isTickerExpanded?: boolean;
  incomingBubbles: ChatMessage[];
  onRemoveBubble: (id: string) => void;
  onReplyBubble: (messageId: string, text: string) => void;
  showMatrix: boolean;
  onMatrixToggle: (show: boolean) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isLandscape?: boolean;
  spatialMode: SpatialMode;
  onSpatialModeChange: (mode: SpatialMode) => void;
  equalizer: EqualizerSettings;
  onEqualizerChange: (eq: EqualizerSettings) => void;
  onOpenCommunity: () => void;
  onOpenCentralChat: () => void;
  liveUsers: LiveUser[];
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  onClose?: () => void;
  onToggleFavorite?: (item: any) => void;
  onOpenBusinessCard?: () => void;
  onOpenReadingRoom?: () => void;
  onOpenGames?: () => void;
  onOpenEmi?: () => void;
  onOpenInstrumentalMusic?: () => void;
  globalAmensCount?: number;
  dailyAmensCount?: number;
  onOpenMusicNews?: () => void;
  onOpenTaskbar?: () => void;
  onGoogleLogin?: () => void;
  isSyncing?: boolean;
  hasSOS?: boolean;
  onSOSClick?: () => void;
}

export const RadioModePlayer: React.FC<RadioModePlayerProps> = ({
  isRadioPlaying,
  onToggleRadio,
  onOpenSupport,
  onShareRadio,
  appLanguage,
  activeStream,
  onSwitchStream,
  onOpenLeftPanel,
  onOpenRightPanel,
  onOpenManagement,
  onOpenBiblicalSchool,
  onOpenVerseSearch,
  addToast,
  userPersona,
  dailyVerse,
  onRefreshDailyVerse,
  onOpenVoiceAssistant,
  radioAlarm,
  installStatus,
  onInstallClick,
  onOpenDailyVerseModal,
  onOpenSmsSubscriptionModal,
  onOpenStore,
  onOpenYouTubeLiveModal,
  unreadNotificationsCount = 0,
  onBibleSearch,
  onEcosystemAction,
  onOpenPrayerIntentions,
  visualMode,
  isTickerExpanded = false,
  incomingBubbles,
  onRemoveBubble,
  onReplyBubble,
  showMatrix,
  onMatrixToggle,
  volume,
  onVolumeChange,
  isLandscape = false,
  spatialMode,
  onSpatialModeChange,
  equalizer,
  onEqualizerChange,
  onOpenCommunity,
  onOpenCentralChat,
  liveUsers,
  audioRef,
  onClose,
  onToggleFavorite,
  onOpenBusinessCard,
  onOpenReadingRoom,
  onOpenGames,
  onOpenEmi,
  onOpenInstrumentalMusic,
  onOpenMusicNews,
  onOpenTaskbar,
  onGoogleLogin,
  isSyncing,
  globalAmensCount = 0,
  dailyAmensCount = 0,
  hasSOS,
  onSOSClick,
}) => {
  const { t } = useTranslation();
  const isZenMode = useAppStore((state) => state.isZenMode);
  const setIsZenMode = useAppStore((state) => state.setIsZenMode);
  const areAllWidgetsHidden = useAppStore((state) => state.areAllWidgetsHidden);
  const setAreAllWidgetsHidden = useAppStore(
    (state) => state.setAreAllWidgetsHidden,
  );
  const setUserPersona = useAppStore((state) => state.setUserPersona);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [contactsActiveTab, setContactsActiveTab] = useState<
    "help" | "community"
  >("help");
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isVerseToolsVisible, setIsVerseToolsVisible] = useState(false);
  const [isLoginTooltipVisible, setIsLoginTooltipVisible] = useState(false);
  const [dailyRadioStats, setDailyRadioStats] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(
      doc(db, "counters", "stats"),
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().totalViews) {
          setTotalViews(docSnap.data().totalViews);
        }
      },
      (error) => {
        console.error("Failed to fetch total views:", error);
      },
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    console.log("dailyRadioStats updated:", dailyRadioStats);
  }, [dailyRadioStats]);
  useEffect(() => {
    let unsub: () => void = () => {};
    let mounted = true;
    let lastSubscribedDate = "";
    let intervalId: NodeJS.Timeout;

    import("../services/communityService").then((m) => {
      import("../types").then((types) => {
        if (!mounted) return;

        const checkAndSubscribe = () => {
          const todayStr = types.getBiblicalDateString(new Date());
          if (todayStr !== lastSubscribedDate) {
            console.log("Subscribing to radio stats for:", todayStr);
            unsub();
            lastSubscribedDate = todayStr;
            unsub = m.CommunityService.subscribeToDailyRadioStats(
              todayStr,
              (clicks) => {
                console.log("Callback received:", clicks);
                if (mounted) setDailyRadioStats(clicks);
              },
            );
          }
        };

        checkAndSubscribe();
        intervalId = setInterval(checkAndSubscribe, 60000);
      });
    });
    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
      unsub();
    };
  }, []);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isVerseToolsVisible) {
      timeoutId = setTimeout(() => {
        setIsVerseToolsVisible(false);
      }, 8000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVerseToolsVisible]);
  const [isVerseElementGlowing, setIsVerseElementGlowing] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isLeftFooterGroupOpen, setIsLeftFooterGroupOpen] = useState(false);
  const [isRightFooterGroupOpen, setIsRightFooterGroupOpen] = useState(false);
  const [selectedCommunityUser, setSelectedCommunityUser] =
    useState<OnlineUser | null>(null);
  const [isVerseGeneratorOpen, setIsVerseGeneratorOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );
  const [landscapeActiveCard, setLandscapeActiveCard] = useState<
    "verse" | "radio"
  >("verse");
  const landscapeTouchStartRef = useRef<number | null>(null);

  const [isRdsVisible, setIsRdsVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cc_rds_visible");
      return saved ? saved === "true" : false;
    }
    return false;
  });

  const [rdsTextSize, setRdsTextSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cc_rds_text_size");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  const handleRdsTextClick = () => {
    setRdsTextSize((prev) => {
      const nextSize = prev === 3 ? 1 : prev + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("cc_rds_text_size", nextSize.toString());
      }
      return nextSize;
    });
  };

  const getRdsTextClass = (baseSize: "normal" | "large" = "normal") => {
    if (baseSize === "normal") {
      switch (rdsTextSize) {
        case 2:
          return "text-[16px] sm:text-[32px]";
        case 3:
          return "text-[20px] sm:text-[40px]";
        case 1:
        default:
          return "text-[12px] sm:text-[24px]";
      }
    } else {
      switch (rdsTextSize) {
        case 2:
          return "text-[22px] sm:text-[36px]";
        case 3:
          return "text-[28px] sm:text-[48px]";
        case 1:
        default:
          return "text-[18px] sm:text-[28px]";
      }
    }
  };

  const handleLandscapeTouchStart = (e: React.TouchEvent) => {
    if (!isLandscape || isDesktop) return;
    landscapeTouchStartRef.current = e.touches[0].clientX;
  };

  const handleLandscapeTouchEnd = (e: React.TouchEvent) => {
    if (!isLandscape || isDesktop || landscapeTouchStartRef.current === null)
      return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = landscapeTouchStartRef.current - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      if (landscapeActiveCard === "verse") setLandscapeActiveCard("radio");
    } else if (distance < -minSwipeDistance) {
      if (landscapeActiveCard === "radio") setLandscapeActiveCard("verse");
    }
    landscapeTouchStartRef.current = null;
  };
  const renderDailyVerseMobile = () => {
    return (
      <div className="w-full h-full relative flex flex-col justify-center items-center pointer-events-auto px-4 no-scrollbar">
        <div
          className={`w-full h-full flex flex-col items-center justify-start text-center animate-fade-in transition-all duration-500 p-2 sm:p-6 relative ${isVerseElementGlowing ? "glowing-gold-border rounded-[2.5rem]" : ""}`}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
        >
          <Separator
            text={appLanguage === "pl" ? "SŁOWO BOŻE" : "WORD OF GOD"}
            className="mb-3 sm:mb-6"
          />

          <div className="w-full h-full flex flex-col items-center justify-center py-2 sm:py-6 relative group/verse no-scrollbar">
            <div
              className={`text-white text-center leading-[1.2] sm:leading-[1.25] w-full px-2 transition-all duration-700 whitespace-pre-wrap break-normal [hyphens:none] cursor-pointer hover:opacity-80 ${!userPersona.dailyVerseConfig?.fontFamily || userPersona.dailyVerseConfig?.fontFamily === "lora" ? "font-bible" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isZenMode) {
                  setIsZenMode(false);
                  return;
                }
                handleCopyVerse();
              }}
              style={{
                fontSize: userPersona?.dailyVerseConfig?.fontSize
                  ? `${userPersona.dailyVerseConfig.fontSize / 16}rem`
                  : verseFontSize,
                fontFamily:
                  userPersona?.dailyVerseConfig?.fontFamily === "mono"
                    ? "var(--font-mono)"
                    : userPersona?.dailyVerseConfig?.fontFamily === "serif"
                      ? "ui-serif, Georgia, serif"
                      : userPersona?.dailyVerseConfig?.fontFamily === "sans"
                        ? "ui-sans-serif, system-ui, sans-serif"
                        : undefined,
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)",
              }}
            >
              {splitVerseIntoLines(dailyVerse.text, dailyVerse.reference).map(
                (line, idx) => (
                  <p key={idx} className="mb-1 last:mb-0">
                    {idx === 0 ? `"${fixOrphans(line)}` : fixOrphans(line)}
                    {idx ===
                    splitVerseIntoLines(dailyVerse.text, dailyVerse.reference)
                      .length -
                      1
                      ? '"'
                      : ""}
                  </p>
                ),
              )}
            </div>
          </div>
          {dailyVerse && (
            <div className="mt-2 sm:mt-6 flex flex-col items-center gap-4 relative z-10 pointer-events-auto">
              <div className="flex flex-col items-center gap-2 sm:gap-4 transition-all duration-300 w-full mb-1">
                {!isVerseToolsVisible ? (
                  <button
                    aria-label="Otwórz Biblię"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVerseToolsVisible(true);
                    }}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-[#C5A059] hover:text-[#F2D08C] transition-all active:scale-90 shadow-xl border border-white/5 animate-fade-in"
                    title={
                      appLanguage === "pl"
                        ? "Pokaż opcje wersetu"
                        : "Show verse options"
                    }
                  >
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
                    <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
                      <button
                        aria-label="Czytaj Biblię"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dailyVerse) {
                            onOpenDailyVerseModal(dailyVerse);
                          }
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F2D08C] hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                        title={
                          appLanguage === "pl" ? "Czytaj Biblię" : "Read Bible"
                        }
                      >
                        <BookText className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        aria-label="Kreator Wersetu"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsVerseGeneratorOpen(true);
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F2D08C] hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                        title={
                          appLanguage === "pl"
                            ? "Kreator Wersetu"
                            : "Verse Creator"
                        }
                      >
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        aria-label="Ulubione werset"
                        onClick={handleToggleVerseFavorite}
                        className={`p-2 rounded-full transition-all active:scale-90 shadow-xl border border-white/5 ${isVerseFavorite ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"}`}
                      >
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${isVerseFavorite ? "fill-current" : ""}`}
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
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            typeof window !== "undefined" &&
                            "vibrate" in navigator
                          ) {
                            navigator.vibrate(10);
                          }
                          CommunityService.incrementGlobalCounter("pray").catch(
                            (err) => console.error(err),
                          );

                          const newAnimId = Date.now() + Math.random();
                          const randomX = Math.floor(Math.random() * 20) - 10;
                          setPlusAnimations((prev) => [
                            ...prev,
                            { id: newAnimId, x: randomX },
                          ]);
                          setTimeout(() => {
                            setPlusAnimations((prev) =>
                              prev.filter((anim) => anim.id !== newAnimId),
                            );
                          }, 800);
                        }}
                        className="p-2 flex items-center justify-center gap-1 rounded-full transition-all active:scale-90 shadow-xl border border-white/5 bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-400 hover:text-white group relative"
                        title={
                          appLanguage === "pl"
                            ? "Amen (modlitwa)"
                            : "Amen (prayer)"
                        }
                      >
                        <span
                          className="flex items-center justify-center text-[1rem] sm:text-[1.125rem] leading-none"
                          role="img"
                        >
                          🙏
                        </span>

                        {plusAnimations.map((anim) => (
                          <span
                            key={anim.id}
                            className="absolute top-0 text-green-400 font-extrabold text-[0.75rem] pointer-events-none z-50 animate-fly-up-plus drop-shadow-md"
                            style={{ left: `calc(50% + ${anim.x}px)` }}
                          >
                            +
                          </span>
                        ))}

                        {globalAmensCount > 0 && (
                          <span className="text-[0.6875rem] sm:text-[0.8125rem] font-black text-white relative flex h-full items-center ml-1">
                            +{globalAmensCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={handleShareAndCopy}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                        title={appLanguage === "pl" ? "Udostępnij" : "Share"}
                      >
                        <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currFonts = ["lora", "sans", "serif", "mono"];
                          const currFont =
                            userPersona.dailyVerseConfig?.fontFamily || "lora";
                          const nextFont =
                            currFonts[
                              (currFonts.indexOf(currFont) + 1) %
                                currFonts.length
                            ];
                          setUserPersona({
                            ...userPersona,
                            dailyVerseConfig: {
                              ...userPersona.dailyVerseConfig,
                              fontSize:
                                userPersona.dailyVerseConfig?.fontSize || 24,
                              fontFamily: nextFont,
                            },
                          });
                        }}
                        className="p-2 ml-2 sm:ml-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                        title={
                          appLanguage === "pl"
                            ? "Zmień czcionkę"
                            : "Change font"
                        }
                      >
                        Tt
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentSize =
                            userPersona?.dailyVerseConfig?.fontSize || 24;
                          setUserPersona({
                            ...userPersona,
                            dailyVerseConfig: {
                              ...userPersona.dailyVerseConfig,
                              fontFamily:
                                userPersona.dailyVerseConfig?.fontFamily ||
                                "lora",
                              fontSize: Math.max(12, currentSize - 2),
                            },
                          });
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                        title={
                          appLanguage === "pl"
                            ? "Zmniejsz czcionkę"
                            : "Decrease font size"
                        }
                      >
                        A-
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentSize =
                            userPersona?.dailyVerseConfig?.fontSize || 24;
                          setUserPersona({
                            ...userPersona,
                            dailyVerseConfig: {
                              ...userPersona.dailyVerseConfig,
                              fontFamily:
                                userPersona.dailyVerseConfig?.fontFamily ||
                                "lora",
                              fontSize: Math.min(60, currentSize + 2),
                            },
                          });
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                        title={
                          appLanguage === "pl"
                            ? "Zwiększ czcionkę"
                            : "Increase font size"
                        }
                      >
                        A+
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 pt-2 inline-block pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isZenMode) {
                    setIsZenMode(false);
                    return;
                  }
                  if (!hasLongPressed.current)
                    onOpenDailyVerseModal(dailyVerse);
                }}
                title={
                  appLanguage === "pl"
                    ? "Przeczytaj cały werset"
                    : "Read full verse"
                }
              >
                <Separator
                  text={normalizeBibleReference(
                    dailyVerse.reference,
                    appLanguage,
                  )}
                  className="opacity-90 scale-90 sm:scale-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRadioPlayerMobile = () => {
    return (
      <div className="w-full h-full relative flex flex-col justify-center items-center pointer-events-auto px-4 no-scrollbar pt-6">
        <div
          className={`w-full flex flex-col items-center gap-4 sm:gap-8 transition-all p-4 duration-700 ${isVerseToolsVisible && !isDesktop ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* Sekcja Play: Wysokość stała 90px */}
          <div
            className={`${isLandscape ? "h-[55px] gap-6" : "h-[90px] gap-4 sm:gap-10"} flex items-center justify-center transition-transform`}
          >
            <button
              aria-label="Udostępnij"
              onClick={onShareRadio}
              className={`rounded-full bg-zinc-900 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/10 transition-all w-8 h-8 sm:w-12 sm:h-12 shadow-[0_0_10px_rgba(197,160,89,0.2)]`}
              title={
                appLanguage === "pl" ? "Udostępnij Stację" : "Share Station"
              }
            >
              <Share2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              aria-label="Ulubione"
              onClick={handlePrevStream}
              className={`${isLandscape ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-zinc-900/80 backdrop-blur-md border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/60 transition-all shadow-lg group`}
            >
              <svg
                className={`${isLandscape ? "w-5 h-5" : "w-6 h-6"} drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 20L9 12L19 4V20Z"
                  fill="currentColor"
                  className="group-hover:fill-[#F2D08C] transition-colors"
                />
                <path
                  d="M5 19V5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="group-hover:stroke-[#F2D08C] transition-colors"
                />
              </svg>
            </button>
            <div className="relative">
              <button
                onPointerDown={handlePointerDownPlayButton}
                onPointerUp={handlePointerUpPlayButton}
                onPointerLeave={handlePointerLeavePlayButton}
                onClick={() => {
                  if (hasLongPressedRadioRef.current) {
                    hasLongPressedRadioRef.current = false;
                    return;
                  }
                  nativeService.hapticImpact(ImpactStyle.Heavy);
                  onToggleRadio();
                }}
                className={`relative ${isLandscape ? "w-14 h-14" : "w-20 h-20"} rounded-full flex items-center justify-center transition-all duration-500 border-[3px] bg-black ${isRadioPlaying ? "border-red-600 scale-105 shadow-[0_0_50px_rgba(220,38,38,0.8)]" : "border-[#C5A059]/50 active:scale-95 hover:border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.3)]"}`}
              >
                {/* Efekt ładowania (kręcący się pierścień) */}
                {isBuffering && (
                  <div className="absolute inset-[-3px] rounded-full border-[3px] border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin z-20 pointer-events-none"></div>
                )}

                {/* Opcjonalny puls tła podczas ładowania */}
                {isBuffering && (
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse pointer-events-none"></div>
                )}
                {isRadioPlaying ? (
                  <div className="flex gap-1.5 z-10">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(220,38,38,1)]"></div>
                    <div className="w-1.5 h-6 bg-red-600 rounded-full animate-pulse delay-150 shadow-[0_0_20px_rgba(220,38,38,1)]"></div>
                  </div>
                ) : (
                  <div className="relative ml-1.5 z-10">
                    <Play
                      className={`${isLandscape ? "w-7 h-7" : "w-10 h-10"} text-[#C5A059] fill-current drop-shadow-[0_0_15px_rgba(197,160,89,0.6)]`}
                    />
                  </div>
                )}
              </button>
            </div>
            <button
              aria-label="Ulubione"
              onClick={handleNextStream}
              className={`${isLandscape ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-zinc-900/80 backdrop-blur-md border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/60 transition-all shadow-lg group`}
            >
              <svg
                className={`${isLandscape ? "w-5 h-5" : "w-6 h-6"} drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 4L15 12L5 20V4Z"
                  fill="currentColor"
                  className="group-hover:fill-[#F2D08C] transition-colors"
                />
                <path
                  d="M19 5V19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="group-hover:stroke-[#F2D08C] transition-colors"
                />
              </svg>
            </button>

            <div className="relative flex items-center gap-2">
              {/* WhatsApp Button */}
              <a
                href="https://chat.whatsapp.com/CLd4fzbTES72scbIZLccbx"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black border border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.5)] flex items-center justify-center active:scale-90 hover:scale-110 transition-all w-8 h-8 sm:w-12 sm:h-12 overflow-hidden z-20"
                title={appLanguage === "pl" ? "Dołącz do Czatu" : "Join Chat"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <img
                  src={CENTRUM_LOGO_URL}
                  alt="WhatsApp"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
          </div>

          {!isRdsVisible && (
            <div className="w-full flex justify-center mt-3 z-20 relative">
              <button
                onClick={() => {
                  setIsRdsVisible((prev) => {
                    const next = !prev;
                    if (typeof window !== "undefined") {
                      localStorage.setItem("cc_rds_visible", String(next));
                    }
                    return next;
                  });
                }}
                className={`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-lg bg-[#C5A059]/5 border-white/5 text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10`}
              >
                <RadioIcon className="w-3 h-3" /> Odtwarzacz RDS
              </button>
            </div>
          )}
          <div
            className={`w-full flex justify-center px-4 sm:px-6 transition-all duration-500 overflow-visible ${isRdsVisible ? (isLandscape ? "h-[42px] mt-2 opacity-100" : "h-[56px] mt-2 opacity-100 scale-y-100") : "h-0 mt-0 opacity-0 scale-y-0 pointer-events-none"}`}
          >
            <div
              className={`${isLandscape ? "h-[42px] max-w-none" : "h-[56px] max-w-[460px] sm:max-w-none"} w-full relative flex items-center bg-zinc-950 border border-white/10 rounded-full shadow-2xl transition-transform`}
            >
              {showVolumeSlider && (
                <div
                  ref={volumeSliderRef}
                  className="absolute bottom-full left-0 right-0 mb-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-5">
                    {/* Volume Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-[#C5A059]" />
                          <span className="text-[10px] font-bold text-[#C5A059]/60 uppercase tracking-widest">
                            Głośność Główna
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#C5A059] tabular-nums">
                          {Math.round(volume * 100)}%
                        </span>
                      </div>
                      <div className="relative flex items-center group">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onVolumeChange(val);
                            if (val > 0) setPreMuteVolume(val);
                          }}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                        />
                      </div>
                    </div>

                    {/* Spatial Modes Section */}
                    <div className="space-y-3">
                      <button
                        aria-label="Ulubione"
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === "spatial" ? "none" : "spatial",
                          )
                        }
                        className="w-full flex items-center justify-between group/title"
                      >
                        <div className="flex items-center gap-2">
                          <Waves
                            className={`w-4 h-4 transition-colors ${expandedSection === "spatial" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                          />
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${expandedSection === "spatial" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                          >
                            Tryb Przestrzenny
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 transition-transform duration-300 ${expandedSection === "spatial" ? "rotate-180 text-[#C5A059]" : "text-zinc-600"}`}
                        >
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {expandedSection === "spatial" && (
                        <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          {spatialModes.map((mode) => {
                            const Icon = mode.icon;
                            const isActive = spatialMode === mode.id;
                            return (
                              <button
                                key={mode.id}
                                onClick={() =>
                                  onSpatialModeChange(mode.id as SpatialMode)
                                }
                                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all duration-300 ${
                                  isActive
                                    ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                    : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-[#C5A059]/30 hover:text-[#C5A059]/70"
                                }`}
                              >
                                <Icon
                                  className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`}
                                />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">
                                  {appLanguage === "pl" ? mode.pl : mode.en}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Equalizer Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <button
                          aria-label="Ulubione"
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === "equalizer"
                                ? "none"
                                : "equalizer",
                            )
                          }
                          className="flex items-center gap-2 group/title"
                        >
                          <Music
                            className={`w-4 h-4 transition-colors ${expandedSection === "equalizer" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                          />
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${expandedSection === "equalizer" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                          >
                            Korektor Graficzny
                          </span>
                          <div
                            className={`w-3 h-3 transition-transform duration-300 ${expandedSection === "equalizer" ? "rotate-180 text-[#C5A059]" : "text-zinc-600"}`}
                          >
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </button>
                        {expandedSection === "equalizer" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEqualizerChange({
                                low: 0,
                                midLow: 0,
                                mid: 0,
                                midHigh: 0,
                                high: 0,
                              });
                            }}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-all group/reset"
                            title="Resetuj Korektor"
                          >
                            <RotateCcw className="w-3 h-3 text-zinc-500 group-hover/reset:text-[#C5A059] transition-colors" />
                            <span className="text-[8px] font-bold text-zinc-500 group-hover/reset:text-[#C5A059] uppercase tracking-tighter">
                              Reset
                            </span>
                          </button>
                        )}
                      </div>

                      {expandedSection === "equalizer" && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                          <div className="relative bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                              <EqualizerGraph
                                equalizer={equalizer}
                                className="w-full h-full bg-transparent border-none p-0 mb-0"
                              />
                            </div>
                            <div className="flex justify-between items-end h-32 gap-2 px-1 relative z-10">
                              {(
                                [
                                  "low",
                                  "midLow",
                                  "mid",
                                  "midHigh",
                                  "high",
                                ] as const
                              ).map((band) => (
                                <div
                                  key={band}
                                  className="flex-1 flex flex-col items-center gap-3 h-full"
                                >
                                  <div className="relative flex-1 w-full flex justify-center items-center group/slider">
                                    {/* Vertical Track Background */}
                                    <div className="absolute w-1 h-full bg-zinc-900 rounded-full border border-white/5"></div>
                                    <input
                                      type="range"
                                      min="-12"
                                      max="12"
                                      step="0.5"
                                      value={equalizer[band]}
                                      onChange={(e) => {
                                        onEqualizerChange({
                                          ...equalizer,
                                          [band]: parseFloat(e.target.value),
                                        });
                                      }}
                                      className="absolute w-28 h-1 bg-transparent appearance-none cursor-pointer accent-[#C5A059] -rotate-90 z-10"
                                      style={{
                                        WebkitAppearance: "none",
                                        background: "transparent",
                                      }}
                                    />
                                    {/* Custom Thumb Glow Effect */}
                                    <div
                                      className="absolute w-3 h-3 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059] pointer-events-none transition-all duration-200"
                                      style={{
                                        bottom: `${((equalizer[band] + 12) / 24) * 100}%`,
                                        transform: "translateY(50%)",
                                      }}
                                    ></div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[8px] font-black text-[#C5A059] tabular-nums mb-0.5">
                                      {equalizer[band] > 0
                                        ? `+${equalizer[band]}`
                                        : equalizer[band]}
                                      dB
                                    </span>
                                    <span className="text-[7px] font-black text-zinc-500 uppercase tracking-tighter text-center">
                                      {band === "low"
                                        ? "60Hz"
                                        : band === "midLow"
                                          ? "250Hz"
                                          : band === "mid"
                                            ? "1kHz"
                                            : band === "midHigh"
                                              ? "4kHz"
                                              : "12kHz"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        aria-label="Głośność"
                        onClick={handleMuteToggle}
                        className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-white/5 transition-all text-[10px] font-bold uppercase tracking-widest text-[#C5A059]/80"
                      >
                        {volume === 0 ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> Wyłącz
                            wyciszenie
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" /> Wycisz
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowVolumeSlider(false)}
                        className="px-4 py-2.5 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 rounded-xl border border-red-600/20 transition-all text-[10px] font-bold uppercase tracking-widest text-red-500"
                      >
                        Zamknij
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Balanced layout to prevent overlap and keep text centered */}
              <div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-start pl-3 gap-2 z-10">
                <button
                  aria-label="YouTube"
                  onClick={() => window.open(ytUrl, "_blank")}
                  className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6 shrink-0"
                  title="YouTube"
                >
                  <svg
                    className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRdsVisible((prev) => {
                      const next = !prev;
                      if (typeof window !== "undefined") {
                        localStorage.setItem("cc_rds_visible", String(next));
                      }
                      return next;
                    });
                  }}
                  className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all h-5 px-1.5 rounded border text-[7px] font-black uppercase tracking-widest shrink-0 ${isRdsVisible ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/30 shadow-[0_0_8px_rgba(197,160,89,0.2)]" : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500"}`}
                  title="Toggle RDS"
                >
                  RDS
                </button>

                {isRadioPlaying && (
                  <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap bg-zinc-950/80 backdrop-blur-md relative z-10 pl-1 pr-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]"></div>
                    <span className="text-[9px] font-black text-red-500 tracking-tighter">
                      LIVE
                    </span>
                    <span className="text-[9px] font-black text-zinc-800 ml-1">
                      |
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 h-full relative flex items-center overflow-hidden">
                <div
                  className={`w-full flex ${rdsText.length > 15 ? "justify-start" : "justify-center"} ${showVolumeSlider ? "opacity-0" : "opacity-100"} cursor-pointer hover:opacity-80 transition-opacity duration-500`}
                  onClick={handleRdsTextClick}
                >
                  <p
                    className={`${getRdsTextClass("normal")} transition-all duration-300 font-medium text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] uppercase tracking-[0.2em] whitespace-nowrap ${rdsText.length > 15 ? "animate-marquee" : "text-center"}`}
                    style={
                      rdsText.length > 15
                        ? { animationDuration: `${rdsText.length * 0.4}s` }
                        : {}
                    }
                  >
                    {rdsText.length > 15 ? (
                      <>
                        <span>
                          {rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                        <span>
                          {rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </>
                    ) : (
                      rdsText
                    )}
                  </p>
                </div>
              </div>

              <div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-end pr-3 z-10 gap-2">
                <div className="relative flex items-center">
                  <button
                    aria-label="Głośność"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-9 h-9 rounded-full ${showVolumeSlider ? "bg-[#C5A059]/20 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)]" : spatialMode !== "none" ? "text-[#C5A059]" : "text-zinc-400 hover:text-white"}`}
                    title="Głośność i Efekty"
                  >
                    {volume === 0 ? (
                      <VolumeX
                        className={`w-5 h-5 ${spatialMode !== "none" ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]" : ""}`}
                      />
                    ) : (
                      <Volume2
                        className={`w-5 h-5 ${spatialMode !== "none" ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]" : ""}`}
                      />
                    )}
                  </button>
                </div>
                <button
                  aria-label="Spotify"
                  onClick={() => window.open(spotifyUrl, "_blank")}
                  className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6"
                  title="Spotify"
                >
                  <svg
                    className="w-4 h-4 text-green-500 fill-current relative z-10 drop-shadow-[0_0_5_rgba(34,197,94,0.5)]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.367-.703.483-1.07.26-2.99-1.828-6.753-2.243-11.187-1.233-.42.097-.84-.167-.937-.587-.097-.42.167-.84.587-.937 4.863-1.11 9.01-.633 12.347 1.407.367.223.483.703.26 1.07zm1.47-3.26c-.28.455-.878.6-1.333.32-3.42-2.103-8.633-2.713-12.68-1.483-.512.155-1.046-.135-1.201-.647-.155-.512.135-1.046.647-1.201 4.627-1.403 10.373-.727 14.247 1.653.455.28.6.878.32 1.333zm.143-3.357c-4.1-2.433-10.853-2.66-14.747-1.48-.63.19-1.297-.163-1.487-.793-.19-.63.163-1.297.793-1.487 4.493-1.363 11.96-1.097 16.687 1.707.567.337.753 1.067.417 1.633-.337.567-1.067.753-1.633.417z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Linia (Przycisk Panelu Samochodowego): WYŁĄCZONY DO ODWOŁANIA
            <button
              onClick={() => onMatrixToggle(true)}
              className="w-full h-[50px] flex items-center justify-center transition-opacity group"
            >
              <div
                className={`w-12 h-[3px] rounded-full transition-all group-hover:w-20 ${showMatrix ? "bg-zinc-700" : "bg-[#00FF41] shadow-[0_0_15px_#00FF41] animate-pulse"}`}
              ></div>
            </button>
            */}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePause = () => setIsBuffering(false);

    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef, audioRef?.current]);

  // ------------------------------

  useEffect(() => {
    if (isRadioPlaying) {
      setIsToggleLoading(false);
    }
  }, [isRadioPlaying]);

  const handleToggleRadioWithLoading = () => {
    setIsToggleLoading(true);
    onToggleRadio();
    setTimeout(() => setIsToggleLoading(false), 5000);
  };
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    "spatial" | "equalizer" | "none"
  >("none");

  const playButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLongPressedRadioRef = useRef(false);

  const handlePointerDownPlayButton = () => {
    hasLongPressedRadioRef.current = false;
    playButtonTimeoutRef.current = setTimeout(() => {
      hasLongPressedRadioRef.current = true;
      nativeService.hapticImpact(ImpactStyle.Heavy);
      import("../services/mediaPlayerService").then(
        ({ mediaPlayerService }) => {
          if (mediaPlayerService.playingUrl && mediaPlayerService.isMinimized) {
            mediaPlayerService.setMinimized(false);
          } else {
            mediaPlayerService.openMyFiles();
          }
        },
      );
    }, 3000);
  };

  const handlePointerUpPlayButton = () => {
    if (playButtonTimeoutRef.current) {
      clearTimeout(playButtonTimeoutRef.current);
      playButtonTimeoutRef.current = null;
    }
  };

  const handlePointerLeavePlayButton = () => {
    if (playButtonTimeoutRef.current) {
      clearTimeout(playButtonTimeoutRef.current);
      playButtonTimeoutRef.current = null;
    }
  };

  const [avatarLongPressProgress, setAvatarLongPressProgress] = useState(0);
  const [showAvatarTooltip, setShowAvatarTooltip] = useState(false);
  const [plusAnimations, setPlusAnimations] = useState<
    { id: number; x: number }[]
  >([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const avatarLongPressTimer = useRef<NodeJS.Timeout | null>(null);
  const avatarProgressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem(
      "cc_avatar_longpress_tooltip_seen",
    );
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowAvatarTooltip(true);
        setTimeout(() => setShowAvatarTooltip(false), 6000);
        localStorage.setItem("cc_avatar_longpress_tooltip_seen", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAvatarPressStart = useCallback(() => {
    if (avatarLongPressTimer.current)
      clearTimeout(avatarLongPressTimer.current);
    if (avatarProgressInterval.current)
      clearInterval(avatarProgressInterval.current);

    setAvatarLongPressProgress(0);

    const startTime = Date.now();
    const duration = 2000;

    avatarProgressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setAvatarLongPressProgress(progress);
      if (progress >= 100) {
        if (avatarProgressInterval.current)
          clearInterval(avatarProgressInterval.current);
      }
    }, 20);

    avatarLongPressTimer.current = setTimeout(() => {
      nativeService.hapticImpact(ImpactStyle.Heavy);
      if ("vibrate" in navigator) navigator.vibrate(100);
      onOpenCentralChat();
      setAvatarLongPressProgress(0);
      if (avatarProgressInterval.current)
        clearInterval(avatarProgressInterval.current);
    }, duration);
  }, [onOpenCentralChat]);

  const handleAvatarPressEnd = useCallback(() => {
    if (avatarLongPressTimer.current) {
      clearTimeout(avatarLongPressTimer.current);
      avatarLongPressTimer.current = null;
    }
    if (avatarProgressInterval.current) {
      clearInterval(avatarProgressInterval.current);
      avatarProgressInterval.current = null;
    }

    if (avatarLongPressProgress < 100 && avatarLongPressProgress > 0) {
      // It was a short press
      onOpenRightPanel();
    }
    setAvatarLongPressProgress(0);
  }, [avatarLongPressProgress, onOpenRightPanel]);
  const [preMuteVolume, setPreMuteVolume] = useState(volume > 0 ? volume : 0.5);
  const volumeSliderRef = useRef<HTMLDivElement>(null);

  const spatialModes = [
    { id: "none", pl: "Standard", en: "Standard", icon: RadioIcon },
    { id: "room", pl: "Pokój", en: "Room", icon: Music },
    { id: "studio", pl: "Studio", en: "Studio", icon: Mic2 },
    { id: "concert", pl: "Koncert", en: "Concert", icon: Headphones },
    { id: "chapel", pl: "Kaplica", en: "Chapel", icon: Waves },
    { id: "cathedral", pl: "Katedra", en: "Cathedral", icon: Waves },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showVolumeSlider &&
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVolumeSlider]);

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPreMuteVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(preMuteVolume);
    }
  };

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLongPressed = useRef(false);

  const castService = useMemo(() => CastService.getInstance(), []);
  const currentMetadata = useMetadata(activeStream, isRadioPlaying);

  const panelTopClass = isTickerExpanded
    ? "top-[calc(3.25rem+env(safe-area-inset-top,0px))] sm:top-[calc(8.75rem+env(safe-area-inset-top,0px))]"
    : "top-[calc(1.75rem+env(safe-area-inset-top,0px))] sm:top-[calc(5.75rem+env(safe-area-inset-top,0px))]";

  const communityList = useMemo(() => {
    const list: OnlineUser[] = [];
    const seenNames = new Set<string>();

    // Add current user if logged in
    if (userPersona.uid && userPersona.name !== "Gość") {
      list.push({
        id: "me",
        name: userPersona.name,
        avatar: userPersona.profilePicture || CZAREK_AVATAR_URL,
        roleText:
          userPersona.personalStatus ||
          (appLanguage === "pl" ? "Ty (Online)" : "You (Online)"),
      });
      seenNames.add(userPersona.name);
    }

    // Add real live users from Firebase
    liveUsers.forEach((user) => {
      const isCurrentUserTab = user.uid === userPersona.uid;
      const isDuplicateName =
        user.userName &&
        user.userName !== "Gość" &&
        seenNames.has(user.userName);

      if (!isCurrentUserTab && !isDuplicateName) {
        if (user.userName && user.userName !== "Gość") {
          seenNames.add(user.userName);
        }
        list.push({
          id: user.uid,
          name: user.userName || "Gość",
          avatar:
            user.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName || "Gość")}&background=18181b&color=D4AF37`,
          roleText:
            user.activeStream === "BIBLIA"
              ? appLanguage === "pl"
                ? "Słucha Biblii"
                : "Listening to Bible"
              : appLanguage === "pl"
                ? "Słucha Radia"
                : "Listening to Radio",
        });
      }
    });

    return list;
  }, [userPersona, appLanguage, liveUsers, t]);

  const isVerseFavorite = useMemo(() => {
    if (!dailyVerse || !userPersona.favorites) return false;
    const verseId = dailyVerse.id || dailyVerse.reference;
    return userPersona.favorites.some(
      (f) => f.id === verseId && f.type === "verse",
    );
  }, [dailyVerse, userPersona.favorites]);

  const handleToggleVerseFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!dailyVerse || !onToggleFavorite) return;
      onToggleFavorite({
        id: dailyVerse.id || dailyVerse.reference,
        type: "verse",
        content: dailyVerse.text,
        reference: dailyVerse.reference,
        timestamp: new Date().toISOString(),
      });
    },
    [dailyVerse, onToggleFavorite],
  );

  const handleCopyVerse = useCallback(async () => {
    if (!dailyVerse) return;
    const isEnglishVerse =
      (activeStream === "GLOBAL" || appLanguage === "en") &&
      dailyVerse.reference.includes(":");
    const translationInfo = isEnglishVerse
      ? "New International Version (NIV)"
      : appLanguage === "pl"
        ? "Biblia Warszawska (BW)"
        : "Warsaw Bible (BW)";
    const reflectionTitle =
      appLanguage === "pl"
        ? "PRZYPISY I ROZWAŻANIE:"
        : "FOOTNOTES & REFLECTION:";
    let fullContent = `"${dailyVerse.text}"\n— ${dailyVerse.reference} —\n\n${appLanguage === "pl" ? "Przekład" : "Translation"}: ${translationInfo}`;
    if (dailyVerse.reflection || dailyVerse.commentary) {
      fullContent += `\n\n${reflectionTitle}\n${dailyVerse.reflection || dailyVerse.commentary}`;
    }
    fullContent += `\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;
    try {
      await navigator.clipboard.writeText(fullContent);
      if (addToast)
        addToast(
          appLanguage === "pl"
            ? "Werset skopiowany do schowka!"
            : "Verse copied to clipboard!",
          "success",
        );
    } catch (err) {
      if (addToast)
        addToast(
          appLanguage === "pl"
            ? "Nie udało się skopiować wersetu."
            : "Failed to copy verse.",
          "alert",
        );
    }
  }, [dailyVerse, appLanguage, addToast]);

  const handleShareAndCopy = useCallback(async () => {
    if (!dailyVerse) return;
    const isEnglishVerse =
      (activeStream === "GLOBAL" || appLanguage === "en") &&
      dailyVerse.reference.includes(":");
    const translationInfo = isEnglishVerse
      ? "New International Version (NIV)"
      : appLanguage === "pl"
        ? "Biblia Warszawska (BW)"
        : "Warsaw Bible (BW)";
    const reflectionTitle =
      appLanguage === "pl"
        ? "PRZYPISY I ROZWAŻANIE:"
        : "FOOTNOTES & REFLECTION:";
    let fullContent = `"${dailyVerse.text}"\n— ${dailyVerse.reference} —\n\n${appLanguage === "pl" ? "Przekład" : "Translation"}: ${translationInfo}`;
    if (dailyVerse.reflection || dailyVerse.commentary) {
      fullContent += `\n\n${reflectionTitle}\n${dailyVerse.reflection || dailyVerse.commentary}`;
    }
    fullContent += `\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;
    try {
      await navigator.clipboard.writeText(fullContent);
    } catch (err) {}
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Werset Dnia - Christian Culture",
          text: fullContent,
          url: "https://cclite.pl",
        });
      } catch (err) {}
    } else {
      if (addToast)
        addToast(
          appLanguage === "pl"
            ? "Werset skopiowany do schowka!"
            : "Verse copied to clipboard!",
          "success",
        );
    }
  }, [dailyVerse, appLanguage, addToast]);

  const handlePressStart = useCallback(
    (e?: React.TouchEvent | React.MouseEvent) => {
      hasLongPressed.current = false;

      if (e && "touches" in e && e.touches.length > 1) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        return;
      }

      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      longPressTimer.current = setTimeout(() => {
        hasLongPressed.current = true;
        setIsVerseElementGlowing(true);
        if ("vibrate" in navigator) navigator.vibrate([60, 40, 60]);
        handleShareAndCopy();
        setTimeout(() => setIsVerseElementGlowing(false), 4000);
      }, 2000);
    },
    [handleShareAndCopy],
  );

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const streams: RadioStreamType[] = ["PL", "GLOBAL", "BIBLIA"];
  const handleNextStream = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      nativeService.hapticImpact(ImpactStyle.Light);
      const currentIndex = streams.indexOf(activeStream);
      const nextIndex = (currentIndex + 1) % streams.length;
      onSwitchStream(streams[nextIndex]);
    },
    [activeStream, onSwitchStream],
  );

  const handlePrevStream = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      nativeService.hapticImpact(ImpactStyle.Light);
      const currentIndex = streams.indexOf(activeStream);
      const prevIndex = (currentIndex - 1 + streams.length) % streams.length;
      onSwitchStream(streams[prevIndex]);
    },
    [activeStream, onSwitchStream],
  );

  const verseFontSize = useMemo(() => {
    if (!dailyVerse) return "1.5rem";
    const len = dailyVerse.text.length;
    let size = "";
    // Scaled to fit perfectly within the limited vertical space between the top and bottom UI.
    if (len < 60) size = "clamp(1rem, 4vh, 2.5rem)";
    else if (len < 120) size = "clamp(0.9rem, 3.5vh, 2.0rem)";
    else if (len < 200) size = "clamp(0.85rem, 3vh, 1.8rem)";
    else if (len < 300) size = "clamp(0.75rem, 2.5vh, 1.5rem)";
    else if (len < 450) size = "clamp(0.65rem, 2vh, 1.2rem)";
    else size = "clamp(0.55rem, 1.5vh, 1rem)";

    return !isDesktop ? `calc(${size} * 0.75)` : size;
  }, [dailyVerse, isDesktop]);

  const ytUrl = useMemo(() => {
    switch (activeStream) {
      case "PL":
        return "https://youtube.com/@radiochristianculture?si=YipewTd993ypAdoO";
      case "GLOBAL":
        return "https://youtube.com/@personalitypluscc?si=vJbsMIytd2hdX7Gb";
      case "BIBLIA":
        return "https://youtube.com/@bibliaaudiocc?si=BCHM4bq05dU-28yP";
      default:
        return "https://youtube.com/@RadioChristianCulture";
    }
  }, [activeStream]);

  const spotifyUrl = useMemo(() => {
    switch (activeStream) {
      case "PL":
      case "GLOBAL":
        return "https://open.spotify.com/artist/3ZgXCNnAllDbNDtzk4jkg6?si=-3ktI3-8Qf-pGgC5DqNEww";
      case "BIBLIA":
        return "https://open.spotify.com/show/6M2mU6VzRCPCOjWihgO8Aw?si=d85688aa9d7a49f8";
      default:
        return "https://open.spotify.com/artist/3ZgXCNnAllDbNDtzk4jkg6?si=-3ktI3-8Qf-pGgC5DqNEww";
    }
  }, [activeStream]);

  const stationName = useMemo(() => {
    switch (activeStream) {
      case "PL":
        return "Radio Christian Culture (Polska)";
      case "GLOBAL":
        return "Christian Culture Global";
      case "BIBLIA":
        return "Biblia Audio CC";
      default:
        return "Radio Christian Culture";
    }
  }, [activeStream]);

  const rdsText = useMemo(() => {
    if (isRadioPlaying && currentMetadata) {
      const prefix = activeStream === "GLOBAL" ? "NOW PLAYING" : "TERAZ GRAMY";
      return `${prefix}: ${currentMetadata} | ${stationName}`;
    }
    return t("radio.playing_for_you");
  }, [isRadioPlaying, currentMetadata, stationName, t, activeStream]);

  const [castState, setCastState] = useState<CastSessionState>({
    isConnected: false,
    isMediaLoaded: false,
  });

  useEffect(() => {
    const cleanup = castService.setupListeners((state) => {
      setCastState(state);
    });
    return cleanup;
  }, [castService]);

  const headerBtnClass =
    "w-11 h-11 sm:w-12 sm:h-12 bg-zinc-950/80 backdrop-blur-md border border-[#C5A059]/20 rounded-2xl flex items-center justify-center hover:bg-[#C5A059]/10 hover:border-[#C5A059]/50 hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all duration-500 active:scale-95 group relative";

  const handleChromecastClick = useCallback(async () => {
    if (!addToast) return;

    if (!castService.isAvailable()) {
      addToast(
        appLanguage === "pl"
          ? "Chromecast nie jest jeszcze gotowy. Spróbuj za chwilę."
          : "Chromecast is not ready yet. Try again in a moment.",
        "info",
      );
      return;
    }

    try {
      const streamTitle =
        activeStream === "PL"
          ? "Radio CC Polska"
          : activeStream === "GLOBAL"
            ? "Christian Culture Global"
            : "Biblia Audio CC";
      addToast(
        appLanguage === "pl"
          ? "Otwieram panel Chromecast..."
          : "Opening Chromecast panel...",
        "info",
      );

      // Stop local playback if it's playing to avoid double audio
      if (isRadioPlaying) {
        onToggleRadio();
      }

      await castService.loadMedia(
        STREAMS[activeStream],
        streamTitle,
        "Christian Culture Global",
      );
    } catch (err) {
      console.error("Chromecast error:", err);
      addToast(
        appLanguage === "pl"
          ? "Błąd Chromecast. Upewnij się, że urządzenie jest w tej samej sieci."
          : "Chromecast error. Ensure device is on the same network.",
        "alert",
      );
    }
  }, [
    castService,
    activeStream,
    addToast,
    appLanguage,
    isRadioPlaying,
    onToggleRadio,
  ]);

  const handleBluetoothClick = useCallback(async () => {
    if (!addToast) return;

    // Try modern Audio Output Devices API (Chrome 110+)
    if (
      "mediaDevices" in navigator &&
      (navigator.mediaDevices as any).selectAudioOutput
    ) {
      try {
        const device = await (
          navigator.mediaDevices as any
        ).selectAudioOutput();
        if (audioRef?.current && (audioRef.current as any).setSinkId) {
          try {
            await (audioRef.current as any).setSinkId(device.deviceId);
            addToast(
              appLanguage === "pl"
                ? `Zmieniono wyjście audio na: ${device.label}`
                : `Audio output changed to: ${device.label}`,
              "success",
            );
          } catch (sinkErr) {
            console.error("setSinkId error:", sinkErr);
            addToast(
              appLanguage === "pl"
                ? "Błąd przełączania wyjścia audio."
                : "Error switching audio output.",
              "alert",
            );
          }
        } else {
          addToast(
            appLanguage === "pl"
              ? "Twoja przeglądarka nie wspiera zmiany wyjścia audio."
              : "Your browser does not support audio output selection.",
            "alert",
          );
        }
      } catch (err: any) {
        if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
          console.error("Bluetooth/Audio output error:", err);
          addToast(
            appLanguage === "pl"
              ? "Błąd wyboru urządzenia audio."
              : "Error selecting audio device.",
            "alert",
          );
        }
      }
    } else {
      // Fallback for other browsers
      addToast(
        appLanguage === "pl"
          ? "Połącz urządzenie w ustawieniach systemowych Bluetooth, aby słuchać CC w głośnikach."
          : "Connect your device in system Bluetooth settings to listen to CC on speakers.",
        "info",
      );
    }
  }, [addToast, appLanguage, audioRef]);

  const handleHomeClick = useCallback(() => {
    window.open(
      CHRISTIAN_CULTURE_HOMEPAGE_URL,
      "_blank",
      "noopener noreferrer",
    );
  }, []);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center text-white select-none overflow-hidden"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        // Don't toggle zen mode if interacting with a clickable element
        if (
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input")
        ) {
          return;
        }
        setIsZenMode(!isZenMode);
      }}
    >
      {(isContactsOpen || isToolsOpen || showMatrix) && (
        <div
          className="fixed inset-0 z-[1550] bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setIsContactsOpen(false);
            setIsToolsOpen(false);
            onMatrixToggle(false);
          }}
        ></div>
      )}

      {/* GÓRNA BELKA & WYSZUKIWARKA & CHAT BUBBLES */}
      <div className="w-full absolute top-[8px] left-0 right-0 z-[2000] pointer-events-none flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col pointer-events-none">
          <header
            className={`w-full grid grid-cols-[110px_1fr_110px] sm:grid-cols-[130px_1fr_130px] items-center px-4 sm:px-6 pt-safe pb-2 flex-shrink-0 z-[2000] bg-transparent pointer-events-auto transition-all duration-700 ${isZenMode ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}`}
          >
            <div className="flex items-center gap-2">
              <button
                aria-label="Ulubione"
                onClick={() => {
                  nativeService.hapticImpact(ImpactStyle.Light);
                  onOpenLeftPanel();
                }}
                className={headerBtnClass}
              >
                <svg
                  className="w-5 h-5 sm:w-6 h-6 text-[#C5A059]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                aria-label="Ulubione"
                onClick={() => {
                  nativeService.hapticImpact(ImpactStyle.Light);
                  setIsContactsOpen(!isContactsOpen);
                  setIsToolsOpen(false);
                }}
                className={`${headerBtnClass} ${isContactsOpen ? "bg-[#C5A059] text-white shadow-[0_0_20px_#C5A059]" : "text-[#C5A059]"}`}
              >
                <svg
                  className="w-5 h-5 sm:w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadNotificationsCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_#ef4444] z-20"></span>
                ) : (
                  userPersona.googleEmail && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></span>
                  )
                )}
              </button>
            </div>
            <div className="flex flex-col items-center text-center pt-1 overflow-hidden">
              <h1 className="text-[10px] sm:text-[14px] font-black uppercase tracking-[0.3em] drop-shadow-2xl leading-tight w-full">
                <span
                  className={
                    activeStream === "BIBLIA" ? "text-[#C5A059]" : "text-white"
                  }
                >
                  {activeStream === "BIBLIA"
                    ? "BIBLIA AUDIO"
                    : activeStream === "PL"
                      ? "Halleluyah Radio"
                      : "CC Global"}
                </span>
              </h1>
              <p className="text-[8px] font-black text-[#C5A059] uppercase tracking-[0.4em] leading-tight mt-2.5 animate-fade-in w-full px-2 opacity-80">
                {fixOrphans(
                  visualMode === "sabbath"
                    ? appLanguage === "pl" && activeStream !== "GLOBAL"
                      ? "BŁOGOSŁAWIONEGO ODPOCZYNKU"
                      : "BLESSED REST"
                    : visualMode === "night"
                      ? appLanguage === "pl" && activeStream !== "GLOBAL"
                        ? "DOBREJ NOCY W BOŻEJ MOCY."
                        : "GOODNIGHT IN THE LORD"
                      : appLanguage === "pl" && activeStream !== "GLOBAL"
                        ? "DOBRZE, ŻE JESTEŚ."
                        : "WELCOME PILGRIM",
                )}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                aria-label="Ulubione"
                onClick={() => {
                  nativeService.hapticImpact(ImpactStyle.Light);
                  setIsToolsOpen(!isToolsOpen);
                  setIsContactsOpen(false);
                }}
                className={`${headerBtnClass} ${isToolsOpen ? "bg-[#C5A059] text-white" : "text-[#C5A059]"}`}
              >
                <svg
                  className="w-5 h-5 sm:w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5m9-6h2.25m-2.25 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12H13.5" />
                </svg>
              </button>
              <div
                className="relative"
                onMouseEnter={() =>
                  !userPersona.googleEmail && setIsLoginTooltipVisible(true)
                }
                onMouseLeave={() => setIsLoginTooltipVisible(false)}
              >
                <button
                  onClick={() => {
                    nativeService.hapticImpact(ImpactStyle.Light);
                    onOpenRightPanel();
                  }}
                  className={`${headerBtnClass} overflow-hidden relative select-none touch-none border-2 ${userPersona.googleEmail ? "border-green-500" : "border-red-500"}`}
                >
                  <img
                    src={
                      userPersona.profilePicture &&
                      userPersona.profilePicture.trim() !== ""
                        ? userPersona.profilePicture
                        : CENTRUM_LOGO_URL
                    }
                    alt="Profil"
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CENTRUM_LOGO_URL;
                    }}
                  />
                </button>

                {/* Tooltip Login */}
                <AnimatePresence>
                  {!userPersona.googleEmail && isLoginTooltipVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute top-full right-0 mt-3 lg:top-1/2 lg:left-full lg:ml-4 lg:-translate-y-1/2 w-48 bg-zinc-900 text-white p-3 rounded-2xl shadow-2xl z-[3000] pointer-events-auto"
                    >
                      <div className="absolute -top-1.5 right-5 w-3 h-3 bg-zinc-900 rotate-45 lg:top-1/2 lg:-left-1.5 lg:right-auto lg:-translate-y-1/2" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Triggers Google Login
                          window.dispatchEvent(
                            new CustomEvent("cc_trigger_google_login"),
                          );
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black p-2 rounded-xl font-black text-[10px] uppercase tracking-widest pointer-events-auto hover:bg-zinc-200 transition-colors"
                      >
                        {/* Google Logo */}
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        LOGOWANIE GOOGLE
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip Onboarding */}
                <AnimatePresence>
                  {showAvatarTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute top-full right-0 mt-3 w-48 bg-[#C5A059] text-white p-3 rounded-2xl shadow-2xl z-[3000] pointer-events-none"
                    >
                      <div className="absolute -top-1.5 right-5 w-3 h-3 bg-[#C5A059] rotate-45" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                        {appLanguage === "pl"
                          ? "Przytrzymaj, aby otworzyć czat"
                          : "Hold to open chat"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* WYSZUKIWARKA */}
          <div
            className={`w-full max-w-5xl bg-transparent py-1 transition-all duration-700 pointer-events-none px-4 sm:px-6 ${isZenMode ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
          >
            <div
              id="global-search-container"
              className="relative w-full my-3 h-[48px] pointer-events-auto"
            >
              <GlobalSearch
                dimmed={isContactsOpen || isToolsOpen || showMatrix}
                appLanguage={appLanguage}
                unreadCount={unreadNotificationsCount}
                onOpenNotifications={() => onOpenManagement("notifications")}
                onBibleSearch={onBibleSearch}
                hasSOS={hasSOS}
                onSOSClick={onSOSClick}
                onEcosystemAction={(action) => {
                  if (action === "navigate:verse-creator") {
                    setIsVerseGeneratorOpen(true);
                  } else if (action === "open:google_login") {
                    if (onGoogleLogin) onGoogleLogin();
                  } else if (onEcosystemAction) {
                    onEcosystemAction(action);
                  }
                }}
                isAlarmEnabled={radioAlarm?.enabled || false}
              />
            </div>
          </div>

          {/* CHAT BUBBLES - Dynamic system under the search bar */}
          <div
            className={`w-full max-w-5xl pointer-events-none px-4 sm:px-6 flex flex-col gap-3 transition-opacity duration-700 ${isZenMode ? "opacity-0" : "opacity-100"}`}
          >
            <AnimatePresence mode="popLayout">
              {incomingBubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  layout
                  initial={{ y: -20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 50, opacity: 0, scale: 0.95 }}
                  className="w-full pointer-events-auto"
                >
                  <div className="bg-black/95 backdrop-blur-2xl border border-[#C5A059]/30 rounded-2xl p-3 shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059]/40 flex-shrink-0 shadow-xl">
                        <img
                          src={
                            bubble.userAvatar ||
                            `https://ui-avatars.com/api/?name=${bubble.userName}&background=random`
                          }
                          alt={bubble.userName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.15em] truncate">
                            {bubble.userName}
                          </span>
                          <button
                            aria-label="Zamknij"
                            onClick={() => onRemoveBubble(bubble.id)}
                            className="text-zinc-500 hover:text-white transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[12px] text-zinc-100 font-medium line-clamp-2 leading-relaxed italic">
                          "{bubble.text}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]/50 transition-all font-medium"
                          placeholder={
                            appLanguage === "pl"
                              ? "Odpowiedz do Jahwe..."
                              : "Reply to Brother..."
                          }
                          value={replyTexts[bubble.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [bubble.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onReplyBubble(
                                bubble.id,
                                replyTexts[bubble.id] || "",
                              );
                              setReplyTexts((prev) => ({
                                ...prev,
                                [bubble.id]: "",
                              }));
                            }
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-4 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 rounded-xl hover:bg-[#C5A059] hover:text-black transition-all font-black text-[9px] uppercase tracking-widest"
                        onClick={() => {
                          onReplyBubble(bubble.id, replyTexts[bubble.id] || "");
                          setReplyTexts((prev) => ({
                            ...prev,
                            [bubble.id]: "",
                          }));
                        }}
                      >
                        {appLanguage === "pl" ? "WYŚLIJ" : "SEND"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* PANEL KONTAKTY / WSPÓLNOTA (Full Screen Modal) */}
      <div
        className={`fixed inset-0 z-[4000] bg-black transform transition-all duration-700 ease-in-out overflow-hidden flex flex-col ${isContactsOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        {/* Dekoracja tła */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.1),transparent_70%)] pointer-events-none" />

        <div className="flex justify-between items-center px-8 sm:px-10 pt-8 pb-6 flex-shrink-0 relative z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Centrum" : "Help"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Pomocy" : "Center"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Christian Culture Network
            </p>
          </div>
          <button
            aria-label="Zamknij"
            onClick={() => setIsContactsOpen(false)}
            className="p-3 bg-zinc-900 rounded-full text-zinc-500 shadow-lg hover:bg-zinc-800 transition-all hover:text-[#C5A059] active:scale-90 border border-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-20 pb-10 relative z-10 scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full space-y-8 pt-4">
            <div className="flex bg-zinc-900/50 p-2 rounded-full border border-white/5 backdrop-blur-md">
              <button
                onClick={() => setContactsActiveTab("help")}
                className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${contactsActiveTab === "help" ? "bg-[#C5A059] text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {appLanguage === "pl" ? "POMOC" : "HELP"}
              </button>
              <button
                onClick={() => setContactsActiveTab("community")}
                className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${contactsActiveTab === "community" ? "bg-[#C5A059] text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {appLanguage === "pl" ? "WSPÓLNOTA" : "COMMUNITY"}
              </button>
            </div>

            {contactsActiveTab === "help" && (
              <div className="space-y-4 animate-fade-in">
                <a
                  href={`tel:${HOTLINE_NADZIEJA_NUMBER.replace(/\s/g, "")}`}
                  className="flex items-center gap-6 p-6 bg-zinc-900 hover:bg-[#C5A059]/5 rounded-[2.5rem] transition-all group border border-white/5 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-3xl border border-white/5 group-hover:scale-105 transition-transform shadow-xl">
                    📞
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight mb-1">
                      INFOLINIA NADZIEJA
                    </p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      POMOC DUCHOWA 24/7
                    </p>
                  </div>
                  <div className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
                <a
                  href={COACH_HOLISTYCZNY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-6 bg-zinc-900 hover:bg-emerald-600/5 rounded-[2.5rem] transition-all group border border-white/5 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-3xl border border-white/5 group-hover:scale-105 transition-transform shadow-xl">
                    👨‍🏫
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight mb-1">
                      TRENER HOLISTYCZNY
                    </p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      WHATSAPP CHAT
                    </p>
                  </div>
                  <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
                <button
                  aria-label="Ulubione"
                  onClick={() => {
                    onOpenVoiceAssistant?.();
                    setIsContactsOpen(false);
                  }}
                  className="w-full flex items-center gap-6 p-6 bg-zinc-900 hover:bg-[#C5A059]/10 rounded-[2.5rem] transition-all group border border-white/5 shadow-2xl relative overflow-hidden text-left"
                >
                  <div className="w-16 h-16 rounded-3xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform shadow-xl">
                    <img
                      src={MIRIAM_AVATAR_URL}
                      alt="Miriam"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left flex-1 z-10">
                    <p className="text-sm font-black text-[#C5A059] uppercase tracking-tight leading-tight mb-1">
                      MIRIAM ASSISTANT
                    </p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      GŁOSOWA POMOC CC
                    </p>
                  </div>
                  <div className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div className="pt-8 border-t border-white/5 mt-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center mb-6 opacity-60">
                    {appLanguage === "pl"
                      ? "Coś nie działa? Pomóż nam"
                      : "Something not working? Help us"}
                  </p>
                  <a
                    href="https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 p-6 bg-red-600/5 hover:bg-red-600/10 rounded-[2.5rem] transition-all group border border-red-500/20 shadow-2xl"
                  >
                    <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-3xl border border-white/5 group-hover:scale-105 transition-transform shadow-xl">
                      🛠️
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight leading-tight mb-1">
                        {appLanguage === "pl"
                          ? "ZGŁOŚ NAPRAWĘ"
                          : "REPORT ISSUE"}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                        {appLanguage === "pl"
                          ? "Aplikacja cały czas rozwija się dla Ciebie. Napisz nam co powinniśmy naprawić."
                          : "The app is constantly evolving. Tell us what we should fix."}
                      </p>
                    </div>
                    <div className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {contactsActiveTab === "community" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    aria-label="Wiadomości"
                    onClick={() => {
                      setIsContactsOpen(false);
                      onOpenCentralChat();
                    }}
                    className="flex flex-col items-center gap-3 p-6 bg-gold/5 hover:bg-gold/10 border border-gold/20 rounded-3xl transition-all group shadow-xl"
                  >
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-gold/20 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-7 h-7 text-gold" />
                    </div>
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest text-center">
                      {appLanguage === "pl" ? "Czat Global" : "Global Chat"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsContactsOpen(false);
                      onOpenCommunity();
                    }}
                    className="flex flex-col items-center gap-3 p-6 bg-zinc-900 hover:bg-white/5 border border-white/5 rounded-3xl transition-all group shadow-xl"
                  >
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                      <Waves className="w-7 h-7 text-zinc-400" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                      {appLanguage === "pl" ? "Intencje" : "Intentions"}
                    </span>
                  </button>
                </div>

                <a
                  href={CHRISTIAN_DATING_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-6 bg-pink-600/5 hover:bg-pink-600/10 rounded-[2.5rem] transition-all group border border-pink-500/20 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-4xl border border-white/5 group-hover:scale-105 transition-transform shadow-xl">
                    💖
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight mb-1">
                      CHRZEŚCIJAŃSKA RANDKA
                    </p>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                      DOŁĄCZ DO PORTALU
                    </p>
                  </div>
                  <div className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>

                <div className="space-y-4">
                  <Separator
                    text={
                      appLanguage === "pl"
                        ? "PIELGRZYMI ONLINE"
                        : "PILGRIMS ONLINE"
                    }
                  />
                  <div className="flex justify-center flex-wrap gap-2 w-full mb-2">
                    {totalViews > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/50 border border-[#C5A059]/20 text-[10px] sm:text-xs font-bold text-[#C5A059] uppercase tracking-widest shadow-[0_0_10px_rgba(197,160,89,0.1)]">
                        <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                        {totalViews.toLocaleString(
                          appLanguage === "pl" ? "pl-PL" : "en-US",
                        )}
                      </span>
                    )}
                    {dailyRadioStats > 0 && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-[#C5A059]/20 text-[10px] sm:text-xs font-bold text-[#C5A059] uppercase tracking-widest shadow-[0_0_10px_rgba(197,160,89,0.1)]">
                        {appLanguage === "pl" ? "DZIŚ" : "TODAY"}:{" "}
                        {dailyRadioStats}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {communityList.length > 0 ? (
                      communityList.map((user) => (
                        <UserWidget
                          key={user.id}
                          user={user}
                          isOnline={true}
                          appLanguage={appLanguage}
                          isDisciple={
                            user.id === "me" || user.id === "nazir-admin"
                          }
                          onClick={(u) => {
                            if (u.id === "miriam-ai") {
                              setIsContactsOpen(false);
                              onOpenVoiceAssistant?.();
                            } else {
                              setSelectedCommunityUser(u);
                            }
                          }}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-zinc-900/40 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          Brak pielgrzymów online
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 sm:px-20 py-10 border-t border-white/5 bg-black/80 backdrop-blur-xl flex-shrink-0 relative z-20">
          <button
            onClick={() => setIsContactsOpen(false)}
            className="max-w-2xl mx-auto w-full py-5 bg-zinc-900 text-zinc-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2 active:scale-95"
          >
            {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>
      </div>

      {/* PANEL BIBLIOTEKA (Full Screen Modal) */}
      <div
        className={`fixed inset-0 z-[4000] bg-black transform transition-all duration-700 ease-in-out overflow-hidden flex flex-col ${isToolsOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        {/* Dekoracja tła */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.1),transparent_70%)] pointer-events-none" />

        <div className="flex justify-between items-center px-8 sm:px-10 pt-8 pb-6 flex-shrink-0 relative z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Biblioteka" : "CC"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "CC" : "Library"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Resources & Digital Media
            </p>
          </div>
          <button
            aria-label="Zamknij"
            onClick={() => setIsToolsOpen(false)}
            className="p-3 bg-zinc-900 rounded-full text-zinc-500 shadow-lg hover:bg-zinc-800 transition-all hover:text-[#C5A059] active:scale-90 border border-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-20 pb-10 relative z-10 scrollbar-hide">
          <div className="max-w-4xl mx-auto w-full pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onOpenBiblicalSchool}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:bg-zinc-900"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  🎓
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Edukacja
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl"
                      ? "Szkoła Biblijna"
                      : "Biblical School"}
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenVerseSearch}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:bg-zinc-900"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  🔍
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Pismo Święte
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "Szukaj w Biblii" : "Search Bible"}
                  </div>
                </div>
              </button>

              <button
                onClick={() => onOpenManagement("alarm")}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:bg-zinc-900"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  <AlarmClock className="w-10 h-10 text-[#C5A059]" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Duchowy Nawyk
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "Budzik Radiowy" : "Radio Alarm"}
                  </div>
                </div>
              </button>

              <button
                onClick={() => onOpenManagement("preferences")}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:bg-zinc-900"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  ⚙️
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Konfiguracja
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "Opcje Aplikacji" : "App Settings"}
                  </div>
                </div>
              </button>

              <button
                onClick={visualMode === "sabbath" ? undefined : onOpenStore}
                disabled={visualMode === "sabbath"}
                className={`flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all group shadow-2xl ${visualMode === "sabbath" ? "opacity-30 grayscale cursor-not-allowed bg-zinc-900 border-white/5" : "bg-zinc-900/60 border-[#C5A059]/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.1)]"}`}
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  🛒
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">
                    Wsparcie Misji
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "SKLEP CC" : "CC SHOP"}
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenYouTubeLiveModal}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:bg-zinc-900"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  🎬
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Multimedia
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl"
                      ? "Wideo i Transmisje"
                      : "Video & Live"}
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenReadingRoom}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-[#C5A059]/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all group shadow-2xl"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  📚
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">
                    {appLanguage === "pl" ? "Literatura" : "Literature"}
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "Książki CC" : "CC Books"}
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenGames}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/60 border border-[#C5A059]/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all group shadow-2xl"
              >
                <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all">
                  🎮
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">
                    {appLanguage === "pl" ? "Rozrywka" : "Entertainment"}
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">
                    {appLanguage === "pl" ? "Gry CC" : "CC Games"}
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenSmsSubscriptionModal}
                className="w-full py-8 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 font-black text-xs uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-4 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  ✉️
                </span>
                {appLanguage === "pl"
                  ? "SUBSKRYPCJA SMS - DUCHOWA INSPIRACJA"
                  : "SMS SUBSCRIPTION - SPIRITUAL INSPIRATION"}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-20 py-10 border-t border-white/5 bg-black/80 backdrop-blur-xl flex-shrink-0 relative z-20">
          <button
            onClick={() => setIsToolsOpen(false)}
            className="max-w-4xl mx-auto w-full py-5 bg-zinc-900 text-zinc-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2 active:scale-95"
          >
            {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>
      </div>

      {/* ================================== */}
      {/* MOBILE FULLSCREEN LANDSCAPE VIEWS  */}
      {/* ================================== */}
      {isLandscape && !isDesktop ? (
        <div
          className="fixed inset-0 z-[5000] bg-black flex overflow-hidden"
          onTouchStart={handleLandscapeTouchStart}
          onTouchEnd={handleLandscapeTouchEnd}
        >
          <div
            className="w-full h-full flex transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              transform: `translateX(${landscapeActiveCard === "verse" ? "0%" : "-100%"})`,
            }}
          >
            {/* Slide 1 - VERSE */}
            <div className="w-full h-full flex-shrink-0 relative overflow-y-auto no-scrollbar">
              {dailyVerse ? (
                renderDailyVerseMobile()
              ) : (
                <div className="py-20 animate-pulse text-[#C5A059] flex w-full h-full justify-center items-center font-black uppercase text-[10px]">
                  Ładowanie Słowa...
                </div>
              )}
            </div>

            {/* Slide 2 - RADIO */}
            <div className="w-full h-full flex-shrink-0 relative overflow-y-auto no-scrollbar">
              {renderRadioPlayerMobile()}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[6000] pointer-events-none">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${landscapeActiveCard === "verse" ? "bg-[#C5A059] w-6" : "bg-white/20"}`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${landscapeActiveCard === "radio" ? "bg-[#C5A059] w-6" : "bg-white/20"}`}
            />
          </div>
        </div>
      ) : (
        <>
          {/* MAIN CONTENT AREA */}
          <main
            className={`flex-grow w-full flex flex-col items-center justify-center px-5 relative transition-all duration-300 ${isLandscape && !isDesktop ? "pt-[60px] pb-[60px]" : isLandscape ? "pt-[304px] sm:pt-[284px] pb-[100px] sm:pb-[140px]" : "pt-[228px] sm:pt-[312px] pb-[340px] sm:pb-[280px]"} overflow-hidden`}
            onTouchStart={handleLandscapeTouchStart}
            onTouchEnd={handleLandscapeTouchEnd}
          >
            {(!isLandscape || isDesktop || landscapeActiveCard === "verse") &&
              (dailyVerse ? (
                <FloatingWidgetWrapper
                  id="daily_verse"
                  defaultWidth="90%"
                  defaultHeight="auto"
                  defaultY={250}
                  transparent
                  isStatic={isLandscape && !isDesktop}
                  lockHorizontal={isDesktop || !isLandscape}
                  closable={false}
                >
                  <div
                    className={`w-full h-full flex flex-col items-center justify-start text-center animate-fade-in transition-all duration-500 p-2 sm:p-6 relative ${isVerseElementGlowing ? "glowing-gold-border rounded-[2.5rem]" : ""}`}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                  >
                    <Separator
                      text={appLanguage === "pl" ? "SŁOWO BOŻE" : "WORD OF GOD"}
                      className="mb-3 sm:mb-6"
                    />

                    <div className="w-full h-full flex flex-col items-center justify-center py-2 sm:py-6 relative group/verse no-scrollbar">
                      <div
                        className={`text-white text-center leading-[1.2] sm:leading-[1.25] w-full px-2 transition-all duration-700 whitespace-pre-wrap break-normal [hyphens:none] cursor-pointer hover:opacity-80 ${!userPersona.dailyVerseConfig?.fontFamily || userPersona.dailyVerseConfig?.fontFamily === "lora" ? "font-bible" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isZenMode) {
                            setIsZenMode(false);
                            return;
                          }
                          handleCopyVerse();
                        }}
                        style={{
                          fontSize: userPersona?.dailyVerseConfig?.fontSize
                            ? `${userPersona.dailyVerseConfig.fontSize}px`
                            : verseFontSize,
                          fontFamily:
                            userPersona?.dailyVerseConfig?.fontFamily === "mono"
                              ? "var(--font-mono)"
                              : userPersona?.dailyVerseConfig?.fontFamily ===
                                  "serif"
                                ? "ui-serif, Georgia, serif"
                                : userPersona?.dailyVerseConfig?.fontFamily ===
                                    "sans"
                                  ? "ui-sans-serif, system-ui, sans-serif"
                                  : undefined,
                          textShadow:
                            "0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)",
                        }}
                      >
                        {splitVerseIntoLines(
                          dailyVerse.text,
                          dailyVerse.reference,
                        ).map((line, idx) => (
                          <p key={idx} className="mb-1 last:mb-0">
                            {idx === 0
                              ? `"${fixOrphans(line)}`
                              : fixOrphans(line)}
                            {idx ===
                            splitVerseIntoLines(
                              dailyVerse.text,
                              dailyVerse.reference,
                            ).length -
                              1
                              ? '"'
                              : ""}
                          </p>
                        ))}
                      </div>
                    </div>
                    {dailyVerse && (
                      <div className="mt-2 sm:mt-6 flex flex-col items-center gap-4 relative z-10 pointer-events-auto">
                        <div className="flex flex-col items-center gap-2 sm:gap-4 transition-all duration-300 w-full">
                          {!isVerseToolsVisible ? (
                            <button
                              aria-label="Otwórz Biblię"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsVerseToolsVisible(true);
                              }}
                              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-[#C5A059] hover:text-[#F2D08C] transition-all active:scale-90 shadow-xl border border-white/5 animate-fade-in"
                              title={
                                appLanguage === "pl"
                                  ? "Pokaż opcje wersetu"
                                  : "Show verse options"
                              }
                            >
                              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
                              <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
                                <button
                                  aria-label="Czytaj Biblię"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (dailyVerse) {
                                      onOpenDailyVerseModal(dailyVerse);
                                    }
                                  }}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F2D08C] hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                                  title={
                                    appLanguage === "pl"
                                      ? "Czytaj Biblię"
                                      : "Read Bible"
                                  }
                                >
                                  <BookText className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button
                                  aria-label="Kreator Wersetu"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVerseGeneratorOpen(true);
                                  }}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F2D08C] hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                                  title={
                                    appLanguage === "pl"
                                      ? "Kreator Wersetu"
                                      : "Verse Creator"
                                  }
                                >
                                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button
                                  aria-label="Ulubione werset"
                                  onClick={handleToggleVerseFavorite}
                                  className={`p-2 rounded-full transition-all active:scale-90 shadow-xl border border-white/5 ${isVerseFavorite ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"}`}
                                >
                                  <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isVerseFavorite ? "fill-current" : ""}`}
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
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      typeof window !== "undefined" &&
                                      "vibrate" in navigator
                                    ) {
                                      navigator.vibrate(10);
                                    }
                                    CommunityService.incrementGlobalCounter(
                                      "pray",
                                    ).catch((err) => console.error(err));

                                    const newAnimId =
                                      Date.now() + Math.random();
                                    const randomX =
                                      Math.floor(Math.random() * 20) - 10;
                                    setPlusAnimations((prev) => [
                                      ...prev,
                                      { id: newAnimId, x: randomX },
                                    ]);
                                    setTimeout(() => {
                                      setPlusAnimations((prev) =>
                                        prev.filter(
                                          (anim) => anim.id !== newAnimId,
                                        ),
                                      );
                                    }, 800);
                                  }}
                                  className="p-2 flex items-center justify-center gap-1 rounded-full transition-all active:scale-90 shadow-xl border border-white/5 bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-400 hover:text-white group relative"
                                  title={
                                    appLanguage === "pl"
                                      ? "Amen (modlitwa)"
                                      : "Amen (prayer)"
                                  }
                                >
                                  <span
                                    className="flex items-center justify-center text-[1rem] sm:text-[1.125rem] leading-none"
                                    role="img"
                                  >
                                    🙏
                                  </span>

                                  {plusAnimations.map((anim) => (
                                    <span
                                      key={anim.id}
                                      className="absolute top-0 text-green-400 font-extrabold text-[0.75rem] pointer-events-none z-50 animate-fly-up-plus drop-shadow-md"
                                      style={{
                                        left: `calc(50% + ${anim.x}px)`,
                                      }}
                                    >
                                      +
                                    </span>
                                  ))}

                                  {globalAmensCount > 0 && (
                                    <span className="text-[0.6875rem] sm:text-[0.8125rem] font-black text-white relative flex h-full items-center ml-1">
                                      +{globalAmensCount}
                                    </span>
                                  )}
                                </button>
                                <button
                                  onClick={handleShareAndCopy}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                                  title={
                                    appLanguage === "pl"
                                      ? "Udostępnij"
                                      : "Share"
                                  }
                                >
                                  <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </div>
                              <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currFonts = [
                                      "lora",
                                      "sans",
                                      "serif",
                                      "mono",
                                    ];
                                    const currFont =
                                      userPersona.dailyVerseConfig
                                        ?.fontFamily || "lora";
                                    const nextFont =
                                      currFonts[
                                        (currFonts.indexOf(currFont) + 1) %
                                          currFonts.length
                                      ];
                                    setUserPersona({
                                      ...userPersona,
                                      dailyVerseConfig: {
                                        ...userPersona.dailyVerseConfig,
                                        fontSize:
                                          userPersona.dailyVerseConfig
                                            ?.fontSize || 24,
                                        fontFamily: nextFont,
                                      },
                                    });
                                  }}
                                  className="p-2 ml-2 sm:ml-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                                  title={
                                    appLanguage === "pl"
                                      ? "Zmień czcionkę"
                                      : "Change font"
                                  }
                                >
                                  Tt
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentSize =
                                      userPersona?.dailyVerseConfig?.fontSize ||
                                      24;
                                    setUserPersona({
                                      ...userPersona,
                                      dailyVerseConfig: {
                                        ...userPersona.dailyVerseConfig,
                                        fontFamily:
                                          userPersona.dailyVerseConfig
                                            ?.fontFamily || "lora",
                                        fontSize: Math.max(12, currentSize - 2),
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                                  title={
                                    appLanguage === "pl"
                                      ? "Zmniejsz czcionkę"
                                      : "Decrease font size"
                                  }
                                >
                                  A-
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentSize =
                                      userPersona?.dailyVerseConfig?.fontSize ||
                                      24;
                                    setUserPersona({
                                      ...userPersona,
                                      dailyVerseConfig: {
                                        ...userPersona.dailyVerseConfig,
                                        fontFamily:
                                          userPersona.dailyVerseConfig
                                            ?.fontFamily || "lora",
                                        fontSize: Math.min(60, currentSize + 2),
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 shadow-xl border border-white/5 font-serif font-black text-[10px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
                                  title={
                                    appLanguage === "pl"
                                      ? "Zwiększ czcionkę"
                                      : "Increase font size"
                                  }
                                >
                                  A+
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 pt-2 inline-block pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isZenMode) {
                              setIsZenMode(false);
                              return;
                            }
                            if (!hasLongPressed.current)
                              onOpenDailyVerseModal(dailyVerse);
                          }}
                          title={
                            appLanguage === "pl"
                              ? "Przeczytaj cały werset"
                              : "Read full verse"
                          }
                        >
                          <Separator
                            text={normalizeBibleReference(
                              dailyVerse.reference,
                              appLanguage,
                            )}
                            className="opacity-90 scale-90 sm:scale-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FloatingWidgetWrapper>
              ) : (
                <div className="py-20 animate-pulse text-[#C5A059] font-black uppercase text-[0.625rem]">
                  Ładowanie Słowa...
                </div>
              ))}

            {/* Panel radiowy pod wersetem dnia - ZAKOTWICZONY NA DOLE */}

            {dailyVerse && (
              <VerseImageGeneratorModal
                isOpen={isVerseGeneratorOpen}
                onClose={() => setIsVerseGeneratorOpen(false)}
                verse={dailyVerse}
                appLanguage={appLanguage}
                addToast={addToast || (() => {})}
                isTickerExpanded={isTickerExpanded}
              />
            )}

            {!showMatrix &&
              (!isLandscape ||
                isDesktop ||
                landscapeActiveCard === "radio") && (
                <FloatingWidgetWrapper
                  id="radio_player"
                  defaultWidth="100%"
                  defaultHeight="auto"
                  defaultX={isLandscape ? undefined : 0}
                  defaultY={
                    isLandscape
                      ? window.innerHeight - 150
                      : window.innerHeight - 300
                  }
                  transparent={true}
                  isStatic={isLandscape && !isDesktop}
                  lockHorizontal={isDesktop || !isLandscape}
                  closable={false}
                >
                  <div
                    className={`w-full flex flex-col items-center gap-4 sm:gap-8 transition-all p-4 duration-700 ${isVerseToolsVisible && !isDesktop ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}
                  >
                    {/* Sekcja Play: Wysokość stała 90px */}
                    <div
                      className={`${isLandscape ? "h-[55px] gap-6" : "h-[90px] gap-4 sm:gap-10"} flex items-center justify-center transition-transform`}
                    >
                      <button
                        aria-label="Udostępnij"
                        onClick={onShareRadio}
                        className={`rounded-full bg-zinc-900 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/10 transition-all w-8 h-8 sm:w-12 sm:h-12 shadow-[0_0_10px_rgba(197,160,89,0.2)]`}
                        title={
                          appLanguage === "pl"
                            ? "Udostępnij Stację"
                            : "Share Station"
                        }
                      >
                        <Share2 className="w-4 h-4 sm:w-6 sm:h-6" />
                      </button>

                      <button
                        aria-label="Ulubione"
                        onClick={handlePrevStream}
                        className={`${isLandscape ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-zinc-900/80 backdrop-blur-md border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/60 transition-all shadow-lg group`}
                      >
                        <svg
                          className={`${isLandscape ? "w-5 h-5" : "w-6 h-6"} drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]`}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 20L9 12L19 4V20Z"
                            fill="currentColor"
                            className="group-hover:fill-[#F2D08C] transition-colors"
                          />
                          <path
                            d="M5 19V5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="group-hover:stroke-[#F2D08C] transition-colors"
                          />
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          onPointerDown={handlePointerDownPlayButton}
                          onPointerUp={handlePointerUpPlayButton}
                          onPointerLeave={handlePointerLeavePlayButton}
                          onClick={() => {
                            if (hasLongPressedRadioRef.current) {
                              hasLongPressedRadioRef.current = false;
                              return;
                            }
                            nativeService.hapticImpact(ImpactStyle.Heavy);
                            onToggleRadio();
                          }}
                          className={`relative ${isLandscape ? "w-14 h-14" : "w-20 h-20"} rounded-full flex items-center justify-center transition-all duration-500 border-[3px] bg-black ${isRadioPlaying ? "border-red-600 scale-105 shadow-[0_0_50px_rgba(220,38,38,0.8)]" : "border-[#C5A059]/50 active:scale-95 hover:border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.3)]"}`}
                        >
                          {/* Efekt ładowania (kręcący się pierścień) */}
                          {isBuffering && (
                            <div className="absolute inset-[-3px] rounded-full border-[3px] border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin z-20 pointer-events-none"></div>
                          )}

                          {/* Opcjonalny puls tła podczas ładowania */}
                          {isBuffering && (
                            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse pointer-events-none"></div>
                          )}
                          {isRadioPlaying ? (
                            <div className="flex gap-1.5 z-10">
                              <div className="w-1.5 h-6 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(220,38,38,1)]"></div>
                              <div className="w-1.5 h-6 bg-red-600 rounded-full animate-pulse delay-150 shadow-[0_0_20px_rgba(220,38,38,1)]"></div>
                            </div>
                          ) : (
                            <div className="relative ml-1.5 z-10">
                              <Play
                                className={`${isLandscape ? "w-7 h-7" : "w-10 h-10"} text-[#C5A059] fill-current drop-shadow-[0_0_15px_rgba(197,160,89,0.6)]`}
                              />
                            </div>
                          )}
                        </button>
                      </div>
                      <button
                        aria-label="Ulubione"
                        onClick={handleNextStream}
                        className={`${isLandscape ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-zinc-900/80 backdrop-blur-md border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/60 transition-all shadow-lg group`}
                      >
                        <svg
                          className={`${isLandscape ? "w-5 h-5" : "w-6 h-6"} drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]`}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 4L15 12L5 20V4Z"
                            fill="currentColor"
                            className="group-hover:fill-[#F2D08C] transition-colors"
                          />
                          <path
                            d="M19 5V19"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="group-hover:stroke-[#F2D08C] transition-colors"
                          />
                        </svg>
                      </button>

                      <div className="relative flex items-center gap-2">
                        {/* WhatsApp Button */}
                        <a
                          href="https://chat.whatsapp.com/CLd4fzbTES72scbIZLccbx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-black border border-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.5)] flex items-center justify-center active:scale-90 hover:scale-110 transition-all w-8 h-8 sm:w-12 sm:h-12 overflow-hidden z-20"
                          title={
                            appLanguage === "pl"
                              ? "Dołącz do Czatu"
                              : "Join Chat"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={CENTRUM_LOGO_URL}
                            alt="WhatsApp"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </a>
                      </div>
                    </div>

                    {!isRdsVisible && (
                      <div className="w-full flex justify-center mt-3 z-20 relative">
                        <button
                          onClick={() => {
                            setIsRdsVisible((prev) => {
                              const next = !prev;
                              if (typeof window !== "undefined") {
                                localStorage.setItem(
                                  "cc_rds_visible",
                                  String(next),
                                );
                              }
                              return next;
                            });
                          }}
                          className={`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-lg bg-[#C5A059]/5 border-white/5 text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10`}
                        >
                          <RadioIcon className="w-3 h-3" /> Odtwarzacz RDS
                        </button>
                      </div>
                    )}
                    <div
                      className={`w-full flex justify-center px-4 sm:px-6 transition-all duration-500 overflow-visible ${isRdsVisible ? (isLandscape ? "h-[42px] mt-2 opacity-100" : "h-[56px] mt-2 opacity-100 scale-y-100") : "h-0 mt-0 opacity-0 scale-y-0 pointer-events-none"}`}
                    >
                      <div
                        className={`${isLandscape ? "h-[42px] max-w-none" : "h-[56px] max-w-[460px] sm:max-w-none"} w-full relative flex items-center bg-zinc-950 border border-white/10 rounded-full shadow-2xl transition-transform`}
                      >
                        {showVolumeSlider && (
                          <div
                            ref={volumeSliderRef}
                            className="absolute bottom-full left-0 right-0 mb-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-5">
                              {/* Volume Section */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-[#C5A059]" />
                                    <span className="text-[10px] font-bold text-[#C5A059]/60 uppercase tracking-widest">
                                      Głośność Główna
                                    </span>
                                  </div>
                                  <span className="text-xs font-black text-[#C5A059] tabular-nums">
                                    {Math.round(volume * 100)}%
                                  </span>
                                </div>
                                <div className="relative flex items-center group">
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      onVolumeChange(val);
                                      if (val > 0) setPreMuteVolume(val);
                                    }}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                                  />
                                </div>
                              </div>

                              {/* Spatial Modes Section */}
                              <div className="space-y-3">
                                <button
                                  aria-label="Ulubione"
                                  onClick={() =>
                                    setExpandedSection(
                                      expandedSection === "spatial"
                                        ? "none"
                                        : "spatial",
                                    )
                                  }
                                  className="w-full flex items-center justify-between group/title"
                                >
                                  <div className="flex items-center gap-2">
                                    <Waves
                                      className={`w-4 h-4 transition-colors ${expandedSection === "spatial" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                                    />
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${expandedSection === "spatial" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                                    >
                                      Tryb Przestrzenny
                                    </span>
                                  </div>
                                  <div
                                    className={`w-4 h-4 transition-transform duration-300 ${expandedSection === "spatial" ? "rotate-180 text-[#C5A059]" : "text-zinc-600"}`}
                                  >
                                    <svg
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </button>

                                {expandedSection === "spatial" && (
                                  <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {spatialModes.map((mode) => {
                                      const Icon = mode.icon;
                                      const isActive = spatialMode === mode.id;
                                      return (
                                        <button
                                          key={mode.id}
                                          onClick={() =>
                                            onSpatialModeChange(
                                              mode.id as SpatialMode,
                                            )
                                          }
                                          className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all duration-300 ${
                                            isActive
                                              ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                              : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-[#C5A059]/30 hover:text-[#C5A059]/70"
                                          }`}
                                        >
                                          <Icon
                                            className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`}
                                          />
                                          <span className="text-[9px] font-bold uppercase tracking-tighter">
                                            {appLanguage === "pl"
                                              ? mode.pl
                                              : mode.en}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Equalizer Section */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <button
                                    aria-label="Ulubione"
                                    onClick={() =>
                                      setExpandedSection(
                                        expandedSection === "equalizer"
                                          ? "none"
                                          : "equalizer",
                                      )
                                    }
                                    className="flex items-center gap-2 group/title"
                                  >
                                    <Music
                                      className={`w-4 h-4 transition-colors ${expandedSection === "equalizer" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                                    />
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${expandedSection === "equalizer" ? "text-[#C5A059]" : "text-zinc-500 group-hover/title:text-[#C5A059]/70"}`}
                                    >
                                      Korektor Graficzny
                                    </span>
                                    <div
                                      className={`w-3 h-3 transition-transform duration-300 ${expandedSection === "equalizer" ? "rotate-180 text-[#C5A059]" : "text-zinc-600"}`}
                                    >
                                      <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </div>
                                  </button>
                                  {expandedSection === "equalizer" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEqualizerChange({
                                          low: 0,
                                          midLow: 0,
                                          mid: 0,
                                          midHigh: 0,
                                          high: 0,
                                        });
                                      }}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 transition-all group/reset"
                                      title="Resetuj Korektor"
                                    >
                                      <RotateCcw className="w-3 h-3 text-zinc-500 group-hover/reset:text-[#C5A059] transition-colors" />
                                      <span className="text-[8px] font-bold text-zinc-500 group-hover/reset:text-[#C5A059] uppercase tracking-tighter">
                                        Reset
                                      </span>
                                    </button>
                                  )}
                                </div>

                                {expandedSection === "equalizer" && (
                                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                                    <div className="relative bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden">
                                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <EqualizerGraph
                                          equalizer={equalizer}
                                          className="w-full h-full bg-transparent border-none p-0 mb-0"
                                        />
                                      </div>
                                      <div className="flex justify-between items-end h-32 gap-2 px-1 relative z-10">
                                        {(
                                          [
                                            "low",
                                            "midLow",
                                            "mid",
                                            "midHigh",
                                            "high",
                                          ] as const
                                        ).map((band) => (
                                          <div
                                            key={band}
                                            className="flex-1 flex flex-col items-center gap-3 h-full"
                                          >
                                            <div className="relative flex-1 w-full flex justify-center items-center group/slider">
                                              {/* Vertical Track Background */}
                                              <div className="absolute w-1 h-full bg-zinc-900 rounded-full border border-white/5"></div>
                                              <input
                                                type="range"
                                                min="-12"
                                                max="12"
                                                step="0.5"
                                                value={equalizer[band]}
                                                onChange={(e) => {
                                                  onEqualizerChange({
                                                    ...equalizer,
                                                    [band]: parseFloat(
                                                      e.target.value,
                                                    ),
                                                  });
                                                }}
                                                className="absolute w-28 h-1 bg-transparent appearance-none cursor-pointer accent-[#C5A059] -rotate-90 z-10"
                                                style={{
                                                  WebkitAppearance: "none",
                                                  background: "transparent",
                                                }}
                                              />
                                              {/* Custom Thumb Glow Effect */}
                                              <div
                                                className="absolute w-3 h-3 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059] pointer-events-none transition-all duration-200"
                                                style={{
                                                  bottom: `${((equalizer[band] + 12) / 24) * 100}%`,
                                                  transform: "translateY(50%)",
                                                }}
                                              ></div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                              <span className="text-[8px] font-black text-[#C5A059] tabular-nums mb-0.5">
                                                {equalizer[band] > 0
                                                  ? `+${equalizer[band]}`
                                                  : equalizer[band]}
                                                dB
                                              </span>
                                              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-tighter text-center">
                                                {band === "low"
                                                  ? "60Hz"
                                                  : band === "midLow"
                                                    ? "250Hz"
                                                    : band === "mid"
                                                      ? "1kHz"
                                                      : band === "midHigh"
                                                        ? "4kHz"
                                                        : "12kHz"}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  aria-label="Głośność"
                                  onClick={handleMuteToggle}
                                  className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-white/5 transition-all text-[10px] font-bold uppercase tracking-widest text-[#C5A059]/80"
                                >
                                  {volume === 0 ? (
                                    <>
                                      <VolumeX className="w-3.5 h-3.5" /> Wyłącz
                                      wyciszenie
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5" /> Wycisz
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => setShowVolumeSlider(false)}
                                  className="px-4 py-2.5 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 rounded-xl border border-red-600/20 transition-all text-[10px] font-bold uppercase tracking-widest text-red-500"
                                >
                                  Zamknij
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Balanced layout to prevent overlap and keep text centered */}
                        <div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-start pl-3 gap-2 z-10">
                          <button
                            aria-label="YouTube"
                            onClick={() => window.open(ytUrl, "_blank")}
                            className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6 shrink-0"
                            title="YouTube"
                          >
                            <svg
                              className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRdsVisible((prev) => {
                                const next = !prev;
                                if (typeof window !== "undefined") {
                                  localStorage.setItem(
                                    "cc_rds_visible",
                                    String(next),
                                  );
                                }
                                return next;
                              });
                            }}
                            className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all h-5 px-1.5 rounded border text-[7px] font-black uppercase tracking-widest shrink-0 ${isRdsVisible ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/30 shadow-[0_0_8px_rgba(197,160,89,0.2)]" : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500"}`}
                            title="Toggle RDS"
                          >
                            RDS
                          </button>

                          {isRadioPlaying && (
                            <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap bg-zinc-950/80 backdrop-blur-md relative z-10 pl-1 pr-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]"></div>
                              <span className="text-[9px] font-black text-red-500 tracking-tighter">
                                LIVE
                              </span>
                              <span className="text-[9px] font-black text-zinc-800 ml-1">
                                |
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 h-full relative flex items-center overflow-hidden">
                          <div
                            className={`w-full flex ${rdsText.length > 15 ? "justify-start" : "justify-center"} ${showVolumeSlider ? "opacity-0" : "opacity-100"} cursor-pointer hover:opacity-80 transition-opacity duration-500`}
                            onClick={handleRdsTextClick}
                          >
                            <p
                              className={`${getRdsTextClass("normal")} transition-all duration-300 font-medium text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] uppercase tracking-[0.2em] whitespace-nowrap ${rdsText.length > 15 ? "animate-marquee" : "text-center"}`}
                              style={
                                rdsText.length > 15
                                  ? {
                                      animationDuration: `${rdsText.length * 0.4}s`,
                                    }
                                  : {}
                              }
                            >
                              {rdsText.length > 15 ? (
                                <>
                                  <span>
                                    {rdsText}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                  <span>
                                    {rdsText}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                </>
                              ) : (
                                rdsText
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-end pr-3 z-10 gap-2">
                          <div className="relative flex items-center">
                            <button
                              aria-label="Głośność"
                              onClick={() =>
                                setShowVolumeSlider(!showVolumeSlider)
                              }
                              className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-9 h-9 rounded-full ${showVolumeSlider ? "bg-[#C5A059]/20 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)]" : spatialMode !== "none" ? "text-[#C5A059]" : "text-zinc-400 hover:text-white"}`}
                              title="Głośność i Efekty"
                            >
                              {volume === 0 ? (
                                <VolumeX
                                  className={`w-5 h-5 ${spatialMode !== "none" ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]" : ""}`}
                                />
                              ) : (
                                <Volume2
                                  className={`w-5 h-5 ${spatialMode !== "none" ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]" : ""}`}
                                />
                              )}
                            </button>
                          </div>
                          <button
                            aria-label="Spotify"
                            onClick={() => window.open(spotifyUrl, "_blank")}
                            className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6"
                            title="Spotify"
                          >
                            <svg
                              className="w-4 h-4 text-green-500 fill-current relative z-10 drop-shadow-[0_0_5_rgba(34,197,94,0.5)]"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.367-.703.483-1.07.26-2.99-1.828-6.753-2.243-11.187-1.233-.42.097-.84-.167-.937-.587-.097-.42.167-.84.587-.937 4.863-1.11 9.01-.633 12.347 1.407.367.223.483.703.26 1.07zm1.47-3.26c-.28.455-.878.6-1.333.32-3.42-2.103-8.633-2.713-12.68-1.483-.512.155-1.046-.135-1.201-.647-.155-.512.135-1.046.647-1.201 4.627-1.403 10.373-.727 14.247 1.653.455.28.6.878.32 1.333zm.143-3.357c-4.1-2.433-10.853-2.66-14.747-1.48-.63.19-1.297-.163-1.487-.793-.19-.63.163-1.297.793-1.487 4.493-1.363 11.96-1.097 16.687 1.707.567.337.753 1.067.417 1.633-.337.567-1.067.753-1.633.417z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Linia (Przycisk Panelu Samochodowego): WYŁĄCZONY DO ODWOŁANIA
            <button
              onClick={() => onMatrixToggle(true)}
              className="w-full h-[50px] flex items-center justify-center transition-opacity group"
            >
              <div
                className={`w-12 h-[3px] rounded-full transition-all group-hover:w-20 ${showMatrix ? "bg-zinc-700" : "bg-[#00FF41] shadow-[0_0_15px_#00FF41] animate-pulse"}`}
              ></div>
            </button>
            */}
                  </div>
                </FloatingWidgetWrapper>
              )}

            {isLandscape && !isDesktop && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 pointer-events-none">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${landscapeActiveCard === "verse" ? "bg-[#C5A059] w-4" : "bg-white/20"}`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${landscapeActiveCard === "radio" ? "bg-[#C5A059] w-4" : "bg-white/20"}`}
                />
              </div>
            )}
          </main>
        </>
      )}
      {/* Matrix Panel */}
      <div
        className={`fixed inset-x-0 mx-auto w-full bg-black border-y border-[#C5A059]/40 transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) overflow-hidden z-[2000]
          ${showMatrix ? (isLandscape ? "inset-0 opacity-100 p-4 sm:p-10 scale-100 z-[9000]" : "top-[84px] sm:top-[152px] bottom-[56px] opacity-100 p-6 sm:p-10 scale-100") : "bottom-[-120%] opacity-0 scale-95 pointer-events-none"}`}
        onClick={() => onMatrixToggle(false)}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-between space-y-2 sm:space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row gap-2 sm:gap-6 animate-fade-in w-full">
            <SpectrumAnalyzer active={isRadioPlaying} label="CHANNEL-LEFT" />
            <SpectrumAnalyzer active={isRadioPlaying} label="CHANNEL-RIGHT" />
          </div>
          <div className="w-full flex flex-col items-center gap-3 sm:gap-4 pt-1 sm:pt-4">
            <div className="flex items-center gap-5 sm:gap-10">
              <button
                aria-label="Ulubione"
                onClick={handlePrevStream}
                className={`rounded-full bg-zinc-900 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/10 transition-all w-10 h-10 sm:w-16 sm:h-16`}
              >
                <svg
                  className="w-5 h-5 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                aria-label="Odtwarzaj"
                onClick={handleToggleRadioWithLoading}
                className={`relative rounded-full flex items-center justify-center transition-all duration-500 border-4 bg-black shadow-2xl w-24 h-24 sm:w-32 sm:h-32 
                          ${isToggleLoading ? "animate-loading-snake border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)]" : isRadioPlaying ? "border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)]" : "border-[#C5A059]/40 hover:border-[#C5A059]"}`}
              >
                {/* Efekt ładowania (kręcący się pierścień) */}
                {isBuffering && (
                  <div className="absolute inset-[-4px] rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin z-20 pointer-events-none"></div>
                )}

                {/* Opcjonalny puls tła podczas ładowania */}
                {isBuffering && (
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse pointer-events-none"></div>
                )}

                {isRadioPlaying ? (
                  <div className={`flex gap-2 sm:gap-3`}>
                    <div
                      className={`bg-[#C5A059] rounded-full animate-pulse w-2 sm:w-3 h-8 sm:h-12`}
                    ></div>
                    <div
                      className={`bg-[#C5A059] rounded-full animate-pulse delay-75 w-2 sm:w-3 h-8 sm:h-12`}
                    ></div>
                  </div>
                ) : (
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 text-[#C5A059] fill-current ml-1.5 z-10" />
                )}
              </button>
              <button
                aria-label="Ulubione"
                onClick={handleNextStream}
                className={`rounded-full bg-zinc-900 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] active:scale-90 hover:bg-[#C5A059]/10 transition-all w-10 h-10 sm:w-16 sm:h-16`}
              >
                <svg
                  className="w-5 h-5 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {!isRdsVisible && (
              <div className="w-full flex justify-center mt-4 z-20 relative">
                <button
                  onClick={() => {
                    setIsRdsVisible((prev) => {
                      const next = !prev;
                      if (typeof window !== "undefined") {
                        localStorage.setItem("cc_rds_visible", String(next));
                      }
                      return next;
                    });
                  }}
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg bg-[#C5A059]/5 border-white/5 text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10`}
                >
                  <RadioIcon className="w-3.5 h-3.5" /> Odtwarzacz RDS
                </button>
              </div>
            )}
            <div
              className={`w-full flex justify-center px-4 sm:px-6 transition-all duration-500 overflow-visible ${isRdsVisible ? "h-[64px] mt-6 opacity-100 scale-y-100" : "h-0 mt-0 opacity-0 scale-y-0 pointer-events-none"}`}
            >
              <div className="w-full max-w-5xl h-[64px] relative flex items-center bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/10 shadow-2xl overflow-hidden rounded-full">
                {/* Balanced layout to prevent overlap and keep text centered */}
                <div className="w-32 flex-shrink-0 flex-grow-0 flex items-center justify-start pl-3 gap-3 z-10">
                  <button
                    aria-label="YouTube"
                    onClick={() => window.open(ytUrl, "_blank")}
                    className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-8 h-8 sm:w-10 sm:h-10 shrink-0"
                    title="YouTube"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 h-6 text-red-600 fill-current relative z-10 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRdsVisible((prev) => {
                        const next = !prev;
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cc_rds_visible", String(next));
                        }
                        return next;
                      });
                    }}
                    className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all h-6 sm:h-7 px-2 rounded border text-[8px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 ${isRdsVisible ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/30 shadow-[0_0_8px_rgba(197,160,89,0.2)]" : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500"}`}
                    title="Toggle RDS"
                  >
                    RDS
                  </button>

                  {isRadioPlaying && (
                    <div className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap bg-zinc-950/80 backdrop-blur-md relative z-10 pl-2 pr-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]"></div>
                      <span className="text-[11px] font-black text-red-500 tracking-widest">
                        LIVE
                      </span>
                      <span className="text-[11px] font-black text-zinc-800 ml-1">
                        |
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 h-full relative flex items-center overflow-hidden">
                  {showVolumeSlider ? (
                    <div
                      className="absolute inset-0 flex items-center px-6 bg-transparent animate-fade-in z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Volume2 className="w-6 h-6 text-[#C5A059] mr-4 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) =>
                          onVolumeChange(parseFloat(e.target.value))
                        }
                        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      />
                      <span className="ml-4 text-[14px] font-bold text-[#C5A059] w-12 tabular-nums">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  ) : null}
                  <div
                    className={`w-full flex ${rdsText.length > 15 ? "justify-start" : "justify-center"} ${showVolumeSlider ? "opacity-0" : "opacity-100"} cursor-pointer hover:opacity-80 transition-opacity duration-500`}
                    onClick={handleRdsTextClick}
                  >
                    <p
                      className={`${getRdsTextClass("large")} transition-all duration-300 font-black text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] uppercase tracking-[0.3em] whitespace-nowrap ${rdsText.length > 15 ? "animate-marquee" : "text-center"}`}
                      style={
                        rdsText.length > 15
                          ? { animationDuration: `${rdsText.length * 0.4}s` }
                          : {}
                      }
                    >
                      {rdsText.length > 15 ? (
                        <>
                          <span>
                            {rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                          <span>
                            {rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                        </>
                      ) : (
                        rdsText
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-32 flex-shrink-0 flex-grow-0 flex items-center justify-end pr-3 z-10 gap-3">
                  <div className="relative flex items-center">
                    <button
                      aria-label="Głośność"
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      className={`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-8 h-8 sm:w-10 sm:h-10 ${showVolumeSlider ? "text-[#C5A059]" : "text-zinc-400 hover:text-white"}`}
                      title="Głośność"
                    >
                      {volume === 0 ? (
                        <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </button>
                  </div>
                  <button
                    aria-label="Spotify"
                    onClick={() => window.open(spotifyUrl, "_blank")}
                    className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-8 h-8 sm:w-10 sm:h-10"
                    title="Spotify"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 h-6 text-green-500 fill-current relative z-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.367-.703.483-1.07.26-2.99-1.828-6.753-2.243-11.187-1.233-.42.097-.84-.167-.937-.587-.097-.42.167-.84.587-.937 4.863-1.11 9.01-.633 12.347 1.407.367.223.483.703.26 1.07zm1.47-3.26c-.28.455-.878.6-1.333.32-3.42-2.103-8.633-2.713-12.68-1.483-.512.155-1.046-.135-1.201-.647-.155-.512.135-1.046.647-1.201 4.627-1.403 10.373-.727 14.247 1.653.455.28.6.878.32 1.333zm.143-3.357c-4.1-2.433-10.853-2.66-14.747-1.48-.63.19-1.297-.163-1.487-.793-.19-.63.163-1.297.793-1.487 4.493-1.363 11.96-1.097 16.687 1.707.567.337.753 1.067.417 1.633-.337.567-1.067.753-1.633.417z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => onMatrixToggle(false)}
              className={`flex items-center justify-center transition-all duration-500 hover:opacity-80 w-16 h-4`}
            >
              <div
                className={`rounded-full transition-all duration-700 w-12 h-1 bg-zinc-600`}
              ></div>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 sm:gap-4 py-2 sm:py-4 border-y border-white/5 w-full">
            <div className="flex items-center bg-zinc-900 border border-white/10 rounded-full p-1.5 sm:p-2.5 shadow-3xl">
              <button
                onClick={() => onSwitchStream("PL")}
                className={`px-4 sm:px-12 py-3 sm:py-6 rounded-full text-[9px] sm:text-sm font-black uppercase tracking-[0.2em] transition-all ${activeStream === "PL" ? "bg-[#C5A059] text-white shadow-2xl scale-110" : "text-zinc-500 hover:text-white"}`}
              >
                POLSKA
              </button>
              <button
                onClick={() => onSwitchStream("GLOBAL")}
                className={`px-4 sm:px-12 py-3 sm:py-6 rounded-full text-[9px] sm:text-sm font-black uppercase tracking-[0.2em] transition-all ${activeStream === "GLOBAL" ? "bg-[#C5A059] text-white shadow-2xl scale-110" : "text-zinc-500 hover:text-white"}`}
              >
                GLOBAL
              </button>
              <button
                onClick={() => onSwitchStream("BIBLIA")}
                className={`px-4 sm:px-12 py-3 sm:py-6 rounded-full text-[9px] sm:text-sm font-black uppercase tracking-[0.2em] transition-all ${activeStream === "BIBLIA" ? "bg-[#C5A059] text-white shadow-2xl scale-110" : "text-zinc-500 hover:text-white"}`}
              >
                BIBLIA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
            <button
              onClick={() => window.open(SHOP_URL, "_blank")}
              className="py-3 sm:py-8 glass-gold border-[#C5A059]/50 text-[#C5A059] font-black text-[10px] sm:text-lg uppercase tracking-[0.3em] rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl hover:bg-black/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🛍️</span> {t("radio.shop")}
            </button>
            <a
              href={`tel:${HOTLINE_NADZIEJA_NUMBER.replace(/\s/g, "")}`}
              className="py-3 sm:py-8 bg-blue-700/80 backdrop-blur-md text-white font-black text-[10px] sm:text-lg uppercase tracking-[0.3em] rounded-[1.5rem] sm:rounded-[2.5rem] text-center shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center active:scale-95 gap-2 border border-blue-400/30"
            >
              <span>📞</span> {t("radio.hotline")}
            </a>
          </div>

          <div className="grid grid-cols-5 gap-2 py-2 border-y border-white/5 w-full px-2">
            <button
              onClick={onShareRadio}
              title={t("common.share")}
              className="py-3 sm:py-5 bg-zinc-900 border border-zinc-800 text-[#C5A059] rounded-2xl shadow-xl hover:bg-black/40 hover:border-[#C5A059] transition-all active:scale-90 flex items-center justify-center"
            >
              <Share className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={onOpenBusinessCard}
              title={appLanguage === "pl" ? "Wizytówka" : "Business Card"}
              className="py-3 sm:py-5 bg-zinc-900 border border-zinc-800 text-[#C5A059] rounded-2xl shadow-xl hover:bg-black/40 hover:border-[#C5A059] transition-all active:scale-90 flex items-center justify-center"
            >
              <Contact className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              aria-label="Ulubione"
              onClick={handleBluetoothClick}
              title="BLUETOOTH"
              className="py-3 sm:py-5 bg-zinc-900 border border-zinc-800 text-[#C5A059] rounded-2xl shadow-xl hover:bg-black/40 hover:border-[#C5A059] transition-all active:scale-90 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-bluetooth w-6 h-6 sm:w-8 sm:h-8"
              >
                <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>
              </svg>
            </button>
            <button
              onClick={handleChromecastClick}
              title="CHROMECAST"
              className={`py-3 sm:py-5 border rounded-2xl shadow-xl transition-all active:scale-90 flex items-center justify-center relative ${castState.isConnected ? "bg-[#C5A059] text-white border-[#C5A059]" : "bg-zinc-900 border-zinc-800 text-[#C5A059] hover:bg-black/40 hover:border-[#C5A059]"}`}
            >
              <Cast className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
              {castState.isConnected && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button
              aria-label="Ulubione"
              onClick={handleHomeClick}
              title="HOME / CENTRUM"
              className="py-3 sm:py-5 bg-zinc-900 border border-zinc-800 text-[#C5A059] rounded-2xl shadow-xl hover:bg-black/40 hover:border-[#C5A059] transition-all active:scale-90 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 sm:w-7 sm:h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={onOpenSupport}
            className="w-full py-3.5 sm:py-9 bg-zinc-900 border border-white/10 text-white font-black text-[12px] sm:text-xl uppercase tracking-[0.3em] rounded-[1.5rem] sm:rounded-[3rem] shadow-[0_20px_60px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 sm:gap-5 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <svg
              className="w-5 h-5 sm:w-10 sm:h-10 fill-current text-red-600 group-hover:scale-125 transition-transform relative z-10"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="relative z-10">{t("radio.support")}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 sm:py-6 bg-gold/90 hover:bg-gold transition-all active:scale-95 text-black font-black text-[10px] sm:text-sm uppercase tracking-[0.4em] border-t border-black/10 flex flex-col items-center gap-1"
          >
            <span className="text-[8px] sm:text-[10px] opacity-60 font-bold">
              SOLI DEO GLORIA
            </span>
            <span>
              {appLanguage === "pl" ? "ZAMKNIJ PANEL" : "CLOSE PANEL"}
            </span>
          </button>
        </div>
      </div>

      {/* FIXED GLOBAL FOOTER */}
      <footer
        className={`fixed bottom-0 left-0 right-0 w-full transition-all duration-700 z-[1700] flex justify-center items-end pointer-events-none ${isZenMode ? "opacity-0 translate-y-full" : "opacity-100 translate-y-0"}`}
      >
        {!isFooterExpanded ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFooterExpanded(true);
            }}
            className={`pointer-events-auto p-3 flex items-center justify-center group mb-1 sm:mb-2 transition-all`}
          >
            <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8 text-[#C5A059]/80 group-hover:text-[#C5A059] group-hover:scale-110 transition-all drop-shadow-xl" />
          </button>
        ) : (
          <div className="w-full bg-gold backdrop-blur-md py-4 text-[8px] border-t border-black/10 shadow-2xl pointer-events-auto flex items-center justify-between px-4 sm:px-8 relative h-14 sm:h-16">
            <div className="flex items-center gap-2 z-10 w-1/3"></div>

            <div className="w-1/3 flex justify-center z-0 overflow-hidden">
              <div className="whitespace-nowrap text-center font-bold text-black uppercase tracking-widest sm:tracking-[0.5em] opacity-80 truncate text-[8px] sm:text-[10px]">
                SOLI DEO GLORIA
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-1/3 z-10 relative">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLeftFooterGroupOpen(!isLeftFooterGroupOpen);
                    if (isRightFooterGroupOpen)
                      setIsRightFooterGroupOpen(false);
                  }}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all flex items-center justify-center gap-1 border shadow-xl ${isLeftFooterGroupOpen ? "bg-black text-[#C5A059] border-[#C5A059]/20" : "bg-black/10 border-black/5 hover:bg-black/20"}`}
                  title={appLanguage === "pl" ? "System" : "System"}
                >
                  <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                  <span className="text-[10px] sm:text-xs font-black uppercase hidden sm:inline text-black">
                    SYS
                  </span>
                </button>

                {isLeftFooterGroupOpen && (
                  <div className="absolute bottom-full right-0 mb-2 p-2 bg-black/90 backdrop-blur-md border border-[#C5A059]/30 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[120px] animate-fade-in origin-bottom-right">
                    {/* ZEN MODE TOGGLE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZenMode(!isZenMode);
                        setIsLeftFooterGroupOpen(false);
                      }}
                      className={`w-full px-3 py-2 bg-black/50 ${isZenMode ? "text-white" : "text-[#C5A059]"} rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-[#C5A059]/10 flex items-center justify-center gap-2`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-[#C5A059] ${isZenMode ? "animate-pulse shadow-[0_0_8px_#C5A059]" : ""}`}
                      ></div>
                      ZEN
                    </button>

                    {/* CC OS Trigger Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTaskbar?.();
                        setIsLeftFooterGroupOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-black/50 text-[#C5A059] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-[#C5A059]/10 flex items-center justify-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#C5A059] group-hover:shadow-[0_0_8px_#C5A059]"></div>
                      OS
                    </button>

                    {/* Radio Player Widget Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isVisible =
                          localStorage.getItem(
                            "cc_widget_radio_player_visible",
                          ) !== "false";
                        localStorage.setItem(
                          "cc_widget_radio_player_visible",
                          isVisible ? "false" : "true",
                        );
                        window.dispatchEvent(new Event("cc_widgets_updated"));
                        setIsLeftFooterGroupOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-black/50 text-[#C5A059] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all border border-[#C5A059]/10 flex items-center justify-center gap-2"
                    >
                      <RadioIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#C5A059]" />
                      RADIO
                    </button>
                  </div>
                )}
              </div>

              {installStatus !== "installed" && (
                <button
                  aria-label="Pobierz"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInstallClick?.();
                  }}
                  className="px-2 py-1.5 sm:px-3 bg-black text-white rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-xl border border-white/10 flex items-center justify-center gap-1.5 shrink-0 animate-pulse"
                  title={
                    installStatus === "update"
                      ? appLanguage === "pl"
                        ? "AKTUALIZUJ"
                        : "UPDATE"
                      : appLanguage === "pl"
                        ? "ZAINSTALUJ"
                        : "INSTALL"
                  }
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden lg:inline">
                    {installStatus === "update"
                      ? appLanguage === "pl"
                        ? "Aktualizuj"
                        : "Update"
                      : appLanguage === "pl"
                        ? "Zainstaluj"
                        : "Install"}
                  </span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRightFooterGroupOpen(!isRightFooterGroupOpen);
                  if (isLeftFooterGroupOpen) setIsLeftFooterGroupOpen(false);
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-all flex items-center justify-center gap-1 border shadow-xl ${isRightFooterGroupOpen ? "bg-black text-[#C5A059] border-[#C5A059]/20" : "bg-black/10 border-black/5 hover:bg-black/20"}`}
                title={appLanguage === "pl" ? "Narzędzia" : "Tools"}
              >
                <div className="relative">
                  <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-600 border border-zinc-950"></span>
                  )}
                </div>
              </button>

              {isRightFooterGroupOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 p-2 bg-black/90 backdrop-blur-md border border-[#C5A059]/30 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[140px] animate-fade-in origin-bottom-right"
                  id="footer-actions-container"
                >
                  {/* Screensaver Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Actively start the screensaver and ensure the setting allows it
                      setUserPersona({
                        ...userPersona,
                        screensaverEnabled: true,
                      });
                      setTimeout(
                        () =>
                          window.dispatchEvent(
                            new CustomEvent("start-screensaver"),
                          ),
                        100,
                      );
                      setIsRightFooterGroupOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg border transition-all flex items-center gap-2 justify-center bg-[#C5A059] text-black border-[#C5A059]`}
                  >
                    <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-black uppercase">
                      {appLanguage === "pl" ? "Wygaszacz" : "Screensaver"}
                    </span>
                  </button>

                  <button
                    aria-label="Powiadomienia"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenManagement("notifications");
                      setIsRightFooterGroupOpen(false);
                    }}
                    className="w-full px-3 py-2 bg-black/50 hover:bg-zinc-800 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/10 text-zinc-300 relative"
                  >
                    <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute left-[30px] top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-600 text-[6px] font-black text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                    <span className="text-xs font-black uppercase">
                      {appLanguage === "pl" ? "Powiadomienia" : "Alerts"}
                    </span>
                  </button>

                  <a
                    href="https://play.google.com/store/apps/dev?id=5215448773598149938"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 bg-black/50 hover:bg-zinc-800 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/10 text-zinc-300"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    >
                      <path d="M3,20.5V3.5L18,12L3,20.5Z" />
                    </svg>
                    <span className="text-xs font-black uppercase">
                      Play Store
                    </span>
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAreAllWidgetsHidden(!areAllWidgetsHidden);
                      setIsRightFooterGroupOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 border ${
                      areAllWidgetsHidden
                        ? "bg-[#C5A059] text-black border-[#C5A059]"
                        : "bg-black/50 text-zinc-300 border-[#C5A059]/10 hover:bg-zinc-800"
                    }`}
                  >
                    {areAllWidgetsHidden ? (
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                    <span className="text-xs font-black uppercase">
                      {areAllWidgetsHidden
                        ? appLanguage === "pl"
                          ? "Pokaż Kafelki"
                          : "Show Tiles"
                        : appLanguage === "pl"
                          ? "Ukryj Kafelki"
                          : "Hide Tiles"}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGames();
                      setIsRightFooterGroupOpen(false);
                    }}
                    className="w-full px-3 py-2 bg-black/50 hover:bg-zinc-800 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/10 text-zinc-300"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs font-black uppercase">
                      {appLanguage === "pl" ? "Gry" : "Games"}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEcosystemAction?.("open:slideshow");
                      setIsRightFooterGroupOpen(false);
                    }}
                    className="w-full px-3 py-2 bg-black/50 hover:bg-zinc-800 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#C5A059]/10 text-zinc-300"
                  >
                    <span className="text-[12px] sm:text-sm font-black leading-none px-1 relative bottom-[1px]">
                      +
                    </span>
                    <span className="text-xs font-black uppercase">
                      {appLanguage === "pl" ? "Pokaz Slajdów" : "Slideshow"}
                    </span>
                  </button>
                </div>
              )}

              <button
                aria-label="Zamknij"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFooterExpanded(false);
                  setIsLeftFooterGroupOpen(false);
                  setIsRightFooterGroupOpen(false);
                }}
                className="p-1 sm:p-2 bg-black/10 hover:bg-black/20 rounded-full transition-all flex items-center justify-center ml-1 border border-transparent shrink-0"
                title={appLanguage === "pl" ? "Ukryj menu" : "Hide menu"}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </button>
            </div>
          </div>
        )}
      </footer>

      <FloatingChatBubble
        onOpenChat={onOpenCentralChat}
        isLandscape={isLandscape}
      />

      {selectedCommunityUser && (
        <ViewUserCardModal
          isOpen={true}
          onClose={() => setSelectedCommunityUser(null)}
          onlineUser={selectedCommunityUser}
          appLanguage={appLanguage}
          addToast={addToast!}
          onOpenCCTextAssistant={() => onOpenVoiceAssistant?.()}
          onOpenCCVoiceAssistant={() => onOpenVoiceAssistant?.()}
          onOpenCentralChat={onOpenCentralChat}
          onOpenBusinessCard={onOpenBusinessCard}
        />
      )}
    </div>
  );
};
