import React, { useState, useEffect, useMemo, useCallback } from "react";
import SunCalc from "suncalc";
import { X, Share2, MousePointer2, MousePointerClick } from "lucide-react";
import { useAppStore } from "../useAppStore";
import {
  fixOrphans,
  REVOLUT_LINK,
  YOUTUBE_DAILY_MIRACLES_PLAYLIST_URL,
  HOTLINE_NADZIEJA_NUMBER,
  CHRISTIAN_CULTURE_HOMEPAGE_URL,
  SMS_SUB_NUMBER,
  TickerContentItem,
  SMS_SUB_MESSAGE_PL,
  SMS_SUB_MESSAGE_EN,
  CHRISTIAN_DATING_APP_URL,
  CENTRUM_CC_URL,
  CENTRUM_LOGO_URL,
  SupportedLanguage,
  PrayerIntention,
  UserPersona,
  BibleVerse,
  ToastMessage,
} from "../types";
import { CommunityService } from "../services/communityService";
import { auth } from "../firebase";
import { Browser } from "@capacitor/browser";

interface TopNewsTickerProps {
  appLanguage: SupportedLanguage;
  activeStream: string;
  installStatus: "install" | "installed" | "update";
  onInstallClick: () => void;
  onOpenSmsSubscriptionModal: () => void;
  onOpenSupport: () => void;
  onShareApp: () => void;
  onIntentionsVisibilityChange?: (isVisible: boolean) => void;
  onExpandedChange?: (isExpanded: boolean) => void;
  userPersona: UserPersona;
  onToggleFavorite?: (item: any) => void;
  dailyVerse?: BibleVerse | null;
  onOpenCcNews?: () => void;
  onOpenEcosystemMap?: () => void;
  onOpenReadingRoom?: () => void;
  onOpenHelpingHand?: () => void;
  onOpenStudioDobregoSlowa?: () => void;
  onOpenCoaching?: () => void;
  onOpenDashboard?: () => void;
  addToast?: (msg: string, type?: ToastMessage["type"]) => void;
  onOpenMusicNews?: () => void;
  onOpenOpenLetter?: () => void;
  onOpenZbyszekGieron?: () => void;
  onOpenEmi?: () => void;
  onOpenInstrumentalMusic?: () => void;
}

const WHATSAPP_PRAYER_GROUP_URL =
  "https://chat.whatsapp.com/LGzSCB9K5Vp2jTF8dIALI6";

const MOTIVATIONAL_PHRASES = {
  pl: [
    "HalleluYah! #DobrzeŻejesteś... Jahwe ma dla Ciebie plan pełen pokoju i nadziei. Zaufaj Mu dzisiaj całym sercem.",
    "HalleluYah! #DobrzeŻejesteś... Jesteś światłością świata, niech Twój blask dziś lśni przed ludźmi ku chwale Ojca.",
    "HalleluYah! #DobrzeŻejesteś... Wszystko możesz w Tym, który Cię umacnia. Nie bój się wyzwań tego dnia.",
    "HalleluYah! #DobrzeŻejesteś... Wiara góry przenosi, a Twoja miłość build bridge do serc innych ludzi.",
    "HalleluYah! #DobrzeŻejesteś... Twoja obecność tutaj to błogosławieństwo od Jahwe. Idź i czyń dobro w imię Jezusa.",
    "HalleluYah! #DobrzeŻejesteś... Pamiętaj, że Jahwe jest Twoim pasterzem. Niczego Ci dzisiaj nie braknie.",
    "HalleluYah! #DobrzeŻejesteś... Dobre Słowo ma moc uzdrawiania. Podziel się nim z kimś, kto dziś tego potrzebuje.",
  ],
  en: [
    "HalleluYah! #GoodToHaveYouHere... God has a plan for you full of peace and hope. Trust Him today with all your heart.",
    "HalleluYah! #GoodToHaveYouHere... You are the light of the world, let your light shine before others for the glory of the Father.",
    "HalleluYah! #GoodToHaveYouHere... You can do all things through Him who strengthens you. Do not fear today's challenges.",
    "HalleluYah! #GoodToHaveYouHere... Faith moves mountains, and your love builds bridges to the hearts of others.",
    "HalleluYah! #GoodToHaveYouHere... Your presence here is a blessing from God. Go and do good in Jesus' name.",
    "HalleluYah! #GoodToHaveYouHere... Remember that the Lord is your shepherd. You shall not want for anything today.",
    "HalleluYah! #GoodToHaveYouHere... A good word has the power to heal. Share it with someone who needs it today.",
  ],
};

const MISSION_PHRASES = {
  pl: [
    "HalleluYah! #DobrzeŻejesteś... Twoje wsparcie buduje Christian Culture. Dołącz do naszej misji i pomóż nam docierać z Ewangelią do każdego zakątka świata.",
    "HalleluYah! #DobrzeŻejesteś... Razem możemy więcej! Wesprzyj misję Christian Culture i stań się częścią wielkiego dzieła ewangelizacji.",
    "HalleluYah! #DobrzeŻejesteś... Misja Christian Culture to głoszenie Prawdy. Twoja cegiełka pomaga nam utrzymać radio i rozwijać aplikację.",
  ],
  en: [
    "HalleluYah! #GoodToHaveYouHere... Your support builds Christian Culture. Join our mission and help us reach every corner of the world with the Gospel.",
    "HalleluYah! #GoodToHaveYouHere... Together we can do more! Support the Christian Culture mission and become part of a great work of evangelization.",
    "HalleluYah! #GoodToHaveYouHere... The mission of Christian Culture is to proclaim the Truth. Your contribution helps us maintain the radio and develop the app.",
  ],
};

const SMS_PHRASES = {
  pl: [
    "HalleluYah! #DobrzeŻejesteś... Subskrybuj Duchowe Inspiracje SMS! Otrzymuj codzienne Słowo Boże bezpośrednio na swój telefon i polecaj nas bliskim.",
    "HalleluYah! #DobrzeŻejesteś... Chcesz codziennie otrzymywać werset dnia na SMS? Dołącz do naszej subskrypcji i bądź zawsze blisko Słowa.",
    "HalleluYah! #DobrzeŻejesteś... Polecaj Duchowe Inspiracje Christian Culture! Pomóż innym odkryć moc codziennego kontaktu z Pismem Świętym.",
  ],
  en: [
    "HalleluYah! #GoodToHaveYouHere... Subscribe to Spiritual Inspirations SMS! Receive the daily Word of God directly to your phone and recommend us to your loved ones.",
    "HalleluYah! #GoodToHaveYouHere... Want to receive the verse of the day via SMS every day? Join our subscription and always stay close to the Word.",
    "HalleluYah! #GoodToHaveYouHere... Recommend Christian Culture Spiritual Inspirations! Help others discover the power of daily contact with the Holy Scriptures.",
  ],
};

const NEWS_PHRASES = {
  pl: [
    "HalleluYah! #DobrzeŻejesteś... Sprawdź najnowsze wydarzenia z życia Christian Culture.",
    "HalleluYah! #DobrzeŻejesteś... Bądź na bieżąco z naszą misją. Poleć aplikację swoim bliskim.",
    "HalleluYah! #DobrzeŻejesteś... Poznaj nowe podcasty, kursy oraz wydarzenia na żywo.",
  ],
  en: [
    "HalleluYah! #GoodToHaveYouHere... Check out the latest events from Christian Culture.",
    "HalleluYah! #GoodToHaveYouHere... Stay up to date with our mission. Recommend the app to your loved ones.",
    "HalleluYah! #GoodToHaveYouHere... Discover new podcasts, courses, and live events.",
  ],
};

const NEWS_ITEMS = {
  pl: [
    { label: "Muzyka Instrumentalna", isLocal: true, actionId: "open_instrumental" },
    { label: "Opowiadania z morałem", isLocal: true, actionId: "open_zbyszek" },
    { label: "EMI - Wiadomości", isLocal: true, actionId: "open_emi" },
    {
      label: "Apokalipsa - Niedziela, 21.00",
      url: "https://youtube.com/playlist?list=PLDA6geI28g8QBRVh8GU5zsWEMTaJjrEQk&si=DScjGIJY7-XPx9x6",
    },
    {
      label: "Cuda Każdego Dnia 18.00 KURS",
      url: "https://www.youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW",
    },
    {
      label: "Biblia Audio CC - Podcast",
      url: "https://youtube.com/playlist?list=PLQBdxcl9HBc_WUnoZBauIg8qFsvOKjDhi&si=ett6INYvMK97V15b",
    },
  ],
  en: [
    { label: "Instrumental Music", isLocal: true, actionId: "open_instrumental" },
    { label: "Stories with a moral", isLocal: true, actionId: "open_zbyszek" },
    {
      label: "Apocalypse - Sunday, 9:00 PM",
      url: "https://youtube.com/playlist?list=PLDA6geI28g8QBRVh8GU5zsWEMTaJjrEQk&si=DScjGIJY7-XPx9x6",
    },
    {
      label: "Daily Miracles 6:00 PM COURSE",
      url: "https://www.youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW",
    },
    {
      label: "CC Audio Bible - Podcast",
      url: "https://youtube.com/playlist?list=PLQBdxcl9HBc_WUnoZBauIg8qFsvOKjDhi&si=ett6INYvMK97V15b",
    },
  ],
};

const TESTIMONY_ITEMS = {
  pl: [
    {
      label: "Oglądaj świadectwa",
      url: "https://youtube.com/playlist?list=PLQBdxcl9HBc9FvSiQ__2u5PLdNrfOdElh&si=_uzBibB9Wlb29h7P",
    },
    {
      label: "Daj świadectwo",
      url: "https://chat.whatsapp.com/Fkn86qPOPXoIeEPBUG89FF",
    },
  ],
  en: [
    {
      label: "Watch testimonies",
      url: "https://youtube.com/playlist?list=PLQBdxcl9HBc9FvSiQ__2u5PLdNrfOdElh&si=_uzBibB9Wlb29h7P",
    },
    {
      label: "Give testimony",
      url: "https://chat.whatsapp.com/Fkn86qPOPXoIeEPBUG89FF",
    },
  ],
};

const BUSINESS_ITEMS = {
  pl: [
    {
      label: "KONCEPT STUDIO",
      www: "https://koncept-studio.pl/",
      phone: "+48515141707",
    },
    { label: "PREMIER HEATFIX (LONDYN)", phone: "+447800800678" },
  ],
  en: [
    {
      label: "KONCEPT STUDIO",
      www: "https://koncept-studio.pl/",
      phone: "+48515141707",
    },
    { label: "PREMIER HEATFIX (LONDON)", phone: "+447800800678" },
  ],
};

const SUPPORT_LINKS = [
  {
    label: "Rozwój misyjny - zrzutka",
    url: "https://zrzutka.pl/rs4g4v",
    icon: "🌱",
  },
  { label: "Rozwój Aplikacji", url: "https://zrzutka.pl/3bbxzn", icon: "📱" },
  {
    label: "Szybkie Wsparcie - Revolut",
    url: "https://revolut.me/christianculture",
    icon: "💳",
  },
  {
    label: "Patronat Cykliczny",
    url: "https://patronite.pl/osobowoscplus",
    icon: "🤝",
  },
  { label: "PayPal", url: "https://www.paypal.me/CezaryRogowski", icon: "🅿️" },
];

const PRAYER_INTENTIONS_BY_LANG = {
  pl: [
    {
      id: 1,
      text: "Zdrowie siostry Zofii - o Boży dotyk i uleczenie z nadciśnienia krwi.",
    },
    {
      id: 2,
      text: "Błogosławieństwo dla misji Christian Culture i wszystkich odbiorców.",
    },
    { id: 3, text: "Wioletta - o nową, Bożą pracę zgodną z jej talentami." },
    {
      id: 4,
      text: "Cezary - o Boże błogosławieństwo i opiekę dla jego dzieci.",
    },
    {
      id: 5,
      text: "O Brata Pawła - o Boże prowadzenie w jego służbie i życiu prywatnym.",
    },
    { id: 6, text: "O pokój w sercach i na świecie przez moc Ewangelii." },
  ],
  en: [
    {
      id: 1,
      text: "Health for Sister Zofia - for God's touch and healing from high blood pressure.",
    },
    {
      id: 2,
      text: "Blessing for the Christian Culture mission and all recipients.",
    },
    {
      id: 3,
      text: "Violetta - for a new, godly job in line with her talents.",
    },
    {
      id: 4,
      text: "Cezary - for God's blessing and protection for his children.",
    },
    {
      id: 5,
      text: "For Brother Pawel - for God's guidance in his service and private life.",
    },
    {
      id: 6,
      text: "For peace in hearts and in the world through the power of the Gospel.",
    },
  ],
};

export const TopNewsTicker: React.FC<TopNewsTickerProps> = ({
  appLanguage,
  activeStream,
  installStatus,
  onInstallClick,
  onOpenSmsSubscriptionModal,
  onOpenSupport,
  onShareApp,
  onIntentionsVisibilityChange,
  onExpandedChange,
  userPersona,
  onToggleFavorite,
  dailyVerse,
  onOpenCcNews,
  onOpenEcosystemMap,
  onOpenReadingRoom,
  onOpenHelpingHand,
  onOpenStudioDobregoSlowa,
  onOpenCoaching,
  onOpenDashboard,
  addToast,
  onOpenMusicNews,
  onOpenOpenLetter,
  onOpenZbyszekGieron,
  onOpenEmi,
  onOpenInstrumentalMusic,
}) => {
  const dynamicDB = useAppStore((state) => state.dynamicDB);
  const isZenMode = useAppStore((state) => state.isZenMode);
  const [now, setNow] = useState(new Date());

  const handleShareText = useCallback(
    async (text: string) => {
      const title = "Christian Culture";
      const url = "https://cclite.pl";
      const fullText = `${text}\n\n${url}`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: text,
            url: url,
          });
        } else {
          await navigator.clipboard.writeText(fullText);
          if (addToast) {
            addToast(
              appLanguage === "pl"
                ? "Skopiowano do schowka!"
                : "Copied to clipboard!",
              "success",
            );
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed", err);
        }
      }
    },
    [appLanguage, addToast],
  );
  const [displayContent, setDisplayContent] = useState<
    "news" | "click" | "date" | "day" | "time" | "weather" | "verse"
  >("news");
  const [blinkColon, setBlinkColon] = useState(true);
  const [isHourlySpecial, setIsHourlySpecial] = useState(false);
  const [isMissionSpecial, setIsMissionSpecial] = useState(false);
  const [isSmsSpecial, setIsSmsSpecial] = useState(false);
  const [isNewsSpecial, setIsNewsSpecial] = useState(false);
  const [isTestimonySpecial, setIsTestimonySpecial] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualBar, setManualBar] = useState<
    | "intentions"
    | "motivation"
    | "sms"
    | "mission"
    | "news"
    | "testimony"
    | "recommended"
    | "businesses"
    | "support"
    | "open_letter"
    | null
  >(null);
  const [intentions, setIntentions] = useState<PrayerIntention[]>([]);
  const [hasLoadedIntentions, setHasLoadedIntentions] = useState(false);
  const [randomPhrase, setRandomPhrase] = useState("");
  const [randomMissionPhrase, setRandomMissionPhrase] = useState("");
  const [randomSmsPhrase, setRandomSmsPhrase] = useState("");
  const [randomNewsPhrase, setRandomNewsPhrase] = useState("");
  const [showHubBanner, setShowHubBanner] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 50.9297,
    lng: 21.3881,
  }); // Default to Ostrowiec Świętokrzyski
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current_weather=true`,
        );
        const data = await response.json();
        if (data && data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          let icon = "☀️";
          if (code === 0) icon = "☀️";
          else if (code >= 1 && code <= 3) icon = "🌤️";
          else if (code >= 45 && code <= 48) icon = "🌫️";
          else if (code >= 51 && code <= 67) icon = "🌧️";
          else if (code >= 71 && code <= 77) icon = "❄️";
          else if (code >= 80 && code <= 82) icon = "🌦️";
          else if (code >= 85 && code <= 86) icon = "❄️";
          else if (code >= 95) icon = "⛈️";

          setWeather({ temp, icon });
        }
      } catch (err) {
        // Suppress network errors for weather to avoid cluttering console
        console.warn(
          "[Weather] Fetch failed (likely offline or blocked):",
          (err as Error).message,
        );
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900000); // Update every 15 mins
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback already set to Ostrowiec
        },
      );
    }
  }, []);

  const [globalCounters, setGlobalCounters] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const unsubscribe = CommunityService.subscribeToIntentions((data) => {
      setIntentions(data);
      setHasLoadedIntentions(true);
    });

    const unsubscribeCounters = CommunityService.subscribeToGlobalCounters(
      (counters) => {
        setGlobalCounters(counters);
      },
    );

    return () => {
      unsubscribe();
      unsubscribeCounters();
    };
  }, []);

  const [localExtraAmens, setLocalExtraAmens] = useState<
    Record<string, number>
  >({});

  const getIntentionHash = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `int_${Math.abs(hash)}`;
  };

  const displayIntentions = useMemo(() => {
    const staticIntentions =
      (PRAYER_INTENTIONS_BY_LANG as any)[appLanguage] ||
      PRAYER_INTENTIONS_BY_LANG.en;

    // Base list from Firestore or Static
    let base =
      !hasLoadedIntentions || intentions.length === 0
        ? [...staticIntentions]
        : [...intentions];

    // Add dynamic intentions from Google Sheet (if any)
    const dbIntencje = dynamicDB["Intencje"];
    if (dbIntencje) {
      const parsedDbIntentions = dbIntencje
        .split("\n")
        .filter((line) => line.trim().length > 3)
        .map((line, idx) => ({
          id: `db-int-${idx}`,
          text: line.trim().replace(/^\d+\.?\s?/, ""), // Remove leading numbers like "1. "
          prayerCount: 0,
        }));
      base = [...parsedDbIntentions, ...base];
    }

    // Apply global counters and local extra amens
    return base.map((i: any) => {
      const hash = getIntentionHash(i.text || "");
      const globalCount = globalCounters[hash] || 0;

      return {
        ...i,
        _hashId: hash, // Store hash for clicking
        prayerCount:
          Math.max(i.prayerCount || 0, globalCount) +
          (localExtraAmens[hash] || 0),
      };
    });
  }, [
    intentions,
    hasLoadedIntentions,
    appLanguage,
    localExtraAmens,
    dynamicDB,
    globalCounters,
  ]);

  const handleAmenClick = async (intention: any) => {
    if (!intention || !intention._hashId) return;
    const hashId = intention._hashId;

    // 1. Optimistic local update
    setLocalExtraAmens((prev) => ({
      ...prev,
      [hashId]: (prev[hashId] || 0) + 1,
    }));

    // Impact feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    // 2. Try persistence for global counters
    try {
      await CommunityService.incrementGlobalCounter(hashId);
    } catch (error) {
      console.error("Failed to increment global counter:", error);
    }

    // 3. Fallback for original firestore intentions if it's a real firestore ID (non-numeric usually)
    const intentionId = intention.id;
    if (
      hasLoadedIntentions &&
      intentions.length > 0 &&
      isNaN(Number(intentionId)) &&
      !String(intentionId).startsWith("db-int-")
    ) {
      try {
        await CommunityService.incrementPrayerCount(String(intentionId));
      } catch (error) {
        // Silent block
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // LOGIKA CYKLICZNEGO BANERA CENTRUM - WYŁĄCZONA
  useEffect(() => {
    setShowHubBanner(false);
  }, []);

  useEffect(() => {
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 1. MOTYWACJA (0, 20, 40)
    if (
      (minutes === 0 || minutes === 20 || minutes === 40) &&
      seconds === 0 &&
      !isHourlySpecial
    ) {
      const hours = now.getHours();
      const isPrayerHour = hours === 9 || hours === 15 || hours === 21;
      if (!isPrayerHour) {
        setIsHourlySpecial(true);
        const phrases =
          (MOTIVATIONAL_PHRASES as any)[appLanguage] || MOTIVATIONAL_PHRASES.en;
        setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setTimeout(() => setIsHourlySpecial(false), 180000);
      }
    }

    // 2. SMS (5, 25, 45)
    if (
      (minutes === 5 || minutes === 25 || minutes === 45) &&
      seconds === 0 &&
      !isSmsSpecial
    ) {
      setIsSmsSpecial(true);
      const phrases = (SMS_PHRASES as any)[appLanguage] || SMS_PHRASES.en;
      setRandomSmsPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      setTimeout(() => setIsSmsSpecial(false), 180000);
    }

    // 3. MISJA (10, 30, 50)
    if (
      (minutes === 10 || minutes === 30 || minutes === 50) &&
      seconds === 0 &&
      !isMissionSpecial
    ) {
      setIsMissionSpecial(true);
      const phrases =
        (MISSION_PHRASES as any)[appLanguage] || MISSION_PHRASES.en;
      setRandomMissionPhrase(
        phrases[Math.floor(Math.random() * phrases.length)],
      );
      setTimeout(() => setIsMissionSpecial(false), 180000);
    }

    // 4. NOWOŚCI (15, 35, 55)
    if (
      (minutes === 15 || minutes === 35 || minutes === 55) &&
      seconds === 0 &&
      !isNewsSpecial
    ) {
      setIsNewsSpecial(true);
      const phrases = (NEWS_PHRASES as any)[appLanguage] || NEWS_PHRASES.en;
      setRandomNewsPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      setTimeout(() => setIsNewsSpecial(false), 180000);
    }

    // 5. ŚWIADECTWA (18, 38, 58)
    if (
      (minutes === 18 || minutes === 38 || minutes === 58) &&
      seconds === 0 &&
      !isTestimonySpecial
    ) {
      setIsTestimonySpecial(true);
      setTimeout(() => setIsTestimonySpecial(false), 180000);
    }

    // Inicjalizacja fraz jeśli puste
    if (!randomPhrase) {
      const phrases =
        (MOTIVATIONAL_PHRASES as any)[appLanguage] || MOTIVATIONAL_PHRASES.en;
      setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
    if (!randomMissionPhrase) {
      const phrases =
        (MISSION_PHRASES as any)[appLanguage] || MISSION_PHRASES.en;
      setRandomMissionPhrase(
        phrases[Math.floor(Math.random() * phrases.length)],
      );
    }
    if (!randomSmsPhrase) {
      const phrases = (SMS_PHRASES as any)[appLanguage] || SMS_PHRASES.en;
      setRandomSmsPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
    if (!randomNewsPhrase) {
      const phrases = (NEWS_PHRASES as any)[appLanguage] || NEWS_PHRASES.en;
      setRandomNewsPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  }, [
    now,
    isHourlySpecial,
    isMissionSpecial,
    isSmsSpecial,
    isNewsSpecial,
    appLanguage,
    randomPhrase,
    randomMissionPhrase,
    randomSmsPhrase,
    randomNewsPhrase,
  ]);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setDisplayContent((prev) => {
        if (prev === "news") return "click";
        if (prev === "click") return "date";
        if (prev === "date") return weather ? "weather" : "time";
        if (prev === "weather") return "time";
        if (prev === "time") return dailyVerse ? "verse" : "day";
        if (prev === "verse") return "day";
        return "news";
      });
    }, 4000);
    return () => clearInterval(toggleInterval);
  }, [weather, dailyVerse]);

  useEffect(() => {
    const blinkInterval = setInterval(
      () => setBlinkColon((prev) => !prev),
      500,
    );
    return () => clearInterval(blinkInterval);
  }, []);

  const isLiveWindow = useMemo(() => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours === 18 && minutes >= 0 && minutes <= 15;
  }, [now]);

  const isPrayerWindow = useMemo(() => {
    const hours = now.getHours();
    return hours === 9 || hours === 15 || hours === 21;
  }, [now]);

  const isMotivationFavorite = useMemo(() => {
    if (!randomPhrase || !userPersona.favorites) return false;
    return userPersona.favorites.some((f) => f.content === randomPhrase);
  }, [randomPhrase, userPersona.favorites]);

  const handleToggleMotivationFavorite = useCallback(() => {
    if (!randomPhrase || !onToggleFavorite) return;
    onToggleFavorite({
      id: `motivation-${randomPhrase.substring(0, 20)}`,
      type: "motivation",
      content: randomPhrase,
      timestamp: new Date().toISOString(),
    });
  }, [randomPhrase, onToggleFavorite]);

  const activeBarType = useMemo(() => {
    // 1. Manual selection has highest priority
    if (manualBar) return manualBar;

    // 2. Scheduled specials
    // Priority: Short specials (3 mins each) > Long specials (Prayer window)
    if (isHourlySpecial) return "motivation";
    if (isSmsSpecial) return "sms";
    if (isMissionSpecial) return "mission";
    if (isNewsSpecial) return "news";
    if (isTestimonySpecial) return "testimony";
    if (isPrayerWindow) return "intentions";

    return "music";
  }, [
    manualBar,
    isPrayerWindow,
    isHourlySpecial,
    isSmsSpecial,
    isMissionSpecial,
    isNewsSpecial,
    isTestimonySpecial,
  ]);

  const isSecondBarActive = !!activeBarType || showHubBanner;

  useEffect(() => {
    onIntentionsVisibilityChange?.(isSecondBarActive);
  }, [isSecondBarActive, onIntentionsVisibilityChange]);

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const dateStr = now.toLocaleDateString(
    appLanguage === "pl" ? "pl-PL" : "en-US",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );

  const biblicalDayStr = useMemo(() => {
    try {
      const times = SunCalc.getTimes(now, location.lat, location.lng);
      const sunset = times.sunset;

      let targetDate = now;
      if (now >= sunset) {
        targetDate = new Date(now);
        targetDate.setDate(now.getDate() + 1);
      }

      const dayName = targetDate.toLocaleDateString(
        appLanguage === "pl" ? "pl-PL" : "en-US",
        { weekday: "long" },
      );
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    } catch (e) {
      const dayName = now.toLocaleDateString(
        appLanguage === "pl" ? "pl-PL" : "en-US",
        { weekday: "long" },
      );
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    }
  }, [now, location, appLanguage]);

  const timeStr = now.toLocaleTimeString(
    appLanguage === "pl" ? "pl-PL" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );
  const [hourTime, minuteTime] = timeStr.split(":");

  const handleHubClick = useCallback(async () => {
    await Browser.open({ url: CENTRUM_CC_URL });
  }, []);

  const handleCcNewsClick = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const baseItems: TickerContentItem[] = useMemo(() => {
    const items: TickerContentItem[] = [];

    items.push({
      type: "button",
      id: "toggle-open-letter",
      label:
        manualBar === "open_letter"
          ? appLanguage === "pl"
            ? "ZAMKNIJ ✉️"
            : "CLOSE ✉️"
          : appLanguage === "pl"
            ? "LIST OTWARTY ✉️"
            : "OPEN LETTER ✉️",
      action: () =>
        setManualBar(manualBar === "open_letter" ? null : "open_letter"),
      bgColor: manualBar === "open_letter" ? "bg-zinc-800" : "bg-[#DFB467]",
      textColor: manualBar === "open_letter" ? "text-white" : "text-black",
      borderColor: "border-[#8b7346]/30",
      shadowColor: "shadow-[#8b7346]/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-intentions",
      label:
        manualBar === "intentions"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🙏"
            : "CLOSE 🙏"
          : appLanguage === "pl"
            ? "INTENCJE 🙏"
            : "INTENTIONS 🙏",
      action: () =>
        setManualBar(manualBar === "intentions" ? null : "intentions"),
      bgColor: manualBar === "intentions" ? "bg-zinc-800" : "bg-orange-500",
      textColor: "text-white",
      borderColor: "border-white/20",
      shadowColor: "shadow-orange-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-support",
      label:
        manualBar === "support"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🤝"
            : "CLOSE 🤝"
          : appLanguage === "pl"
            ? "WESPRZYJ 🙏"
            : "SUPPORT 🙏",
      action: () => setManualBar(manualBar === "support" ? null : "support"),
      bgColor: manualBar === "support" ? "bg-zinc-800" : "bg-black",
      textColor: "text-gold",
      borderColor: "border-gold/30",
      shadowColor: "shadow-black/50",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-motivation",
      label:
        manualBar === "motivation"
          ? appLanguage === "pl"
            ? "ZAMKNIJ ✨"
            : "CLOSE ✨"
          : appLanguage === "pl"
            ? "MOTYWACJA ✨"
            : "MOTIVATION ✨",
      action: () =>
        setManualBar(manualBar === "motivation" ? null : "motivation"),
      bgColor: manualBar === "motivation" ? "bg-zinc-800" : "bg-[#DFB467]",
      textColor: manualBar === "motivation" ? "text-white" : "text-black",
      borderColor: "border-white/20",
      shadowColor: "shadow-green-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-sms",
      label:
        manualBar === "sms"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 📱"
            : "CLOSE 📱"
          : appLanguage === "pl"
            ? "SMS 📱"
            : "SMS 📱",
      action: () => setManualBar(manualBar === "sms" ? null : "sms"),
      bgColor: manualBar === "sms" ? "bg-zinc-800" : "bg-blue-600",
      textColor: "text-white",
      borderColor: "border-white/20",
      shadowColor: "shadow-blue-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-recommended",
      label:
        manualBar === "recommended"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🚀"
            : "CLOSE 🚀"
          : appLanguage === "pl"
            ? "POLECAMY 🚀"
            : "RECOMMENDED 🚀",
      action: () =>
        setManualBar(manualBar === "recommended" ? null : "recommended"),
      bgColor: manualBar === "recommended" ? "bg-zinc-800" : "bg-indigo-600",
      textColor: "text-white",
      borderColor: "border-white/20",
      shadowColor: "shadow-indigo-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-mission",
      label:
        manualBar === "mission"
          ? appLanguage === "pl"
            ? "ZAMKNIJ ❤️"
            : "CLOSE ❤️"
          : appLanguage === "pl"
            ? "MISJA ❤️"
            : "MISSION ❤️",
      action: () => setManualBar(manualBar === "mission" ? null : "mission"),
      bgColor: manualBar === "mission" ? "bg-zinc-800" : "bg-[#DFB467]",
      textColor: manualBar === "mission" ? "text-white" : "text-black",
      borderColor: "border-white/20",
      shadowColor: "shadow-red-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-news",
      label:
        manualBar === "news"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🆕"
            : "CLOSE 🆕"
          : appLanguage === "pl"
            ? "NOWOŚCI 🆕"
            : "NEWS 🆕",
      action: () => setManualBar(manualBar === "news" ? null : "news"),
      bgColor: manualBar === "news" ? "bg-zinc-800" : "bg-[#DFB467]",
      textColor: manualBar === "news" ? "text-white" : "text-black",
      borderColor: "border-white/20",
      shadowColor: "shadow-purple-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-testimony",
      label:
        manualBar === "testimony"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🕊️"
            : "CLOSE 🕊️"
          : appLanguage === "pl"
            ? "ŚWIADECTWA 🕊️"
            : "TESTIMONIES 🕊️",
      action: () =>
        setManualBar(manualBar === "testimony" ? null : "testimony"),
      bgColor: manualBar === "testimony" ? "bg-zinc-800" : "bg-[#DFB467]",
      textColor: manualBar === "testimony" ? "text-white" : "text-black",
      borderColor: "border-white/20",
      shadowColor: "shadow-amber-500/30",
      separatorAfter: true,
    });

    items.push({
      type: "button",
      id: "toggle-businesses",
      label:
        manualBar === "businesses"
          ? appLanguage === "pl"
            ? "ZAMKNIJ 🏢"
            : "CLOSE 🏢"
          : appLanguage === "pl"
            ? "FIRMY CC 🏢"
            : "CC BUSINESSES 🏢",
      action: () =>
        setManualBar(manualBar === "businesses" ? null : "businesses"),
      bgColor: manualBar === "businesses" ? "bg-zinc-800" : "bg-emerald-600",
      textColor: "text-white",
      borderColor: "border-white/20",
      shadowColor: "shadow-emerald-500/30",
      separatorAfter: true,
    });

    if (isLiveWindow) {
      items.push({
        type: "button",
        id: "live-now-special",
        label:
          appLanguage === "pl"
            ? "🔴 LIVE - Cuda Każdego Dnia"
            : "🔴 LIVE - Daily Miracles",
        action: async () =>
          await Browser.open({ url: YOUTUBE_DAILY_MIRACLES_PLAYLIST_URL }),
        bgColor: "bg-[#F5F5DC]",
        textColor: "text-blue-700",
        borderColor: "border-blue-400/50",
        shadowColor: "shadow-blue-500/20",
        separatorAfter: true,
      });
    }

    if (installStatus !== "installed" && !isLiveWindow && !isPrayerWindow) {
      items.push({
        type: "button",
        id: "install-pwa-ticker",
        label:
          appLanguage === "pl"
            ? installStatus === "update"
              ? "AKTUALIZUJ 📱"
              : "INSTALUJ CC 📱"
            : installStatus === "update"
              ? "UPDATE 📱"
              : "INSTALL CC 📱",
        action: onInstallClick,
        bgColor: installStatus === "update" ? "bg-[#DFB467]" : "bg-gold-dark",
        textColor: installStatus === "update" ? "text-black" : "text-white",
        borderColor: "border-white/20",
        shadowColor: "shadow-yellow-500/20",
        separatorAfter: true,
      });
    }

    items.push({
      type: "button",
      id: "patronite-ticker",
      label: appLanguage === "pl" ? "WSPARCIE ❤️" : "SUPPORT ❤️",
      action: onOpenSupport,
      bgColor: "bg-zinc-800",
      textColor: "text-[#C5A059]",
      borderColor: "border-[#C5A059]/30",
      shadowColor: "shadow-zinc-500/20",
      separatorAfter: true,
    });

    const standardContent =
      appLanguage === "pl"
        ? [
            {
              type: "text",
              content: dynamicDB["Kontakt www"]
                ? ` HalleluYah! #DobrzeŻejesteś... ${dynamicDB["Kontakt www"]} | Infolinia Nadzieja: `
                : " HalleluYah! #DobrzeŻejesteś... polskieradio.cc | cclite.pl | Infolinia Nadzieja: ",
            },
            {
              type: "button",
              id: "hotline",
              label:
                dynamicDB["Subskrypcja"]?.match(/\d{3}\s\d{3}\s\d{3}/)?.[0] ||
                HOTLINE_NADZIEJA_NUMBER,
              action: () => {
                const num = (
                  dynamicDB["Subskrypcja"]?.match(/\d{3}\s\d{3}\s\d{3}/)?.[0] ||
                  HOTLINE_NADZIEJA_NUMBER
                ).replace(/\s/g, "");
                window.location.href = `tel:${num}`;
              },
              bgColor: "bg-blue-700",
              textColor: "text-white",
              borderColor: "border-blue-500/30",
              shadowColor: "shadow-blue-500/20",
              separatorAfter: true,
            },
          ]
        : [
            {
              type: "text",
              content: dynamicDB["Kontakt www"]
                ? ` HalleluYah! #GoodToHaveYouHere... Visit ${dynamicDB["Kontakt www"]} | Hope Hotline: `
                : " HalleluYah! #GoodToHaveYouHere... Visit polskieradio.cc or cclite.pl | Hope Hotline: ",
            },
            {
              type: "button",
              id: "hotline",
              label:
                dynamicDB["Subskrypcja"]?.match(/\d{3}\s\d{3}\s\d{3}/)?.[0] ||
                HOTLINE_NADZIEJA_NUMBER,
              action: () => {
                const num = (
                  dynamicDB["Subskrypcja"]?.match(/\d{3}\s\d{3}\s\d{3}/)?.[0] ||
                  HOTLINE_NADZIEJA_NUMBER
                ).replace(/\s/g, "");
                window.location.href = `tel:${num}`;
              },
              bgColor: "bg-blue-700",
              textColor: "text-white",
              borderColor: "border-blue-500/30",
              shadowColor: "shadow-blue-500/20",
              separatorAfter: true,
            },
          ];

    return [...items, ...(standardContent as TickerContentItem[])];
  }, [
    appLanguage,
    installStatus,
    isLiveWindow,
    onInstallClick,
    isPrayerWindow,
    manualBar,
  ]);

  const loopedTickerItems = useMemo(
    () => Array(4).fill(baseItems).flat(),
    [baseItems],
  );

  return (
    <div
      id="top-news-ticker"
      className={`fixed top-0 left-0 pt-safe z-[50] flex flex-col transition-all duration-700 ${isExpanded ? "w-full" : "w-auto pointer-events-none"} ${isZenMode ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}`}
    >
      <div className={`flex flex-col ${isExpanded ? "w-full" : "w-auto"}`}>
        <div
          className={`h-[24px] flex items-center overflow-hidden select-none transition-colors duration-1000 ${isExpanded ? "w-full bg-[#DFB467] border-b border-black" : "w-auto"}`}
        >
          <div
            className={`flex-shrink-0 h-full flex items-center z-20 transition-all duration-700 cursor-pointer hover:brightness-110 w-[120px] pointer-events-auto ${isExpanded ? "bg-[#DFB467]" : "bg-transparent"}`}
            onClick={handleCcNewsClick}
          >
            <div
              className={`relative font-sans text-[10px] sm:text-[11px] tracking-[0.5px] font-normal uppercase whitespace-nowrap text-center w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 ${isExpanded ? "text-black" : "text-[#C5A059]"}`}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "news" ? "opacity-100" : "opacity-0"}`}
              >
                <span className="flex items-center justify-center w-full">
                  {isPrayerWindow
                    ? appLanguage === "pl" && activeStream !== "GLOBAL"
                      ? "MODLITWA"
                      : "PRAYER"
                    : isLiveWindow
                      ? "LIVE"
                      : "CC NEWS"}
                </span>
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "click" ? "opacity-100" : "opacity-0"}`}
              >
                <span className="flex items-center justify-center w-full">
                  {appLanguage === "pl" ? "KLIKNIJ" : "CLICK"}
                </span>
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "date" ? "opacity-100" : "opacity-0"}`}
              >
                {dateStr}
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "day" ? "opacity-100" : "opacity-0"}`}
              >
                {biblicalDayStr}
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "weather" ? "opacity-100" : "opacity-0"}`}
              >
                {weather && (
                  <span className="flex items-center gap-1 font-normal font-sans">
                    <span>{weather.icon}</span>
                    <span>{weather.temp}°C</span>
                  </span>
                )}
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${displayContent === "time" ? "opacity-100" : "opacity-0"}`}
              >
                {hourTime}
                {blinkColon ? ":" : " "}
                {minuteTime}
              </span>
              <span
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${displayContent === "verse" ? "opacity-100" : "opacity-0"} px-1`}
              >
                {dailyVerse && (
                  <>
                    <span className="text-[11px] font-normal font-sans truncate w-full text-center leading-none">
                      {dailyVerse.reference}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          {isExpanded && (
            <div className="relative flex-1 h-full overflow-hidden flex items-center group cursor-default pointer-events-auto pr-[120px] sm:pr-[180px]">
              <style>{`
                  @keyframes majesticTickerPass { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                  .animate-ticker-majestic { animation: majesticTickerPass 150s linear infinite; }
                  .animate-ticker-majestic:hover { animation-play-state: paused; }
                `}</style>
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {loopedTickerItems.map((item, index) => (
                  <React.Fragment key={`${item.type}-${index}`}>
                    {item.type === "text" ? (
                      <span
                        className={`font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal uppercase inline-block mx-2 text-black`}
                      >
                        {fixOrphans(item.content)}
                      </span>
                    ) : item.type === "button" ? (
                      <button
                        onClick={item.action}
                        className={`font-sans text-[10px] sm:text-[11px] tracking-[0.5px] font-normal uppercase px-2 py-1 rounded-none transition-all duration-300 flex items-center gap-1 justify-center 
                        ${item.bgColor} ${item.textColor} border border-black/20 hover:scale-105 active:scale-95 mx-1`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <div className="inline-block">{item.component}</div>
                    )}
                    {item.separatorAfter && (
                      <span
                        className={`text-[11px] font-normal font-sans uppercase tracking-[0.5px] mx-3 text-black/20`}
                      >
                        |
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PASEK MUZYCZNY (Tylko lewy prostokąt, jako wolnostojący element) */}
        <div
          className={`w-full overflow-hidden transition-all duration-700 ease-in-out pointer-events-none ${isExpanded && activeBarType === "music" ? "h-[24px] opacity-100" : "h-0 opacity-0"} absolute top-full left-0 z-50`}
        >
          <div className="flex w-full h-full">
            <div
              className="pointer-events-auto flex-shrink-0 bg-[#0A0A0A] h-full flex items-center justify-center border-b border-r border-[#C5A059] w-[110px] sm:w-[180px] cursor-pointer hover:brightness-110 active:brightness-95 transition-all overflow-hidden relative"
              onClick={onOpenMusicNews}
            >
              <span className="relative z-10 text-[6px] sm:text-[9px] font-normal font-sans text-[#C5A059] uppercase tracking-[0.2em] text-center px-1 leading-tight flex flex-col">
                <span>NOWOŚCI</span>
                <span>MUZYCZNE 2026</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
            {/* Pusta i przezroczysta przestrzeń. Kliknięcia przechodzą. */}
            <div className="flex-1 bg-transparent"></div>
          </div>
        </div>

        {/* PASEK MODLITWY (Priorytet) */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "intentions" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-[#C5A059] h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "MODLIMY SIĘ O:" : "PRAYING FOR:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {displayIntentions.map((intent: any, idx: number) => (
                  <React.Fragment key={intent.id || idx}>
                    <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                      🙏 {intent.text}
                    </span>
                    <div className="inline-flex items-center gap-2 mr-4">
                      <button
                        onClick={() => handleAmenClick(intent)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[11px] sm:text-[13px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                      >
                        Amen ({intent.prayerCount || 0})
                      </button>
                      <button
                        onClick={async () =>
                          await Browser.open({ url: WHATSAPP_PRAYER_GROUP_URL })
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] sm:text-[13px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                      >
                        {appLanguage === "pl"
                          ? "Wyślij intencję"
                          : "Send intention"}
                      </button>
                      <button
                        aria-label={
                          appLanguage === "pl"
                            ? "Udostępnij intencję"
                            : "Share intention"
                        }
                        onClick={() => handleShareText(intent.text)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black transition-all active:scale-90"
                      >
                        <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PASEK FIRMY CC */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "businesses" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl"
                  ? "CHRZEŚCIJAŃSKIE FIRMY:"
                  : "CHRISTIAN BUSINESSES:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center group cursor-default scrollbar-hide">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center hover:[animation-play-state:paused]">
                {[
                  ...BUSINESS_ITEMS[appLanguage === "pl" ? "pl" : "en"],
                  ...BUSINESS_ITEMS[appLanguage === "pl" ? "pl" : "en"],
                ].map((biz, idx) => (
                  <div
                    key={`${idx}-${biz.label}`}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-black/30 rounded-full border border-white/10 mx-2"
                  >
                    <span className="font-sans text-[9px] sm:text-[11px] tracking-[0.5px] font-normal text-black uppercase">
                      {biz.label}
                    </span>
                    {biz.www && (
                      <button
                        onClick={async () =>
                          await Browser.open({ url: biz.www })
                        }
                        className="text-[7px] sm:text-[9px] bg-white text-emerald-700 px-2 py-0.5 rounded-full font-normal font-sans"
                      >
                        WWW
                      </button>
                    )}
                    {biz.phone && (
                      <button
                        onClick={() =>
                          (window.location.href = `tel:${biz.phone}`)
                        }
                        className="text-[7px] sm:text-[9px] bg-white text-emerald-700 px-2 py-0.5 rounded-full font-normal font-sans"
                      >
                        📞 {biz.phone}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                aria-label={appLanguage === "pl" ? "Zamknij" : "Close"}
                onClick={() => setManualBar(null)}
                className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-[#DFB467] via-[#DFB467] to-transparent text-black/50 hover:text-black transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PASEK POLECAMY */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "recommended" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl"
                  ? "POLECAMY DLA CIEBIE:"
                  : "RECOMMENDED FOR YOU:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center group cursor-default scrollbar-hide">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center hover:[animation-play-state:paused]">
                {Array(2)
                  .fill([
                    {
                      action: onOpenZbyszekGieron,
                      labelKey: "zbyszek",
                      icon: "📝",
                      pl: "Opowiadania z morałem",
                      en: "Stories with a moral",
                    },
                    {
                      action: onOpenReadingRoom,
                      labelKey: "reader",
                      icon: "📚",
                      pl: "Czytelnia CC",
                      en: "Reading Room",
                    },
                    {
                      action: onOpenHelpingHand,
                      labelKey: "help",
                      icon: "🏛️",
                      pl: "Pomocna Dłoń",
                      en: "Helping Hand",
                    },
                    {
                      action: onOpenStudioDobregoSlowa,
                      labelKey: "studio",
                      icon: "🎙️",
                      pl: "Studio Dobrego Słowa",
                      en: "Good Word Studio",
                    },
                    {
                      action: onOpenCoaching,
                      labelKey: "coaching",
                      icon: "🧭",
                      pl: "Holistyczny Coaching",
                      en: "Holistic Coaching",
                    },
                  ])
                  .flat()
                  .map((btn, idx) => (
                    <button
                      key={`${idx}-${btn.labelKey}`}
                      onClick={btn.action}
                      className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[11px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 border border-black/10 mx-2"
                    >
                      {btn.icon} {appLanguage === "pl" ? btn.pl : btn.en}
                    </button>
                  ))}
              </div>
              <button
                aria-label={appLanguage === "pl" ? "Zamknij" : "Close"}
                onClick={() => setManualBar(null)}
                className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-[#DFB467] via-[#DFB467] to-transparent text-black/50 hover:text-black transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PASEK MOTYWACJI (Hourly Special) */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "motivation" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "MOTYWACJA DNIA:" : "DAILY MOTIVATION:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        ✨ {randomPhrase}
                      </span>
                      <div className="inline-flex items-center gap-2 mr-10">
                        <button
                          aria-label="Ulubione"
                          onClick={handleToggleMotivationFavorite}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 ${isMotivationFavorite ? "bg-red-500 text-white" : "bg-black/10 hover:bg-black/20 text-black"}`}
                        >
                          <svg
                            className={`w-2.5 h-2.5 sm:w-3 h-3 ${isMotivationFavorite ? "fill-current" : ""}`}
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
                          {appLanguage === "pl" ? "Ulubione" : "Favorite"}
                        </button>
                        <button
                          aria-label="Udostępnij"
                          onClick={() => handleShareText(randomPhrase)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                        >
                          <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                          {appLanguage === "pl" ? "Udostępnij" : "Share"}
                        </button>
                        <button
                          aria-label="Zamknij"
                          onClick={() => {
                            setManualBar(null);
                            setIsHourlySpecial(false);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 h-3" />
                          {appLanguage === "pl" ? "Zamknij" : "Close"}
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* PASEK MISJA */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "mission" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "MISJA CC:" : "CC MISSION:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        ❤️ {randomMissionPhrase}
                      </span>
                      <button
                        onClick={async () =>
                          await Browser.open({
                            url: "https://patronite.pl/osobowoscplus",
                          })
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-4"
                      >
                        {appLanguage === "pl"
                          ? "Zostań oficjalnym patronem misji"
                          : "Become an official mission patron"}
                      </button>
                      <button
                        aria-label="Udostępnij"
                        onClick={() => handleShareText(randomMissionPhrase)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-4"
                      >
                        <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                        {appLanguage === "pl" ? "Udostępnij" : "Share"}
                      </button>
                      <button
                        aria-label="Zamknij"
                        onClick={() => {
                          setManualBar(null);
                          setIsMissionSpecial(false);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-10"
                      >
                        <X className="w-2.5 h-2.5 sm:w-3 h-3" />
                        {appLanguage === "pl" ? "Zamknij" : "Close"}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* PASEK NOWOŚCI */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "news" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "NOWOŚCI CC:" : "CC NEWS:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        📰 {randomNewsPhrase}
                      </span>
                      <div className="inline-flex items-center gap-2 mr-6">
                        <span className="text-[8px] sm:text-[10px] font-normal font-sans uppercase text-black/90 bg-black/10 px-2 py-0.5 rounded-md border border-black/10">
                          {appLanguage === "pl"
                            ? "POZNAJ EKOSYSTEM CC"
                            : "EXPLORE CC ECOSYSTEM"}
                        </span>
                        <button
                          onClick={onOpenEcosystemMap}
                          className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-white text-purple-700 hover:bg-zinc-100 text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 shadow-lg shadow-black/20"
                        >
                          {appLanguage === "pl" ? "Otwórz" : "Open"}
                        </button>
                      </div>
                      {dynamicDB["Nowości CC"] && (
                        <button
                          onClick={onOpenCcNews}
                          className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black hover:bg-zinc-800 text-white text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-4 border border-black/20"
                        >
                          🔥{" "}
                          {dynamicDB["Nowości CC"]
                            .split("\n")[0]
                            .substring(0, 40)}
                          ...
                        </button>
                      )}
                      {((NEWS_ITEMS as any)[appLanguage] || NEWS_ITEMS.en).map(
                        (news: any, nIdx: number) => (
                          <div
                            key={nIdx}
                            className="inline-flex items-center gap-2 mr-4"
                          >
                            <button
                              onClick={async () => {
                                if (news.isLocal) {
                                  if (
                                    news.actionId === "open_zbyszek" &&
                                    onOpenZbyszekGieron
                                  ) {
                                    onOpenZbyszekGieron();
                                  } else if (
                                    news.actionId === "open_emi" &&
                                    onOpenEmi
                                  ) {
                                    onOpenEmi();
                                  } else if (
                                    news.actionId === "open_instrumental" &&
                                    onOpenInstrumentalMusic
                                  ) {
                                    onOpenInstrumentalMusic();
                                  }
                                } else {
                                  await Browser.open({ url: news.url });
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                            >
                              {news.label}
                            </button>
                            {!news.isLocal && (
                              <button
                                aria-label="Udostępnij"
                                onClick={() =>
                                  handleShareText(news.label + " - " + news.url)
                                }
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black transition-all active:scale-90"
                              >
                                <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ),
                      )}
                      <button
                        aria-label="Zamknij"
                        onClick={() => {
                          setManualBar(null);
                          setIsNewsSpecial(false);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-10"
                      >
                        <X className="w-2.5 h-2.5 sm:w-3 h-3" />
                        {appLanguage === "pl" ? "Zamknij" : "Close"}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* PASEK LIST OTWARTY */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black/10 overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "open_letter" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black/10 w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "LIST OTWARTY:" : "OPEN LETTER:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center hover:[animation-play-state:paused]">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        ✉️ "Zaproszenie do Współtworzenia Globalnego Ekosystemu
                        Kultury Chrześcijańskiej..."
                      </span>
                      <button
                        onClick={() => {
                          if (onOpenOpenLetter) onOpenOpenLetter();
                          setManualBar(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-white text-[#8b7346] hover:bg-zinc-100 text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 shadow-lg shadow-black/20 mr-10"
                      >
                        {appLanguage === "pl" ? "Czytaj całość" : "Read more"}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              <button
                aria-label={appLanguage === "pl" ? "Zamknij" : "Close"}
                onClick={() => setManualBar(null)}
                className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-[#DFB467] via-[#DFB467] to-transparent text-black/50 hover:text-black transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                <X className="w-2.5 h-2.5 sm:w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* PASEK ŚWIADECTWA */}
        <div
          className={`w-full bg-[#DFB467] border-b border-black/10 overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "testimony" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-white/20 h-full flex items-center justify-center border-r border-black/10 w-[110px] sm:w-[180px]">
              <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.5px] font-normal text-black uppercase text-center px-1 leading-tight">
                {appLanguage === "pl" ? "ŚWIADECTWA CC:" : "CC TESTIMONIES:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        🕊️{" "}
                        {appLanguage === "pl"
                          ? "Poznaj historie, które zmieniają życie na zawsze."
                          : "Discover stories that change lives forever."}
                      </span>
                      {(
                        (TESTIMONY_ITEMS as any)[appLanguage] ||
                        TESTIMONY_ITEMS.en
                      ).map((item: any, tIdx: number) => (
                        <div
                          key={tIdx}
                          className="inline-flex items-center gap-2 mr-4"
                        >
                          <button
                            onClick={async () =>
                              await Browser.open({ url: item.url })
                            }
                            className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90"
                          >
                            {item.label}
                          </button>
                          <button
                            aria-label={
                              appLanguage === "pl"
                                ? "Udostępnij świadectwo"
                                : "Share testimony"
                            }
                            onClick={() =>
                              handleShareText(item.label + " - " + item.url)
                            }
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black transition-all active:scale-90"
                          >
                            <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        aria-label="Zamknij"
                        onClick={() => {
                          setManualBar(null);
                          setIsTestimonySpecial(false);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/10 hover:bg-black/20 text-black text-[8px] sm:text-[10px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mr-10"
                      >
                        <X className="w-2.5 h-2.5 sm:w-3 h-3" />
                        {appLanguage === "pl" ? "Zamknij" : "Close"}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* PASEK WSPARCIA "POMAGANIE WZMACNIA" */}
        <div
          className={`w-full bg-black border-b border-gold/20 overflow-hidden transition-all duration-700 ease-in-out ${isExpanded && activeBarType === "support" ? "h-[24px] opacity-100" : "h-0 opacity-0 border-none"}`}
        >
          <div className="flex h-full items-center">
            <div className="flex-shrink-0 bg-gold/10 h-full flex items-center justify-center border-r border-gold/20 w-[110px] sm:w-[180px]">
              <span className="text-[7px] sm:text-[10px] font-normal font-sans text-gold uppercase tracking-[0.5px] text-center px-1 leading-tight">
                {appLanguage === "pl"
                  ? "POMAGANIE WZMACNIA:"
                  : "HELPING STRENGTHENS:"}
              </span>
            </div>
            <div className="relative flex-1 h-full overflow-hidden flex items-center group cursor-default scrollbar-hide">
              <div className="animate-ticker-majestic whitespace-nowrap flex items-center hover:[animation-play-state:paused]">
                {Array(4)
                  .fill(0)
                  .map((_, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      <span className="font-sans text-[10px] sm:text-[12px] tracking-[0.5px] font-normal text-black uppercase mx-4 sm:mx-10 whitespace-nowrap">
                        ✨ "Pomaganie Wzmacnia" - wspieraj misję Christian
                        Culture.
                      </span>
                      {SUPPORT_LINKS.map((link, lIdx) => (
                        <button
                          key={`${groupIdx}-${lIdx}`}
                          onClick={async () =>
                            await Browser.open({ url: link.url })
                          }
                          className="inline-flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gold/10 hover:bg-gold/20 text-gold text-[8px] sm:text-[11px] font-normal font-sans uppercase tracking-[0.5px] transition-all active:scale-90 mx-2 border border-gold/20"
                        >
                          {link.icon} {link.label}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
              </div>
              <button
                aria-label={appLanguage === "pl" ? "Zamknij" : "Close"}
                onClick={() => setManualBar(null)}
                className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-black via-black to-transparent text-[#C5A059]/50 hover:text-[#C5A059] transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* BANER CENTRUM (Wyłączony) */}
    </div>
  );
};
