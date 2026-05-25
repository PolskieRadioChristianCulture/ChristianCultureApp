import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, RadioStreamType, ToastMessage } from '../types';
import { PersistenceService } from '../services/persistenceService';

export const useAppLanguage = (activeStream: RadioStreamType, addToast: (msg: string, type?: ToastMessage["type"]) => void) => {
  const { i18n } = useTranslation();

  const [appLanguage, setAppLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("i18nextLng") as SupportedLanguage;
    const supported: SupportedLanguage[] = ["pl", "en", "de", "es", "fr", "it", "pt", "uk"];
    if (supported.includes(saved)) return saved;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLang = navigator.language.toLowerCase().split("-")[0] as SupportedLanguage;

    if (supported.includes(browserLang)) return browserLang;

    return (timeZone.includes("Warsaw") || browserLang === "pl") ? "pl" : "en";
  });

  const uiLang = useMemo(() => {
    if (activeStream === "GLOBAL") return "en";
    if (activeStream === "PL" || activeStream === "BIBLIA") return "pl";
    return appLanguage === "pl" || appLanguage === "en" ? appLanguage : "en";
  }, [activeStream, appLanguage]);

  const handleLanguageChange = useCallback((lang: SupportedLanguage) => {
    if ((activeStream === "PL" || activeStream === "BIBLIA") && lang !== "pl") {
      addToast(uiLang === "pl" ? "Ta stacja wymaga języka polskiego." : "This station requires Polish language.", "info");
      setAppLanguage("pl");
      i18n.changeLanguage("pl");
      PersistenceService.safeSetItem("app_language_cc_radio", "pl");
      return;
    }
    if (activeStream === "GLOBAL" && lang !== "en") {
      addToast(uiLang === "pl" ? "Ta stacja wymaga języka angielskiego." : "This station requires English language.", "info");
      setAppLanguage("en");
      i18n.changeLanguage("en");
      PersistenceService.safeSetItem("app_language_cc_radio", "en");
      return;
    }
    setAppLanguage(lang);
    i18n.changeLanguage(lang);
    PersistenceService.safeSetItem("app_language_cc_radio", lang);
  }, [i18n, activeStream, addToast, uiLang]);

  // Sync language with stream automatically
  useEffect(() => {
    if (activeStream === "PL" || activeStream === "BIBLIA") {
      if (appLanguage !== "pl") {
        setAppLanguage("pl");
        i18n.changeLanguage("pl");
        PersistenceService.safeSetItem("app_language_cc_radio", "pl");
      }
    } else if (activeStream === "GLOBAL") {
      if (appLanguage !== "en") {
        setAppLanguage("en");
        i18n.changeLanguage("en");
        PersistenceService.safeSetItem("app_language_cc_radio", "en");
      }
    }
  }, [activeStream, appLanguage, i18n]);

  return {
    appLanguage,
    uiLang,
    handleLanguageChange,
    setAppLanguage
  };
};
