import { useEffect, useRef } from 'react';
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { nativeService } from "../services/nativeService";
import { PersistenceService } from "../services/persistenceService";
import { fetchDailyDualContent } from "../services/geminiService";
import { useAppStore } from "../useAppStore";
import { isAllowedDomain, isStripeAllowed, loadScript } from "../types";
import { BibleService } from "../services/bibleService";

export const useStartup = (
  appStarted: boolean,
  userPersona: any,
  loadVerse: (force: boolean) => void,
  setIsTvStudyModalOpen: (val: boolean) => void
) => {
  const hasAutostartedRef = useRef(false);

  useEffect(() => {
    // Restore radio player if it was closed (Patch)
    if (localStorage.getItem('cc_fix_radio_player_visibility') !== 'true') {
      localStorage.setItem('cc_widget_radio_player_visible', 'true');
      localStorage.setItem('cc_fix_radio_player_visibility', 'true');
      window.dispatchEvent(new Event('cc_widgets_updated'));
    }

    useAppStore.getState().initAuth();
    nativeService.initialize();

    if (nativeService.isNative()) {
      ScreenOrientation.unlock().catch(err => console.warn("[App] Failed to unlock orientation:", err));
    }

    if (isAllowedDomain()) {
      loadScript("https://accounts.google.com/gsi/client", "google-gsi").catch(
        (err) => console.warn("[App] Failed to load GSI script:", err),
      );
    }

    if (isStripeAllowed()) {
      Promise.all([
        loadScript("https://js.stripe.com/v3/", "stripe-js"),
        loadScript("https://js.stripe.com/v3/buy-button.js", "stripe-buy-button"),
      ]).catch((err) => console.warn("[App] Failed to load Stripe script:", err));
    }

    PersistenceService.preCacheUpcomingContent(async (date) => {
      try { return await fetchDailyDualContent(date, false, []); } catch { return null; }
    });

    if (nativeService.isNative()) {
      const settings = PersistenceService.loadNotificationSettings();
      const [hour, minute] = settings.verseOfDayTime.split(":").map(Number);
      nativeService.scheduleCCNotifications({ hour, minute });
    }

    BibleService.loadDatabase().then(() => loadVerse(false)).catch(() => loadVerse(false));
  }, [loadVerse]);

  useEffect(() => {
    const checkTimer = setInterval(() => {
      const now = new Date();
      if (now.getDay() === 6 && now.getHours() === 9 && now.getMinutes() === 0) {
        if (localStorage.getItem("tv_study_shown_today") !== now.toDateString()) {
          setIsTvStudyModalOpen(true);
          localStorage.setItem("tv_study_shown_today", now.toDateString());
        }
      }
    }, 60000);
    return () => clearInterval(checkTimer);
  }, [setIsTvStudyModalOpen]);
};
