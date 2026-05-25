import React from "react";
import { SupportedLanguage, ToastMessage } from "../types";
import { GlobeModal } from "./GlobeModal";
import { BibleBrowser } from "./BibleBrowser";
import { Browser } from "@capacitor/browser";
import { useAppStore } from "../useAppStore";
import { MorningInspirationsModal } from "./MorningInspirationsModal";
import { ChristianInspirationsModal } from "./ChristianInspirationsModal";
import { AdminPostModal } from "./AdminPostModal";

interface SidePanelsProps {
  setCurrentView: (view: "radio" | "dashboard" | "community") => void;
  onRadioStreamChange: (stream: "PL" | "GLOBAL" | "BIBLIA") => void;
  appLanguage: SupportedLanguage;
  addToast: (msg: string, type?: ToastMessage["type"]) => string;
  isAnyModalOpen?: boolean;
  onOpenUserPanel?: (uid: string) => void;
  setIsCentralChatOpen: (open: boolean) => void;
  setIsBiblicalSchoolOpen: (open: boolean) => void;
  setIsVerseSearchOpen: (open: boolean) => void;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  setIsSmsSubscriptionModalOpen: (open: boolean) => void;
  setIsPrayerIntentionsOpen: (open: boolean) => void;
  setIsDailyVerseModalOpen: (open: boolean) => void;
  setIsHelpingHandModalOpen: (open: boolean) => void;
  setIsSupportModalOpen: (open: boolean) => void;
  setIsStudioDobregoSlowaModalOpen: (open: boolean) => void;
  setIsCoachingModalOpen: (open: boolean) => void;
  setIsYouTubeLiveModalOpen: (open: boolean) => void;
  onOpenYouTube?: (source: "live" | "films" | "plus" | "testimonies") => void;
  setIsEcosystemMapOpen: (open: boolean) => void;
  setIsSpotifyModalOpen: (open: boolean) => void;
  setIsCcNewsModalOpen?: (open: boolean) => void;
  setIsReadingRoomOpen: (open: boolean) => void;
  setIsTvStudyModalOpen: (open: boolean) => void;
  setIsLawDecalogueOpen: (open: boolean) => void;
  setIsCcResourcesModalOpen: (open: boolean) => void;
  setIsCcMediaPlayerPageOpen: (open: boolean) => void;
  isTickerExpanded?: boolean;
  setIsGlobeOpen?: (open: boolean) => void;
  initialMorningPostId?: string | null;
  initialChristianPostId?: string | null;
}

export const SidePanels: React.FC<SidePanelsProps> = ({
  setCurrentView,
  onRadioStreamChange,
  appLanguage,
  addToast,
  isAnyModalOpen,
  onOpenUserPanel,
  setIsCentralChatOpen,
  setIsBiblicalSchoolOpen,
  setIsVerseSearchOpen,
  setIsVoiceAssistantOpen,
  setIsSmsSubscriptionModalOpen,
  setIsPrayerIntentionsOpen,
  setIsDailyVerseModalOpen,
  setIsHelpingHandModalOpen,
  setIsSupportModalOpen,
  setIsStudioDobregoSlowaModalOpen,
  setIsCoachingModalOpen,
  setIsYouTubeLiveModalOpen,
  onOpenYouTube,
  setIsEcosystemMapOpen,
  setIsSpotifyModalOpen,
  setIsCcNewsModalOpen,
  setIsReadingRoomOpen,
  setIsTvStudyModalOpen,
  setIsLawDecalogueOpen,
  setIsCcResourcesModalOpen,
  setIsCcMediaPlayerPageOpen,
  isTickerExpanded,
  setIsGlobeOpen,
  initialMorningPostId,
  initialChristianPostId,
}) => {
  const [leftIndex, setLeftIndex] = React.useState(0);
  const [rightIndex, setRightIndex] = React.useState(0);

  const [isLeftTileMenuOpen, setIsLeftTileMenuOpen] = React.useState(false);
  const [isRightTileMenuOpen, setIsRightTileMenuOpen] = React.useState(false);
  const [isMorningInspirationsModalOpen, setIsMorningInspirationsModalOpen] =
    React.useState(!!initialMorningPostId);
  const [
    morningInspirationsInitialPostId,
    setMorningInspirationsInitialPostId,
  ] = React.useState<string | null>(initialMorningPostId || null);
  const [
    isChristianInspirationsModalOpen,
    setIsChristianInspirationsModalOpen,
  ] = React.useState(!!initialChristianPostId);
  const [
    christianInspirationsInitialPostId,
    setChristianInspirationsInitialPostId,
  ] = React.useState<string | null>(initialChristianPostId || null);
  const [isAdminPostModalOpen, setIsAdminPostModalOpen] = React.useState(false);
  const [adminPostCollection, setAdminPostCollection] = React.useState(
    "morning_inspirations",
  );
  const [isLeftExpanded, setIsLeftExpanded] = React.useState(false);
  const [isRightExpanded, setIsRightExpanded] = React.useState(false);

  const setAreAllWidgetsHidden = useAppStore(
    (state) => state.setAreAllWidgetsHidden,
  );
  const isZenMode = useAppStore((state) => state.isZenMode);

  React.useEffect(() => {
    // Handle deep links from URL on load
    const path = window.location.pathname;
    if (path.startsWith("/post/")) {
      const postId = path.split("/")[2];
      if (postId) {
        setMorningInspirationsInitialPostId(postId);
        setIsMorningInspirationsModalOpen(true);
      }
    } else if (path.startsWith("/inspiration/")) {
      const inspirationId = path.split("/")[2];
      if (inspirationId) {
        setChristianInspirationsInitialPostId(inspirationId);
        setIsChristianInspirationsModalOpen(true);
      }
    }

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "OPEN_MORNING_INSPIRATION") {
        const postId = event.data.postId;
        if (postId) setMorningInspirationsInitialPostId(postId);
        setIsMorningInspirationsModalOpen(true);
      } else if (
        event.data &&
        event.data.type === "SHARE_MORNING_INSPIRATION"
      ) {
        const postId = event.data.postId;
        if (postId) setMorningInspirationsInitialPostId(postId);
        setIsMorningInspirationsModalOpen(true);
        setTimeout(() => {
          addToast(
            appLanguage === "pl"
              ? "Wybierz post do udostępnienia"
              : "Select post to share",
            "info",
          );
        }, 500);
      } else if (
        event.data &&
        event.data.type === "OPEN_CHRISTIAN_INSPIRATION"
      ) {
        const inspirationId = event.data.inspirationId;
        if (inspirationId) setChristianInspirationsInitialPostId(inspirationId);
        setIsChristianInspirationsModalOpen(true);
      } else if (
        event.data &&
        event.data.type === "SHARE_CHRISTIAN_INSPIRATION"
      ) {
        setIsChristianInspirationsModalOpen(true);
        setTimeout(() => {
          addToast(
            appLanguage === "pl"
              ? "Wybierz inspirację do udostępnienia"
              : "Select inspiration to share",
            "info",
          );
        }, 500);
      } else if (event.data && event.data.type === "SUBSCRIBE_SMS") {
        setIsSmsSubscriptionModalOpen(true);
      }
    };

    const handleAdminModalEvent = (e: any) => {
      setAdminPostCollection(
        e.detail?.collectionName || "morning_inspirations",
      );
      setIsAdminPostModalOpen(true);
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    }
    window.addEventListener("message", handleServiceWorkerMessage);
    window.addEventListener("cc_open_admin_post_modal", handleAdminModalEvent);

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
      window.removeEventListener("message", handleServiceWorkerMessage);
      window.removeEventListener(
        "cc_open_admin_post_modal",
        handleAdminModalEvent,
      );
    };
  }, [appLanguage, addToast, setIsSmsSubscriptionModalOpen]);

  const addTile = (tileId: string) => {
    setAreAllWidgetsHidden(false);
    if (tileId === "daily_verse") {
      localStorage.setItem("cc_widget_daily_verse_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Werset Dnia."
          : "Added Daily Verse tile.",
        "success",
      );
    } else if (tileId === "mediaplayer") {
      localStorage.setItem("cc_widget_mediaplayer_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Odtwarzacza."
          : "Added Player tile.",
        "success",
      );
    } else if (tileId === "motivation") {
      localStorage.setItem("cc_widget_motivation_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Duchowej Motywacji."
          : "Added Spiritual Motivation tile.",
        "success",
      );
    } else if (tileId === "didyouknow") {
      localStorage.setItem("cc_widget_didyouknow_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Wiedzy."
          : "Added Information tile.",
        "success",
      );
    } else if (tileId === "golden_thoughts") {
      localStorage.setItem("cc_widget_golden_thoughts_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Złote Myśli."
          : "Added Golden Thoughts tile.",
        "success",
      );
    } else if (tileId === "cta_mobilization") {
      localStorage.setItem("cc_widget_cta_mobilization_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl"
          ? "Dodano kafelek Mobilizacji."
          : "Added Mobilization tile.",
        "success",
      );
    } else if (tileId === "yellow_card") {
      localStorage.setItem("cc_widget_yellow_card_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl" ? "Dodano Żółtą Kartkę." : "Added Yellow Card.",
        "success",
      );
    } else if (tileId === "music_news") {
      localStorage.setItem("cc_widget_music_news_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl" ? "Dodano Nowości Muzyczne." : "Added Music News.",
        "success",
      );
    } else if (tileId === "emi_news") {
      localStorage.setItem("cc_widget_emi_news_visible", "true");
      window.dispatchEvent(new Event("cc_widgets_updated"));
      addToast(
        appLanguage === "pl" ? "Dodano Wiadomości EMI." : "Added EMI News.",
        "success",
      );
    }
    setIsLeftTileMenuOpen(false);
    setIsRightTileMenuOpen(false);
  };

  const leftRoles = React.useMemo(
    () => [
      {
        name: appLanguage === "pl" ? "POBUDKI" : "MORNING INSPIRATIONS",
        desc:
          appLanguage === "pl"
            ? "Poranna inspiracja na start dnia."
            : "Morning inspiration to start the day.",
        icon: "🌅",
        action: () => setIsMorningInspirationsModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "INSPIRACJE" : "INSPIRATIONS",
        desc:
          appLanguage === "pl"
            ? "Budujące Słowo na każdy dzień."
            : "Edifying Word for every day.",
        icon: "🕊️",
        action: () => setIsChristianInspirationsModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "TV STUDIUM" : "TV STUDY",
        desc:
          appLanguage === "pl"
            ? "Telewizyjne Studium Pisma Świętego."
            : "Television Bible Study.",
        icon: "📺",
        action: () => setIsTvStudyModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "PLANER 2026" : "PLANNER 2026",
        desc:
          appLanguage === "pl"
            ? "Twój roczny plan czytania Pisma Świętego."
            : "Your yearly Bible reading plan.",
        icon: "📅",
        action: () => setCurrentView("dashboard"),
      },
      {
        name: "RADIO PL",
        desc:
          appLanguage === "pl"
            ? "Polskie Radio Duchowe."
            : "Polish Spiritual Radio.",
        icon: "📻",
        action: () => onRadioStreamChange("PL"),
      },
      {
        name: "RADIO GLOBAL",
        desc:
          appLanguage === "pl"
            ? "Radio duchowe dla świata."
            : "Spiritual radio for the world.",
        icon: "🌐",
        action: () => onRadioStreamChange("GLOBAL"),
      },
      {
        name: "RADIO BIBLIA",
        desc:
          appLanguage === "pl"
            ? "Czytane Pismo Święte."
            : "Reading of the Holy Scripture.",
        icon: "📖",
        action: () => onRadioStreamChange("BIBLIA"),
      },
      {
        name: "YOUTUBE LIVE",
        desc:
          appLanguage === "pl"
            ? "Oglądaj transmisje na żywo."
            : "Watch live streams.",
        icon: "🎥",
        action: () => onOpenYouTube?.("live"),
      },
      {
        name: appLanguage === "pl" ? "WERSET DNIA" : "VERSE OF THE DAY",
        desc:
          appLanguage === "pl"
            ? "Codzienna inspiracja wersetem."
            : "Daily verse inspiration.",
        icon: "✨",
        action: () => setIsDailyVerseModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "ZAMÓW BIBLIĘ" : "ORDER BIBLE",
        desc:
          appLanguage === "pl"
            ? "Darmowa Biblia UBG dla Ciebie."
            : "Free UBG Bible for you.",
        icon: "📖",
        action: () => (window.location.href = "tel:+48799082024"),
      },
      {
        name: appLanguage === "pl" ? "MAPA CC" : "CC MAP",
        desc:
          appLanguage === "pl"
            ? "Interaktywny przewodnik po ekosystemie."
            : "Interactive ecosystem guide.",
        icon: "🗺️",
        action: () => setIsEcosystemMapOpen(true),
      },
      {
        name: "PRAWO",
        desc:
          appLanguage === "pl"
            ? "DEKALOG - Dziesięć Przykazań Bożych."
            : "DECALOGUE - Ten Commandments.",
        icon: "⚖️",
        action: () => setIsLawDecalogueOpen(true),
      },
      {
        name: "WIKIFAITH",
        desc:
          appLanguage === "pl"
            ? "Bezpłatna Encyklopedia Wiary."
            : "Free Encyclopedia of Faith.",
        icon: "📚",
        action: () => window.open("https://wikifaith.org/pl", "_blank"),
      },
    ],
    [
      appLanguage,
      setCurrentView,
      onRadioStreamChange,
      setIsDailyVerseModalOpen,
      setIsEcosystemMapOpen,
      setIsPrayerIntentionsOpen,
      setIsLawDecalogueOpen,
    ],
  );

  const rightRoles = React.useMemo(
    () => [
      {
        name: "LIVE GLOBAL",
        desc:
          appLanguage === "pl"
            ? "Zobacz gdzie słuchają nas w czasie rzeczywistym."
            : "See where they listen to us in real time.",
        icon: "🌍",
        action: () => setIsGlobeOpen?.(true),
      },
      {
        name: appLanguage === "pl" ? "WSPIERAM" : "SUPPORT",
        desc:
          appLanguage === "pl"
            ? "Twoje wsparcie pozwala nam tworzyć narzędzia uświęcenia."
            : "Your support allows us to create tools for sanctification.",
        icon: "❤️",
        action: () => setIsSupportModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "CZYTELNIA" : "READING ROOM",
        desc:
          appLanguage === "pl"
            ? "Biblioteka publikacji Christian Culture."
            : "Christian Culture publication library.",
        icon: "📚",
        action: () => setIsReadingRoomOpen(true),
      },
      {
        name: "CZAT APP",
        desc:
          appLanguage === "pl"
            ? "Czat Christian Culture na Android."
            : "Christian Culture Android Chat.",
        icon: "💬",
        action: async () =>
          await Browser.open({
            url: "https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2",
          }),
      },
      {
        name: appLanguage === "pl" ? "POMOCNA DŁOŃ" : "HELPING HAND",
        desc:
          appLanguage === "pl"
            ? "Rozkwitnij z nami w tym tygodniu."
            : "Flourish with us this week.",
        icon: "🌿",
        action: () => setIsHelpingHandModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "STUDIO SŁOWA" : "WORD STUDIO",
        desc:
          appLanguage === "pl"
            ? "Inspirujące miejsce dla poszukiwaczy pasji."
            : "An inspiring place for passion seekers.",
        icon: "🎙️",
        action: () => setIsStudioDobregoSlowaModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "COACHING" : "COACHING",
        desc:
          appLanguage === "pl"
            ? "Holistyczny Coaching P. Murawski."
            : "Holistic Coaching P. Murawski.",
        icon: "🧭",
        action: () => setIsCoachingModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "CUDA DNIA" : "MIRACLES",
        desc:
          appLanguage === "pl"
            ? "Obejrzyj programy Cuda Każdego Dnia."
            : "Watch Daily Miracles programs.",
        icon: "📺",
        action: () => onOpenYouTube?.("live"),
      },
      {
        name: appLanguage === "pl" ? "ŚWIADECTWA" : "TESTIMONIES",
        desc:
          appLanguage === "pl"
            ? "Poznaj poruszające świadectwa wiary."
            : "Discover moving testimonies of faith.",
        icon: "🙌",
        action: () => onOpenYouTube?.("testimonies"),
      },
      {
        name: appLanguage === "pl" ? "SMS" : "SMS",
        desc:
          appLanguage === "pl"
            ? "Subskrybuj duchowe SMS-y."
            : "Subscribe to spiritual SMS.",
        icon: "📱",
        action: () => setIsSmsSubscriptionModalOpen(true),
      },
      {
        name: "SPOTIFY",
        desc:
          appLanguage === "pl"
            ? "Duchowe playlisty na Spotify."
            : "Spiritual playlists on Spotify.",
        icon: "🎵",
        action: () => setIsSpotifyModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "ODTWARZACZ CC" : "CC PLAYER",
        desc:
          appLanguage === "pl"
            ? "Twoje centrum multimedialne."
            : "Your multimedia center.",
        icon: "🎬",
        action: () => setIsCcMediaPlayerPageOpen(true),
      },
      {
        name: appLanguage === "pl" ? "ZASOBY CC" : "CC RESOURCES",
        desc:
          appLanguage === "pl"
            ? "Pobierz dzwonki i materiały CC."
            : "Download ringtones and CC materials.",
        icon: "📥",
        action: () => setIsCcResourcesModalOpen(true),
      },
      {
        name: appLanguage === "pl" ? "KURSY BIBLIJNE" : "BIBLE COURSES",
        desc:
          appLanguage === "pl"
            ? "Odkryj darmowe Kursy Biblijne."
            : "Discover free Bible Courses.",
        icon: "📖",
        action: () => window.open("https://kursybiblijne.pl/", "_blank"),
      },
      {
        name: "WHATSAPP",
        desc:
          appLanguage === "pl"
            ? "Napisz do nas na WhatsApp."
            : "Message us on WhatsApp.",
        icon: "💬",
        action: async () =>
          await Browser.open({ url: "https://wa.me/48783478280" }),
      },
    ],
    [
      appLanguage,
      setIsSupportModalOpen,
      setIsHelpingHandModalOpen,
      setIsStudioDobregoSlowaModalOpen,
      setIsCoachingModalOpen,
      setIsCentralChatOpen,
      setIsPrayerIntentionsOpen,
      setIsYouTubeLiveModalOpen,
      setIsSmsSubscriptionModalOpen,
      setIsCcNewsModalOpen,
      addToast,
      onOpenYouTube,
      setIsSpotifyModalOpen,
      setIsGlobeOpen,
    ],
  );

  React.useEffect(() => {
    const lInt = setInterval(
      () => setLeftIndex((p) => (p + 1) % leftRoles.length),
      30000,
    );
    const rInt = setInterval(
      () => setRightIndex((p) => (p + 1) % rightRoles.length),
      30000,
    );
    return () => {
      clearInterval(lInt);
      clearInterval(rInt);
    };
  }, [leftRoles.length, rightRoles.length]);

  if (isAnyModalOpen) return null;

  const left = leftRoles[leftIndex];
  const right = rightRoles[rightIndex];

  return (
    <>
      <style>
        {`
          @keyframes sidePulse {
            0% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(197, 160, 89, 0); }
            100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); }
          }
          .animate-side-pulse { animation: sidePulse 2s infinite; }
        `}
      </style>

      {/* LEWY PANEL - DYNAMICZNY */}
      <div
        className={`fixed left-0 z-[5001] flex items-center flex-row-reverse transition-all duration-700 group outline-none pointer-events-auto
          top-[calc(50%+45px)] sm:top-[calc(50%+80px)] -translate-y-1/2 ${isZenMode ? "opacity-0 -translate-x-[150%] pointer-events-none" : isLeftExpanded ? "opacity-100 translate-x-0" : "opacity-100 -translate-x-[calc(100%-40px)]"}`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsLeftExpanded(!isLeftExpanded);
            if (isRightExpanded) setIsRightExpanded(false);
          }}
          className="bg-[#C5A059]/20 cursor-pointer hover:brightness-125 backdrop-blur-xl text-[#C5A059] w-10 h-52 sm:h-64 rounded-r-[2.2rem] flex items-center justify-center shadow-[inset_0_0_20px_rgba(197,160,89,0.1),0_0_20px_rgba(197,160,89,0.2)] border-r border-y border-[#C5A059]/40 animate-side-pulse"
        >
          <span className="[writing-mode:vertical-rl] font-black text-[10px] sm:text-[12px] uppercase tracking-[0.4em] whitespace-nowrap">
            {left.name}
          </span>
        </div>

        <div
          onClick={() => {
            left.action();
            setIsLeftExpanded(false);
          }}
          role="button"
          tabIndex={0}
          className="bg-gradient-to-br cursor-pointer hover:brightness-110 from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white/10 shadow-2xl rounded-r-lg -ml-1 border-r border-white/5"
        >
          <p className="font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2 italic">
            {left.name}
          </p>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[130px] sm:max-w-[160px]">
            {left.desc}
          </p>
          <div className="mt-4 flex items-center gap-2 text-white font-black text-[9px] sm:text-[10px]">
            <span className="bg-gold text-black px-2 py-1 rounded transition-transform group-hover:scale-105">
              {left.icon} {appLanguage === "pl" ? "OTWÓRZ TERAZ" : "OPEN NOW"}
            </span>
          </div>
        </div>
      </div>

      {/* TILE ADD BUTTON LEFT */}
      <div
        className={`hidden lg:flex fixed left-0 z-[5001] top-[calc(50%+160px)] sm:top-[calc(50%+220px)] pointer-events-auto transition-all duration-700 ${isZenMode ? "opacity-0 -translate-x-[150%] pointer-events-none" : "opacity-100"}`}
      >
        <button
          onClick={() => {
            setIsLeftTileMenuOpen(!isLeftTileMenuOpen);
            setIsRightTileMenuOpen(false);
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-r-[1rem] bg-black/40 backdrop-blur-xl border-y border-r border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:bg-[#C5A059]/20 transition-all group"
        >
          <span className="text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform">
            +
          </span>
        </button>
        {isLeftTileMenuOpen && (
          <div className="absolute left-10 sm:left-12 bottom-0 max-h-[50vh] overflow-y-auto scrollbar-thin bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl border border-[#C5A059]/30 rounded-xl p-2 shadow-2xl w-56 flex flex-col gap-1">
            <h4 className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest px-2 pt-1 pb-2">
              {appLanguage === "pl" ? "Przenieś na pulpit" : "Move to desktop"}
            </h4>
            <button
              onClick={() => addTile("daily_verse")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              📱 {appLanguage === "pl" ? "Werset Dnia" : "Daily Verse"}
            </button>
            <button
              onClick={() => addTile("mediaplayer")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">🎵</span>
              {appLanguage === "pl"
                ? "Odtwarzacz Multimedialny"
                : "Media Player"}
            </button>
            <button
              onClick={() => addTile("motivation")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">⚔️</span>
              {appLanguage === "pl"
                ? "Duchowa Motywacja"
                : "Spiritual Motivation"}
            </button>
            <button
              onClick={() => addTile("didyouknow")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">💡</span>
              {appLanguage === "pl" ? "Czy wiesz, że..." : "Did you know..."}
            </button>
            <button
              onClick={() => addTile("golden_thoughts")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">⚔️</span>
              {appLanguage === "pl"
                ? "Złote Myśli: Pokonać Goliata"
                : "Golden Thoughts: Overcoming Goliath"}
            </button>
          </div>
        )}
      </div>

      {/* PRAWY PANEL - DYNAMICZNY */}
      <div
        className={`fixed right-0 z-[5001] flex items-center transition-all duration-700 group outline-none pointer-events-auto
          top-[calc(50%+45px)] sm:top-[calc(50%+80px)] -translate-y-1/2 ${isZenMode ? "opacity-0 translate-x-[150%] pointer-events-none" : isRightExpanded ? "opacity-100 translate-x-0" : "opacity-100 translate-x-[calc(100%-40px)]"}`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsRightExpanded(!isRightExpanded);
            if (isLeftExpanded) setIsLeftExpanded(false);
          }}
          className="bg-[#C5A059]/20 cursor-pointer hover:brightness-125 backdrop-blur-xl text-[#C5A059] w-10 h-52 sm:h-64 rounded-l-[2.2rem] flex items-center justify-center shadow-[inset_0_0_20px_rgba(197,160,89,0.1),0_0_20px_rgba(197,160,89,0.2)] border-l border-y border-[#C5A059]/40 animate-side-pulse"
        >
          <span className="[writing-mode:vertical-rl] rotate-180 font-black text-[10px] sm:text-[12px] uppercase tracking-[0.4em] whitespace-nowrap drop-shadow-sm">
            {right.name}
          </span>
        </div>

        <div
          onClick={() => {
            right.action();
            setIsRightExpanded(false);
          }}
          role="button"
          tabIndex={0}
          className="bg-gradient-to-br cursor-pointer hover:brightness-110 from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white/10 shadow-2xl rounded-l-lg -mr-1 border-l border-white/5"
        >
          <p className="font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2 italic">
            {right.name}
          </p>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[130px] sm:max-w-[160px]">
            {right.desc}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-white font-black text-[9px] sm:text-[10px]">
            <span className="flex items-center gap-1">
              {right.icon} {right.name}
            </span>
          </div>
        </div>
      </div>

      {/* TILE ADD BUTTON RIGHT */}
      <div
        className={`hidden lg:flex fixed right-0 z-[5001] top-[calc(50%+160px)] sm:top-[calc(50%+220px)] pointer-events-auto flex-row-reverse transition-all duration-700 ${isZenMode ? "opacity-0 translate-x-[150%] pointer-events-none" : "opacity-100"}`}
      >
        <button
          onClick={() => {
            setIsRightTileMenuOpen(!isRightTileMenuOpen);
            setIsLeftTileMenuOpen(false);
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-l-[1rem] bg-black/40 backdrop-blur-xl border-y border-l border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:bg-[#C5A059]/20 transition-all group"
        >
          <span className="text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform">
            +
          </span>
        </button>
        {isRightTileMenuOpen && (
          <div className="absolute right-10 sm:right-12 bottom-0 max-h-[50vh] overflow-y-auto scrollbar-thin bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl border border-[#C5A059]/30 rounded-xl p-2 shadow-2xl w-56 flex flex-col gap-1">
            <h4 className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest px-2 pt-1 pb-2">
              {appLanguage === "pl" ? "Przenieś na pulpit" : "Move to desktop"}
            </h4>
            <button
              onClick={() => addTile("daily_verse")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              📱 {appLanguage === "pl" ? "Werset Dnia" : "Daily Verse"}
            </button>
            <button
              onClick={() => addTile("cta_mobilization")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">🎯</span>
              {appLanguage === "pl"
                ? "Wezwanie do działania"
                : "Call to Action"}
            </button>
            <button
              onClick={() => addTile("yellow_card")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">📝</span>
              {appLanguage === "pl" ? "Żółta Kartka" : "Yellow Card"}
            </button>
            <button
              onClick={() => addTile("music_news")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">🎵</span>
              {appLanguage === "pl"
                ? "Nowości Muzyczne 2026"
                : "Music News 2026"}
            </button>
            <button
              onClick={() => addTile("emi_news")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-white uppercase font-bold tracking-wider transition-colors text-left"
            >
              <span className="text-lg">📻</span>
              {appLanguage === "pl" ? "Wiadomości EMI" : "EMI News"}
            </button>
          </div>
        )}
      </div>

      <MorningInspirationsModal
        isOpen={isMorningInspirationsModalOpen}
        onClose={() => {
          setIsMorningInspirationsModalOpen(false);
          setMorningInspirationsInitialPostId(null);
        }}
        appLanguage={appLanguage}
        addToast={addToast}
        initialPostId={morningInspirationsInitialPostId}
      />
      <ChristianInspirationsModal
        isOpen={isChristianInspirationsModalOpen}
        onClose={() => {
          setIsChristianInspirationsModalOpen(false);
          setChristianInspirationsInitialPostId(null);
        }}
        appLanguage={appLanguage}
        addToast={addToast}
        initialPostId={christianInspirationsInitialPostId}
        openSmsSubscription={() => {
          setIsChristianInspirationsModalOpen(false);
          setIsSmsSubscriptionModalOpen(true);
        }}
      />
      <AdminPostModal
        isOpen={isAdminPostModalOpen}
        onClose={() => setIsAdminPostModalOpen(false)}
        appLanguage={appLanguage}
        addToast={addToast}
        collectionName={adminPostCollection}
      />
    </>
  );
};
