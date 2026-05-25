import React, {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Preferences } from "@capacitor/preferences";
import { Toast } from "./components/Toast";
import { RadioModePlayer } from "./components/RadioModePlayer";
import { ApostleAgent } from "./components/ApostleAgent";
import { AudioVisualizer } from "./components/AudioVisualizer";
const StripeSupportModal = React.lazy(() => import("./components/StripeSupportModal").then(m => ({ default: m.StripeSupportModal })));
import { Sidebar } from "./components/Sidebar";
const BusinessCardModal = React.lazy(() => import("./components/BusinessCardModal").then(m => ({ default: m.BusinessCardModal })));
const ZbyszekGieronModal = React.lazy(() => import("./components/ZbyszekGieronModal").then(m => ({ default: m.ZbyszekGieronModal })));
const KatarzynaFedkowModal = React.lazy(() => import("./components/KatarzynaFedkowModal").then(m => ({ default: m.KatarzynaFedkowModal })));
const EMIMediaModal = React.lazy(() => import("./components/EMIMediaModal"));
const InstrumentalMusicModal = React.lazy(() => import("./components/InstrumentalMusicModal"));
const SlideshowModal = React.lazy(() => import("./components/SlideshowModal").then(m => ({ default: m.SlideshowModal })));
const YellowCardModal = React.lazy(() => import("./components/YellowCardModal").then(m => ({ default: m.YellowCardModal })));
const PublicProfileModal = React.lazy(() => import("./components/PublicProfileModal").then(m => ({ default: m.PublicProfileModal })));
const UserPanel = React.lazy(() => import("./components/UserPanel").then(m => ({ default: m.UserPanel })));
import { Calendar } from "./components/Calendar";
import { DailyDetail } from "./components/DailyDetail";
const BiblicalSchoolPanel = React.lazy(() => import("./components/BiblicalSchoolPanel").then(m => ({ default: m.BiblicalSchoolPanel })));
import { getStaticLessonContent } from "./services/biblicalSchoolLessonContent";
const AppManagementCenter = React.lazy(() => import("./components/AppManagementCenter").then(m => ({ default: m.AppManagementCenter })));
const YouTubeNotificationModal = React.lazy(() => import("./components/YouTubeNotificationModal").then(m => ({ default: m.YouTubeNotificationModal })));
const VoiceAssistantModal = React.lazy(() => import("./components/VoiceAssistantModal").then(m => ({ default: m.VoiceAssistantModal })));
const InstallationGuideModal = React.lazy(() => import("./components/InstallationGuideModal").then(m => ({ default: m.InstallationGuideModal })));
const TutorialPanel = React.lazy(() => import("./components/TutorialPanel").then(m => ({ default: m.TutorialPanel })));
const LessonReadingModal = React.lazy(() => import("./components/LessonReadingModal").then(m => ({ default: m.LessonReadingModal })));
const InstallationCounterModal = React.lazy(() => import("./components/InstallationCounterModal").then(m => ({ default: m.InstallationCounterModal })));
import { TopNewsTicker } from "./components/TopNewsTicker";
const OpenLetterModal = React.lazy(() => import("./components/OpenLetterModal").then(m => ({ default: m.OpenLetterModal })));
const ShabbatWelcomeModal = React.lazy(() => import("./components/ShabbatWelcomeModal").then(m => ({ default: m.ShabbatWelcomeModal })));
const WeeklyScheduleModal = React.lazy(() => import("./components/WeeklyScheduleModal").then(m => ({ default: m.WeeklyScheduleModal })));
const VerseSearchModal = React.lazy(() => import("./components/VerseSearchModal").then(m => ({ default: m.VerseSearchModal })));
import { SABBATH_VERSES } from "./services/sabbathVerses";
const DailyVerseModal = React.lazy(() => import("./components/DailyVerseModal").then(m => ({ default: m.DailyVerseModal })));
const YouTubeLiveModal = React.lazy(() => import("./components/YouTubeLiveModal").then(m => ({ default: m.YouTubeLiveModal })));
import { NotificationCascade } from "./components/NotificationCascade";
const SmsSubscriptionModal = React.lazy(() => import("./components/SmsSubscriptionModal").then(m => ({ default: m.SmsSubscriptionModal })));
const PrivacyComplianceModal = React.lazy(() => import("./components/PrivacyComplianceModal").then(m => ({ default: m.PrivacyComplianceModal })));
const StoreModal = React.lazy(() => import("./components/StoreModal").then(m => ({ default: m.StoreModal })));
const GamesPortalModal = React.lazy(() => import("./components/GamesPortalModal").then(m => ({ default: m.GamesPortalModal })));
const ReadingRoomModal = React.lazy(() => import("./components/ReadingRoomModal").then(m => ({ default: m.ReadingRoomModal })));
const LawDecalogueModal = React.lazy(() => import("./components/LawDecalogueModal").then(m => ({ default: m.LawDecalogueModal })));
const CcNewsModal = React.lazy(() => import("./components/CcNewsModal").then(m => ({ default: m.CcNewsModal })));
const CcEcosystemMapModal = React.lazy(() => import("./components/CcEcosystemMapModal").then(m => ({ default: m.CcEcosystemMapModal })));
const StrategicPartnersModal = React.lazy(() => import("./components/StrategicPartnersModal").then(m => ({ default: m.StrategicPartnersModal })));
const WdowiGroszModal = React.lazy(() => import("./components/WdowiGroszModal").then(m => ({ default: m.WdowiGroszModal })));
import { CcLiveGlobalMap } from "./components/CcLiveGlobalMap";
const SpotifyModal = React.lazy(() => import("./components/SpotifyModal").then(m => ({ default: m.SpotifyModal })));
const ApiKeySelectionModal = React.lazy(() => import("./components/ApiKeySelectionModal").then(m => ({ default: m.ApiKeySelectionModal })));
const HelpingHandModal = React.lazy(() => import("./components/HelpingHandModal").then(m => ({ default: m.HelpingHandModal })));
const StudioDobregoSlowaModal = React.lazy(() => import("./components/StudioDobregoSlowaModal").then(m => ({ default: m.StudioDobregoSlowaModal })));
const HolistycznyCoachingModal = React.lazy(() => import("./components/HolistycznyCoachingModal").then(m => ({ default: m.HolistycznyCoachingModal })));
const UpdateAvailableModal = React.lazy(() => import("./components/UpdateAvailableModal").then(m => ({ default: m.UpdateAvailableModal })));
import { LoginScreen } from "./components/LoginScreen";
const StartupModeSelection = React.lazy(() => import("./components/StartupModeSelection").then(m => ({ default: m.StartupModeSelection })));
const SidePanels = React.lazy(() => import("./components/SidePanels").then(m => ({ default: m.SidePanels })));
const BiblePromoModal = React.lazy(() => import("./components/BiblePromoModal").then(m => ({ default: m.BiblePromoModal })));
const TvStudyModal = React.lazy(() => import("./components/TvStudyModal").then(m => ({ default: m.TvStudyModal })));
const MiriamChatModal = React.lazy(() => import("./components/MiriamChatModal").then(m => ({ default: m.MiriamChatModal })));
const MyFilesModal = React.lazy(() => import("./components/MyFilesModal").then(m => ({ default: m.MyFilesModal })));
const CcResourcesModal = React.lazy(() => import("./components/CcResourcesModal").then(m => ({ default: m.CcResourcesModal })));
const CcMediaPlayerPage = React.lazy(() => import("./components/CcMediaPlayerPage").then(m => ({ default: m.CcMediaPlayerPage })));
const CcPatronsPage = React.lazy(() => import("./components/CcPatronsPage").then(m => ({ default: m.CcPatronsPage })));
import DailyWordWidget from "./components/DailyWordWidget";
import WidgetDashboard from "./components/WidgetDashboard";
import { FloatingWidgetWrapper } from "./components/FloatingWidgetWrapper";
const ImaginationStudio = React.lazy(() => import("./components/ImaginationStudio"));
const SongCreator = React.lazy(() => import("./components/SongCreator"));
import { DashboardVerseGraphic } from "./components/DashboardVerseGraphic";
import PinnedWidgetsGrid from "./components/PinnedWidgetsGrid";
const MajowkaCampaignModal = React.lazy(() => import("./components/MajowkaCampaignModal").then(m => ({ default: m.MajowkaCampaignModal })));
const MobileLandscapeCarMode = React.lazy(() => import("./components/MobileLandscapeCarMode"));
import { mediaPlayerService } from "./services/mediaPlayerService";
import { FarewellScreen } from "./components/FarewellScreen";

// Desktop Widgets (Portals)
import { LocalMediaPlayerWidget } from "./components/LocalMediaPlayerWidget";
import { SpiritualMotivationWidget } from "./components/SpiritualMotivationWidget";
import { DidYouKnowWidget } from "./components/DidYouKnowWidget";
import { GoldenThoughtsWidget } from "./components/GoldenThoughtsWidget";
import { CtaMobilizationWidget } from "./components/CtaMobilizationWidget";
import { YellowCardWidget } from "./components/YellowCardWidget";
import { MusicNewsWidget } from "./components/MusicNewsWidget";
import { EmiNewsWidget } from "./components/EmiNewsWidget";

import { DesktopTaskbar } from "./components/DesktopTaskbar";
import { BibleService } from "./services/bibleService";
import {
  fetchDailyDualContent,
  fetchBibleLesson,
} from "./services/geminiService";
import { DEFAULT_BIBLE_VERSE, DEFAULT_WIDGET_CONFIGS } from "./constants";
import { PersistenceService } from "./services/persistenceService";
import { CommunityService } from "./services/communityService";
import { PrayerIntentions } from "./components/PrayerIntentions";
const CommunityChat = React.lazy(() => import("./components/CommunityChat").then(m => ({ default: m.CommunityChat })));
import { CentralChatOverlay } from "./components/CentralChatOverlay";
import {
  LiveUser,
  PrayerIntention,
  SupportedLanguage,
  ChatMessage,
} from "./types";
import { Button } from "./components/ui/button";
import { NotificationService } from "./services/notificationService";
import { visualModeService } from "./services/visualModeService";
import { useRadio } from "./useRadio";
import { useMetadata } from "./useMetadata";
import { useAppStore } from "./useAppStore";
import { useSwipe } from "./hooks/useSwipe";
import {
  BACKGROUND_IDS,
  BIBLE_BACKGROUND_IDS,
  GLOBAL_BACKGROUND_IDS,
} from "./config";
import { useTranslation } from "react-i18next";
import { nativeService } from "./services/nativeService";
import { ImpactStyle } from "@capacitor/haptics";
import { getVerseForDate } from "./src/verses";
import { Prayer, DailyGoal, DailyTask, DailyNote } from "./types";

import { googleCalendarService } from "./services/googleCalendarService";
import { DatabaseService } from "./services/databaseService";
import {
  auth,
  db,
  rtdb,
  handleFirestoreError,
  OperationType,
} from "./firebase";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, onSnapshot, getDocs, collection, query as firestoreQuery, orderBy, limit, updateDoc, setDoc, deleteField, increment } from "firebase/firestore";
import { sanitizeForFirestore } from "./services/syncService";
import {
  ref,
  onChildAdded,
  query as rtdbQuery,
  limitToLast,
  push,
  serverTimestamp as rtdbTimestamp,
} from "firebase/database";
import SunCalc from "suncalc";
import {
  ToastMessage,
  WSPIERAJ_MISJE_ICON,
  DualBibleVerse,
  getLocalDateString,
  getBiblicalDateString,
  getVerseSegmentKey,
  ManagementTab,
  UserPersona,
  APP_VERSION,
  inferGenderFromName,
  BibleVerse,
  RadioStreamType,
  SystemNotification,
  VisualMode,
  SpatialMode,
  EqualizerSettings,
  isAllowedDomain,
  isStripeAllowed,
  loadScript,
  FavoriteItem,
} from "./types";

import { useCustomBackgrounds } from "./hooks/useCustomBackgrounds";

const RotatingBackground: React.FC<{
  activeStream: RadioStreamType;
  visualMode: VisualMode;
}> = ({ activeStream, visualMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const prevActiveIdRef = useRef<string | null>(null);
  const {
    backgrounds: customBackgrounds,
    isActive: areCustomCustomBackgroundsActive,
  } = useCustomBackgrounds();

  const currentBackgroundSet = useMemo(() => {
    if (areCustomCustomBackgroundsActive && customBackgrounds.length > 0) {
      return customBackgrounds.map((bg) => bg.url);
    }
    if (activeStream === "BIBLIA") return GLOBAL_BACKGROUND_IDS;
    if (activeStream === "GLOBAL") return BIBLE_BACKGROUND_IDS;
    return BACKGROUND_IDS;
  }, [activeStream, customBackgrounds, areCustomCustomBackgroundsActive]);

  useEffect(() => {
    setCurrentIndex(0);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentBackgroundSet.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [currentBackgroundSet]);

  const handleImageError = (id: string) => {
    console.warn(`[Background] Failed to load image: ${id}`);
    setLoadError((prev) => ({ ...prev, [id]: true }));
  };

  const filterStyle = useMemo(() => {
    if (visualMode === "sabbath") {
      return "brightness(0.55) contrast(1.05) saturate(1.2) sepia(0.35) hue-rotate(-5deg)"; // Warm, golden, sacred feel
    }
    if (visualMode === "night") {
      return "brightness(0.3) contrast(1.15) saturate(0.6) hue-rotate(20deg)"; // Deep, cool, nocturnal
    }
    // Standard mode with slight variations for stream
    return activeStream === "BIBLIA"
      ? "brightness(0.5) contrast(1.1) saturate(0.9) sepia(0.1)"
      : "brightness(0.6) contrast(1.1) saturate(0.85)";
  }, [visualMode, activeStream]);

  const visibleBackgrounds = currentBackgroundSet.filter(
    (id) => !loadError[id],
  );
  const activeId =
    visibleBackgrounds.length > 0
      ? visibleBackgrounds[currentIndex % visibleBackgrounds.length]
      : currentBackgroundSet[0];

  useEffect(() => {
    if (activeId) {
      prevActiveIdRef.current = activeId;
    }
  }, [activeId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-zinc-900">
      {currentBackgroundSet.map((id, index) => {
        const imageUrl =
          id.startsWith("blob:") || id.startsWith("/")
            ? id
            : `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
        if (!imageUrl || loadError[id]) return null;

        const isActive = id === activeId;
        const isPrev = id === prevActiveIdRef.current && !isActive;

        return (
          <div
            key={id}
            className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${isActive ? "opacity-100 z-10" : isPrev ? "opacity-100 z-0" : "opacity-0 z-0"}`}
          >
            <img
              src={imageUrl}
              alt="Background"
              className={`w-full h-full object-cover object-center ${index % 2 === 0 ? "animate-ken-burns-1" : "animate-ken-burns-2"}`}
              style={{
                filter: filterStyle,
                transition: "filter 4s ease-in-out",
              }}
              onError={() => handleImageError(id)}
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}
      <div
        className={`absolute inset-0 z-10 transition-colors duration-[3000ms] ${
          visualMode === "sabbath"
            ? "bg-gradient-to-b from-amber-900/40 via-transparent to-black/90"
            : visualMode === "night"
              ? "bg-gradient-to-b from-indigo-950/60 via-transparent to-black/95"
              : "bg-gradient-to-b from-black/60 via-transparent to-black/85"
        }`}
      ></div>
      <div
        className={`divine-rays z-20 transition-opacity duration-[3000ms] ${
          visualMode === "sabbath"
            ? "opacity-[0.12] text-amber-500"
            : visualMode === "night"
              ? "opacity-[0.06] text-indigo-400"
              : "opacity-[0.08]"
        }`}
      ></div>
    </div>
  );
};

// Removed useRegisterSW
import { GripVertical, MonitorUp, X, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Responsive, Layout } from "react-grid-layout";

const WidthProvider = (ComposedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = useState(1200);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) setWidth(ref.current.offsetWidth);
      const handleResize = () => {
        if (ref.current) setWidth(ref.current.offsetWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div ref={ref} className="w-full">
        <ComposedComponent {...props} width={width} />
      </div>
    );
  };
};

const ResponsiveGridLayout = WidthProvider(Responsive);

import { VoiceGreetingService } from "./services/voiceGreetingService";
import { useCounters } from "./hooks/useCounters";
import { useVisualMode } from "./hooks/useVisualMode";
import { usePrayerIntentions } from "./hooks/usePrayerIntentions";
import { usePWAInstallAndUpdates } from "./hooks/usePWAInstallAndUpdates";
import { useGlobalErrorHandling } from "./hooks/useGlobalErrorHandling";
import { useAndroidBackButton } from "./hooks/useAndroidBackButton";
import { useGoogleIdentityLink } from "./hooks/useGoogleIdentityLink";
import { useDailyVerse } from "./hooks/useDailyVerse";
import { CommunityView } from "./components/views/CommunityView";
import { DashboardView } from "./components/views/DashboardView";

export type AppView =
  | "radio"
  | "dashboard"
  | "community"
  | "widgets"
  | "imagination-studio"
  | "song-creator";

export const App: React.FC = () => {
  const { totalViews, dailyRadioStats, globalAmensCount, dailyAmensCount } = useCounters();

  const [plannerLayouts, setPlannerLayouts] = useState<any>({
    lg: [
      { i: "calendar", x: 0, y: 0, w: 5, h: 8, minW: 3, minH: 5 },
      { i: "dashboard", x: 5, y: 0, w: 7, h: 8, minW: 4, minH: 5 }
    ],
  });
  const { t, i18n } = useTranslation();
  const [appLanguage, setAppLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("i18nextLng") as SupportedLanguage;
    const supported: SupportedLanguage[] = [
      "pl",
      "en",
      "de",
      "es",
      "fr",
      "it",
      "pt",
      "uk",
    ];
    if (supported.includes(saved)) {
      return saved;
    }
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLang = navigator.language
      .toLowerCase()
      .split("-")[0] as SupportedLanguage;

    if (supported.includes(browserLang)) {
      return browserLang;
    }

    const isPolishRegion = timeZone.includes("Warsaw") || browserLang === "pl";
    const lang: SupportedLanguage = isPolishRegion ? "pl" : "en";
    return lang;
  });

  const {
    userPersona,
    setUserPersona,
    systemNotifications,
    setSystemNotifications,
    notificationSettings,
    userId,
    isAuthReady,
    setAreAllWidgetsHidden,
    prayers,
    setPrayers,
    dailyGoals,
    setDailyGoals,
    dailyTasks,
    setDailyTasks,
    notes,
    setNotes,
    spiritualGoals,
    setSpiritualGoals,
    dailyGoalProgress,
    setDailyGoalProgress,
  } = useAppStore();

  const visualMode = useVisualMode(userPersona);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: ToastMessage["type"] = "info",
      action?: ToastMessage["action"],
    ): string => {
      const id = Math.random().toString(36).substr(2, 9);

      // Treat alert simply as an error to avoid scaring users
      const finalType = type === "alert" ? "error" : type;

      setToasts((prev) => [
        ...prev,
        { id, message, type: finalType, action },
      ]);
      return id;
    },
    [],
  );
  const { dualDailyVerse, setDualDailyVerse, isBibleInitialLoading, loadVerse } = useDailyVerse({
    appLanguage,
    addToast,
    visualMode,
    setIsApiKeyModalOpen,
    APP_VERSION
  });
  
  useEffect(() => {
    // ONE-TIME FIX FOR LAODYCEA POST
    const fixLaodyceaPost = async () => {
      if (auth.currentUser?.email !== 'nazirczarkes@gmail.com') return;
      try {
        const q = firestoreQuery(collection(db, 'morning_inspirations'), orderBy('timestamp', 'desc'), limit(10));
        const snap = await getDocs(q);
        snap.docs.forEach(async (d) => {
          const data = d.data();
          // szukamy Laodycei
          if (data.title?.includes('BREAKING NEWS') || data.content?.includes('LAODYCEĘ')) {
            if (data.imageUrl) {
              await updateDoc(doc(db, 'morning_inspirations', d.id), {
                imageUrl: deleteField()
              });
              console.log('Fixed Laodycea post image URL');
            }
          }
        });
      } catch (e) {}
    };
    fixLaodyceaPost();
  }, []);

  const dailyVerseRef = useRef<BibleVerse | null>(null);
  useEffect(() => {
    if (dualDailyVerse && dualDailyVerse.pl) {
      dailyVerseRef.current = dualDailyVerse.pl;
    }
  }, [dualDailyVerse]);
  
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);

  const [spatialMode, setSpatialMode] = useState<SpatialMode>(() => {
    const lastStream = PersistenceService.loadLastStream() || "BIBLIA";
    return lastStream === "BIBLIA" ? "room" : "none";
  });
  const [equalizer, setEqualizer] = useState<EqualizerSettings>({
    low: 0,
    midLow: 0,
    mid: 0,
    midHigh: 0,
    high: 0,
  });

  // Sync i18n when appLanguage changes
  useEffect(() => {
    i18n.changeLanguage(appLanguage);
  }, [appLanguage, i18n]);

  useEffect(() => {
    const handleSaveFavorite = (e: any) => {
      const { title, body } = e.detail || {};
      if (title && body) {
        const newNotes = [
          ...useAppStore.getState().notes,
          {
            date: new Date().toISOString(),
            content: `${title}: ${body}`,
          },
        ];
        useAppStore.getState().setNotes(newNotes);
        setToasts((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: "Zapisano w notatkach z powiadomienia",
            type: "success",
          },
        ]);
      }
    };

    const handleOpenBible = () => setIsVerseSearchOpen(true);
    const handleOpenDailyVerse = () => {
       if (dailyVerseRef.current) {
         setSelectedDailyVerseForModal(dailyVerseRef.current);
         setIsDailyVerseModalOpen(true);
       }
    };
    const handleOpenBiblicalSchool = () => setIsBiblicalSchoolOpen(true);
    const handleOpenCommunity = () => setCurrentView("community");

    window.addEventListener("cc_save_favorite", handleSaveFavorite);
    window.addEventListener("cc_open_bible", handleOpenBible);
    window.addEventListener("cc_open_daily_verse_modal", handleOpenDailyVerse);
    window.addEventListener(
      "cc_open_biblical_school",
      handleOpenBiblicalSchool,
    );
    window.addEventListener("cc_open_community", handleOpenCommunity);

    const handleOpenMiriamChat = (e: any) => {
      if (e.detail?.query) {
        setMiriamChatInitialQuery(e.detail.query);
      } else {
        setMiriamChatInitialQuery("");
      }
      setIsMiriamChatOpen(true);
    };
    window.addEventListener("cc_open_miriam_chat", handleOpenMiriamChat);

    return () => {
      window.removeEventListener("cc_save_favorite", handleSaveFavorite);
      window.removeEventListener("cc_open_bible", handleOpenBible);
      window.removeEventListener("cc_open_daily_verse_modal", handleOpenDailyVerse);
      window.removeEventListener(
        "cc_open_biblical_school",
        handleOpenBiblicalSchool,
      );
      window.removeEventListener("cc_open_community", handleOpenCommunity);
      window.removeEventListener("cc_open_miriam_chat", handleOpenMiriamChat);
    };
  }, []);

  const [appStarted, setAppStarted] = useState(() => {
    return true; // Zawsze startuj aplikację bezpośrednio, zgodnie ze wskazówkami
  });
  const [startModeChoice, setStartModeChoice] = useState<'standard' | 'blind' | null>('standard');
  
  
  const {
    installStatus,
    isUpdatePending,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    isInstallationGuideOpen,
    setIsInstallationGuideOpen,
    triggerDirectInstall,
    updateServiceWorker,
    newAvailableVersion
  } = usePWAInstallAndUpdates(appLanguage, appStarted, addToast, t, setSystemNotifications);

  const isZenMode = useAppStore((state) => state.isZenMode);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  useEffect(() => {
    if (appStarted && !isZenMode) {
      const timer = setTimeout(() => {
        setNotificationsAllowed(true);
      }, 60000);
      return () => clearTimeout(timer);
    } else {
      setNotificationsAllowed(false);
    }
  }, [appStarted, isZenMode]);

  const dynamicDB = useAppStore((state) => state.dynamicDB);
  const setDynamicDB = useAppStore((state) => state.setDynamicDB);

  // Synchronizacja Bazy Danych Google Sheets (CCN) - Real-time sync
  useEffect(() => {
    const syncDatabase = async () => {
      try {
        console.log("[DynamicEDB] Sprawdzanie aktualności...");
        const data = await DatabaseService.fetchData();
        if (data && Object.keys(data).length > 0) {
          setDynamicDB(data);
          console.log("[DynamicDB] Pomyślnie zsynchronizowano wieści.");
        }
      } catch (err) {
        console.warn("[DynamicDB] Błąd synchronizacji:", err);
      }
    };

    // Globalne wieści z Firestore (Real-time override)
    const configRef = doc(db, "config", "global");
    const unsubscribeConfig = onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        console.log("[DynamicDB] Nowe wieści z chmury dotarły!");
        setDynamicDB({ ...useAppStore.getState().dynamicDB, ...remoteData });
      }
    }, (error) => {
      console.warn("Global config snapshot non-fatal error suppressed:", error);
    });

    // Początkowa synchronizacja z Arkusza
    syncDatabase();

    // Cykliczna co 5 minut (300000ms) dla Arkusza (fallback)
    const interval = setInterval(syncDatabase, 300000);
    return () => {
      clearInterval(interval);
      unsubscribeConfig();
    };
  }, [setDynamicDB]);

  // Agent Update: Aktualizacja sekcji „Nowości” po zmianach w kodzie
  useEffect(() => {
    const latestNews =
      '✨ CC OS v26.5.21.6 - Premium Wizytówka Update\n- Naprawiono błąd przeźroczystości wizytówki na Androidzie, stosując 100% nieprzezroczyste i jednolite ciemne tła.\n- Wyeliminowano miganie imienia i nazwiska poprzez optymalizację cyklu odświeżania awatarów.\n- Wprowadzono super-stabilny, autorski układ kafelkowy Bento Grid dla trybu odczytu, całkowicie zastępując ciężki generator siatek i eliminując zapętlenia renderowania na telefonach.\n- Zdjęcia oraz tło wizytówki posiadają teraz 100% zabezpieczenie przed urwanymi linkami w Firebase i ładują wysokiej jakości grafiki zapasowe w przypadku braku lub błędu wczytywania.\n- Zrób to Dla Jezusa – On już czeka!';
    if (dynamicDB["Nowości CC"] !== latestNews) {
      // Small timeout to avoid race condition with initial sync
      const timer = setTimeout(() => {
        setDynamicDB({
          ...useAppStore.getState().dynamicDB,
          "Nowości CC": latestNews,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dynamicDB, setDynamicDB]);

  // Initialize Native Features & Dynamic Scripts
  useEffect(() => {
    // Patch to restore radio player if it was closed
    if (localStorage.getItem('cc_fix_radio_player_visibility') !== 'true') {
      localStorage.setItem('cc_widget_radio_player_visible', 'true');
      localStorage.setItem('cc_fix_radio_player_visibility', 'true');
      window.dispatchEvent(new Event('cc_widgets_updated'));
    }

    // Initialize Auth Session
    useAppStore.getState().initAuth();

    nativeService.initialize();

    // Unlock screen orientation
    if (nativeService.isNative()) {
      ScreenOrientation.unlock().catch(err => console.warn("[App] Failed to unlock orientation:", err));
    }

    // Load Google Identity Services on allowed domains
    if (isAllowedDomain() && !document.getElementById("google-gsi")) {
      console.log("[App] Loading GSI script...");
      loadScript("https://accounts.google.com/gsi/client", "google-gsi").catch(
        (err) => console.warn("[App] Failed to load GSI script:", err),
      );
    } else {
      console.log("[App] Skipping GSI script.");
    }

    // Load Stripe specifically on strict allowed domains
    if (isStripeAllowed() && !document.getElementById("stripe-js")) {
      console.log("[App] Loading Stripe script...");
      Promise.all([
        loadScript("https://js.stripe.com/v3/", "stripe-js"),
        loadScript(
          "https://js.stripe.com/v3/buy-button.js",
          "stripe-buy-button",
        ),
      ]).catch((err) =>
        console.warn("[App] Failed to load Stripe script:", err),
      );
    } else {
      console.log("[App] Skipping Stripe script.");
    }

    // Pre-cache upcoming content (Offline-First)
    PersistenceService.preCacheUpcomingContent(async (date) => {
      try {
        return await fetchDailyDualContent(date, false, []);
      } catch {
        return null;
      }
    });

    // Schedule CC Notifications on start if native
    if (nativeService.isNative()) {
      const settings = PersistenceService.loadNotificationSettings();
      const [hour, minute] = settings.verseOfDayTime.split(":").map(Number);
      nativeService.scheduleCCNotifications({ hour, minute });
    }
  }, []);

  // Sync Emergency Contacts
  useEffect(() => {
    if (userPersona.emergencyContacts) {
      nativeService.setEmergencyContacts(userPersona.emergencyContacts);
    }
  }, [userPersona.emergencyContacts]);

  // Telewizyjne Studium Pisma Świętego - Sobota 09:00
  useEffect(() => {
    const checkTimer = setInterval(() => {
      const now = new Date();
      if (
        now.getDay() === 6 &&
        now.getHours() === 9 &&
        now.getMinutes() === 0
      ) {
        if (
          localStorage.getItem("tv_study_shown_today") !== now.toDateString()
        ) {
          setIsTvStudyModalOpen(true);
          localStorage.setItem("tv_study_shown_today", now.toDateString());
        }
      }
    }, 60000);
    return () => clearInterval(checkTimer);
  }, []);

  // Sync Widget Data
  useEffect(() => {
    if (dualDailyVerse && dualDailyVerse.pl) {
      PersistenceService.saveLastDisplayedVerse(dualDailyVerse.pl);
    }
    if (dualDailyVerse) {
      const verse =
        dualDailyVerse[appLanguage] ||
        (appLanguage === "pl" ? dualDailyVerse.pl : dualDailyVerse.en);
      if (verse) {
        nativeService.updateWidgetData({
          verse: verse.text,
          reference: verse.reference,
          date: getLocalDateString(new Date()),
        });

        // Update Native Notifications with real verse if possible
        if (nativeService.isNative()) {
          const settings = PersistenceService.loadNotificationSettings();
          const [hour, minute] = settings.verseOfDayTime.split(":").map(Number);
          nativeService.scheduleCCNotifications(
            { hour, minute },
            { text: verse.text, reference: verse.reference },
          );
        }

        // Add to system notifications if it's the first time today
        const now = new Date();
        const today = now.toDateString();
      }
    }
  }, [
    dualDailyVerse,
    appLanguage,
    setSystemNotifications,
    systemNotifications,
  ]);

  const [isDailyVerseModalOpen, setIsDailyVerseModalOpen] = useState(false);
  const [isWidgetPreviewOpen, setIsWidgetPreviewOpen] = useState(false);
  const [currentView, _setCurrentView] = useState<AppView>("radio");

  const setCurrentView = useCallback((view: AppView) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        _setCurrentView(view);
      });
    } else {
      _setCurrentView(view);
    }
  }, []);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);
  const [selectedDailyVerseForModal, setSelectedDailyVerseForModal] =
    useState<BibleVerse | null>(null);

  // Global CC Toast Handler
  useEffect(() => {
    const handleGlobalToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        addToast(customEvent.detail.message, customEvent.detail.type || "info");
      }
    };
    window.addEventListener("cc_show_toast", handleGlobalToast);
    return () => window.removeEventListener("cc_show_toast", handleGlobalToast);
  }, [addToast]);

  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const radio = useRadio(
    appLanguage,
    addToast,
    userPersona.keepScreenOnWhileRadioPlaying,
    spatialMode,
  );

  const uiLang = useMemo(() => {
    if (radio.activeStream === "GLOBAL") return "en";
    if (radio.activeStream === "PL" || radio.activeStream === "BIBLIA") return "pl";
    return appLanguage === "pl" || appLanguage === "en" ? appLanguage : "en";
  }, [radio.activeStream, appLanguage]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [targetUserID, setTargetUserID] = useState<string | undefined>(
    undefined,
  );

  const openUserPanelForUser = (uid?: string) => {
    setTargetUserID(uid);
    setIsUserPanelOpen(true);
  };
  const openChatForUser = (uid: string) => {
    setChatInitialUserId(uid);
    setChatInitialView("private_chat");
    setIsCentralChatOpen(true);
    setIsUserPanelOpen(false);
  };
  const [isManagementCenterOpen, setIsManagementCenterOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [isAdminModeEnabled, setIsAdminModeEnabled] = useState(false);
  
  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '5550455') {
      setIsAdminPinModalOpen(false);
      setAdminPinInput("");
      setIsAdminModeEnabled(true);
      openManagement('admin');
      addToast(uiLang === 'pl' ? "Witaj w Centrum Dowodzenia, Cezary." : "Welcome to Command Center, Cezary.", "success");
    } else {
      addToast(uiLang === 'pl' ? "Błędny PIN." : "Invalid PIN.", "alert");
    }
  };
  const [managementInitialTab, setManagementInitialTab] =
    useState<ManagementTab>("profile");
  const [isBiblicalSchoolOpen, setIsBiblicalSchoolOpen] = useState(false);
  const [isVerseSearchOpen, setIsVerseSearchOpen] = useState(false);
  const [verseSearchInitialQuery, setVerseSearchInitialQuery] = useState("");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isHelpingHandModalOpen, setIsHelpingHandModalOpen] = useState(false);
  const [isStudioDobregoSlowaModalOpen, setIsStudioDobregoSlowaModalOpen] =
    useState(false);
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);
  const [isLawDecalogueOpen, setIsLawDecalogueOpen] = useState(false);
  const [isOpenLetterOpen, setIsOpenLetterOpen] = useState(false);
  const [isReadingRoomOpen, setIsReadingRoomOpen] = useState(false);
  const [isBibleAdOpen, setIsBibleAdOpen] = useState(false);
  const [isMyFilesModalOpen, setIsMyFilesModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenFiles = () => setIsMyFilesModalOpen(true);
    mediaPlayerService.on("openModal", handleOpenFiles);
    return () => {
      mediaPlayerService.removeListener("openModal", handleOpenFiles);
    };
  }, []);
  const [isWeeklyScheduleModalOpen, setIsWeeklyScheduleModalOpen] =
    useState(false);
  const [gapiSignedIn, setGapiSignedIn] = useState(false);

  useEffect(() => {
    const checkGapi = async () => {
      try {
        await googleCalendarService.ensureClientReady();
        setGapiSignedIn(googleCalendarService.isSignedIn());
      } catch (err) {
        console.warn("[App] GAPI init failed:", err);
      }
    };
    checkGapi();
  }, []);

  const [isMiriamChatOpen, setIsMiriamChatOpen] = useState(false);
  const [miriamChatInitialQuery, setMiriamChatInitialQuery] = useState("");
  const [isTvStudyModalOpen, setIsTvStudyModalOpen] = useState(false);
  const [isYouTubeLiveModalOpen, setIsYouTubeLiveModalOpen] = useState(false);
  const [youtubeInitialSource, setYoutubeInitialSource] = useState<
    "live" | "films" | "plus" | "testimonies" | "objawienie"
  >("live");
  const [youtubeNotificationProps, setYoutubeNotificationProps] = useState<{
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    description?: string;
    playlistUrl?: string;
  }>({ isOpen: false });
  const [isCcNewsModalOpen, setIsCcNewsModalOpen] = useState(false);
  const [isCcResourcesModalOpen, setIsCcResourcesModalOpen] = useState(false);
  const [isCcMediaPlayerPageOpen, setIsCcMediaPlayerPageOpen] = useState(false);
  const [isCcPatronsPageOpen, setIsCcPatronsPageOpen] = useState(false);
  const [isEcosystemMapOpen, setIsEcosystemMapOpen] = useState(false);
  const [isLiveGlobalMapOpen, setIsLiveGlobalMapOpen] = useState(false);
  const [isStrategicPartnersOpen, setIsStrategicPartnersOpen] = useState(false);
  const [isWdowiGroszModalOpen, setIsWdowiGroszModalOpen] = useState(false);
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState(false);
  const [isCentralChatOpen, setIsCentralChatOpen] = useState(false);
  const [isPublicProfileModalOpen, setIsPublicProfileModalOpen] = useState(false);
  const [publicProfileId, setPublicProfileId] = useState("");

  const isAdmin = isAdminModeEnabled || userPersona.googleEmail === 'nazirczarkes@gmail.com';

  const [isBusinessCardOpen, setIsBusinessCardOpen] = useState(false);
  const [isZbyszekGieronOpen, setIsZbyszekGieronOpen] = useState(false);
  const [isKatarzynaFedkowModalOpen, setIsKatarzynaFedkowModalOpen] =
    useState(false);
  const [isEMIMediaModalOpen, setIsEMIMediaModalOpen] = useState(false);
  const [isInstrumentalMusicModalOpen, setIsInstrumentalMusicModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isYellowCardOpen, setIsYellowCardOpen] = useState(false);
  const [chatInitialView, setChatInitialView] = useState<
    | "lobby"
    | "global"
    | "private_list"
    | "private_chat"
    | "search"
    | "invitations"
    | "all_users"
    | undefined
  >();
  const [chatInitialUserId, setChatInitialUserId] = useState<
    string | undefined
  >();
  const [chatInitialMessage, setChatInitialMessage] = useState<
    string | undefined
  >();

  const [isSmsSubscriptionModalOpen, setIsSmsSubscriptionModalOpen] =
    useState(false);
  const [isShabbatModalOpen, setIsShabbatModalOpen] = useState(false);
  const [isPrayerIntentionsOpen, setIsPrayerIntentionsOpen] = useState(false);

  const { hasNewPrayerIntention, setHasNewPrayerIntention } = usePrayerIntentions(addToast, setSystemNotifications, setIsPrayerIntentionsOpen);

  const [indicatorMode, setIndicatorMode] = useState<"online" | "views" | "praying" | "sos">("online");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicatorMode(prev => {
        if (prev === "online") return "views";
        if (prev === "views") return "praying";
        if (prev === "praying") return hasNewPrayerIntention ? "sos" : "online";
        return "online";
      });
    }, 4000); // 4 seconds cycle
    return () => clearInterval(interval);
  }, [hasNewPrayerIntention]);

  const [isFarewellScreenOpen, setIsFarewellScreenOpen] = useState(false);
  const [isLessonReadingModalOpen, setIsLessonReadingModalOpen] =
    useState(false);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string | null>(
    null,
  );
  const [currentLessonImage, setCurrentLessonImage] = useState<string | null>(
    null,
  );
  const [currentLessonContent, setCurrentLessonContent] = useState<
    string | null
  >(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);

  const handleOpenLesson = async (lessonTitle: string, imageUrl?: string) => {
    if (!lessonTitle) return;
    setCurrentLessonTitle(lessonTitle);
    setCurrentLessonImage(imageUrl || null);
    setCurrentLessonContent(null);
    setIsLessonLoading(true);
    setIsLessonReadingModalOpen(true);

    try {
      let content = getStaticLessonContent(lessonTitle, uiLang);
      if (!content) {
        content = await fetchBibleLesson(lessonTitle, uiLang);
      }
      setCurrentLessonContent(content);
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      addToast(
        uiLang === "pl"
          ? "Nie udało się pobrać lekcji."
          : "Failed to fetch lesson.",
        "alert",
      );
    } finally {
      setIsLessonLoading(false);
    }
  };

  const handleLessonComplete = (title: string) => {
    if (!title) return;
    const currentCompleted = userPersona.completedLessons || [];
    if (!currentCompleted.includes(title)) {
      const updatedCompleted = [...currentCompleted, title];
      const badges = userPersona.badges || [];
      const newBadges = [...badges];

      // Example basic badge logic:
      if (updatedCompleted.length === 1 && !badges.includes("Pierwszy Krok")) {
        newBadges.push("Pierwszy Krok");
        addToast(
          uiLang === "pl"
            ? "Odznaka odblokowana: Pierwszy Krok!"
            : "Badge Unlocked: First Step!",
          "success",
        );
      }
      if (updatedCompleted.length >= 5 && !badges.includes("Wytrwały Uczeń")) {
        newBadges.push("Wytrwały Uczeń");
        addToast(
          uiLang === "pl"
            ? "Odznaka odblokowana: Wytrwały Uczeń!"
            : "Badge Unlocked: Persistent Student!",
          "success",
        );
      }
      if (
        updatedCompleted.length >= 10 &&
        !badges.includes("Absolwent Fundamentów")
      ) {
        newBadges.push("Absolwent Fundamentów");
        addToast(
          uiLang === "pl"
            ? "Odznaka odblokowana: Absolwent Fundamentów!"
            : "Badge Unlocked: Foundations Graduate!",
          "success",
        );
      }

      const updatedPersona = {
        ...userPersona,
        completedLessons: updatedCompleted,
        badges: newBadges,
      };
      setUserPersona(updatedPersona);
      PersistenceService.saveUserPersona(updatedPersona);
    }
    setIsLessonReadingModalOpen(false);
  };

  // --- SYSTEM INTELIGENTNEGO TAKTU (STAGGERED STARTUP) ---
  // Ustawienie powiadomień i reklam rozłożonych w czasie

  useEffect(() => {
    if (appStarted && notificationsAllowed) {
      console.log("[SI Takt] Inicjalizacja sekwencji startowej...");

      // 1. Głosowe powitanie (6s)
      const voiceTimer = setTimeout(async () => {
        if (
          !VoiceGreetingService.isIntroPlayed() &&
          userPersona.aiGreetingsEnabled
        ) {
          const greeting =
            await VoiceGreetingService.getDailyMentorGreeting(userPersona);
          if (greeting) {
            VoiceGreetingService.synthesizeAndPlay(greeting);
            VoiceGreetingService.markIntroPlayed();
          }
        }
      }, 6000);

      // 2. Nowości CC News (15 minut po starcie) - Pokaż tylko jeśli treść się zmieniła
      const newsTimer = setTimeout(() => {
        const currentNews = dynamicDB?.["Nowości CC"] || "";
        const lastSeenNews = localStorage.getItem("cc_news_last_seen_text") || "";

        if (currentNews && currentNews !== lastSeenNews) {
          setIsCcNewsModalOpen(true);
          localStorage.setItem("cc_news_last_seen_text", currentNews);
          // Oznaczamy, że dzisiaj pokazaliśmy duży modal, żeby nie przytłaczać użytkownika
          localStorage.setItem("cc_daily_promo_shown_date", new Date().toDateString());
        }
      }, 900000); // 15 minut

      // 3. Rotacyjna Reklama (30 minut po starcie) - Tylko jedna dziennie (Biblia, Wdowi Grosz, Sklep)
      const promoTimer = setTimeout(() => {
        const today = new Date().toDateString();
        const lastPromoDate = localStorage.getItem("cc_daily_promo_shown_date");
        
        if (
          lastPromoDate !== today &&
          !isUserPanelOpen &&
          !isSidebarOpen &&
          !isCcNewsModalOpen
        ) {
          const promoSequence = parseInt(localStorage.getItem("cc_promo_sequence") || "0");
          
          if (promoSequence === 0) {
            setIsBibleAdOpen(true);
            localStorage.setItem("cc_promo_sequence", "1");
          } else if (promoSequence === 1) {
            setIsWdowiGroszModalOpen(true);
            localStorage.setItem("cc_promo_sequence", "2");
          } else {
            setIsStoreModalOpen(true); // Zastępuje timer sklepu z linii ~1800
            localStorage.setItem("cc_promo_sequence", "0");
          }
          
          localStorage.setItem("cc_daily_promo_shown_date", today);
        }
      }, 1800000); // 30 minut

      return () => {
        clearTimeout(voiceTimer);
        clearTimeout(newsTimer);
        clearTimeout(promoTimer);
      };
    }
  }, [
    appStarted,
    notificationsAllowed,
    userPersona,
    isUserPanelOpen,
    isSidebarOpen,
    isCcNewsModalOpen,
    isBibleAdOpen,
  ]);

  // Wdowi Grosz - Ticker/Toast Dzienny
  useEffect(() => {
    const checkWdowiGroszToast = () => {
      const today = new Date().toDateString();
      const lastToastDay = localStorage.getItem("cc_wdowi_grosz_toast_day");

      if (lastToastDay !== today) {
        addToast(
          uiLang === "pl"
            ? "Wesprzyj misję Christian Culture: Wdowi Grosz."
            : "Support Christian Culture mission: Widow's Mite.",
          "info",
        );
        localStorage.setItem("cc_wdowi_grosz_toast_day", today);
      }
    };
    
    if (appStarted && notificationsAllowed) {
      // Wyświetl po 3 minutach od startu, żeby nie wpadać na inne powiadomienia na początku
      const timer = setTimeout(checkWdowiGroszToast, 180000);
      return () => clearTimeout(timer);
    }
  }, [appStarted, notificationsAllowed, uiLang, addToast]);

  const handleEcosystemNavigation = (action: string) => {
    const [type, target] = action.split(":");

    // Voice & Global Actions
    if (type === "radio") {
      if (target === "play") radio.toggleRadio();
      if (target === "stop" && radio.isRadioPlaying) radio.toggleRadio();
      return;
    }

    if (type === "open") {
      switch (target) {
        case "admin_panel":
          setIsAdminPinModalOpen(true);
          break;
        case "business_card":
          setIsBusinessCardOpen(true);
          break;
        case "zbyszek_gieron":
          setIsZbyszekGieronOpen(true);
          break;
        case "katarzyna_fedkow":
          if (radio.isRadioPlaying) radio.toggleRadio();
          setIsKatarzynaFedkowModalOpen(true);
          break;
        case "emi_media":
          if (radio.isRadioPlaying) radio.toggleRadio();
          setIsEMIMediaModalOpen(true);
          break;
        case "instrumental_music":
          if (radio.isRadioPlaying) radio.toggleRadio();
          setIsInstrumentalMusicModalOpen(true);
          break;
        case "slideshow":
          setIsSlideshowOpen(true);
          break;
        case "yellow_card":
          setIsYellowCardOpen(true);
          break;
        case "wikifaith":
          window.open("https://wikifaith.org/pl", "_blank");
          break;
        case "bible_courses":
          window.open("https://kursybiblijne.pl/", "_blank");
          break;
        case "morning_inspirations":
          window.postMessage({ type: 'OPEN_MORNING_INSPIRATION' }, '*');
          break;
        case "christian_inspirations":
          window.postMessage({ type: 'OPEN_CHRISTIAN_INSPIRATION' }, '*');
          break;
        case "notifications":
          openManagement("notifications");
          break;
        case "bible":
          setIsVerseSearchOpen(true);
          break;
        case "my_files":
          setIsMyFilesModalOpen(true);
          break;
        case "wdowi_grosz":
          setIsWdowiGroszModalOpen(true);
          break;
        case "resources_cc":
          setIsCcResourcesModalOpen(true);
          break;
        case "media_player_page":
          setIsCcMediaPlayerPageOpen(true);
          break;
        case "patrons_page":
          setIsCcPatronsPageOpen(true);
          break;
        case "daily_reflections_pdf":
          window.open(
            "https://drive.google.com/file/d/1gxrZFQHNnbQR6r0sBta42u-AiQQvdaQM/view?usp=sharing",
            "_blank",
          );
          break;
        case "google_login":
          handleGoogleIdentityLink();
          break;
        case "daily_verse":
          setIsDailyVerseModalOpen(true);
          break;
      }
      return;
    }

    if (type === "navigate") {
      switch (target) {
        case "school":
          setIsBiblicalSchoolOpen(true);
          break;
        case "prayer":
          setIsPrayerIntentionsOpen(true);
          break;
        case "chat":
          setIsCentralChatOpen(true);
          break;
        case "mentor":
          setIsVoiceAssistantOpen(true);
          break;
        case "support":
          setIsSupportModalOpen(true);
          break;
        case "helping-hand":
          setIsHelpingHandModalOpen(true);
          break;
        case "studio-ds":
          setIsStudioDobregoSlowaModalOpen(true);
          break;
        case "coaching":
          setIsCoachingModalOpen(true);
          break;
        case "profile":
          openManagement("profile");
          break;
        case "dashboard":
          setCurrentView("dashboard");
          break;
        case "spotify":
          setIsSpotifyModalOpen(true);
          break;
        case "testimonies":
          setYoutubeInitialSource("testimonies");
          setIsYouTubeLiveModalOpen(true);
          break;
        case "radio":
          setCurrentView("radio");
          break;
        case "store":
          setIsStoreModalOpen(true);
          break;
        case "ecosystem-map":
        case "live-global":
          setIsLiveGlobalMapOpen(true);
          break;
        case "reading-room":
          setIsReadingRoomOpen(true);
          break;
        case "law-decalogue":
          setIsLawDecalogueOpen(true);
          break;
        case "imagination-studio":
          setCurrentView("imagination-studio");
          break;
        case "song-creator":
          setCurrentView("song-creator");
          break;
        case "biblia":
          setIsVerseSearchOpen(true);
          break;
        case "news":
          setIsCcNewsModalOpen(true);
          break;
        case "calendar":
          setIsWeeklyScheduleModalOpen(true);
          break;
        case "open-letter":
          setIsOpenLetterOpen(true);
          break;
        case "partners":
          setIsStrategicPartnersOpen(true);
          break;
        case "sms":
          setIsSmsSubscriptionModalOpen(true);
          break;
      }
    }
  };

  useEffect(() => {
    // Listener dla Deeplinków (np. z Widgetu Androida)
    const urlListener = CapacitorApp.addListener("appUrlOpen", (event) => {
      const url = event.url;
      console.log("[Routing] Caught appUrlOpen event:", url);

      if (url.includes("cclite://radio/toggle")) {
        radio.toggleRadio();
        setCurrentView("radio");
      } else if (url.includes("cclite://radio/next")) {
        radio.nextStream();
        setCurrentView("radio");
      } else if (url.includes("cclite://radio/prev")) {
        radio.prevStream();
        setCurrentView("radio");
      } else if (url.includes("cclite://radio/share")) {
        const shareText = "Słuchaj CC Radio! https://cclite.pl";
        nativeService
          .share("CC Radio", shareText, "https://cclite.pl")
          .then((success) => {
            if (!success) {
              try {
                navigator.clipboard.writeText(shareText);
              } catch {}
            }
          });
      }
    });

    return () => {
      urlListener.then((l) => l.remove());
    };
  }, [radio]);

  // Sync Native Radio Widget
  useEffect(() => {
    if (nativeService.isNative()) {
      let streamName = "CC Polska";
      if (radio.activeStream === "BIBLIA") streamName = "Biblia Audio";
      else if (radio.activeStream === "GLOBAL") streamName = "CC Global";

      nativeService.updateRadioWidgetData(radio.isRadioPlaying, streamName);
    }
  }, [radio.isRadioPlaying, radio.activeStream]);

  const handleRadioStreamChange = (stream: "PL" | "GLOBAL" | "BIBLIA") => {
    radio.playStream(stream);
    setCurrentView("radio");
  };

  const handleLanguageChange = useCallback(
    (lang: SupportedLanguage) => {
      if ((radio.activeStream === "PL" || radio.activeStream === "BIBLIA") && lang !== "pl") {
        setAppLanguage("pl");
        i18n.changeLanguage("pl");
        PersistenceService.safeSetItem("app_language_cc_radio", "pl");
        return;
      }
      if (radio.activeStream === "GLOBAL" && lang !== "en") {
        setAppLanguage("en");
        i18n.changeLanguage("en");
        PersistenceService.safeSetItem("app_language_cc_radio", "en");
        return;
      }
      setAppLanguage(lang);
      i18n.changeLanguage(lang);
      PersistenceService.safeSetItem("app_language_cc_radio", lang);
    },
    [i18n, radio.activeStream, addToast, uiLang, setAppLanguage],
  );

  useEffect(() => {
    if (radio.activeStream === "PL" || radio.activeStream === "BIBLIA") {
      if (appLanguage !== "pl") {
        setAppLanguage("pl");
        i18n.changeLanguage("pl");
        PersistenceService.safeSetItem("app_language_cc_radio", "pl");
      }
    } else if (radio.activeStream === "GLOBAL") {
      if (appLanguage !== "en") {
        setAppLanguage("en");
        i18n.changeLanguage("en");
        PersistenceService.safeSetItem("app_language_cc_radio", "en");
      }
    }
  }, [radio.activeStream, appLanguage, i18n, setAppLanguage]);

  // Default spatial mode for BIBLIA stream
  useEffect(() => {
    if (radio.activeStream === "BIBLIA" && spatialMode === "none") {
      setSpatialMode("room");
    }
  }, [radio.activeStream, spatialMode]);

  // Expose stopPlayback globally for notification actions
  useEffect(() => {
    (window as any).cc_stopRadio = () => {
      if (radio.isRadioPlaying) {
        radio.stopPlayback();
      }
    };
    return () => {
      delete (window as any).cc_stopRadio;
    };
  }, [radio.isRadioPlaying, radio.stopPlayback]);

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const favorites = userPersona.favorites || [];
      const exists = favorites.find((f) => f.id === item.id);
      let newFavorites;
      if (exists) {
        newFavorites = favorites.filter((f) => f.id !== item.id);
        addToast(
          appLanguage === "pl"
            ? "Usunięto z ulubionych"
            : "Removed from favorites",
          "info",
        );
      } else {
        newFavorites = [...favorites, item];
        addToast(
          appLanguage === "pl" ? "Dodano do ulubionych" : "Added to favorites",
          "success",
        );
      }
      setUserPersona({ ...userPersona, favorites: newFavorites });
    },
    [userPersona, setUserPersona, appLanguage, addToast],
  );

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      // Swipe gestures temporarily disabled
      // if (currentView !== 'radio') return;
      // console.log('[Gestures] Swipe Left -> Prev Stream');
      // nativeService.hapticImpact(ImpactStyle.Light);
      // radio.prevStream();
    },
    onSwipeRight: () => {
      // Swipe gestures temporarily disabled
      // if (currentView !== 'radio') return;
      // console.log('[Gestures] Swipe Right -> Next Stream');
      // nativeService.hapticImpact(ImpactStyle.Light);
      // radio.nextStream();
    },
    onSwipeUp: () => {
      // Swipe gestures for Matrix disabled per request
      // if (currentView !== "radio") return;
      // console.log("[Gestures] Swipe Up -> Full Radio (Matrix)");
      // nativeService.hapticImpact(ImpactStyle.Medium);
      // setIsMatrixOpen(true);
    },
    onSwipeDown: () => {
      // Swipe gestures for Matrix disabled per request
    },
  });

  const dailyVerse = useMemo(() => {
    if (!dualDailyVerse) return null;

    // If on GLOBAL stream, prioritize English
    if (radio.activeStream === "GLOBAL") {
      const enVerse = dualDailyVerse.en;
      if (
        enVerse &&
        enVerse.text &&
        !enVerse.text.includes("Miriam is translating")
      ) {
        console.log(
          `[Verse] GLOBAL stream detected, forcing English verse:`,
          enVerse.reference,
        );
        return enVerse;
      }
    }

    // Fallback logic: try current language, then 'en', then 'pl'
    const verse =
      (dualDailyVerse as any)[appLanguage] ||
      dualDailyVerse.en ||
      dualDailyVerse.pl;
    console.log(
      `[Verse] Selected verse for language ${appLanguage} (Stream: ${radio.activeStream}):`,
      verse?.reference,
    );
    return verse;
  }, [dualDailyVerse, appLanguage, radio.activeStream]);

  useEffect(() => {
    if (isDailyVerseModalOpen) {
      setSelectedDailyVerseForModal(dailyVerse);
    }
  }, [dailyVerse, isDailyVerseModalOpen]);

  useEffect(() => {
    // Expose current UID for Modals
    if (userPersona?.uid) {
       (window as any).cc_current_uid = userPersona.uid;
    }
  }, [userPersona?.uid]);

  const [initialMorningPostId, setInitialMorningPostId] = useState<string | null>(null);
  const [initialChristianPostId, setInitialChristianPostId] = useState<string | null>(null);

  // Deep Linking Routing Logic
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/ksiazka/')) {
      const bookId = path.split('/')[2];
      if (bookId) {
        setIsReadingRoomOpen(true);
        
        // Update meta tags for client-side routing
        const updateMeta = (title: string, desc: string, img: string) => {
           document.title = title;
           document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
           document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
           document.querySelector('meta[property="og:image"]')?.setAttribute("content", img);
        };
        
        if (bookId === 'biblia-ubg') {
           updateMeta("Biblia UBG - Christian Culture", "Darmowa Biblia UBG. Ponosisz tylko koszt przesyłki.", window.location.origin + "/books/biblia_ubg_cover.webp");
        } else if (bookId === 'kod-zrodlowy') {
           updateMeta("Kod Źródłowy - Christian Culture", "Niezwykła podróż do fundamentów wiary i zrozumienia duchowej rzeczywistości.", window.location.origin + "/books/kod_zrodlowy_cover.webp");
        }

        setTimeout(() => {
          const evt = new CustomEvent('deeplink-ksiazka', { detail: { bookId } });
          window.dispatchEvent(evt);
        }, 800);
      }
    } else if (path.startsWith('/profil/')) {
      const profileId = path.split('/')[2];
      if (profileId) {
         setPublicProfileId(profileId);
         setIsPublicProfileModalOpen(true);
      }
    } else if (path.startsWith('/post/')) {
      const postId = path.split('/')[2];
      if (postId) {
        setInitialMorningPostId(postId);
      }
    } else if (path.startsWith('/inspiration/')) {
      const postId = path.split('/')[2];
      if (postId) {
        setInitialChristianPostId(postId);
      }
    }

    const handleOpenProfile = (e: any) => {
       if (e.detail && e.detail.uid) {
           setPublicProfileId(e.detail.uid);
           setIsPublicProfileModalOpen(true);
       }
    };
    window.addEventListener('open-public-profile', handleOpenProfile);
    return () => window.removeEventListener('open-public-profile', handleOpenProfile);
  }, []);

  const hasAutostartedRef = useRef(false);
  // Nowy stan do synchronizacji z Tickerem w celu pozycjonowania Toastów
  const [isIntentionsBarVisible, setIsIntentionsBarVisible] = useState(false);
  const [isTopNewsExpanded, setIsTopNewsExpanded] = useState(false);

  // Real-time Presence & Community
  useEffect(() => {
    console.log("[PresenceEffect] Subscribing to community features...");


    // 2. Presence Subscription - Also available for guests (read only)
    const unsubscribeLive = CommunityService.subscribeToLivePresence(setLiveUsers);

    // 3. User Heartbeat - Requires effective UID
    let interval: NodeJS.Timeout | null = null;
    const effectiveUid = auth.currentUser?.uid || userPersona.uid;

    if (appStarted && effectiveUid) {
      const update = () => {
        CommunityService.updatePresence(
          effectiveUid,
          userPersona.name,
          radio.activeStream,
          radio.activeStream === "BIBLIA" || isIntentionsBarVisible,
        ).catch((err) => console.warn("Failed to update presence:", err.message));
      };
      update();
      interval = setInterval(update, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
      unsubscribeLive();
    };
  }, [
    appStarted,
    userPersona.uid,
    userPersona.name,
    radio.activeStream,
    auth.currentUser?.uid,
    isIntentionsBarVisible,
  ]);

  const [activeChatBubbles, setActiveChatBubbles] = useState<ChatMessage[]>([]);
  const removeChatBubble = useCallback((id: string) => {
    setActiveChatBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleReplyToBubble = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      try {
        const messagesRef = ref(rtdb, "chat_messages");
        const messageData = {
          text: text.trim(),
          userName: userPersona.name || "Pielgrzym",
          userAvatar: userPersona.profilePicture || "",
          userId: userPersona.uid || "guest",
          timestamp: rtdbTimestamp(),
        };
        await push(messagesRef, messageData);

        // Also send to global if that's the intention
        const globalRef = ref(rtdb, "global_cc_radio");
        await push(globalRef, messageData);
      } catch (error) {
        console.error("[Reply] Error sending message:", error);
      }
    },
    [userPersona],
  );

  // Real-time Chat Notifications
  useEffect(() => {
    if (!appStarted) return;

    const messagesRef = ref(rtdb, "chat_messages");
    const recentMessagesQuery = rtdbQuery(messagesRef, limitToLast(1));
    let isInitialLoad = true;

    const unsubscribe = onChildAdded(recentMessagesQuery, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      const data = snapshot.val();
      if (data && data.userId !== (auth.currentUser?.uid || userPersona.uid)) {
        const newMessage: ChatMessage = {
          id: snapshot.key as string,
          text: data.text || "",
          userName: data.userName || "Pielgrzym",
          userAvatar:
            data.userAvatar ||
            `https://ui-avatars.com/api/?name=${data.userName}&background=random`,
          timestamp: data.timestamp || Date.now(),
          userId: data.userId || "guest",
          status: "sent",
        };

        // Add to active bubbles
        setActiveChatBubbles((prev) => {
          // Limit to 3 active bubbles at once
          const next = [newMessage, ...prev];
          return next.slice(0, 3);
        });

        const chatNotif: SystemNotification = {
          id: `chat-${snapshot.key}-${Date.now()}`,
          title: appLanguage === "pl" ? "Nowa wiadomość" : "New message",
          message: data.text,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: "info",
          icon: "💬",
          action: {
            label: appLanguage === "pl" ? "OTWÓRZ CZAT" : "OPEN CHAT",
            onClick: () => setIsCentralChatOpen(true),
          },
        };
        setSystemNotifications([chatNotif, ...systemNotifications]);

        // Also show a toast for immediate feedback
        addToast(
          appLanguage === "pl"
            ? `Nowa wiadomość od ${data.userName}`
            : `New message from ${data.userName}`,
          "info",
          {
            label: appLanguage === "pl" ? "CZYTAJ" : "READ",
            onClick: () => setIsCentralChatOpen(true),
          },
        );
      }
    });

    return () => unsubscribe();
  }, [
    appStarted,
    appLanguage,
    systemNotifications,
    setSystemNotifications,
    addToast,
    userPersona.uid,
  ]);

  // Stop radio when YouTube Live or Shabbat Modal opens
  useEffect(() => {
    if (
      (isYouTubeLiveModalOpen || isShabbatModalOpen) &&
      radio.isRadioPlaying
    ) {
      radio.stopPlayback();
    }
  }, [
    isYouTubeLiveModalOpen,
    isShabbatModalOpen,
    radio.isRadioPlaying,
    radio.stopPlayback,
  ]);

  // INTELIGENTNY SYSTEM POWIADOMIEŃ (KASKADOWY)
  useEffect(() => {
    if (!appStarted) return;

    const checkNotifications = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDate();

      // 2. CUDA KAŻDEGO DNIA (18:00 - 19:00) - YouTube Live Modal
      if (notificationSettings.dailyMiraclesEnabled && hour === 18) {
        const lastCudaLiveUpdate = localStorage.getItem(
          "cc_last_cuda_live_modal",
        );
        if (lastCudaLiveUpdate !== now.toDateString()) {
          setYoutubeNotificationProps({
            isOpen: true,
            title: "Cuda Każdego Dnia",
            subtitle: "Premiera na kanale Osobowość Plus",
            description: `"Wszystko jest możliwe dla tego, kto wierzy." Rozpoczynamy wieczorną audycję świadectw. Dołącz do naszej wspólnoty na YouTube.`,
            playlistUrl:
              "https://youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW&si=fDyyvGRqhw5XL1MJ",
          });
          if (radio.isRadioPlaying) radio.stopPlayback();
          PersistenceService.safeSetItem(
            "cc_last_cuda_live_modal",
            now.toDateString(),
          );
        }
      }

      // PREMIERA: OBJAWIENIE (Niedziela 21:00)
      if (now.getDay() === 0 && hour === 21) {
        const lastObjawienieUpdate = localStorage.getItem(
          "cc_last_objawienie_premiere",
        );
        if (lastObjawienieUpdate !== now.toDateString()) {
          setYoutubeNotificationProps({
            isOpen: true,
            title: "Objawienie",
            subtitle: "Premiera serii",
            description: `Premiera w każdą niedzielę o 21:00. Zapraszamy na najnowszy odcinek serii Objawienie. Poznaj Boże tajemnice i wzrastaj w wierze z Christian Culture. Oglądaj teraz.`,
            playlistUrl:
              "https://www.youtube.com/playlist?list=PLDA6geI28g8QBRVh8GU5zsWEMTaJjrEQk",
          });
          if (radio.isRadioPlaying) radio.stopPlayback();
          PersistenceService.safeSetItem(
            "cc_last_objawienie_premiere",
            now.toDateString(),
          );
        }
      }

      // 3. Wsparcie (1 i 15 dnia miesiąca o 10:00)
      if (
        notificationSettings.supportRemindersEnabled &&
        (day === 1 || day === 15) &&
        hour === 10
      ) {
        const lastSupportUpdate = localStorage.getItem("cc_last_support_notif");
        if (lastSupportUpdate !== now.toDateString()) {
          const notif = NotificationService.generateNotification(
            "support",
            appLanguage,
          );
          addToast(notif.message, "success");
          PersistenceService.safeSetItem(
            "cc_last_support_notif",
            now.toDateString(),
          );
        }
      }

      // 4. SZABAT (Piątek po zachodzie słońca)
      if (now.getDay() === 5) {
        let lat = 50.9297;
        let lng = 21.3881;
        if (userPersona.location && userPersona.location.includes(",")) {
          const [lLat, lLng] = userPersona.location.split(",").map(Number);
          if (!isNaN(lLat) && !isNaN(lLng)) {
            lat = lLat;
            lng = lLng;
          }
        }
        const times = SunCalc.getTimes(now, lat, lng);
        const sunset = times.sunset;

        if (now >= sunset) {
          const lastShabbatWelcome = localStorage.getItem(
            "cc_last_shabbat_welcome",
          );
          const todayStr = now.toDateString();
          if (lastShabbatWelcome !== todayStr) {
            setIsShabbatModalOpen(true);
            if (radio.isRadioPlaying) {
              radio.stopPlayback();
            }
            PersistenceService.safeSetItem("cc_last_shabbat_welcome", todayStr);
          }
        }
      }
    };

    const interval = setInterval(checkNotifications, 60000); // Co minutę
    checkNotifications(); // I na starcie
    return () => clearInterval(interval);
  }, [
    appStarted,
    notificationSettings,
    appLanguage,
    addToast,
    radio,
    userPersona,
  ]);


  // Mark autostart as done if radio starts playing for any reason
  useEffect(() => {
    if (radio.isRadioPlaying) {
      hasAutostartedRef.current = true;
    }
  }, [radio.isRadioPlaying]);

  // AUTOSTART RADIO PO INTERAKCJI Z EKRANEM STARTOWYM
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (
        appStarted &&
        userPersona.autostartRadio &&
        !radio.isRadioPlaying &&
        !hasAutostartedRef.current
      ) {
        console.log("[Radio] Autostart on first interaction...");
        radio.playStream(radio.activeStream);
      }
      // Always mark as attempted on first interaction if autostart is enabled
      if (appStarted && userPersona.autostartRadio) {
        hasAutostartedRef.current = true;
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    if (
      appStarted &&
      userPersona.autostartRadio &&
      !hasAutostartedRef.current
    ) {
      window.addEventListener("click", handleFirstInteraction, { once: true });
      window.addEventListener("touchstart", handleFirstInteraction, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [
    appStarted,
    userPersona.autostartRadio,
    radio.isRadioPlaying,
    radio.activeStream,
  ]);

  useEffect(() => {
    if (
      appStarted &&
      userPersona.autostartRadio &&
      !radio.isRadioPlaying &&
      !hasAutostartedRef.current
    ) {
      const timer = setTimeout(() => {
        radio.playStream(radio.activeStream);
        hasAutostartedRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [appStarted, userPersona.autostartRadio, radio.activeStream]);

  useEffect(() => {
    if (userPersona.isFirstRun !== false) {
      if (appLanguage === "en") {
        radio.setActiveStream("GLOBAL");
        PersistenceService.saveLastStream("GLOBAL");
      }
      setUserPersona({ ...userPersona, isFirstRun: false });
    }
  }, [userPersona.isFirstRun, appLanguage, radio]);

  useEffect(() => {
    const checkUpdates = () => {
      const now = new Date();
      const hour = now.getHours();
      const currentSlot = NotificationService.getUpdateSlot(hour);

      if (currentSlot === "cuda") return;

      const lastUpdateStr = localStorage.getItem("cc_last_notif_update");
      if (
        currentSlot &&
        NotificationService.shouldUpdate(lastUpdateStr, currentSlot)
      ) {
        // Record update FIRST to prevent logical race conditions in intervals
        PersistenceService.safeSetItem(
          "cc_last_notif_update",
          JSON.stringify({
            date: now.toDateString(),
            slot: currentSlot,
          }),
        );

        const newNotif = NotificationService.generateNotification(
          currentSlot,
          appLanguage,
        );

        setSystemNotifications((prev) => {
          if (prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
      }
    };
    checkUpdates();
    const interval = setInterval(checkUpdates, 60000);
    return () => clearInterval(interval);
  }, [appLanguage, setSystemNotifications]);

  // WYMUSZENIE WIDOKU RADIA PRZY STARCIE
  // REMOVED DUPLICATE: const [currentView, setCurrentView] = useState<'dashboard' | 'radio' | 'community'>('radio');

  const handleOpenDashboard = useCallback(() => {
    const doScroll = () => {
      const el = document.getElementById("cc-organizer");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    if (currentView !== "dashboard") {
      setCurrentView("dashboard");
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === "community" && radio.isRadioPlaying) {
      radio.stopPlayback();
    }
  }, [currentView, radio.isRadioPlaying, radio.stopPlayback]);

  const openManagement = useCallback((tab: ManagementTab) => {
    setManagementInitialTab(tab);
    setIsManagementCenterOpen(true);
    setIsSidebarOpen(false);
    setIsUserPanelOpen(false);
  }, []);

  const openCentralChat = useCallback(
    (view?: any, userId?: string, message?: string) => {
      setChatInitialView(view);
      setChatInitialUserId(userId);
      setChatInitialMessage(message);
      setIsCentralChatOpen(true);

      // Clear chat-related notifications
      const filteredNotifs = systemNotifications.filter(
        (n) => !n.id.startsWith("chat-"),
      );
      if (filteredNotifs.length !== systemNotifications.length) {
        setSystemNotifications(filteredNotifs);
      }
    },
    [systemNotifications, setSystemNotifications],
  );

  const handleMiriamVoiceAction = useCallback(
    (
      action:
        | RadioStreamType
        | "STOP"
        | "STANDARD_MODE"
        | "BLIND_MODE"
        | "INSTALL"
        | "EXIT",
    ) => {
      if (action === "STOP") radio.stopPlayback();
      else if (action === "STANDARD_MODE")
        setUserPersona({ ...userPersona, appMode: "standard" });
      else if (action === "BLIND_MODE")
        setUserPersona({ ...userPersona, appMode: "blind" });
      else if (action === "INSTALL") triggerDirectInstall();
      else if (action === "EXIT") {
        setAppStarted(false);
        setStartModeChoice(null);
        localStorage.removeItem("cc_app_start_choice");
        PersistenceService.clearSSOCookie();
        setIsVoiceAssistantOpen(false);
      } else {
        const newLang = action === "PL" || action === "BIBLIA" ? "pl" : "en";
        setAppLanguage(newLang);
        PersistenceService.safeSetItem("app_language_cc_radio", newLang);
        radio.playStream(action as RadioStreamType);
        setCurrentView("radio");
      }
    },
    [radio, userPersona, setUserPersona, triggerDirectInstall],
  );

  const requestInitialLocation = useCallback(() => {
    if (navigator.geolocation) {
      addToast(t("location.fetching"), "info");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
          setUserPersona({
            ...userPersona,
            location: coords,
            geolocationConsent: true,
          });
          addToast(t("location.success"), "success");
        },
        () => {
          setUserPersona({ ...userPersona, geolocationConsent: false });
          addToast(t("location.denied"), "info");
        },
        { timeout: 10000 },
      );
    }
  }, [userPersona, setUserPersona, t, addToast]);

  const handleStartAppStandard = useCallback(
    (remember: boolean = false) => {
      requestInitialLocation();
      if (remember) PersistenceService.saveRememberedStartMode("standard");
      PersistenceService.safeSetItem("cc_app_start_choice", "standard");
      setStartModeChoice("standard");
      setUserPersona({ ...userPersona, appMode: "standard" });
      setAppStarted(true);

      // Manual autostart trigger on interaction
      if (
        userPersona.autostartRadio &&
        !radio.isRadioPlaying &&
        !hasAutostartedRef.current
      ) {
        radio.playStream(radio.activeStream);
        hasAutostartedRef.current = true;
      }
    },
    [userPersona, setUserPersona, requestInitialLocation, radio],
  );

  const handleStartAppBlind = useCallback(
    (remember: boolean = false) => {
      requestInitialLocation();
      if (remember) PersistenceService.saveRememberedStartMode("blind");
      PersistenceService.safeSetItem("cc_app_start_choice", "blind");
      setStartModeChoice("blind");
      setUserPersona({ ...userPersona, appMode: "blind" });
      setAppStarted(true);
      setCurrentView("radio");
      setIsVoiceAssistantOpen(true);

      // Manual autostart trigger on interaction
      if (
        userPersona.autostartRadio &&
        !radio.isRadioPlaying &&
        !hasAutostartedRef.current
      ) {
        radio.playStream(radio.activeStream);
        hasAutostartedRef.current = true;
      }
    },
    [userPersona, setUserPersona, requestInitialLocation, radio],
  );

  const handleHardRefresh = useCallback(async () => {
    addToast(t("system.updating"), "info");
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((regs) => regs.unregister()));
    }
    localStorage.removeItem("cc_bible_ubg_flat_v7_2");
    window.location.reload();
  }, [t, addToast]);

  const handleShareRadio = useCallback(async () => {
    const shareText = "Słuchaj CC Radio! https://cclite.pl";
    const success = await nativeService.share(
      "CC Radio",
      shareText,
      "https://cclite.pl",
    );
    if (!success) {
      addToast(t("common.copied"), "success");
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {}
    }
  }, [t, addToast]);

  const handleShareApp = useCallback(async () => {
    const shareText = t("verse.share");
    const success = await nativeService.share(
      "CC App",
      shareText,
      "https://cclite.pl",
    );
    if (!success) {
      addToast(t("common.copied"), "success");
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {}
    }
  }, [t, addToast]);

  const handleGlobalBibleSearch = useCallback((query: string) => {
    setVerseSearchInitialQuery(query);
    setIsVerseSearchOpen(true);
  }, []);

  const unreadNotifsCount = systemNotifications.filter((n) => !n.isRead && n.id.startsWith("chat-")).length;

  const { isSyncing, handleGoogleIdentityLink } = useGoogleIdentityLink({
    uiLang,
    userPersona,
    setUserPersona,
    addToast,
    dynamicDB,
    setDynamicDB,
  });

  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  const checkIsMobile = () => /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 1024 && window.matchMedia("(pointer: coarse)").matches);
  const checkIsLandscape = () => {
    if (window.screen && window.screen.orientation) {
      return window.screen.orientation.type.includes("landscape");
    }
    return window.matchMedia("(orientation: landscape)").matches;
  };

  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(
    () => checkIsMobile(),
  );
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);

  useEffect(() => {
    const handleActivity = () => {
      // Automatic screensaver is disabled per user request ("Tylko na życzenie")
      // We only clear the screensaver if it's active and user interacts
      setIsScreensaverActive(false);
    };

    const handleStartScreensaver = () => {
      // Allow manual screensaver activation if radio is playing
      setIsScreensaverActive(true);
    };

    window.addEventListener("start-screensaver", handleStartScreensaver);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("start-screensaver", handleStartScreensaver);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // const isL = checkIsLandscape();
      const isMobile = checkIsMobile();
      
      // Temporarily disabled due to bugs:
      setIsLandscape(false);
      setIsMobileDevice(isMobile);

      // Tryb pełnoekranowy radia i odtwarzacza multimedialnego w poziomie działa automatycznie dzięki stylowaniu isLandscape
      // Tryb samochodowy (Matrix) funkcjonuje niezależnie
      if (isMatrixOpen && !isMobile) {
        // Optionally close matrix if moving to desktop, but let's keep it simple
      }
    };
    window.addEventListener("resize", handleResize);
    // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, [radio.isRadioPlaying, currentView, isMatrixOpen]);

  useGlobalErrorHandling(appLanguage, addToast);

  useAndroidBackButton({
    appLanguage,
    addToast,
    isLessonReadingModalOpen,
    setIsLessonReadingModalOpen,
    isYouTubeLiveModalOpen,
    setIsYouTubeLiveModalOpen,
    isSpotifyModalOpen,
    setIsSpotifyModalOpen,
    isMatrixOpen,
    setIsMatrixOpen,
    isBusinessCardOpen,
    setIsBusinessCardOpen,
    isAdminPinModalOpen,
    setIsAdminPinModalOpen,
    isGamesModalOpen,
    setIsGamesModalOpen,
    isMyFilesModalOpen,
    setIsMyFilesModalOpen,
    isWeeklyScheduleModalOpen,
    setIsWeeklyScheduleModalOpen,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    isTvStudyModalOpen,
    setIsTvStudyModalOpen,
    isCcResourcesModalOpen,
    setIsCcResourcesModalOpen,
    isWdowiGroszModalOpen,
    setIsWdowiGroszModalOpen,
    isKatarzynaFedkowModalOpen,
    setIsKatarzynaFedkowModalOpen,
    isEMIMediaModalOpen,
    setIsEMIMediaModalOpen,
    isCentralChatOpen,
    setIsCentralChatOpen,
    isBiblicalSchoolOpen,
    setIsBiblicalSchoolOpen,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    isManagementCenterOpen,
    setIsManagementCenterOpen,
    isUserPanelOpen,
    setIsUserPanelOpen,
    isBibleAdOpen,
    setIsBibleAdOpen,
    isDailyVerseModalOpen,
    setIsDailyVerseModalOpen,
    isSupportModalOpen,
    setIsSupportModalOpen,
    isHelpingHandModalOpen,
    setIsHelpingHandModalOpen,
    isStudioDobregoSlowaModalOpen,
    setIsStudioDobregoSlowaModalOpen,
    isCoachingModalOpen,
    setIsCoachingModalOpen,
    isInstallationGuideOpen,
    setIsInstallationGuideOpen,
    isTutorialOpen,
    setIsTutorialOpen,
    isStoreModalOpen,
    setIsStoreModalOpen,
    isReadingRoomOpen,
    setIsReadingRoomOpen,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    isOpenLetterOpen,
    setIsOpenLetterOpen,
    isCcNewsModalOpen,
    setIsCcNewsModalOpen,
    isEcosystemMapOpen,
    setIsEcosystemMapOpen,
    isStrategicPartnersOpen,
    setIsStrategicPartnersOpen,
    isZbyszekGieronOpen,
    setIsZbyszekGieronOpen,
    isSmsSubscriptionModalOpen,
    setIsSmsSubscriptionModalOpen,
    isPrayerIntentionsOpen,
    setIsPrayerIntentionsOpen,
    isShabbatModalOpen,
    setIsShabbatModalOpen,
    isVerseSearchOpen,
    setIsVerseSearchOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isFarewellScreenOpen,
    setIsFarewellScreenOpen,
    currentView,
    setCurrentView,
  });

  const rdsMetadata = useMetadata(radio.activeStream, radio.isRadioPlaying);
  const stationName = useMemo(() => {
    return (
      dynamicDB?.["Stacje cc"]?.[radio.activeStream]?.name || radio.activeStream
    );
  }, [dynamicDB, radio.activeStream]);

  const rdsText = useMemo(() => {
    if (radio.isRadioPlaying && rdsMetadata) {
      const prefix =
        radio.activeStream === "GLOBAL" ? "NOW PLAYING" : "TERAZ GRAMY";
      return `${prefix}: ${rdsMetadata} | ${stationName}`;
    }
    return "";
  }, [radio.isRadioPlaying, rdsMetadata, stationName, radio.activeStream]);

  const disableScreensaverForToday = useCallback(() => {
    localStorage.setItem(
      "cc_screensaver_disabled_date",
      new Date().toDateString(),
    );
    setIsScreensaverActive(false);
    addToast(
      appLanguage === "pl"
        ? "Wygaszacz wyłączony do jutra."
        : "Screensaver disabled until tomorrow.",
      "info",
    );
  }, [appLanguage, addToast]);

  const isScreensaverShowing =
    userPersona.screensaverEnabled !== false &&
    radio.isRadioPlaying &&
    isScreensaverActive &&
    (currentView === "radio" || isMatrixOpen) &&
    !isSlideshowOpen;

  // Force Audio Resume on first valid user interaction
  useEffect(() => {
    const unlockAudio = async () => {
      console.log("[AudioUnlock] User interaction detected. Checking radio state...");
      
      // Resume AudioContext if it exists (for visualizers etc)
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const dummyCtx = new AudioContextClass();
          if (dummyCtx.state === 'suspended') {
            await dummyCtx.resume();
            console.log("[AudioUnlock] AudioContext resumed.");
          }
        }
      } catch (e) {}

      // If radio is supposed to be playing but is paused, try to kickstart it
      if (PersistenceService.loadIsPlaying()) {
        console.log("[AudioUnlock] Radio should be playing. Attempting to trigger cc_start_radio...");
        // This event tells useRadio effects to try playing again
        window.dispatchEvent(new CustomEvent('cc_trigger_autostart_resume'));
      }
      
      // Remove listeners after first success or interaction
      window.removeEventListener('mousedown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('mousedown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('click', unlockAudio);
    
    return () => {
      window.removeEventListener('mousedown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  const isCarMode = false; // appStarted && isMobileDevice && isLandscape && currentView === "radio" && !isMatrixOpen;

  return (
    <div
      className={`dark h-[100dvh] w-full flex flex-col justify-center overflow-hidden select-none bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f160b] via-[#050505] to-black text-white font-sans ${userPersona.appMode === "blind" ? "blind-mode" : ""} ${isLandscape ? "is-landscape" : ""} ${isCarMode ? "car-mode-active" : ""}`}
    >
      <Suspense fallback={<div className="h-[100dvh] w-full flex items-center justify-center bg-black"><div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#C5A059] animate-spin"></div></div>}>
      <header></header>
      {!appStarted && !startModeChoice && (
        <StartupModeSelection
          onSelectStandard={handleStartAppStandard}
          onSelectBlind={handleStartAppBlind}
          onRequestLocation={requestInitialLocation}
          appLanguage={appLanguage}
          isTickerExpanded={isIntentionsBarVisible}
        />
      )}

      {appStarted && isMobileDevice && isLandscape && currentView === "radio" && !isMatrixOpen && (
        <MobileLandscapeCarMode
          dailyVerse={dailyVerse}
          uiLang={uiLang}
          addToast={addToast}
          radio={radio}
          userPersona={userPersona}
          spatialMode={spatialMode}
          setSpatialMode={setSpatialMode}
          equalizer={equalizer}
          setEqualizer={setEqualizer}
          setCurrentView={setCurrentView}
          openCentralChat={openCentralChat}
        />
      )}

      {appStarted && !isCarMode && (
        <TopNewsTicker
          appLanguage={uiLang}
            activeStream={radio.activeStream}
            installStatus={installStatus}
          onInstallClick={triggerDirectInstall}
          onOpenSmsSubscriptionModal={() => setIsSmsSubscriptionModalOpen(true)}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onShareApp={handleShareApp}
          onIntentionsVisibilityChange={setIsIntentionsBarVisible}
          onExpandedChange={setIsTopNewsExpanded}
          userPersona={userPersona}
          onToggleFavorite={toggleFavorite}
          dailyVerse={
            dualDailyVerse
              ? dualDailyVerse[uiLang] ||
                (uiLang === "pl" ? dualDailyVerse.pl : dualDailyVerse.en)
              : null
          }
          onOpenCcNews={() => setIsCcNewsModalOpen(true)}
          onOpenEcosystemMap={() => setIsEcosystemMapOpen(true)}
          onOpenReadingRoom={() => setIsReadingRoomOpen(true)}
          onOpenHelpingHand={() => setIsHelpingHandModalOpen(true)}
          onOpenStudioDobregoSlowa={() =>
            setIsStudioDobregoSlowaModalOpen(true)
          }
          onOpenCoaching={() => setIsCoachingModalOpen(true)}
          onOpenDashboard={handleOpenDashboard}
          addToast={addToast}
          onOpenMusicNews={() =>
            setYoutubeNotificationProps({
              isOpen: true,
              title: "NOWOŚCI MUZYCZNE 2026",
              subtitle: "WŁĄCZ PLAYLISTĘ",
              description:
                "Polecamy nową playlistę z chrześcijańskimi nowościami muzycznymi na rok 2026.",
              playlistUrl:
                "https://youtube.com/playlist?list=PLQBdxcl9HBc_NZedkCUTlrUZhZAtqodU1",
            })
          }
          onOpenOpenLetter={() => setIsOpenLetterOpen(true)}
          onOpenZbyszekGieron={() => setIsZbyszekGieronOpen(true)}
          onOpenEmi={() => setIsEMIMediaModalOpen(true)}
          onOpenInstrumentalMusic={() => setIsInstrumentalMusicModalOpen(true)}
        />
      )}
      <RotatingBackground
        activeStream={radio.activeStream}
        visualMode={visualMode}
      />
      <AudioVisualizer
        audioRef={radio.audioRef}
        isPlaying={radio.isRadioPlaying}
        visualizerEnabled={radio.useCORS}
        spatialMode={spatialMode}
        equalizer={equalizer}
        isFullScreen={isScreensaverShowing}
      />

      {/* Screensaver Overlay */}
      {isScreensaverShowing && (
        <div
          className="fixed inset-0 z-[9600] pointer-events-auto flex flex-col justify-end"
          onClick={(e) => setIsScreensaverActive(false)}
        >
          <div className="relative z-10 w-full flex justify-center pb-24">
            {rdsText && (
              <div className="w-full max-w-4xl overflow-hidden px-8">
                <div
                  className={`text-[0.75rem] sm:text-[1.5rem] font-medium text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] uppercase tracking-[0.2em] whitespace-nowrap ${rdsText.length > 15 ? "animate-marquee" : "text-center"}`}
                  style={
                    rdsText.length > 15
                      ? { animationDuration: `${rdsText.length * 0.4}s` }
                      : {}
                  }
                >
                  {rdsText.length > 15 ? (
                    <>
                      <span>{rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span>{rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span>{rdsText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </>
                  ) : (
                    rdsText
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Neutral Access Zone for buttons */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute bottom-6 w-full flex justify-center gap-4 px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  disableScreensaverForToday();
                }}
                className="px-4 py-2 bg-black/60 backdrop-blur-md text-zinc-400 hover:text-white border border-white/10 hover:border-[#C5A059]/50 rounded-full text-[0.625rem] sm:text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg"
              >
                {appLanguage === "pl" ? "Uśpij Dzisiaj" : "Sleep Today"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserPersona({ ...userPersona, screensaverEnabled: false });
                  setIsScreensaverActive(false);
                  if (typeof addToast === "function") {
                    addToast(
                      appLanguage === "pl"
                        ? "Wygaszacz wyłączony na stałe."
                        : "Screensaver permanently disabled.",
                      "info",
                    );
                  }
                }}
                className="px-4 py-2 bg-black/60 backdrop-blur-md text-zinc-400 hover:text-white border border-white/10 hover:border-[#C5A059]/50 rounded-full text-[0.625rem] sm:text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg"
              >
                {appLanguage === "pl"
                  ? "Wyłącz Na Stałe"
                  : "Turn Off Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Community Indicator */}
      {appStarted && (
        <div 
          className={`fixed top-0 right-0 z-[50] flex flex-col pt-safe transition-all duration-700 w-auto pointer-events-none animate-fade-in ${
            isZenMode ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="flex flex-col w-auto">
            <div className={`h-[24px] flex items-center overflow-hidden select-none transition-colors duration-1000 w-auto ${isTopNewsExpanded ? "bg-[#DFB467] border-b border-black" : ""}`}>
              <div 
                role="button"
                aria-label="Otwórz czat społeczności"
                tabIndex={0}
                className={`flex-shrink-0 h-full flex items-center z-20 transition-colors duration-700 hover:brightness-110 w-[6.875rem] sm:w-[11.25rem] pointer-events-auto cursor-pointer ${isTopNewsExpanded ? "bg-[#DFB467]" : "bg-transparent border-transparent"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (indicatorMode === "praying" || indicatorMode === "sos" || hasNewPrayerIntention) {
                      setHasNewPrayerIntention(false);
                      setIsPrayerIntentionsOpen(true);
                    } else {
                      openCentralChat();
                    }
                  }
                }}
                onClick={() => {
                  if (indicatorMode === "praying" || indicatorMode === "sos" || hasNewPrayerIntention) {
                    setHasNewPrayerIntention(false);
                    setIsPrayerIntentionsOpen(true);
                  } else {
                    openCentralChat();
                  }
                }}
              >
                <div className={`relative text-[0.625rem] sm:text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap text-center w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 text-black`}>
                  {(() => {
                    const isOnline = indicatorMode === "online";
                    const isViews = indicatorMode === "views";
                    const isPraying = indicatorMode === "praying";
                    const isSos = indicatorMode === "sos";
                    
                    const count = liveUsers.length;
                    const getOsobyText = (c: number) => {
                      if (c === 1) return "OSOBA";
                      const lastTwo = c % 100;
                      if (lastTwo >= 11 && lastTwo <= 14) return "OSÓB";
                      const lastDigit = c % 10;
                      if ([2, 3, 4].includes(lastDigit)) return "OSOBY";
                      return "OSÓB";
                    };
                    const osobyPl = getOsobyText(count);
                    const titleText = appLanguage === "pl" ? `Teraz jest nas ${count} ${osobyPl.toLowerCase()} online. Mamy w tej chwili ${globalAmensCount} reakcji uwielbienia i modlitwy (dzisiaj: ${dailyAmensCount}). Dołącz teraz i Ty!` : `Right now there ${count === 1 ? 'is' : 'are'} ${count} ${count === 1 ? 'person' : 'people'} online. We have ${globalAmensCount} reactions of worship and prayer (today: ${dailyAmensCount}). Join us now!`;

                    return (
                      <div className="w-full h-full relative" title={titleText}>
                        <div className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-500 ease-in-out ${isOnline ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 -z-10"}`}>
                          <div className="flex items-center justify-center gap-[6px] h-[18px] px-3 bg-black rounded-full shadow-inner mx-1">
                            <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.8)] shrink-0"></div>
                            <span className="text-white font-sans text-[10px] tracking-[0.5px] font-normal leading-none pt-[1px] relative inline-flex items-center h-[18px] w-[90px]">
                              <span className="animate-ticker-fade absolute whitespace-nowrap"><span>{count}</span> <span className="hidden sm:inline">&nbsp;{osobyPl}</span>&nbsp;ONLINE</span>
                                 <span className="animate-ticker-fade-delayed absolute whitespace-nowrap">{dailyRadioStats} {appLanguage === "pl" ? "ODTWORZEŃ" : "PLAYS"}</span>
                            </span>
                          </div>
                        </div>
                        <div className={`absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${isViews ? "opacity-100 z-10" : "opacity-0 -z-10"}`}>
                          <div className="flex items-center justify-center gap-[6px] h-[18px] px-3 bg-black rounded-full shadow-inner mx-1">
                            <span className="text-white font-sans text-[10px] tracking-[0.5px] font-normal leading-none pt-[1px] flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                              <span className="text-[#C5A059] font-bold">{totalViews.toLocaleString(appLanguage === "pl" ? "pl-PL" : "en-US")}</span> 
                              <span className="hidden sm:inline text-white/60 text-[9px] ml-0.5">{appLanguage === "pl" ? "WEJŚCIA" : "VIEWS"}</span>
                            </span>
                          </div>
                        </div>
                        <div className={`absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-500 ease-in-out ${isPraying ? "opacity-100 z-10" : "opacity-0 -z-10"}`}>
                          <div className="flex items-center justify-center gap-[6px] h-[18px] px-3 bg-black rounded-full shadow-inner mx-1">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
                            </span>
                            <span className="text-white font-sans text-[10px] tracking-[0.5px] font-normal leading-none pt-[1px] flex items-center gap-1">
                              <span className="text-[10px] leading-none">🙏</span>
                              <span className="hidden sm:inline">{appLanguage === "pl" ? "AMEN:" : "AMEN:"} </span>
                              <span className="text-white">+{globalAmensCount}</span> 
                              <span className="hidden sm:inline text-white/60 text-[9px] ml-1">({dailyAmensCount})</span>
                            </span>
                          </div>
                        </div>
                        <div className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-500 ease-in-out ${isSos ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 -z-10"}`}>
                          <div className="flex items-center justify-center gap-[6px] h-[18px] px-3 bg-red-600 rounded-full shadow-[0_0_15px_#dc2626] mx-1 border border-red-400">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                            </span>
                            <span className="text-white font-sans text-[10px] tracking-[0.5px] font-black leading-none pt-[1px] flex items-center gap-1">
                              <span className="text-white">SOS MODLITWA</span> 
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {appStarted && currentView === "radio" && (
        <>
          <FloatingWidgetWrapper
            id="calendar"
            defaultWidth={380}
            defaultHeight={500}
            defaultX={20}
            defaultY={120}
          >
            <Calendar
              selectedDate={new Date()}
              onDateSelect={() => {}}
              theme="dark"
              appLanguage={uiLang}
              notes={notes}
              prayers={prayers}
              dailyGoals={dailyGoals}
              dailyTasks={dailyTasks}
              onOpenDashboard={handleOpenDashboard}
            />
          </FloatingWidgetWrapper>
          <FloatingWidgetWrapper
            id="dashboard"
            defaultWidth={420}
            defaultHeight={600}
            defaultX={50}
            defaultY={150}
          >
            <DailyDetail globalAmensCount={globalAmensCount}
                         dailyAmensCount={dailyAmensCount}
              date={new Date()}
              dailyVerse={dailyVerse}
              appLanguage={uiLang}
              userPersona={userPersona}
              weatherData={null}
              radioAlarm={radio.radioAlarm}
              onOpenRadioControl={() => openManagement("alarm")}
              onOpenManagement={openManagement}
              isMiriamUnlocked={true}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
              prayers={prayers}
              onAddPrayer={(content, time) => {
                const newPrayer: Prayer = { id: Date.now().toString(), content, date: new Date().toISOString().split('T')[0], reminderTime: time, completed: false, createdAt: new Date().toISOString() };
                setPrayers([...prayers, newPrayer]);
              }}
              onUpdatePrayer={(id, content, time, completed) => setPrayers(prayers.map(p => p.id === id ? { ...p, content, reminderTime: time, completed } : p))}
              onDeletePrayer={(id) => setPrayers(prayers.filter(p => p.id !== id))}
              dailyGoals={dailyGoals}
              onAddDailyGoal={(content) => {
                const newGoal: DailyGoal = { id: Date.now().toString(), content, date: new Date().toISOString().split('T')[0], completed: false, createdAt: new Date().toISOString() };
                setDailyGoals([...dailyGoals, newGoal]);
              }}
              onUpdateDailyGoal={(id, content, completed) => setDailyGoals(dailyGoals.map(g => g.id === id ? { ...g, content, completed } : g))}
              onDeleteDailyGoal={(id) => setDailyGoals(dailyGoals.filter(g => g.id !== id))}
              dailyTasks={dailyTasks}
              onAddDailyTask={(content) => {
                const newTask: DailyTask = { id: Date.now().toString(), content, date: new Date().toISOString().split('T')[0], completed: false, createdAt: new Date().toISOString() };
                setDailyTasks([...dailyTasks, newTask]);
              }}
              onUpdateDailyTask={(id, content, completed) => setDailyTasks(dailyTasks.map(t => t.id === id ? { ...t, content, completed } : t))}
              onDeleteDailyTask={(id) => setDailyTasks(dailyTasks.filter(t => t.id !== id))}
              note={notes.find(n => n.date === getLocalDateString(new Date()))?.content || ''}
              onUpdateNote={(content) => {
                const today = getLocalDateString(new Date());
                const existing = notes.find(n => n.date === today);
                if (existing) {
                  setNotes(notes.map(n => n.date === today ? { ...n, content } : n));
                } else {
                  setNotes([...notes, { id: Date.now().toString(), date: today, content, createdAt: new Date().toISOString() }]);
                }
              }}
              spiritualGoals={spiritualGoals}
              setSpiritualGoals={setSpiritualGoals}
              dailyGoalProgress={dailyGoalProgress}
              setDailyGoalProgress={setDailyGoalProgress}
              addToast={addToast}
              theme="dark"
              onOpenDailyVerseModal={(v) => {
                setSelectedDailyVerseForModal(v);
                setIsDailyVerseModalOpen(true);
              }}
              onOpenRadioMode={() => setCurrentView("radio")}
              onOpenBiblicalSchool={() => setIsBiblicalSchoolOpen(true)}
              onOpenSupport={() => setIsSupportModalOpen(true)}
              isLandscape={isLandscape}
              onToggleFavorite={toggleFavorite}
              onGoogleLogin={handleGoogleIdentityLink}
              isSyncing={isSyncing}
            />
          </FloatingWidgetWrapper>
          <FloatingWidgetWrapper
            id="verse-graphic"
            defaultWidth={320}
            defaultHeight={400}
            defaultX={30}
            defaultY={100}
          >
            <DashboardVerseGraphic
              verse={dailyVerse}
              appLanguage={uiLang}
              addToast={addToast}
            />
          </FloatingWidgetWrapper>
        </>
      )}

      <Toast
        toasts={toasts}
        onRemove={removeToast}
        isIntentionsVisible={isIntentionsBarVisible}
      />
      <audio ref={radio.audioRef} preload="auto" playsInline crossOrigin="anonymous" />

      {appStarted && !isCarMode && (
        <main
          id="main-content"
          className={`relative z-20 flex-1 flex flex-col items-center justify-center w-full ${
            ["radio", "dashboard"].includes(currentView) ||
            currentView === undefined
              ? ""
              : "max-w-5xl mx-auto"
          } h-full overflow-hidden ${
            isIntentionsBarVisible
              ? "pt-[calc(48px+env(safe-area-inset-top,0px))]"
              : "pt-[calc(48px+env(safe-area-inset-top,0px))]"
          } pb-safe`}
        >
          {userPersona.appMode === "blind" ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-6 animate-fade-in bg-black cursor-pointer"
              onClick={() => setIsVoiceAssistantOpen(true)}
            >
              <h2 className="text-4xl font-black text-[#E2B859] uppercase tracking-[0.3em] mb-4">
                Tryb Głosowy
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[0.625rem]">
                Kliknij gdziekolwiek, aby rozmawiać z Miriam CC
              </p>
            </div>
          ) : currentView === "radio" ? (
            <RadioModePlayer
              isRadioPlaying={radio.isRadioPlaying}
              onToggleRadio={radio.toggleRadio}
              onOpenSupport={() => setIsSupportModalOpen(true)}
              onShareRadio={handleShareRadio}
              appLanguage={uiLang}
              activeStream={radio.activeStream}
              hasSOS={hasNewPrayerIntention}
              onSOSClick={() => {
                setHasNewPrayerIntention(false);
                setIsPrayerIntentionsOpen(true);
              }}
              onSwitchStream={(s) => {
                const newLang = s === "PL" || s === "BIBLIA" ? "pl" : "en";
                handleLanguageChange(newLang);
                radio.playStream(s);
              }}
              onOpenLeftPanel={() => setIsSidebarOpen(true)}
              onOpenRightPanel={() => setIsUserPanelOpen(true)}
              onOpenManagement={openManagement}
              onOpenBiblicalSchool={() => setIsBiblicalSchoolOpen(true)}
              onOpenVerseSearch={() => setIsVerseSearchOpen(true)}
              userPersona={userPersona}
              dailyVerse={dailyVerse}
              onRefreshDailyVerse={() => loadVerse(true)}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
              isMiriamUnlocked={true}
              radioAlarm={radio.radioAlarm}
              installStatus={installStatus}
              onInstallClick={triggerDirectInstall}
              onOpenDailyVerseModal={(v) => {
                setSelectedDailyVerseForModal(v);
                setIsDailyVerseModalOpen(true);
              }}
              onOpenSmsSubscriptionModal={() =>
                setIsSmsSubscriptionModalOpen(true)
              }
              onOpenStore={() => setIsStoreModalOpen(true)}
              onOpenReadingRoom={() => setIsReadingRoomOpen(true)}
              onOpenYouTubeLiveModal={() => {
                setYoutubeInitialSource("live");
                setIsYouTubeLiveModalOpen(true);
              }}
              onOpenGames={() => setIsGamesModalOpen(true)}
              unreadNotificationsCount={unreadNotifsCount}
              onBibleSearch={handleGlobalBibleSearch}
              onEcosystemAction={handleEcosystemNavigation}
              visualMode={visualMode}
              isTickerExpanded={isIntentionsBarVisible}
              incomingBubbles={activeChatBubbles}
              onRemoveBubble={removeChatBubble}
              onReplyBubble={handleReplyToBubble}
              showMatrix={isMatrixOpen}
              onMatrixToggle={setIsMatrixOpen}
              volume={radio.volume}
              onVolumeChange={radio.updateVolume}
              isLandscape={isLandscape}
              spatialMode={spatialMode}
              onSpatialModeChange={setSpatialMode}
              equalizer={equalizer}
              onEqualizerChange={setEqualizer}
              onOpenCommunity={() => setCurrentView("community")}
              onOpenCentralChat={openCentralChat}
              liveUsers={liveUsers}
              globalAmensCount={globalAmensCount}
              dailyAmensCount={dailyAmensCount}
              audioRef={radio.audioRef}
              onClose={() => {
                setIsMatrixOpen(false);
                handleOpenDashboard();
              }}
              onToggleFavorite={toggleFavorite}
              onOpenBusinessCard={() => setIsBusinessCardOpen(true)}
              onOpenEmi={() => setIsEMIMediaModalOpen(true)}
              onOpenInstrumentalMusic={() => setIsInstrumentalMusicModalOpen(true)}
              onOpenPrayerIntentions={() => setIsPrayerIntentionsOpen(true)}
              onOpenMusicNews={() =>
                setYoutubeNotificationProps({
                  isOpen: true,
                  title: "NOWOŚCI MUZYCZNE 2026",
                  subtitle: "WŁĄCZ PLAYLISTĘ",
                  description:
                    "Polecamy nową playlistę z chrześcijańskimi nowościami muzycznymi na rok 2026.",
                  playlistUrl:
                    "https://youtube.com/playlist?list=PLQBdxcl9HBc_NZedkCUTlrUZhZAtqodU1",
                })
              }
              onOpenTaskbar={() => setIsTaskbarOpen(true)}
              onGoogleLogin={handleGoogleIdentityLink}
              isSyncing={isSyncing}
            />
          ) : currentView === "community" ? (
            <CommunityView 
              userPersona={userPersona}
              setCurrentView={setCurrentView}
              isIntentionsBarVisible={isIntentionsBarVisible}
              t={t}
            />
          ) : currentView === "widgets" ? (
            <WidgetDashboard
              onBack={() => setCurrentView("radio")}
              uiLang={uiLang}
            />
          ) : currentView === "imagination-studio" ? (
            <ImaginationStudio
              onBack={() => setCurrentView("radio")}
              uiLang={uiLang}
            />
          ) : currentView === "song-creator" ? (
            <SongCreator
              onBack={() => setCurrentView("radio")}
              uiLang={uiLang}
            />
          ) : (
            <DashboardView
              plannerLayouts={plannerLayouts}
              setPlannerLayouts={setPlannerLayouts}
              uiLang={uiLang}
              notes={notes}
              prayers={prayers}
              dailyGoals={dailyGoals}
              dailyTasks={dailyTasks}
              setPrayers={setPrayers}
              setDailyGoals={setDailyGoals}
              setDailyTasks={setDailyTasks}
              setNotes={setNotes}
              spiritualGoals={spiritualGoals}
              setSpiritualGoals={setSpiritualGoals}
              dailyGoalProgress={dailyGoalProgress}
              setDailyGoalProgress={setDailyGoalProgress}
              globalAmensCount={globalAmensCount}
              dailyAmensCount={dailyAmensCount}
              dailyVerse={dailyVerse}
              userPersona={userPersona}
              radioAlarm={radio.radioAlarm}
              openManagement={openManagement}
              setIsVoiceAssistantOpen={setIsVoiceAssistantOpen}
              addToast={addToast}
              setSelectedDailyVerseForModal={setSelectedDailyVerseForModal}
              setIsDailyVerseModalOpen={setIsDailyVerseModalOpen}
              setCurrentView={setCurrentView}
              setIsBiblicalSchoolOpen={setIsBiblicalSchoolOpen}
              setIsSupportModalOpen={setIsSupportModalOpen}
              isLandscape={isLandscape}
              toggleFavorite={toggleFavorite}
              handleGoogleIdentityLink={handleGoogleIdentityLink}
              isSyncing={isSyncing}
              setAreAllWidgetsHidden={setAreAllWidgetsHidden}
            />
          )}
        </main>
      )}

      {appStarted && (
        <>
          <aside
            className={`fixed top-[calc(48px+env(safe-area-inset-top,0px))] bottom-0 left-0 w-full z-[8000] bg-zinc-950/98 backdrop-blur-3xl transform transition-transform duration-500 ease-in-out pt-safe pb-safe ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar
              isRadioPlaying={radio.isRadioPlaying}
              onToggleRadio={radio.toggleRadio}
              onClose={() => setIsSidebarOpen(false)}
              onShareRadio={handleShareRadio}
              addToast={addToast}
              eqMode="Gospel"
              setEqMode={() => {}}
              appLanguage={uiLang}
              onOpenManagement={openManagement}
              onOpenRadioMode={() => {
                setCurrentView("radio");
                setIsSidebarOpen(false);
              }}
              onOpenDashboard={() => {
                handleOpenDashboard();
                setIsSidebarOpen(false);
              }}
              onOpenBiblicalSchool={() => {
                setIsBiblicalSchoolOpen(true);
                setIsSidebarOpen(false);
              }}
              activeStream={radio.activeStream}
              prayers={prayers}
              onToggle={() => {}}
              onDelete={() => {}}
              onOpenTutorialPanel={() => setIsTutorialOpen(true)}
              onInstallApp={triggerDirectInstall}
              onShareApp={handleShareApp}
              installStatus={installStatus}
              visualMode={visualMode}
              onOpenSupport={() => setIsSupportModalOpen(true)}
              onOpenEcosystemMap={() => setIsEcosystemMapOpen(true)}
              onOpenWeeklySchedule={() => setIsWeeklyScheduleModalOpen(true)}
              onOpenWidgetPreview={() => {
                setCurrentView("widgets");
                setIsSidebarOpen(false);
              }}
              onOpenImaginationStudio={() => {
                setCurrentView("imagination-studio");
                setIsSidebarOpen(false);
              }}
              onOpenSongCreator={() => {
                setCurrentView("song-creator");
                setIsSidebarOpen(false);
              }}
              onOpenStrategicPartners={() => {
                setIsStrategicPartnersOpen(true);
                setIsSidebarOpen(false);
              }}
            />
          </aside>

          <SidePanels
            setCurrentView={setCurrentView}
            onRadioStreamChange={handleRadioStreamChange}
            appLanguage={uiLang}
            addToast={addToast}
            onOpenUserPanel={openUserPanelForUser}
            setIsCentralChatOpen={setIsCentralChatOpen}
            setIsBiblicalSchoolOpen={setIsBiblicalSchoolOpen}
            setIsVerseSearchOpen={setIsVerseSearchOpen}
            setIsVoiceAssistantOpen={setIsVoiceAssistantOpen}
            setIsSmsSubscriptionModalOpen={setIsSmsSubscriptionModalOpen}
            setIsPrayerIntentionsOpen={setIsPrayerIntentionsOpen}
            setIsDailyVerseModalOpen={setIsDailyVerseModalOpen}
            setIsSupportModalOpen={setIsSupportModalOpen}
            setIsHelpingHandModalOpen={setIsHelpingHandModalOpen}
            setIsStudioDobregoSlowaModalOpen={setIsStudioDobregoSlowaModalOpen}
            setIsCoachingModalOpen={setIsCoachingModalOpen}
            setIsYouTubeLiveModalOpen={setIsYouTubeLiveModalOpen}
            onOpenYouTube={(src) => {
              setYoutubeInitialSource(src);
              setIsYouTubeLiveModalOpen(true);
            }}
            setIsEcosystemMapOpen={setIsEcosystemMapOpen}
            setIsSpotifyModalOpen={setIsSpotifyModalOpen}
            setIsCcNewsModalOpen={setIsCcNewsModalOpen}
            setIsReadingRoomOpen={setIsReadingRoomOpen}
            setIsTvStudyModalOpen={setIsTvStudyModalOpen}
            setIsGlobeOpen={setIsLiveGlobalMapOpen}
            setIsLawDecalogueOpen={setIsLawDecalogueOpen}
            setIsCcResourcesModalOpen={setIsCcResourcesModalOpen}
            setIsCcMediaPlayerPageOpen={setIsCcMediaPlayerPageOpen}
            initialMorningPostId={initialMorningPostId}
            initialChristianPostId={initialChristianPostId}
            isAnyModalOpen={
              isManagementCenterOpen ||
              isBiblicalSchoolOpen ||
              isVerseSearchOpen ||
              isSupportModalOpen ||
              isHelpingHandModalOpen ||
              isStudioDobregoSlowaModalOpen ||
              isCoachingModalOpen ||
              isVoiceAssistantOpen ||
              isInstallationGuideOpen ||
              isTutorialOpen ||
              isYouTubeLiveModalOpen ||
              isUpdateModalOpen ||
              isCentralChatOpen ||
              isSmsSubscriptionModalOpen ||
              isShabbatModalOpen ||
              isStoreModalOpen ||
              isReadingRoomOpen ||
              isCcNewsModalOpen ||
              isOpenLetterOpen ||
              isEcosystemMapOpen ||
              isSpotifyModalOpen ||
              isTvStudyModalOpen ||
              isLawDecalogueOpen ||
              isCcResourcesModalOpen ||
              isCcMediaPlayerPageOpen
            }
            isTickerExpanded={isIntentionsBarVisible}
          />

          <UserPanel
            isOpen={isUserPanelOpen}
            onClose={() => {
              setIsUserPanelOpen(false);
              setTargetUserID(undefined);
            }}
            onOpenAdminLogin={() => setIsAdminPinModalOpen(true)}
            userPersona={userPersona}
            targetUserID={targetUserID}
            appLanguage={uiLang}
            addToast={addToast}
            onLogout={() => {
              setAppStarted(false);
              setStartModeChoice(null);
              localStorage.removeItem("cc_app_start_choice");
              PersistenceService.clearSSOCookie();
              setUserPersona({
                ...userPersona,
                name: "Gość",
                googleEmail: null,
                assignedMentor: undefined,
              });
              setIsUserPanelOpen(false);
              setTargetUserID(undefined);
            }}
            onEditProfile={() => openManagement("profile")}
            onBecomePatron={() => setIsSupportModalOpen(true)}
            onBecomeMecenas={() => setIsSupportModalOpen(true)}
            onOpenRadioMode={() => {
              setCurrentView("radio");
              setIsUserPanelOpen(false);
            }}
            onOpenDashboard={() => {
              handleOpenDashboard();
              setIsUserPanelOpen(false);
            }}
            onOpenManagement={openManagement}
            onUpdateUserPersona={setUserPersona}
            isTickerExpanded={isIntentionsBarVisible}
            isLandscape={isLandscape}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onOpenChat={openChatForUser}
            onOpenBusinessCard={() => setIsBusinessCardOpen(true)}
            onOpenZbyszekGieron={() => setIsZbyszekGieronOpen(true)}
          />

          {isManagementCenterOpen && (
            <AppManagementCenter
              isOpen={isManagementCenterOpen}
              initialTab={managementInitialTab}
              onClose={() => setIsManagementCenterOpen(false)}
              userPersona={userPersona}
              onUpdateUserPersona={setUserPersona}
              radioAlarm={radio.radioAlarm}
              onUpdateRadioAlarm={radio.updateAlarm}
              appLanguage={uiLang}
              addToast={addToast}
              onLanguageChange={handleLanguageChange}
              onOpenRadioMode={() => {
                setCurrentView("radio");
                setIsManagementCenterOpen(false);
              }}
              isProKeyActive={true}
              onSetProKeyActive={() => {}}
              onHardRefresh={handleHardRefresh}
              installStatus={installStatus}
              onInstallApp={triggerDirectInstall}
              isGoogleCalendarConnected={
                userPersona.isGoogleCalendarConnected ?? false
              }
              onGoogleLoginFromManagement={(data) => {
                const gender = inferGenderFromName(data.name);
                const mentor = gender === "male" ? "Miriam" : "Jeszua";
                setUserPersona({
                  ...userPersona,
                  googleEmail: data.email,
                  isGoogleCalendarConnected: true,
                  isGooglePhotosConnected: true,
                  isGoogleTasksConnected: true,
                  isGoogleKeepConnected: true,
                  name: data.name ?? userPersona.name,
                  profilePicture: data.picture ?? userPersona.profilePicture,
                  gender: gender,
                  assignedMentor: mentor,
                  joshuaSystem: userPersona.joshuaSystem
                    ? {
                        ...userPersona.joshuaSystem,
                        driveSyncEnabled: true,
                      }
                    : {
                        enabled: true,
                        disciplineMode: "5.10.15",
                        driveSyncEnabled: true,
                      },
                });
                PersistenceService.setSSOCookie({
                  name: data.name,
                  googleEmail: data.email,
                  profilePicture: data.picture,
                  gender,
                  assignedMentor: mentor,
                });
              }}
              systemNotifications={systemNotifications}
              onMarkNotificationRead={(id) => {
                setSystemNotifications(
                  systemNotifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n,
                  ),
                );
              }}
              onClearNotifications={() => setSystemNotifications([])}
              isLandscape={isLandscape}
              onToggleFavorite={toggleFavorite}
              isTickerExpanded={isIntentionsBarVisible}
              activeStream={radio.activeStream}
              isAdminMode={isAdminModeEnabled}
            />
          )}

          <VoiceAssistantModal
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
            addToast={addToast}
            dailyVerseContext={dailyVerse}
            userName={userPersona.name}
            userGender={userPersona.gender}
            appLanguage={uiLang}
            onSpeakingStatusChange={() => {}}
            userAgeGroup="adult"
            userMaritalStatus="unspecified"
            userSpiritualStatus="believer"
            currentMode={userPersona.appMode}
            onExecuteRadioAction={handleMiriamVoiceAction}
            isTickerExpanded={isIntentionsBarVisible}
          />
          {isDailyVerseModalOpen && selectedDailyVerseForModal && (
            <DailyVerseModal
              isOpen={isDailyVerseModalOpen}
              onClose={() => setIsDailyVerseModalOpen(false)}
              dailyVerse={selectedDailyVerseForModal}
              appLanguage={uiLang}
              onSpeakVerse={() => {}}
              isMiriamSpeaking={false}
              onRefreshDailyVerse={() => loadVerse(true)}
              addToast={addToast}
              isTickerExpanded={isIntentionsBarVisible}
            />
          )}

          <NotificationCascade
            notifications={systemNotifications}
            onMarkRead={(id) => {
              setSystemNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
              );
            }}
            appLanguage={uiLang}
            isIntentionsVisible={isIntentionsBarVisible}
          />
          <BiblicalSchoolPanel
            isOpen={isBiblicalSchoolOpen}
            onClose={() => setIsBiblicalSchoolOpen(false)}
            appLanguage={uiLang}
            userPersona={userPersona}
            onUpdateUserPersonaStatus={(newStatus, startDate) => {
              const date = startDate || new Date().toISOString();
              const updatedPersona = {
                ...userPersona,
                personalStatus: newStatus,
                discipleStartDate: userPersona.discipleStartDate || date,
              };
              setUserPersona(updatedPersona);
              PersistenceService.saveUserPersona(updatedPersona);
            }}
            onOpenLesson={handleOpenLesson}
            onOpenRadioMode={() => {
              setCurrentView("radio");
              setIsBiblicalSchoolOpen(false);
            }}
            onOpenDashboard={() => {
              handleOpenDashboard();
              setIsBiblicalSchoolOpen(false);
            }}
            onShareApp={handleShareApp}
            isTickerExpanded={isIntentionsBarVisible}
            isLandscape={isLandscape}
          />
          <LessonReadingModal
            isOpen={isLessonReadingModalOpen}
            onClose={() => setIsLessonReadingModalOpen(false)}
            title={currentLessonTitle}
            imageUrl={currentLessonImage}
            content={currentLessonContent}
            loading={isLessonLoading}
            appLanguage={uiLang}
            onSpeakLesson={(title, content) => {
              VoiceGreetingService.synthesizeAndPlay(`${title}. ${content}`);
            }}
            isMiriamSpeaking={false}
            onLessonComplete={() =>
              handleLessonComplete(currentLessonTitle || "")
            }
            isTickerExpanded={isIntentionsBarVisible}
          />
          <WeeklyScheduleModal
            isOpen={isWeeklyScheduleModalOpen}
            onClose={() => setIsWeeklyScheduleModalOpen(false)}
          />
          <VerseSearchModal
            isOpen={isVerseSearchOpen}
            onClose={() => {
              setIsVerseSearchOpen(false);
              setVerseSearchInitialQuery("");
            }}
            initialQuery={verseSearchInitialQuery}
            selectedTranslation="BW"
            addToast={addToast}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <StripeSupportModal
            isOpen={isSupportModalOpen}
            onClose={() => setIsSupportModalOpen(false)}
            region={radio.activeStream === "BIBLIA" ? "PL" : radio.activeStream}
            addToast={addToast}
            appLanguage={uiLang}
            onOpenRadioMode={() => setCurrentView("radio")}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <HelpingHandModal
            isOpen={isHelpingHandModalOpen}
            onClose={() => setIsHelpingHandModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <StudioDobregoSlowaModal
            isOpen={isStudioDobregoSlowaModalOpen}
            onClose={() => setIsStudioDobregoSlowaModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <HolistycznyCoachingModal
            isOpen={isCoachingModalOpen}
            onClose={() => setIsCoachingModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <SmsSubscriptionModal
            isOpen={isSmsSubscriptionModalOpen}
            onClose={() => setIsSmsSubscriptionModalOpen(false)}
            appLanguage={uiLang}
            addToast={addToast}
          />
          <InstallationGuideModal
            isOpen={isInstallationGuideOpen}
            onClose={() => setIsInstallationGuideOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <YouTubeLiveModal
            isOpen={isYouTubeLiveModalOpen}
            onClose={() => setIsYouTubeLiveModalOpen(false)}
            isLandscape={isLandscape}
            initialSource={youtubeInitialSource}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <YouTubeNotificationModal
            isOpen={youtubeNotificationProps.isOpen}
            title={youtubeNotificationProps.title}
            subtitle={youtubeNotificationProps.subtitle}
            description={youtubeNotificationProps.description}
            playlistUrl={youtubeNotificationProps.playlistUrl}
            onClose={() =>
              setYoutubeNotificationProps((prev) => ({
                ...prev,
                isOpen: false,
              }))
            }
            onSnooze={(mins) => {
              setYoutubeNotificationProps((prev) => ({
                ...prev,
                isOpen: false,
              }));
              setTimeout(() => {
                setYoutubeNotificationProps((prev) => ({
                  ...prev,
                  isOpen: true,
                }));
              }, mins * 60000);
            }}
            onWatchNow={() => {
              const source =
                youtubeNotificationProps.title === "Objawienie"
                  ? "objawienie"
                  : "live";
              setYoutubeInitialSource(source);
              setIsYouTubeLiveModalOpen(true);
            }}
          />
          <CcNewsModal
            isOpen={isCcNewsModalOpen}
            onClose={() => setIsCcNewsModalOpen(false)}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <OpenLetterModal
            isOpen={isOpenLetterOpen}
            onClose={() => setIsOpenLetterOpen(false)}
            appLanguage={uiLang}
          />

          <LawDecalogueModal
            isOpen={isLawDecalogueOpen}
            onClose={() => setIsLawDecalogueOpen(false)}
            appLanguage={uiLang}
          />

          <CcEcosystemMapModal
            isOpen={isEcosystemMapOpen}
            onClose={() => setIsEcosystemMapOpen(false)}
            onNavigate={handleEcosystemNavigation}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <StrategicPartnersModal
            isOpen={isStrategicPartnersOpen}
            onClose={() => setIsStrategicPartnersOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <WdowiGroszModal
            isOpen={isWdowiGroszModalOpen}
            onClose={() => setIsWdowiGroszModalOpen(false)}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <CcLiveGlobalMap
            isOpen={isLiveGlobalMapOpen}
            onClose={() => setIsLiveGlobalMapOpen(false)}
            uiLang={uiLang}
          />
          <SpotifyModal
            isOpen={isSpotifyModalOpen}
            onClose={() => setIsSpotifyModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <UpdateAvailableModal
            isOpen={isUpdateModalOpen}
            onUpdate={() => updateServiceWorker(true)}
            newAvailableVersion={newAvailableVersion}
          />
          <ShabbatWelcomeModal
            isOpen={isShabbatModalOpen}
            onClose={() => setIsShabbatModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <StoreModal
            isOpen={isStoreModalOpen}
            onClose={() => setIsStoreModalOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <MiriamChatModal
            isOpen={isMiriamChatOpen}
            onClose={() => setIsMiriamChatOpen(false)}
            initialQuery={miriamChatInitialQuery}
            appLanguage={uiLang}
            userName={userPersona.name}
          />

          <GamesPortalModal
            isOpen={isGamesModalOpen}
            onClose={() => setIsGamesModalOpen(false)}
            appLanguage={uiLang}
          />

          <BiblePromoModal
            isOpen={isBibleAdOpen}
            onClose={() => setIsBibleAdOpen(false)}
            appLanguage={uiLang}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <MyFilesModal
            isOpen={isMyFilesModalOpen}
            onClose={() => setIsMyFilesModalOpen(false)}
            appLanguage={uiLang}
            radioAlarm={radio.radioAlarm}
            onUpdateRadioAlarm={radio.updateAlarm}
            userPersona={userPersona}
            onUpdateUserPersona={setUserPersona}
          />

          {currentView === "widgets" && (
            <WidgetDashboard
              onBack={() => setCurrentView("radio")}
              uiLang={uiLang}
            />
          )}

          {/* Daily Word Widget Preview Modal */}
          {isWidgetPreviewOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-md flex flex-col items-center">
                <button
                  aria-label="Zamknij podgląd"
                  onClick={() => setIsWidgetPreviewOpen(false)}
                  className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                >
                  <svg
                    className="w-8 h-8"
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

                <div className="w-full">
                  <DailyWordWidget
                    verseText={(dualDailyVerse as any)?.[uiLang]?.text}
                    verseRef={(dualDailyVerse as any)?.[uiLang]?.reference}
                  />
                </div>

                <div className="mt-8 text-center space-y-4">
                  <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest leading-none">
                    Premium Android Widget
                  </h3>
                  <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed uppercase font-bold tracking-[0.1em]">
                    To jest podgląd nowej stylistyki Full Premium. Widżet na
                    systemie Android został zaktualizowany do tego standardu.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <div
                      className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-lg flex items-center justify-center text-[10px] text-white/40 font-mono"
                      title="Deep Black"
                    >
                      #0A
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center text-[10px] text-black font-bold"
                      title="Gold"
                    >
                      #D4
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl bg-[#B87333] shadow-lg flex items-center justify-center text-[10px] text-white font-bold"
                      title="Copper"
                    >
                      #B8
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ReadingRoomModal
            isOpen={isReadingRoomOpen}
            onClose={() => setIsReadingRoomOpen(false)}
            appLanguage={uiLang}
            onOpenGlobe={() => setIsGlobeOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            isTickerExpanded={isIntentionsBarVisible}
            addToast={addToast}
          />

          <ApiKeySelectionModal
            isOpen={isApiKeyModalOpen}
            appLanguage={uiLang}
            onKeySaved={() => {
              setIsApiKeyModalOpen(false);
              loadVerse(false); // Refresh content with new key
              addToast(
                uiLang === "pl"
                  ? "Klucz zapisany. AI odblokowane!"
                  : "Key saved. AI unlocked!",
                "success",
              );
            }}
            onSelectKey={async () => {
              if (window.aistudio) {
                await window.aistudio.openSelectKey();
                setIsApiKeyModalOpen(false);
                loadVerse(false);
              }
            }}
            isTickerExpanded={isIntentionsBarVisible}
          />

          <CentralChatOverlay
            isOpen={isCentralChatOpen}
            onClose={() => {
              setIsCentralChatOpen(false);
              setChatInitialView(undefined);
              setChatInitialUserId(undefined);
              setChatInitialMessage(undefined);
            }}
            userName={userPersona.name}
            userAvatar={userPersona.profilePicture}
            onOpenUserPanel={openUserPanelForUser}
            initialView={chatInitialView}
            initialUserId={chatInitialUserId}
            initialMessage={chatInitialMessage}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <ApostleAgent 
            user={userPersona} 
            isAdmin={isAdmin} 
          />
          <AnimatePresence>
            {isAdminPinModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gradient-to-b from-zinc-900/90 to-black/90 backdrop-blur-xl border border-[#C5A059]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_rgba(255,255,255,0.05)] rounded-2xl p-8 max-w-sm w-full text-center relative"
                >
                  <button 
                    aria-label="Zamknij logowanie administratora"
                    onClick={() => {
                      setIsAdminPinModalOpen(false);
                      setAdminPinInput("");
                    }}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <Shield className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                  <h2 className="text-[#C5A059] font-black uppercase text-xl mb-6 tracking-widest">
                    {uiLang === 'pl' ? 'Autoryzacja Admina' : 'Admin Auth'}
                  </h2>
                  <form onSubmit={handleAdminPinSubmit} className="flex flex-col gap-4">
                    <input 
                      type="password" 
                      value={adminPinInput} 
                      onChange={e => setAdminPinInput(e.target.value)}
                      autoFocus
                      className="bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/50 rounded-xl p-4 text-center text-white font-black tracking-widest text-2xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 outline-none transition-all placeholder-zinc-700"
                      placeholder="PIN"
                    />
                    <button 
                      type="submit" 
                      className="bg-[#C5A059] text-black hover:bg-[#E2B859] transition-colors font-black uppercase tracking-widest py-4 rounded-xl active:scale-[0.98]"
                    >
                      {uiLang === 'pl' ? 'Weryfikuj' : 'Verify'}
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <PublicProfileModal
            isOpen={isPublicProfileModalOpen}
            onClose={() => setIsPublicProfileModalOpen(false)}
            profileId={publicProfileId}
            currentUser={userPersona!}
            addToast={addToast}
            appLanguage={uiLang}
          />
          <BusinessCardModal
            isOpen={isBusinessCardOpen}
            onClose={() => setIsBusinessCardOpen(false)}
            onOpenTvStudy={() => setIsTvStudyModalOpen(true)}
            onOpenManagement={() => setIsManagementCenterOpen(true)}
            appLanguage={uiLang}
            addToast={addToast}
            isTickerExpanded={isIntentionsBarVisible}
          />
          <ZbyszekGieronModal
            isOpen={isZbyszekGieronOpen}
            onClose={() => setIsZbyszekGieronOpen(false)}
            onOpenTvStudy={() => setIsTvStudyModalOpen(true)}
            appLanguage={uiLang}
            addToast={addToast}
          />
          <KatarzynaFedkowModal
            isOpen={isKatarzynaFedkowModalOpen}
            onClose={() => setIsKatarzynaFedkowModalOpen(false)}
            appLanguage={uiLang}
          />
          <EMIMediaModal
            isOpen={isEMIMediaModalOpen}
            onClose={() => setIsEMIMediaModalOpen(false)}
            appLanguage={uiLang}
          />
          <InstrumentalMusicModal
            isOpen={isInstrumentalMusicModalOpen}
            onClose={() => setIsInstrumentalMusicModalOpen(false)}
            appLanguage={uiLang}
          />
          <SlideshowModal
            isOpen={isSlideshowOpen}
            onClose={() => setIsSlideshowOpen(false)}
            appLanguage={uiLang}
          />
          <YellowCardModal
            isOpen={isYellowCardOpen}
            onClose={() => setIsYellowCardOpen(false)}
            appLanguage={uiLang}
          />
          {isTvStudyModalOpen && (
            <TvStudyModal onClose={() => setIsTvStudyModalOpen(false)} />
          )}

          {/* MODAL INTENCJI */}
          {isPrayerIntentionsOpen && (
            <div
              className={`fixed bottom-0 left-0 right-0 z-[6000] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-fade-in top-[calc(48px+env(safe-area-inset-top,0px))]`}
              onClick={() => setIsPrayerIntentionsOpen(false)}
            >
              <div
                id="prayer-intentions-scroll-container"
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-gold/30 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-4 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <PrayerIntentions
                  userId={userPersona.googleEmail || "guest"}
                  userName={userPersona.name}
                />
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsPrayerIntentionsOpen(false)}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors"
                  >
                    ZAMKNIJ ARCHIWUM INTENCJI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Widgets (Portals) - Global rendering */}
          <LocalMediaPlayerWidget appLanguage={uiLang} />
          <SpiritualMotivationWidget appLanguage={uiLang} />
          <DidYouKnowWidget appLanguage={uiLang} />
          <GoldenThoughtsWidget appLanguage={uiLang} />
          <CtaMobilizationWidget appLanguage={uiLang} />
          <YellowCardWidget appLanguage={uiLang} />
          <MusicNewsWidget
            appLanguage={uiLang}
            onOpenMusicNews={() =>
              setYoutubeNotificationProps({
                isOpen: true,
                title: "NOWOŚCI MUZYCZNE 2026",
                subtitle: "WŁĄCZ PLAYLISTĘ",
                description:
                  "Polecamy nową playlistę z chrześcijańskimi nowościami muzycznymi na rok 2026.",
                playlistUrl:
                  "https://youtube.com/playlist?list=PLQBdxcl9HBc_NZedkCUTlrUZhZAtqodU1",
              })
            }
          />
          <EmiNewsWidget
            appLanguage={uiLang}
            onOpenEmi={() => setIsEMIMediaModalOpen(true)}
          />

          <MajowkaCampaignModal />

          <DesktopTaskbar
            userPersona={userPersona}
            gapiSignedIn={gapiSignedIn}
            appLanguage={uiLang}
            onOpenManagement={openManagement}
            isOpen={isTaskbarOpen}
            onClose={() => setIsTaskbarOpen(false)}
          />

          <CcResourcesModal
            isOpen={isCcResourcesModalOpen}
            onClose={() => setIsCcResourcesModalOpen(false)}
            appLanguage={appLanguage}
          />

          <CcMediaPlayerPage
            isOpen={isCcMediaPlayerPageOpen}
            onClose={() => setIsCcMediaPlayerPageOpen(false)}
            appLanguage={appLanguage}
          />

          <CcPatronsPage
            isOpen={isCcPatronsPageOpen}
            onClose={() => setIsCcPatronsPageOpen(false)}
          />

          <FarewellScreen
            isOpen={isFarewellScreenOpen}
            onCancel={() => setIsFarewellScreenOpen(false)}
            appLanguage={uiLang}
          />
        </>
      )}
      </Suspense>
      <footer></footer>
    </div>
  );
};
