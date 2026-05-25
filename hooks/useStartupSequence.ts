import { useEffect } from 'react';
import { UserPersona, ToastMessage, SupportedLanguage } from '../types';
import { VoiceGreetingService } from '../services/voiceGreetingService';

interface StartupSequenceProps {
  appStarted: boolean;
  notificationsAllowed: boolean;
  userPersona: UserPersona;
  modals: Record<string, boolean>;
  setModalOpen: (name: string, isOpen: boolean) => void;
  addToast: (msg: string, type?: ToastMessage["type"]) => void;
  uiLang: SupportedLanguage;
  dynamicDB: any;
}

export const useStartupSequence = ({
  appStarted,
  notificationsAllowed,
  userPersona,
  modals,
  setModalOpen,
  addToast,
  uiLang,
  dynamicDB
}: StartupSequenceProps) => {

  useEffect(() => {
    if (appStarted && notificationsAllowed) {
      console.log("[SI Takt] Inicjalizacja sekwencji startowej...");

      // 1. Głosowe powitanie (6s)
      const voiceTimer = setTimeout(async () => {
        if (
          !VoiceGreetingService.isIntroPlayed() &&
          userPersona.aiGreetingsEnabled
        ) {
          const greeting = await VoiceGreetingService.getDailyMentorGreeting(userPersona);
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
          setModalOpen("ccNews", true);
          localStorage.setItem("cc_news_last_seen_text", currentNews);
          localStorage.setItem("cc_daily_promo_shown_date", new Date().toDateString());
        }
      }, 900000); // 15 minut

      // 3. Rotacyjna Reklama (30 minut po starcie) - Tylko jedna dziennie
      const promoTimer = setTimeout(() => {
        const today = new Date().toDateString();
        const lastPromoDate = localStorage.getItem("cc_daily_promo_shown_date");

        if (
          lastPromoDate !== today &&
          !modals.userPanel &&
          !modals.sidebar &&
          !modals.ccNews
        ) {
          const promoSequence = parseInt(localStorage.getItem("cc_promo_sequence") || "0");

          if (promoSequence === 0) {
            setModalOpen("bibleAd", true);
            localStorage.setItem("cc_promo_sequence", "1");
          } else if (promoSequence === 1) {
            setModalOpen("wdowiGrosz", true);
            localStorage.setItem("cc_promo_sequence", "2");
          } else {
            setModalOpen("store", true);
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
  }, [appStarted, notificationsAllowed, userPersona, modals, dynamicDB]);

  // Wdowi Grosz - Ticker/Toast Dzienny
  useEffect(() => {
    if (appStarted && notificationsAllowed) {
      const timer = setTimeout(() => {
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
      }, 180000);
      return () => clearTimeout(timer);
    }
  }, [appStarted, notificationsAllowed, uiLang, addToast]);
};
