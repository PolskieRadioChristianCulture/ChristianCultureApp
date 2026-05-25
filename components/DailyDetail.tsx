import { useAppStore } from "../useAppStore";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import SunCalc from "suncalc";
import { Separator } from "./Separator";
import {
  Prayer,
  MONTH_NAMES_GENITIVE_PL,
  DAY_NAMES_PL,
  SpiritualGoal,
  DailyGoalProgress,
  ToastMessage,
  UserPersona,
  DailyGoal,
  DailyTask,
  fixOrphans,
  normalizeBibleReference,
  MONTH_NAMES_EN,
  DAY_NAMES_EN,
  RadioAlarm,
  MIRIAM_AVATAR_URL,
  ManagementTab,
  BibleVerse,
  splitVerseIntoLines,
  SupportedLanguage,
} from "../types";
import { AlarmClock, Share2 } from "lucide-react";
import { AboutSection } from "./AboutSection";
import { CommunityService } from "../services/communityService";

interface DailyDetailProps {
  date: Date;
  dailyVerse: BibleVerse | null;
  prayers: Prayer[];
  onAddPrayer: (content: string, time?: string) => void;
  onUpdatePrayer: (
    id: string,
    newContent: string,
    newTime?: string,
    completed?: boolean,
  ) => void;
  onDeletePrayer: (id: string) => void;
  dailyGoals: DailyGoal[];
  onAddDailyGoal: (content: string) => void;
  onUpdateDailyGoal: (
    id: string,
    newContent: string,
    completed: boolean,
  ) => void;
  onDeleteDailyGoal: (id: string) => void;
  dailyTasks: DailyTask[];
  onAddDailyTask: (content: string) => void;
  onUpdateDailyTask: (
    id: string,
    newContent: string,
    completed: boolean,
  ) => void;
  onDeleteDailyTask: (id: string) => void;
  note: string;
  onUpdateNote: (content: string, time?: string) => void;
  theme: "dark" | "light";
  userPersona: UserPersona;
  appLanguage: SupportedLanguage;
  weatherData: any | null;
  radioAlarm: RadioAlarm | null;
  onOpenRadioControl: () => void;
  onOpenVoiceAssistant?: () => void;
  isMiriamUnlocked?: boolean;
  onOpenManagement: (tab: ManagementTab) => void;
  spiritualGoals: SpiritualGoal[];
  setSpiritualGoals: React.Dispatch<React.SetStateAction<SpiritualGoal[]>>;
  dailyGoalProgress: DailyGoalProgress[];
  setDailyGoalProgress: React.Dispatch<
    React.SetStateAction<DailyGoalProgress[]>
  >;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onOpenDailyVerseModal: (verse: BibleVerse) => void;
  onOpenRadioMode: () => void;
  onOpenBiblicalSchool: () => void;
  onOpenSupport: () => void;
  isLandscape?: boolean;
  onToggleFavorite?: (item: any) => void;
  onGoogleLogin?: () => void;
  isSyncing?: boolean;
  globalAmensCount?: number;
  dailyAmensCount?: number;
}

export const DailyDetail: React.FC<DailyDetailProps> = ({
  date,
  dailyVerse,
  appLanguage,
  radioAlarm,
  onOpenVoiceAssistant,
  isMiriamUnlocked,
  onOpenManagement,
  onOpenDailyVerseModal,
  onOpenRadioMode,
  onOpenBiblicalSchool,
  onOpenSupport,
  userPersona,
  isLandscape = false,
  onToggleFavorite,
  onGoogleLogin,
  isSyncing = false,
  globalAmensCount = 0,
  dailyAmensCount = 0,
}) => {
  const [showSabbathDetails, setShowSabbathDetails] = useState(false);
  const [isVerseElementGlowing, setIsVerseElementGlowing] = useState(false);
  const [plusAnimations, setPlusAnimations] = useState<
    { id: number; x: number }[]
  >([]);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLongPressed = useRef(false);

  const handleShareAndCopy = useCallback(async () => {
    if (!dailyVerse) return;

    // Budowanie PEŁNEJ treści zgodnie z prośbą użytkownika (werset, sygnatura, przypisy/refleksja)
    const translationLabel = appLanguage === "pl" ? "Przekład" : "Translation";
    const translationInfo =
      appLanguage === "pl" ? "Biblia Warszawska (BW)" : "Warsaw Bible (BW)";
    const reflectionTitle =
      appLanguage === "pl"
        ? "PRZYPISY I ROZWAŻANIE:"
        : "FOOTNOTES & REFLECTION:";

    let fullContent = `"${dailyVerse.text}"\n— ${dailyVerse.reference} —\n\n${translationLabel}: ${translationInfo}`;

    if (dailyVerse.reflection || dailyVerse.commentary) {
      fullContent += `\n\n${reflectionTitle}\n${dailyVerse.reflection || dailyVerse.commentary}`;
    }

    fullContent += `\n\n#ChristianCulture | cclite.pl | www.polskieradio.cc |\nPolecam aplikacje Christian Culture w sklepie Google Play: https://play.google.com/store/apps/dev?id=5215448773598149938 \n| Udostępnij Werset Dnia i zostań patronem na https://patronite.pl/osobowoscplus\n| Niech dobry Bóg Cię błogosławi.`;

    try {
      await navigator.clipboard.writeText(fullContent);
    } catch (err) {
      console.debug("Clipboard copy failed");
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Werset Dnia - Christian Culture",
          text: fullContent,
          url: "https://cclite.pl",
        });
      } catch (err) {
        console.debug("Share cancelled");
      }
    }
  }, [dailyVerse, appLanguage]);

  const handlePressStart = useCallback(() => {
    hasLongPressed.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);

    longPressTimer.current = setTimeout(() => {
      hasLongPressed.current = true;
      setIsVerseElementGlowing(true);
      if ("vibrate" in navigator) navigator.vibrate([60, 40, 60]);

      handleShareAndCopy();

      // Podświetlenie ramki trwa 4 sekundy
      setTimeout(() => setIsVerseElementGlowing(false), 4000);
    }, 2000);
  }, [handleShareAndCopy]);

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;
  const isFriday = date.getDay() === 5;

  const isFavorite = useMemo(() => {
    if (!dailyVerse || !userPersona.favorites) return false;
    const verseId = dailyVerse.id || dailyVerse.reference;
    return userPersona.favorites.some((f) => f.id === verseId);
  }, [dailyVerse, userPersona.favorites]);

  const handleToggleFavorite = useCallback(() => {
    if (!dailyVerse || !onToggleFavorite) return;
    onToggleFavorite({
      id: dailyVerse.id || dailyVerse.reference,
      type: "verse",
      content: dailyVerse.text,
      reference: dailyVerse.reference,
      timestamp: new Date().toISOString(),
    });
  }, [dailyVerse, onToggleFavorite]);

  const currentMonthNamesGenitive =
    appLanguage === "pl"
      ? MONTH_NAMES_GENITIVE_PL
      : MONTH_NAMES_EN.map((name) => name.toLowerCase());
  const currentDayNames = appLanguage === "pl" ? DAY_NAMES_PL : DAY_NAMES_EN;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [blinkColon, setBlinkColon] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(
      () => setBlinkColon((prev) => !prev),
      500,
    );
    return () => clearInterval(blinkInterval);
  }, []);

  const [sabbathTimes, setSabbathTimes] = useState<{
    friday: string;
    saturday: string;
  } | null>(null);

  useEffect(() => {
    try {
      let lat = 52.2297; // Warsaw fallback
      let lon = 21.0122;

      if (userPersona.location) {
        const parts = userPersona.location.split(",");
        if (
          parts.length === 2 &&
          !isNaN(parseFloat(parts[0])) &&
          !isNaN(parseFloat(parts[1]))
        ) {
          lat = parseFloat(parts[0]);
          lon = parseFloat(parts[1]);
        }
      }

      const now = new Date();
      const day = now.getDay();

      const friday = new Date(now);
      let daysToFriday = day <= 5 ? 5 - day : -1;
      friday.setDate(now.getDate() + daysToFriday);
      friday.setHours(12, 0, 0, 0);

      const saturday = new Date(friday);
      saturday.setDate(friday.getDate() + 1);
      saturday.setHours(12, 0, 0, 0);

      const fridaySunset = SunCalc.getTimes(friday, lat, lon).sunset;
      const saturdaySunset = SunCalc.getTimes(saturday, lat, lon).sunset;

      const formatTime = (d: Date) => {
        if (isNaN(d.getTime()))
          return appLanguage === "pl" ? "brak danych" : "no data";
        return d.toLocaleTimeString(appLanguage === "pl" ? "pl-PL" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      setSabbathTimes({
        friday: formatTime(fridaySunset),
        saturday: formatTime(saturdaySunset),
      });
    } catch (e) {
      console.error("Sabbath time calculation error:", e);
      setSabbathTimes({
        friday: appLanguage === "pl" ? "zachód słońca" : "sunset",
        saturday: appLanguage === "pl" ? "zachód słońca" : "sunset",
      });
    }
  }, [userPersona.location, appLanguage, date]);

  const timeString = currentTime.toLocaleTimeString(
    appLanguage === "pl" ? "pl-PL" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );
  const [hour, minute] = timeString.split(":");

  const dynamicFontSize = useMemo(() => {
    if (!dailyVerse) return "text-lg";
    const len = dailyVerse.text.length;
    if (len < 60) return "text-2xl sm:text-3xl";
    if (len < 120) return "text-xl sm:text-2xl";
    if (len < 200) return "text-lg sm:text-xl";
    return "text-base sm:text-lg";
  }, [dailyVerse]);

  return (
    <div
      id="cc-organizer"
      className={`space-y-6 animate-fade-in ${isLandscape ? "pb-4" : "pb-10"}`}
    >
      <button
        onClick={onOpenRadioMode}
        className={`w-full ${isLandscape ? "py-3" : "py-5"} bg-zinc-900 border-2 border-[#C5A059]/40 rounded-[2rem] flex items-center justify-center gap-4 text-[#C5A059] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-95 group`}
      >
        <span
          className={`${isLandscape ? "text-xl" : "text-2xl"} group-hover:rotate-12 transition-transform`}
        >
          📻
        </span>
        {appLanguage === "pl" ? "Wróć do Panelu Radia" : "Back to Radio Panel"}
      </button>

      <div
        className={`relative overflow-hidden ${isLandscape ? "p-4" : "p-6 sm:p-8"} rounded-[3rem] bg-zinc-950 border border-zinc-800 shadow-2xl group flex flex-col ${isLandscape ? "min-h-[300px]" : "min-h-[500px]"}`}
      >
        {/* Glow Effect for depth */}
        <div className="absolute -inset-20 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-[0.5625rem] font-black uppercase tracking-[0.4em] text-[#C5A059] mb-1">
              {isSaturday
                ? appLanguage === "pl"
                  ? "DZIEŃ PAŃSKI (SZABAT)"
                  : "THE LORDS DAY (SABBATH)"
                : isSunday
                  ? appLanguage === "pl"
                    ? "PIERWSZY DZIEŃ TYGODNIA"
                    : "THE FIRST DAY OF THE WEEK"
                  : appLanguage === "pl"
                    ? "ORGANIZER CC"
                    : "CC ORGANIZER"}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              {currentDayNames[date.getDay()]}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tighter">
              {hour}
              <span
                className={`${blinkColon ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
              >
                :
              </span>
              {minute}
            </span>
            <p className="text-[0.4375rem] font-black text-zinc-600 uppercase tracking-widest mt-1">
              Soli Deo Gloria
            </p>
          </div>
        </div>

        <div className="mb-8 relative z-10 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter leading-none">
              {date.getDate()}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-zinc-600 tracking-tighter leading-none">
              {currentMonthNamesGenitive[date.getMonth()]}
            </span>
          </div>
          {(isSaturday || isSunday) && (
            <div className="w-10 h-10 bg-[#C5A059] rounded-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_20px_#C5A059] animate-pulse">
              {isSaturday ? "S" : "I"}
            </div>
          )}
        </div>

        {dailyVerse && (
          <div className="flex flex-col gap-4 mb-8 relative z-10">
            <div
              className={`relative flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 bg-white/[0.02] border-2 transition-all rounded-3xl group overflow-hidden ${isVerseElementGlowing ? "glowing-gold-border" : "border-transparent border-y-white/5"}`}
            >
              <Separator
                text={appLanguage === "pl" ? "SŁOWO BOŻE" : "WORD OF GOD"}
              />
              <div
                className="w-full flex flex-col items-center justify-center px-2 cursor-pointer transition-transform active:scale-95 hover:opacity-90"
                onClick={handleShareAndCopy}
                title={
                  appLanguage === "pl"
                    ? "Skopiuj i udostępnij werset"
                    : "Copy and share verse"
                }
              >
                <div
                  className={`${userPersona.dailyVerseConfig?.fontSize ? "" : dynamicFontSize} italic text-zinc-100 leading-relaxed text-center drop-shadow-md group-hover:text-white transition-colors [hyphens:none] text-balance ${!userPersona.dailyVerseConfig?.fontFamily || userPersona.dailyVerseConfig?.fontFamily === "lora" ? "font-serif" : ""}`}
                  style={{
                    fontSize: userPersona.dailyVerseConfig?.fontSize
                      ? `${userPersona.dailyVerseConfig.fontSize / 16}rem`
                      : undefined,
                    fontFamily:
                      userPersona.dailyVerseConfig?.fontFamily === "mono"
                        ? "var(--font-mono)"
                        : userPersona.dailyVerseConfig?.fontFamily === "serif"
                          ? "ui-serif, Georgia, serif"
                          : userPersona.dailyVerseConfig?.fontFamily === "sans"
                            ? "ui-sans-serif, system-ui, sans-serif"
                            : undefined,
                  }}
                >
                  {splitVerseIntoLines(
                    dailyVerse.text,
                    dailyVerse.reference,
                  ).map((line, idx) => (
                    <p key={idx} className="mb-1 last:mb-0 text-balance">
                      {idx === 0 ? `"${fixOrphans(line)}` : fixOrphans(line)}
                      {idx ===
                      splitVerseIntoLines(dailyVerse.text, dailyVerse.reference)
                        .length -
                        1
                        ? '"'
                        : ""}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-row items-center justify-center gap-3">
                  <button
                    aria-label="Ulubione"
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-full transition-all active:scale-90 pointer-events-auto ${isFavorite ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-[#C5A059]/50"}`}
                  >
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorite ? "fill-current" : ""}`}
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

                      const newAnimId = Date.now();
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
                    className="p-3 flex items-center justify-center gap-1 rounded-full transition-all active:scale-90 bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-[#C5A059]/50 pointer-events-auto relative group"
                    title={
                      appLanguage === "pl" ? "Amen (modlitwa)" : "Amen (prayer)"
                    }
                  >
                    <span
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[1.125rem] sm:text-[1.375rem] leading-none"
                      role="img"
                    >
                      🙏
                    </span>

                    {plusAnimations.map((anim) => (
                      <span
                        key={anim.id}
                        className="absolute top-0 text-green-400 font-extrabold text-[0.875rem] pointer-events-none z-50 animate-fly-up-plus drop-shadow-md"
                        style={{ left: `calc(50% + ${anim.x}px)` }}
                      >
                        +
                      </span>
                    ))}

                    {globalAmensCount > 0 && (
                      <div className="absolute -top-3 -right-3 flex flex-col items-center bg-gradient-to-r from-green-500 to-green-400 text-white px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-fade-in origin-bottom-left">
                        <span className="text-[0.6875rem] font-black leading-none flex items-center gap-1">
                          <span className="text-[9px]">🙏</span> +
                          {globalAmensCount}
                        </span>
                        {dailyAmensCount > 0 && (
                          <span className="hidden sm:block text-[0.5rem] font-bold opacity-80 border-t border-white/20 mt-0.5 pt-0.5">
                            Dziś: {dailyAmensCount}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                  <button
                    aria-label="Udostępnij"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareAndCopy();
                    }}
                    className="p-3 rounded-full transition-all active:scale-90 bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-[#C5A059]/50 pointer-events-auto"
                  >
                    <Share2
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>

                <div className="flex flex-row items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const state = useAppStore.getState();
                      const fonts: ("lora" | "mono" | "sans" | "serif")[] = [
                        "lora",
                        "serif",
                        "sans",
                        "mono",
                      ];
                      const currFont =
                        userPersona.dailyVerseConfig?.fontFamily || "lora";
                      const nextFont =
                        fonts[
                          (fonts.indexOf(currFont as any) + 1) % fonts.length
                        ];
                      state.setUserPersona({
                        ...userPersona,
                        dailyVerseConfig: {
                          ...userPersona.dailyVerseConfig,
                          fontSize:
                            userPersona.dailyVerseConfig?.fontSize || 24,
                          fontFamily: nextFont,
                        },
                      });
                    }}
                    className="p-3 text-xs font-black uppercase text-zinc-400 bg-zinc-900/80 border border-white/10 rounded-xl hover:text-white hover:border-[#C5A059]/50 transition-all pointer-events-auto"
                  >
                    Aa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentSize =
                        userPersona.dailyVerseConfig?.fontSize || 24;
                      useAppStore.getState().setUserPersona({
                        ...userPersona,
                        dailyVerseConfig: {
                          ...userPersona.dailyVerseConfig,
                          fontFamily:
                            userPersona.dailyVerseConfig?.fontFamily || "lora",
                          fontSize: Math.max(12, currentSize - 2),
                        },
                      });
                    }}
                    className="p-3 text-xs font-black text-zinc-400 bg-zinc-900/80 border border-white/10 rounded-xl hover:text-white hover:border-[#C5A059]/50 transition-all pointer-events-auto flex items-center justify-center leading-none"
                  >
                    a-
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentSize =
                        userPersona.dailyVerseConfig?.fontSize || 24;
                      useAppStore.getState().setUserPersona({
                        ...userPersona,
                        dailyVerseConfig: {
                          ...userPersona.dailyVerseConfig,
                          fontFamily:
                            userPersona.dailyVerseConfig?.fontFamily || "lora",
                          fontSize: Math.min(60, currentSize + 2),
                        },
                      });
                    }}
                    className="p-3 text-sm font-black text-zinc-400 bg-zinc-900/80 border border-white/10 rounded-xl hover:text-white hover:border-[#C5A059]/50 transition-all pointer-events-auto flex items-center justify-center leading-none"
                  >
                    A+
                  </button>
                </div>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasLongPressed.current)
                      onOpenDailyVerseModal(dailyVerse);
                  }}
                  className="w-full text-center text-[0.625rem] font-black text-[#C5A059] uppercase tracking-widest opacity-80 whitespace-nowrap overflow-hidden text-ellipsis pointer-events-auto cursor-pointer hover:underline mt-2"
                >
                  — {normalizeBibleReference(dailyVerse.reference, appLanguage)}{" "}
                  —
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenBiblicalSchool}
                className="flex flex-col items-center justify-center gap-1.5 py-4 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 text-zinc-400 hover:border-[#C5A059]/50 hover:text-white transition-all active:scale-95 shadow-xl font-black text-[0.5rem] uppercase tracking-widest"
              >
                <span className="text-xl">🎓</span>
                {appLanguage === "pl" ? "Szkoła" : "School"}
              </button>
              <button
                onClick={onOpenSupport}
                className="flex flex-col items-center justify-center gap-1.5 py-4 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 text-zinc-400 hover:border-[#C5A059]/50 hover:text-white transition-all active:scale-95 shadow-xl font-black text-[0.5rem] uppercase tracking-widest"
              >
                <span className="text-xl">❤️</span>
                {appLanguage === "pl" ? "MISJA" : "MISSION"}
              </button>
            </div>
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Christian Identity Desktop Bubble */}
          <div
            className={`relative flex items-center gap-4 p-4 rounded-[2rem] border transition-all duration-500 group 
                    ${
                      !userPersona.googleEmail
                        ? "bg-white border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)] animate-pulse"
                        : "bg-zinc-900/80 border-white/10 hover:border-[#C5A059]/40 shadow-xl cursor-pointer"
                    }`}
            onClick={() =>
              userPersona.googleEmail
                ? onOpenManagement("preferences")
                : undefined
            }
          >
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 shadow-2xl
                       ${!userPersona.googleEmail ? "border-[#C5A059]" : "border-white/20"}`}
              >
                {isSyncing ? (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                  </div>
                ) : (
                  <img
                    src={
                      userPersona.profilePicture ||
                      (userPersona.googleEmail
                        ? "/ROGOWSKI.webp"
                        : "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg")
                    }
                    alt="Identity"
                    className={`w-full h-full object-cover ${!userPersona.googleEmail ? "p-2.5" : ""}`}
                  />
                )}
              </div>
              {!userPersona.googleEmail && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C5A059] rounded-full border-2 border-white animate-bounce"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={`block text-xs font-black uppercase tracking-tight truncate ${!userPersona.googleEmail ? "text-black" : "text-white"}`}
              >
                {userPersona.googleEmail
                  ? userPersona.name
                  : appLanguage === "pl"
                    ? "POŁĄCZ IDENTITY"
                    : "CONNECT IDENTITY"}
              </span>
              <p
                className={`text-[9px] font-bold uppercase tracking-widest truncate mt-0.5 ${!userPersona.googleEmail ? "text-[#C5A059]" : "text-zinc-500"}`}
              >
                {userPersona.googleEmail
                  ? "CHRISTIAN IDENTITY"
                  : appLanguage === "pl"
                    ? "LOGOWANIE GOOGLE"
                    : "GOOGLE LOGIN"}
              </p>
            </div>

            {!userPersona.googleEmail && (
              <div className="absolute -top-[120%] right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 bg-zinc-900 border border-[#C5A059] rounded-xl p-4 shadow-2xl w-56 scale-95 group-hover:scale-100 origin-bottom-right">
                <p className="text-xs text-zinc-300 mb-3 text-center leading-relaxed font-medium">
                  {appLanguage === "pl"
                    ? "Zaloguj się, aby połączyć się z globalnym ekosystemem."
                    : "Log in to connect with the global ecosystem."}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoogleLogin) onGoogleLogin();
                  }}
                  className="w-full py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
                >
                  {appLanguage === "pl"
                    ? "ZALOGUJ G-MAIL"
                    : "LOG IN WITH G-MAIL"}
                </button>
              </div>
            )}
          </div>

          <div
            onClick={() =>
              isMiriamUnlocked
                ? onOpenVoiceAssistant?.()
                : onOpenManagement("preferences")
            }
            className={`relative flex items-center gap-4 p-4 rounded-[2rem] border transition-all duration-500 cursor-pointer group 
                ${isMiriamUnlocked ? "bg-zinc-900/80 border-[#C5A059]/30 shadow-xl" : "bg-zinc-950 border-zinc-800"}`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={MIRIAM_AVATAR_URL}
                alt="Miriam"
                className="w-12 h-12 rounded-full border-2 border-[#C5A059]/60 object-cover shadow-lg group-hover:scale-105 transition-transform"
              />
              {isMiriamUnlocked && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-black text-white uppercase tracking-tight truncate">
                Miriam Assistant
              </span>
              <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest truncate">
                {isMiriamUnlocked
                  ? appLanguage === "pl"
                    ? "ROZMAWIAJ"
                    : "TALK NOW"
                  : appLanguage === "pl"
                    ? "ODBLOKUJ"
                    : "UNLOCK"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onOpenManagement("alarm")}
              className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col items-center gap-1.5 hover:border-[#C5A059]/50 transition-all"
            >
              <span className="text-xl">⏰</span>
              <span className="text-[8px] font-black uppercase text-zinc-500">
                {appLanguage === "pl" ? "BUDZIK" : "ALARM"}
              </span>
              <span className="text-[10px] font-black text-[#C5A059] tabular-nums">
                {radioAlarm?.enabled ? radioAlarm.time : "--:--"}
              </span>
            </button>
            <button
              onClick={() => setShowSabbathDetails(!showSabbathDetails)}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${showSabbathDetails ? "bg-[#C5A059] border-[#C5A059] text-black" : "bg-zinc-900/60 border-zinc-800 text-zinc-500"}`}
            >
              <span className="text-xl">🕯️</span>
              <span className="text-[8px] font-black uppercase">
                {appLanguage === "pl" ? "SZABAT" : "SABBATH"}
              </span>
              <span className="text-[10px] font-black">
                {isFriday || isSaturday ? "AKTUALNY" : "INFO"}
              </span>
            </button>
          </div>
        </div>

        {showSabbathDetails && (
          <div className="relative z-10 mt-4 p-5 bg-black/60 rounded-[1.5rem] border border-[#C5A059]/20 animate-fade-in">
            <h5 className="text-[0.5625rem] font-black text-[#C5A059] uppercase tracking-widest mb-3 text-center border-b border-white/5 pb-2">
              Czas Odpoczynku
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[0.625rem] font-bold">
                <span className="text-zinc-500 uppercase">Start (Erew):</span>
                <span className="text-white text-right">
                  Piątek zachód słońca
                  <br />
                  <span className="text-[#C5A059] opacity-80 text-[0.6875rem] block mt-0.5">
                    {sabbathTimes?.friday || ""}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center text-[0.625rem] font-bold">
                <span className="text-zinc-500 uppercase">
                  Koniec (Hawdala):
                </span>
                <span className="text-white text-right">
                  Sobota zachód słońca
                  <br />
                  <span className="text-[#C5A059] opacity-80 text-[0.6875rem] block mt-0.5">
                    {sabbathTimes?.saturday || ""}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AboutSection appLanguage={appLanguage} />
    </div>
  );
};
