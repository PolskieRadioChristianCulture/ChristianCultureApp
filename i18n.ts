import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const translationEN = {
  "app.update_available": "New update available",
  "app.update_now": "Update now",
  "install.success": "Installation successful",
  "location.fetching": "Detecting location...",
  "location.success": "Location updated",
  "location.denied": "Location access denied",
  "system.updating": "System update in progress",
  "common.copied": "Copied to clipboard",
  "verse.share": "Check out this verse!",
  "community.online": "Worshipers online:",
  "community.title": "Community",
  "cc_widgets_updated": "Widgets layout saved",
  "radio.error": "Connection error. Retrying...",
  "radio.shop": "CC Store",
  "radio.hotline": "Hotline"
};

const translationPL = {
  "app.update_available": "Dostępna nowa aktualizacja",
  "app.update_now": "Zaktualizuj teraz",
  "install.success": "Instalacja zakończona sukcesem",
  "location.fetching": "Wykrywanie lokalizacji...",
  "location.success": "Lokalizacja zaktualizowana",
  "location.denied": "Brak dostępu do lokalizacji",
  "system.updating": "Trwa aktualizacja systemu",
  "common.copied": "Skopiowano do schowka",
  "verse.share": "Zobacz ten werset!",
  "community.online": "Wierni online:",
  "community.title": "Społeczność",
  "cc_widgets_updated": "Układ widgetów zapisany",
  "radio.error": "Błąd połączenia. Próbuję ponownie...",
  "radio.shop": "Sklep CC",
  "radio.hotline": "Infolinia"
};
const translationDE = {};
const translationES = {};
const translationFR = {};
const translationIT = {};
const translationPT = {};
const translationUK = {};

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
  de: { translation: translationDE },
  es: { translation: translationES },
  fr: { translation: translationFR },
  it: { translation: translationIT },
  pt: { translation: translationPT },
  uk: { translation: translationUK }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
