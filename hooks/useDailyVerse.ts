import { useState, useCallback, useEffect } from 'react';
import { 
  DualBibleVerse, 
  BibleVerse, 
  ToastMessage, 
  SupportedLanguage
} from '../types';
import { PersistenceService } from '../services/persistenceService';
import { SABBATH_VERSES } from '../services/sabbathVerses';
import { getVerseForDate } from '../src/verses';
import { fetchDailyDualContent } from '../services/geminiService';
import { getVerseSegmentKey } from '../types';
import { BibleService } from '../services/bibleService';

interface UseDailyVerseProps {
  appLanguage: SupportedLanguage;
  addToast: (msg: string, type: ToastMessage["type"], action?: ToastMessage["action"]) => void;
  visualMode: string;
  setIsApiKeyModalOpen: (v: boolean) => void;
  APP_VERSION?: string;
}

export function useDailyVerse({
  appLanguage,
  addToast,
  visualMode,
  setIsApiKeyModalOpen,
  APP_VERSION
}: UseDailyVerseProps) {
  const [dualDailyVerse, setDualDailyVerse] = useState<DualBibleVerse | null>(
    PersistenceService.loadLastDisplayedVerse()
      ? {
          pl: PersistenceService.loadLastDisplayedVerse()!,
          en: PersistenceService.loadLastDisplayedVerse()!,
        }
      : null
  );

  // Sync to localStorage
  useEffect(() => {
    if (dualDailyVerse && dualDailyVerse.pl.reference) {
      PersistenceService.saveLastDisplayedVerse(dualDailyVerse.pl);
    }
  }, [dualDailyVerse]);

  const [isBibleInitialLoading, setIsBibleInitialLoading] = useState(true);

  const isVerseComplete = useCallback((verse: DualBibleVerse | null): boolean => {
    if (!verse) return false;
    const isComplete = !!(
      verse.pl &&
      verse.en &&
      verse.pl.text &&
      verse.en.text &&
      !verse.en.text.includes("Miriam is translating") &&
      verse.pl.reflection &&
      verse.pl.reflection.length > 50 &&
      verse.en.reflection &&
      verse.en.reflection.length > 50
    );
    return isComplete;
  }, []);

  const loadVerseFromGemini = useCallback(
    async (forceRefresh: boolean, manualUpdate: boolean = false) => {
      const todayStr = getVerseSegmentKey(new Date());
      const history = PersistenceService.loadVerseHistory();
      console.log(
        `[Verse] loadVerseFromGemini started. Date: ${todayStr}, forceRefresh: ${forceRefresh}`,
      );

      try {
        let data = await fetchDailyDualContent(todayStr, forceRefresh, history);
        console.log(`[Verse] Gemini returned: ${data.pl.reference}`, data);

        if (
          !data.en ||
          !data.en.text ||
          data.en.text.includes("Miriam is translating")
        ) {
          console.warn(
            "[Verse] English translation missing or incomplete in Gemini response.",
          );
        }

        // Check if we need to generate Verse Art
        const cached = PersistenceService.loadDailyVerseCache(todayStr);
        if (cached && cached.verseArtUrl && !forceRefresh) {
          data.verseArtUrl = cached.verseArtUrl;
        }

        setDualDailyVerse(data);
        if (
          manualUpdate ||
          !PersistenceService.loadDailyVerseCache(todayStr) ||
          !isVerseComplete(PersistenceService.loadDailyVerseCache(todayStr))
        ) {
          console.log("[Verse] Saving Gemini verse to cache...");
          PersistenceService.saveDailyVerseCache(todayStr, data);
        }
      } catch (err: any) {
        console.error("[Verse] Gemini fetch error:", err);
        if (err.isApiQuotaExceeded || err.isMissingKey || err.isKeyInvalid) {
          addToast(
            appLanguage === "pl"
              ? "Asystent Miriam wymaga własnego klucza API."
              : "Miriam Assistant requires your own API key.",
            "news",
            {
              label: appLanguage === "pl" ? "ODBLOKUJ" : "UNLOCK",
              onClick: () => setIsApiKeyModalOpen(true),
            },
          );
        }
      } finally {
        setIsBibleInitialLoading(false);
      }
    },
    [appLanguage, addToast, isVerseComplete, setIsApiKeyModalOpen],
  );

  const loadVerse = useCallback(
    async (forceRandom = false) => {
      const today = new Date();
      const todayStr = getVerseSegmentKey(today);
      console.log(
        `[Verse] loadVerse called. Date segment: ${todayStr}, forceRandom: ${forceRandom}`,
      );

      try {
        const currentVisualMode = visualMode;
        console.log(
          `[Verse] loadVerse execution. Current VisualMode: ${currentVisualMode}`,
        );

        if (currentVisualMode === "sabbath" && !forceRandom) {
          const hourIndex = today.getHours();
          const sabbathVerse = SABBATH_VERSES[hourIndex % 24];
          console.log(
            `[Verse] Sabbath mode detected. Setting Sabbath verse for hour ${hourIndex}: ${sabbathVerse.pl.reference}`,
          );
          setDualDailyVerse(sabbathVerse);
          setIsBibleInitialLoading(false);
          return;
        }

        // For the daily verse (not forced random), always use our curated list
        if (!forceRandom) {
          const curatedVerse = getVerseForDate(today);
          console.log(
            `[Verse] Using curated verse for today: ${curatedVerse.pl.reference}`,
          );

          // Check if we have art for it in cache
          const cached = PersistenceService.loadDailyVerseCache(todayStr);
          const finalVerse = {
            ...curatedVerse,
            verseArtUrl:
              cached && cached.verseArtUrl ? cached.verseArtUrl : undefined,
          };

          setDualDailyVerse(finalVerse);
          setIsBibleInitialLoading(false);

          PersistenceService.saveDailyVerseCache(todayStr, finalVerse);
          return;
        }

        const cached = PersistenceService.loadDailyVerseCache(todayStr);
        if (forceRandom) {
          console.log("[Verse] Forcing random verse search via Gemini...");
          addToast(
            appLanguage === "pl"
              ? "Szukanie wersetu..."
              : "Searching for verse...",
            "info",
          );
          setDualDailyVerse(null); // Clear to show loading state
        }

        let verse: BibleVerse;
        try {
          if (forceRandom) {
            verse = await BibleService.getRandomVerse();
            console.log(
              `[Verse] Random verse from local DB: ${verse.reference}`,
            );
          } else {
            verse = await BibleService.getDailyVerse();
            console.log(
              `[Verse] Daily verse from local DB: ${verse.reference}`,
            );
          }

          const newDualVerse: DualBibleVerse = {
            pl: verse,
            en: { ...verse, text: "Miriam is translating..." },
          };

          // Only set if we don't have a better one already (unless forceRandom or it's a new day)
          setDualDailyVerse((prev) => {
            if (forceRandom) return newDualVerse;
            if (!prev) return newDualVerse;
            return isVerseComplete(prev) ? prev : newDualVerse;
          });

          if (forceRandom)
            PersistenceService.saveDailyVerseCache(todayStr, newDualVerse);
          setIsBibleInitialLoading(false);

          // Now try to upgrade to Gemini version
          await loadVerseFromGemini(forceRandom, forceRandom);
        } catch (dbErr) {
          console.error(
            "[Verse] Local DB error, falling back to Gemini only:",
            dbErr,
          );
          await loadVerseFromGemini(forceRandom, forceRandom);
        }
      } catch (e: any) {
        console.error("[Verse] Global loadVerse error:", e);
        setIsBibleInitialLoading(false);
      }
    },
    [loadVerseFromGemini, appLanguage, addToast, isVerseComplete, visualMode],
  );

  // Refresh Sabbath verse every hour
  useEffect(() => {
    if (visualMode === "sabbath") {
      const checkHour = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const lastSabbathHour = parseInt(
          localStorage.getItem("cc_last_sabbath_hour") || "-1",
        );

        if (currentHour !== lastSabbathHour) {
          console.log(
            `[Sabbath] Hour changed to ${currentHour}, refreshing verse...`,
          );
          loadVerse(false);
          localStorage.setItem("cc_last_sabbath_hour", currentHour.toString());
        }
      };

      checkHour();
      const interval = setInterval(checkHour, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [visualMode, loadVerse]);

  useEffect(() => {
    console.log(
      `[App] Initial loadVerse effect running. Version: ${APP_VERSION}`,
    );

    // Safety check for reload loops
    const lastReload = sessionStorage.getItem("cc_last_reload");
    const now = Date.now();
    if (lastReload && now - parseInt(lastReload) < 5000) {
      console.warn(
        "[App] Detected potential reload loop. Skipping automatic reload.",
      );
    } else {
      sessionStorage.setItem("cc_last_reload", now.toString());
    }

    BibleService.loadDatabase()
      .then(() => loadVerse(false))
      .catch(() => loadVerse(false));

    // Global hook for key selection
    (window as any).cc_openManualApiKeyModal = () => setIsApiKeyModalOpen(true);

    return () => {
      delete (window as any).cc_openManualApiKeyModal;
    };
  }, [loadVerse, APP_VERSION, setIsApiKeyModalOpen]);

  // Periodic check for day change or incomplete data
  useEffect(() => {
    const checkDataFreshness = () => {
      if (visualMode === "sabbath") {
        loadVerse(false);
        return;
      }
      const todayStr = getVerseSegmentKey(new Date());
      const cached = PersistenceService.loadDailyVerseCache(todayStr);
      if (!cached || !isVerseComplete(cached)) {
        console.log(
          "[App] Data is missing or incomplete for segment. Refreshing...",
        );
        loadVerse(false);
      }
    };
    const interval = setInterval(checkDataFreshness, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [loadVerse, isVerseComplete, visualMode]);

  return {
    dualDailyVerse,
    setDualDailyVerse,
    isBibleInitialLoading,
    loadVerse,
  };
}
