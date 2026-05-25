import * as React from "react";

export const APP_VERSION = "26.5.22.3";

// --- Enums & Types ---

export type UserGender = "male" | "female" | "unspecified";
export type UserAgeGroup =
  | "child"
  | "teenager"
  | "young_adult"
  | "adult"
  | "senior"
  | "unspecified";
export type MaritalStatus =
  | "single"
  | "married"
  | "widowed"
  | "divorced"
  | "unspecified";
export type SpiritualStatus =
  | "believer"
  | "seeker"
  | "theologian"
  | "atheist"
  | "unspecified";
export type AppMode = "standard" | "blind";
export type VisualMode = "standard" | "sabbath" | "night";
export type LoginProvider = "guest" | "google";
export type ManagementTab =
  | "profile"
  | "notifications"
  | "alarm"
  | "preferences"
  | "cloud"
  | "contact"
  | "legal"
  | "system"
  | "about"
  | "emergency"
  | "favorites"
  | "admin";
export type AISuggestionType = "sanctification" | "evangelism";
export type ThemeMode = "dark" | "light";
export type RadioStreamType = "PL" | "GLOBAL" | "BIBLIA";
export type SpatialMode =
  | "none"
  | "room"
  | "studio"
  | "cathedral"
  | "chapel"
  | "concert";
export type SupportedLanguage =
  | "pl"
  | "en"
  | "de"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "uk";
export type SearchMode = "GOOGLE" | "BIBLE" | "ECOSYSTEM" | "MIRIAM";

export type WidgetType =
  | "link"
  | "social"
  | "multimedia"
  | "spiritual"
  | "communication"
  | "embed"
  | "post";

export interface WidgetMetadata {
  url?: string;
  icon?: string;
  color?: string;
  subType?: string; // e.g. 'spotify', 'youtube', 'soundcloud'
  title?: string;
  description?: string;
  videoId?: string;
  embedUrl?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  content: string;
  positionIndex: number;
  metadata?: WidgetMetadata;
  layout?: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
}

export interface EqualizerSettings {
  low: number; // 60Hz
  midLow: number; // 250Hz
  mid: number; // 1kHz
  midHigh: number; // 4kHz
  high: number; // 12kHz
}

// --- Interfaces ---

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "info" | "success" | "alert" | "event" | "news";
  icon: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export interface FavoriteItem {
  id: string;
  type: "verse" | "motivation" | "mission" | "sms" | "testimony";
  content: string;
  reference?: string;
  timestamp: string;
}

export interface SocialLinks {
  spotify?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  messenger?: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  backgroundImage?: string;
  titleColor?: string;
  contentColor?: string;
  accentColor?: string;
  backgroundAlpha?: number;
  borderRadius?: number;
  letterSpacing?: string;
  fontSize?: number;
  showLogo?: boolean;
  blurAmount?: number;
  borderWidth?: number;
  shadowIntensity?: number;
  fontFamily?: "Inter" | "Lora" | "Space Grotesk" | "JetBrains Mono";
  gradientType?: "none" | "linear" | "radial";
  isPremium?: boolean;
  isPinned?: boolean;
  gridPos?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface UserPersona {
  uid?: string;
  role?: string;
  name: string;
  surname?: string;
  displayName?: string;
  gender: UserGender;
  profilePicture?: string;
  avatarUrls?: string[];
  profileBackground?: string;
  personalStatus?: string;
  userPersonalStatus?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  embedCodes?: string[];
  ageGroup: UserAgeGroup;
  maritalStatus: MaritalStatus;
  spiritualStatus: SpiritualStatus;
  appMode: AppMode;
  theme?: ThemeMode;
  location?: string;
  geolocationConsent: boolean;
  preferredLaunchMode: "standard" | "radio";
  smartStart: boolean;
  autostartRadio: boolean;
  aiGreetingsEnabled: boolean;
  introPlayed?: boolean;
  screensaverEnabled?: boolean;
  dailyVerseConfig?: {
    fontSize: number;
    fontFamily: string;
  };
  keepScreenOnWhileRadioPlaying: boolean;
  isGoogleCalendarConnected?: boolean;
  isGooglePhotosConnected?: boolean;
  isGoogleTasksConnected?: boolean;
  isGoogleKeepConnected?: boolean | null;
  googleCalendarId?: string | null;
  googleEmail?: string | null;
  googleClientId?: string | null;
  assignedMentor?: "Miriam" | "Jeszua"; // Intelligent Onboarding
  isFirstRun?: boolean;
  discipleStartDate?: string;
  lessonFrequency?: "daily" | "weekly" | "biweekly";
  joshuaSystem?: {
    enabled: boolean;
    disciplineMode: "5.10.15";
    lastPositiveBat?: string;
    driveSyncEnabled: boolean;
  };
  emergencyContacts?: {
    name: string;
    phone: string;
    isSOSActive: boolean;
  }[];
  favorites?: FavoriteItem[];
  widgets?: Widget[];
  widgetConfigs?: Record<string, WidgetConfig>;
  completedLessons?: string[];
  badges?: string[];
  thematicPreferences?: {
    topics: string[];
    favoriteAuthors: string[];
    interestLevel: number;
  };
}

export interface BibleVerse {
  id?: string;
  reference: string;
  text: string;
  reflection?: string;
  commentary?: string;
  callToAction?: string;
  blessing?: string;
  prayer?: string;
  application?: string;
  translation?: string;
}

export interface DualBibleVerse {
  pl: BibleVerse;
  en: BibleVerse;
  de?: BibleVerse;
  es?: BibleVerse;
  fr?: BibleVerse;
  it?: BibleVerse;
  pt?: BibleVerse;
  uk?: BibleVerse;
  verseArtUrl?: string;
}

export interface FoundVerse {
  reference: string;
  text: string;
  connection: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  content: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "success" | "news" | "alert" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DailyNote {
  id?: string;
  date: string;
  content: string;
  reminderTime?: string;
  createdAt?: string;
}

export interface Prayer {
  id: string;
  content: string;
  date: string;
  reminderTime?: string;
  completed: boolean;
  createdAt: string;
}

export interface DailyGoal {
  id: string;
  content: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface DailyTask {
  id: string;
  content: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface SpiritualGoal {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

export interface DailyGoalProgress {
  date: string;
  completedCount: number;
  totalCount: number;
}

export interface RadioAlarm {
  id: string;
  time: string;
  enabled: boolean;
  repeatDaily: boolean;
  selectedDays: number[];
  stream: RadioStreamType;
  fadeInEnabled: boolean;
  lastTriggeredDate?: string;
  localFileId?: string;
  localFileName?: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  roleText?: string;
}

export interface LiveUser {
  uid: string;
  userName: string;
  lastSeen: string;
  activeStream: string;
  isPraying: boolean;
  profilePicture?: string;
}

export interface DynamicDBData {
  [key: string]: string;
}

export interface WeeklyScheduleEntry {
  day: number; // 0 for Sunday
  time: string;
  title: string;
}

export interface WeeklySchedule {
  [day: string]: WeeklyScheduleEntry[];
}

export interface PrayerIntention {
  id?: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  prayerCount: number;
}

export interface Post {
  id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any; // Firestore Timestamp
  tags?: string[];
  summary_for_ai?: string;
}

export interface Book {
  id?: string;
  title: string;
  author: string;
  content: string;
  tags?: string[];
  summary_for_ai?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  userName: string;
  userAvatar?: string;
  timestamp: any;
  userId: string;
  status: "sent" | "delivered" | "read";
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface CloudStatus {
  lastSync: string;
  isConnected: boolean;
}

export interface UserLayout {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  i: string;
  static?: boolean;
}

export interface UserLayouts {
  [pathOrView: string]: {
    [breakpoint: string]: UserLayout[];
  };
}

export interface NotificationSettings {
  verseOfDayEnabled: boolean;
  verseOfDayTime: string;
  dailyMiraclesEnabled: boolean;
  supportRemindersEnabled: boolean;
  momentOfPeaceEnabled: boolean;
  lockScreenWidgetEnabled: boolean;
  wakeup4amEnabled?: boolean;
  wakeup6amEnabled?: boolean;
  lastVerseTriggerDate?: string | null;
  lastMiracleTriggerDate?: string | null;
  lastSupportTriggerDate?: string | null;
  lastMomentOfPeaceTriggerDate?: string | null;
}

export interface TickerContentItem {
  type: "text" | "button" | "component";
  id?: string;
  content?: string;
  label?: string;
  component?: React.ReactNode;
  action?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  shadowColor?: string;
  separatorAfter?: boolean;
}

// @ts-ignore
// Fix: Define BibleTranslation interface
export interface BibleTranslation {
  id: string;
  name: string;
  category: "PL" | "EN";
}

// --- Constants ---

export const WSPIERAJ_MISJE_ICON = "❤️";
export const MIRIAM_AVATAR_URL =
  "https://drive.google.com/thumbnail?id=1dHi9QX86UWj21YAIk3I8xyAXalzQkZpj&sz=w512";
export const JESZUA_AVATAR_URL =
  "https://drive.google.com/thumbnail?id=16_q5K0e3Uo6_vI0n6_E0Z4f6-8D6k_9W&sz=w512";
export const CZAREK_AVATAR_URL = "/ROGOWSKI.jpg";
export const PAWEL_COACH_AVATAR_URL =
  "https://drive.google.com/thumbnail?id=1fHuE3XPQcQjvI9CjDzvVr7ZPUVoO2Em0&sz=w512";
export const MARIUSZ_PRIEST_AVATAR_URL =
  "https://drive.google.com/thumbnail?id=1H9aZoyr1IEOLqFbOoExbXPnh3n1vCwf0&sz=w512";

export const CENTRUM_LOGO_URL =
  "https://drive.google.com/thumbnail?id=1sAA1RITqDUfjfEf9xqhSagcGHf_Rtbfi&sz=w512";
export const CENTRUM_CC_URL = "https://centrum.cclite.pl";

export const SHOP_URL = "https://my-store-1009741.creator-spring.com/";
export const RADIO_LISTEN_NUMBER_PL = "1-631-856-9564";
export const RADIO_LISTEN_NUMBER_EN = "1-667-930-9070";
export const HOTLINE_NADZIEJA_NUMBER = "+48 730958583";
export const SMS_SUB_NUMBER = "+48 537 147 043";
export const SMS_SUB_TEXT = "Duchowe Inspiracje";
export const CUDA_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW&si=vtQYu4ttsDtMnwbT";
export const SUPPORT_ZRZUTKA_APP_URL = "https://zrzutka.pl/3bbxzn";
export const SUPPORT_ZRZUTKA_MISSION_URL = "https://zrzutka.pl/rs4g4v";
export const SUPPORT_PAYPAL_URL = "https://www.paypal.me/CezaryRogowski";
export const CHRISTIAN_CULTURE_HOMEPAGE_URL =
  "https://linktr.ee/christianculture?utm_source=linktree_profile_share&ltsid=2bf65f4a-f9d7-4463-a522-dda9f93170a5";
export const PAWEL_COACH_NUMBER = "+48 729 415 390";
export const MARIUSZ_PRIEST_NUMBER = "+48 608 337 477";
export const REVOLUT_LINK = "https://revolut.me/christianculture";
export const YOUTUBE_DAILY_MIRACLES_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW&si=vtQYu4ttsDtMnwbT";
export const ALL_CHANNELS_YOUTUBE_URL =
  "https://linktr.ee/christianculturenetwork?utm_source=linktree_profile_share&ltsid=1d265923-7bb1-48a3-a5ba-14e10dba54ab";

export const CHRISTIAN_CULTURE_TOC_URL = "https://christianculture.cclite.pl";
export const COACH_HOLISTYCZNY_URL = "https://wa.me/48783478280";
export const STUDIO_DOBREGO_SLOWA_URL = "https://studiods.pl/";
export const SMS_SUB_MESSAGE_PL = "Duchowe Inspiracje";
export const SMS_SUB_MESSAGE_EN = "Spiritual Inspirations";

export const CHRISTIAN_DATING_APP_URL = "https://randka.cclite.pl";

export const RADIO_EMAIL = "radiochristianculture@gmail.com";
export const CCTV_EMAIL = "polskiercctv@gmail.com";
export const POLSKIE_RADIO_CC_URL = "https://polskieradio.cc";
export const CCLITE_PL_URL = "https://cclite.pl";

export const MONTH_NAMES_PL = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
export const MONTH_NAMES_GENITIVE_PL = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];
export const DAY_NAMES_PL = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];
export const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const USER_ROLES = [
  {
    id: "WITNESS",
    pl: "Cyfrowy Świadek Chrystusa",
    en: "Digital Witness of Christ",
  },
  {
    id: "DISCIPLE",
    pl: "UCZEŃ JEZUSA CHRYSTUSA",
    en: "DISCIPLE OF JESUS CHRIST",
  },
  { id: "OTHER", pl: "Inna rola...", en: "Other role..." },
];

export const USER_AGE_GROUPS = [
  { id: "unspecified", pl: "Nieokreślony", en: "Unspecified" },
  { id: "child", pl: "Dziecko (<12 lat)", en: "Child (<12 years)" },
  {
    id: "teenager",
    pl: "Nastolatek (13-17 lat)",
    en: "Teenager (13-17 years)",
  },
  {
    id: "young_adult",
    pl: "Młody Dorosły (18-29 lat)",
    en: "Young Adult (18-29 years)",
  },
  { id: "adult", pl: "Dorosły (30-64 lat)", en: "Adult (30-64 years)" },
  { id: "senior", pl: "Senior (65+ lat)", en: "Senior (65+ years)" },
];

export const MARITAL_STATUS_OPTIONS = [
  { id: "unspecified", pl: "Nieokreślony", en: "Unspecified" },
  { id: "single", pl: "Singiel", en: "Single" },
  { id: "married", pl: "Żonaty/Mężatka", en: "Married" },
  { id: "widowed", pl: "Wdowiec/Wdowa", en: "Widowed" },
  { id: "divorced", pl: "Rozwiedziony/Rozwiedziona", en: "Divorced" },
];

export const SPIRITUAL_STATUS_OPTIONS = [
  { id: "unspecified", pl: "Nieokreślony", en: "Unspecified" },
  { id: "believer", pl: "Wierzący", en: "Believer" },
  { id: "seeker", pl: "Poszukujący prawdy", en: "Truth Seeker" },
  {
    id: "theologian",
    pl: "Teolog/Badacz Pisma",
    en: "Theologian/Scripture Scholar",
  },
  { id: "atheist", pl: "Niewierzący/Ateista", en: "Non-believer/Atheist" },
];

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { id: "BW", name: "Biblia Warszawska", category: "PL" },
  { id: "UBG", name: "Uwspółcześniona Biblia Gdańska", category: "PL" },
  { id: "EIB", name: "Biblia EIB", category: "PL" },
  { id: "NIV", name: "New International Version", category: "EN" },
  { id: "NKJV", name: "New King James Version", category: "EN" },
];

export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getBiblicalDateString = (date: Date): string => {
  // Biblical day starts at sunset (simplified to 18:00)
  const d = new Date(date);
  if (d.getHours() >= 18) {
    d.setDate(d.getDate() + 1);
  }
  return getLocalDateString(d);
};

export const getVerseSegmentKey = (date: Date): string => {
  const base = getLocalDateString(date);
  const hour = date.getHours();
  const segment15 = Math.floor(date.getMinutes() / 15);
  return `${base}-${hour}-${segment15}`;
};

export const isAllowedDomain = (): boolean => {
  if (typeof window === "undefined") return false;
  const { hostname } = window.location;
  return (
    hostname === "cclite.pl" ||
    hostname === "www.cclite.pl" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.includes("run.app")
  );
};

export const isStripeAllowed = (): boolean => {
  if (typeof window === "undefined") return false;
  const { hostname } = window.location;
  // Stripe requires production domain for the payment buttons to render correctly
  return (
    hostname === "cclite.pl" ||
    hostname === "www.cclite.pl" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.includes("run.app")
  );
};

export const loadScript = (
  src: string,
  id: string,
  crossorigin: string | null = null,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    if (crossorigin) script.setAttribute("crossorigin", crossorigin);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export const fixOrphans = (text: string): string => {
  if (!text) return "";
  // Polish orphans: single letter words (a, i, o, u, w, z) should not stay at the end of a line.
  // We replace the space after them with a non-breaking space (\u00A0).
  // We use a lookahead to ensure we don't break HTML tags if present.
  return text
    .replace(/(\s|^)([aiouwzAIOUWZ])\s+(?![^<]*>)/g, "$1$2\u00A0")
    .replace(/-(?![^<]*>)/g, "\u2011");
};

/**
 * Splits a verse into aesthetic lines based on punctuation or length.
 */
export const splitVerseIntoLines = (
  text: string,
  reference?: string,
): string[] => {
  if (!text) return [];

  // Split the text into sentences ending with . ! or ?
  // We use a regex that matches those punctuation marks followed by a space or end of string.
  // The matched punctuation is kept with the sentence by capturing it or adjusting the split.

  // A regex to match sentence ending punctuation and capture it, then match trailing space
  const matches = text.match(/[^.!?]+[.!?]+(?:\s|$)?/g);

  if (matches && matches.length > 0) {
    return matches.map((m) => m.trim());
  }

  return [text];
};

export const normalizeBibleReference = (
  ref: string,
  lang: SupportedLanguage,
): string => {
  if (!ref) return "";
  let normalized = ref.trim();

  if (lang === "pl") {
    // Fix common misspellings from AI
    normalized = normalized.replace(/HEBRAICZYKÓW/gi, "HEBRAJCZYKÓW");
    normalized = normalized.replace(/HEBRAICZYKOW/gi, "HEBRAJCZYKÓW");
    normalized = normalized.replace(/HEBRAJCZYKOW/gi, "HEBRAJCZYKÓW");

    // If the reference contains question marks, try to clean it up
    if (normalized.includes("?")) {
      // Replace ?:? or ? with empty string and trim
      normalized = normalized
        .replace(/\s*\?\s*:\s*\?\s*/g, "")
        .replace(/\s*\?\s*/g, "")
        .trim();

      // If after cleaning it's empty or just symbols, return a generic label
      if (
        !normalized ||
        normalized === ":" ||
        normalized === "," ||
        normalized === "?:?" ||
        normalized === "???" ||
        normalized === "?"
      ) {
        return lang === "pl" ? "Werset" : "Verse";
      }
    }

    // Replace colon with comma for Polish standard (e.g., 12:1 -> 12, 1)
    // Only if it's between numbers
    normalized = normalized.replace(/(\d+):(\d+)/g, "$1, $2");

    // Ensure space after comma if missing
    normalized = normalized.replace(/,(\d+)/g, ", $1");
  }

  return normalized;
};

export const inferGenderFromName = (name: string): UserGender => {
  if (!name) return "unspecified";
  const firstName = name.trim().split(" ")[0].toLowerCase();
  // Reguła polska: imiona żeńskie kończą się na 'a' (z kilkoma wyjątkami, ale tu wystarczy do inteligencji onboardingowej)
  if (firstName.endsWith("a")) return "female";
  return "male";
};

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    Hls: any;
    google: any;
    OneSignalDeferred: any[];
    handleCredentialResponse: (
      response: any,
      isManagementCenter: boolean,
    ) => void;
    aistudio?: AIStudio;
    gapi: any;
    gapi_onload: () => void;
  }
}

// --- Digital Apostle (Agent) Types ---

export type ApostleTaskType = "post_social" | "analyze_logs" | "send_sms" | "generate_report";
export type ApostleTaskStatus = "pending" | "running" | "completed" | "failed";

export interface ApostleTask {
  id?: string;
  type: ApostleTaskType;
  status: ApostleTaskStatus;
  payload: any;
  scheduledAt: string;
  completedAt?: string;
  error?: string;
}

export interface ApostleLog {
  id?: string;
  action: string;
  details: string;
  timestamp?: string;
  level: "info" | "warning" | "error";
}

export interface ApostleReport {
  id?: string;
  summary: string;
  actionsTaken: string[];
  strategicSuggestions: string[];
  timestamp?: string;
}

export interface ApostleUXIssue {
  id?: string;
  issue: string;
  context: string;
  severity: "low" | "medium" | "high";
  detectedAt?: string;
  status: "new" | "investigating" | "fixed" | "ignored";
}

export interface ApostleConfig {
  isEnabled: boolean;
  lastActive: string;
  apiKeys?: {
    meta?: string;
    twilio?: string;
    gmail?: string;
  };
  constitutionUrl?: string;
}

