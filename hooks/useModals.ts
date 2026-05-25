import { useState, useCallback } from 'react';

export const useModals = () => {
  const [modals, setModals] = useState({
    dailyVerse: false,
    widgetPreview: false,
    sidebar: false,
    userPanel: false,
    managementCenter: false,
    biblicalSchool: false,
    verseSearch: false,
    support: false,
    helpingHand: false,
    studioDobregoSlowa: false,
    coaching: false,
    voiceAssistant: false,
    installationGuide: false,
    tutorial: false,
    store: false,
    games: false,
    lawDecalogue: false,
    openLetter: false,
    readingRoom: false,
    bibleAd: false,
    myFiles: false,
    weeklySchedule: false,
    apiKey: false,
    miriamChat: false,
    tvStudy: false,
    youtubeLive: false,
    update: false,
    ccNews: false,
    ccResources: false,
    ccMediaPlayerPage: false,
    ccPatronsPage: false,
    ecosystemMap: false,
    liveGlobalMap: false,
    strategicPartners: false,
    wdowiGrosz: false,
    spotify: false,
    centralChat: false,
    businessCard: false,
    zbyszekGieron: false,
    katarzynaFedkow: false,
    emiMedia: false,
    slideshow: false,
    yellowCard: false,
    smsSubscription: false,
    shabbat: false,
    prayerIntentions: false,
    lessonReading: false,
    taskbar: false,
    matrix: false,
  });

  const setModalOpen = useCallback((modalName: keyof typeof modals, isOpen: boolean) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(Object.keys(modals).reduce((acc, key) => ({ ...acc, [key]: false }), {} as typeof modals));
  }, [modals]);

  return {
    modals,
    setModalOpen,
    closeAllModals,
  };
};
