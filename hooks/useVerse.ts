import { useState, useCallback, useEffect, useMemo } from 'react';
import { DualBibleVerse, BibleVerse, SupportedLanguage, RadioStreamType, ToastMessage, getVerseSegmentKey } from '../types';
import { PersistenceService } from '../services/persistenceService';
import { BibleService } from '../services/bibleService';
import { fetchDailyDualContent } from '../services/geminiService';
import { getVerseForDate } from '../src/verses';
import { SABBATH_VERSES } from '../services/sabbathVerses';

interface VerseProps {
  appLanguage: SupportedLanguage;
  activeStream: RadioStreamType;
  visualMode: string;
  addToast: (msg: string, type?: ToastMessage["type"]) => void;
  setModalOpen: (name: string, isOpen: boolean) => void;
}

export const useVerse = ({
  appLanguage,
  activeStream,
  visualMode,
  addToast,
  setModalOpen
}: VerseProps) => {
  const [dualDailyVerse, setDualDailyVerse] = useState<DualBibleVerse | null>(
    PersistenceService.loadLastDisplayedVerse()
      ? {
          pl: PersistenceService.loadLastDisplayedVerse()!,
          en: PersistenceService.loadLastDisplayedVerse()!,
        }
      : null,
  );
  const [isBibleInitialLoading, setIsBibleInitialLoading] = useState(true);

  const isVerseComplete = useCallback((verse: DualBibleVerse | null) => {
    if (!verse) return false;
    return !!(verse.pl.reflection && verse.pl.reflection.length > 50 && verse.en.reflection && verse.en.reflection.length > 50);
  }, []);

  const loadVerseFromGemini = useCallback(async (forceRefresh: boolean, manualUpdate: boolean = false) => {
    const todayStr = getVerseSegmentKey(new Date());
    const history = PersistenceService.loadVerseHistory();
    try {
      let data = await fetchDailyDualContent(todayStr, forceRefresh, history);
      const cached = PersistenceService.loadDailyVerseCache(todayStr);
      if (cached && cached.verseArtUrl && !forceRefresh) {
        data.verseArtUrl = cached.verseArtUrl;
      }
      setDualDailyVerse(data);
      if (manualUpdate || !PersistenceService.loadDailyVerseCache(todayStr) || !isVerseComplete(PersistenceService.loadDailyVerseCache(todayStr))) {
        PersistenceService.saveDailyVerseCache(todayStr, data);
      }
    } catch (err: any) {
      if (err.isApiQuotaExceeded || err.isMissingKey || err.isKeyInvalid) {
        addToast(appLanguage === "pl" ? "Asystent Miriam wymaga własnego klucza API." : "Miriam Assistant requires your own API key.", "news", {
          label: appLanguage === "pl" ? "ODBLOKUJ" : "UNLOCK",
          onClick: () => setModalOpen("apiKey", true),
        });
      }
    } finally {
      setIsBibleInitialLoading(false);
    }
  }, [appLanguage, addToast, isVerseComplete, setModalOpen]);

  const loadVerse = useCallback(async (forceRandom = false) => {
    const today = new Date();
    const todayStr = getVerseSegmentKey(today);
    try {
      if (visualMode === "sabbath" && !forceRandom) {
        const hourIndex = today.getHours();
        setDualDailyVerse(SABBATH_VERSES[hourIndex % 24]);
        setIsBibleInitialLoading(false);
        return;
      }
      if (!forceRandom) {
        const curatedVerse = getVerseForDate(today);
        const cached = PersistenceService.loadDailyVerseCache(todayStr);
        const finalVerse = { ...curatedVerse, verseArtUrl: cached?.verseArtUrl };
        setDualDailyVerse(finalVerse);
        setIsBibleInitialLoading(false);
        PersistenceService.saveDailyVerseCache(todayStr, finalVerse);
        return;
      }
      if (forceRandom) {
        addToast(appLanguage === "pl" ? "Szukanie wersetu..." : "Searching for verse...", "info");
        setDualDailyVerse(null);
      }
      let verse: BibleVerse;
      if (forceRandom) verse = await BibleService.getRandomVerse();
      else verse = await BibleService.getDailyVerse();
      const newDualVerse: DualBibleVerse = { pl: verse, en: { ...verse, text: "Miriam is translating..." } };
      setDualDailyVerse((prev) => (forceRandom ? newDualVerse : (isVerseComplete(prev) ? prev : newDualVerse)));
      if (forceRandom) PersistenceService.saveDailyVerseCache(todayStr, newDualVerse);
      setIsBibleInitialLoading(false);
      await loadVerseFromGemini(forceRandom, forceRandom);
    } catch (e) {
      setIsBibleInitialLoading(false);
    }
  }, [loadVerseFromGemini, appLanguage, addToast, isVerseComplete, visualMode]);

  useEffect(() => {
    BibleService.loadDatabase().then(() => loadVerse(false)).catch(() => loadVerse(false));
  }, []);

  const dailyVerse = useMemo(() => {
    if (!dualDailyVerse) return null;
    if (activeStream === "GLOBAL") {
      const enVerse = dualDailyVerse.en;
      if (enVerse && enVerse.text && !enVerse.text.includes("Miriam is translating")) return enVerse;
    }
    return (dualDailyVerse as any)[appLanguage] || dualDailyVerse.en || dualDailyVerse.pl;
  }, [dualDailyVerse, appLanguage, activeStream]);

  return { dailyVerse, isBibleInitialLoading, loadVerse, dualDailyVerse };
};
