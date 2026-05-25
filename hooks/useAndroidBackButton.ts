import { useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

interface UseAndroidBackButtonProps {
  appLanguage: string;
  addToast: (msg: string, type: string) => void;
  isLessonReadingModalOpen: boolean;
  setIsLessonReadingModalOpen: (v: boolean) => void;
  isYouTubeLiveModalOpen: boolean;
  setIsYouTubeLiveModalOpen: (v: boolean) => void;
  isSpotifyModalOpen: boolean;
  setIsSpotifyModalOpen: (v: boolean) => void;
  isMatrixOpen: boolean;
  setIsMatrixOpen: (v: boolean) => void;
  isBusinessCardOpen: boolean;
  setIsBusinessCardOpen: (v: boolean) => void;
  isAdminPinModalOpen: boolean;
  setIsAdminPinModalOpen: (v: boolean) => void;
  isGamesModalOpen: boolean;
  setIsGamesModalOpen: (v: boolean) => void;
  isMyFilesModalOpen: boolean;
  setIsMyFilesModalOpen: (v: boolean) => void;
  isWeeklyScheduleModalOpen: boolean;
  setIsWeeklyScheduleModalOpen: (v: boolean) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (v: boolean) => void;
  isTvStudyModalOpen: boolean;
  setIsTvStudyModalOpen: (v: boolean) => void;
  isCcResourcesModalOpen: boolean;
  setIsCcResourcesModalOpen: (v: boolean) => void;
  isWdowiGroszModalOpen: boolean;
  setIsWdowiGroszModalOpen: (v: boolean) => void;
  isKatarzynaFedkowModalOpen: boolean;
  setIsKatarzynaFedkowModalOpen: (v: boolean) => void;
  isEMIMediaModalOpen: boolean;
  setIsEMIMediaModalOpen: (v: boolean) => void;
  isCentralChatOpen: boolean;
  setIsCentralChatOpen: (v: boolean) => void;
  isBiblicalSchoolOpen: boolean;
  setIsBiblicalSchoolOpen: (v: boolean) => void;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (v: boolean) => void;
  isManagementCenterOpen: boolean;
  setIsManagementCenterOpen: (v: boolean) => void;
  isUserPanelOpen: boolean;
  setIsUserPanelOpen: (v: boolean) => void;
  isBibleAdOpen: boolean;
  setIsBibleAdOpen: (v: boolean) => void;
  isDailyVerseModalOpen: boolean;
  setIsDailyVerseModalOpen: (v: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (v: boolean) => void;
  isHelpingHandModalOpen: boolean;
  setIsHelpingHandModalOpen: (v: boolean) => void;
  isStudioDobregoSlowaModalOpen: boolean;
  setIsStudioDobregoSlowaModalOpen: (v: boolean) => void;
  isCoachingModalOpen: boolean;
  setIsCoachingModalOpen: (v: boolean) => void;
  isInstallationGuideOpen: boolean;
  setIsInstallationGuideOpen: (v: boolean) => void;
  isTutorialOpen: boolean;
  setIsTutorialOpen: (v: boolean) => void;
  isStoreModalOpen: boolean;
  setIsStoreModalOpen: (v: boolean) => void;
  isReadingRoomOpen: boolean;
  setIsReadingRoomOpen: (v: boolean) => void;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  isOpenLetterOpen: boolean;
  setIsOpenLetterOpen: (v: boolean) => void;
  isCcNewsModalOpen: boolean;
  setIsCcNewsModalOpen: (v: boolean) => void;
  isEcosystemMapOpen: boolean;
  setIsEcosystemMapOpen: (v: boolean) => void;
  isStrategicPartnersOpen: boolean;
  setIsStrategicPartnersOpen: (v: boolean) => void;
  isZbyszekGieronOpen: boolean;
  setIsZbyszekGieronOpen: (v: boolean) => void;
  isSmsSubscriptionModalOpen: boolean;
  setIsSmsSubscriptionModalOpen: (v: boolean) => void;
  isPrayerIntentionsOpen: boolean;
  setIsPrayerIntentionsOpen: (v: boolean) => void;
  isShabbatModalOpen: boolean;
  setIsShabbatModalOpen: (v: boolean) => void;
  isVerseSearchOpen: boolean;
  setIsVerseSearchOpen: (v: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  isFarewellScreenOpen: boolean;
  setIsFarewellScreenOpen: (v: boolean) => void;
  currentView: string;
  setCurrentView: (v: any) => void;
}

export function useAndroidBackButton(props: UseAndroidBackButtonProps) {
  const propsRef = useRef(props);
  
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    let backPressCount = 0;
    let backPressTimer: any = null;

    if (typeof window === "undefined" || !CapacitorApp) {
        return;
    }

    const backButtonListener = CapacitorApp.addListener(
      "backButton",
      ({ canGoBack: _canGoBack }) => {
        const p = propsRef.current;
        // 1. Hierarchia zamykania modali i paneli (od najbardziej zagnieżdżonych/ważnych)
        if (p.isLessonReadingModalOpen) return p.setIsLessonReadingModalOpen(false);
        if (p.isYouTubeLiveModalOpen) return p.setIsYouTubeLiveModalOpen(false);
        if (p.isSpotifyModalOpen) return p.setIsSpotifyModalOpen(false);
        if (p.isMatrixOpen) return p.setIsMatrixOpen(false);
        if (p.isBusinessCardOpen) return p.setIsBusinessCardOpen(false);
        if (p.isAdminPinModalOpen) return p.setIsAdminPinModalOpen(false);
        if (p.isGamesModalOpen) return p.setIsGamesModalOpen(false);
        if (p.isMyFilesModalOpen) return p.setIsMyFilesModalOpen(false);
        if (p.isWeeklyScheduleModalOpen) return p.setIsWeeklyScheduleModalOpen(false);
        if (p.isApiKeyModalOpen) return p.setIsApiKeyModalOpen(false);
        if (p.isTvStudyModalOpen) return p.setIsTvStudyModalOpen(false);
        if (p.isCcResourcesModalOpen) return p.setIsCcResourcesModalOpen(false);
        if (p.isWdowiGroszModalOpen) return p.setIsWdowiGroszModalOpen(false);
        if (p.isKatarzynaFedkowModalOpen) return p.setIsKatarzynaFedkowModalOpen(false);
        if (p.isEMIMediaModalOpen) return p.setIsEMIMediaModalOpen(false);
        if (p.isCentralChatOpen) return p.setIsCentralChatOpen(false);
        if (p.isBiblicalSchoolOpen) return p.setIsBiblicalSchoolOpen(false);
        if (p.isVoiceAssistantOpen) return p.setIsVoiceAssistantOpen(false);
        if (p.isManagementCenterOpen) return p.setIsManagementCenterOpen(false);
        if (p.isUserPanelOpen) return p.setIsUserPanelOpen(false);
        if (p.isBibleAdOpen) return p.setIsBibleAdOpen(false);
        if (p.isDailyVerseModalOpen) return p.setIsDailyVerseModalOpen(false);
        if (p.isSupportModalOpen) return p.setIsSupportModalOpen(false);
        if (p.isHelpingHandModalOpen) return p.setIsHelpingHandModalOpen(false);
        if (p.isStudioDobregoSlowaModalOpen) return p.setIsStudioDobregoSlowaModalOpen(false);
        if (p.isCoachingModalOpen) return p.setIsCoachingModalOpen(false);
        if (p.isInstallationGuideOpen) return p.setIsInstallationGuideOpen(false);
        if (p.isTutorialOpen) return p.setIsTutorialOpen(false);
        if (p.isStoreModalOpen) return p.setIsStoreModalOpen(false);
        if (p.isReadingRoomOpen) return p.setIsReadingRoomOpen(false);
        if (p.isUpdateModalOpen) return p.setIsUpdateModalOpen(false);
        if (p.isOpenLetterOpen) return p.setIsOpenLetterOpen(false);
        if (p.isCcNewsModalOpen) return p.setIsCcNewsModalOpen(false);
        if (p.isEcosystemMapOpen) return p.setIsEcosystemMapOpen(false);
        if (p.isStrategicPartnersOpen) return p.setIsStrategicPartnersOpen(false);
        if (p.isZbyszekGieronOpen) return p.setIsZbyszekGieronOpen(false);
        if (p.isSmsSubscriptionModalOpen) return p.setIsSmsSubscriptionModalOpen(false);
        if (p.isPrayerIntentionsOpen) return p.setIsPrayerIntentionsOpen(false);
        if (p.isShabbatModalOpen) return p.setIsShabbatModalOpen(false);
        if (p.isVerseSearchOpen) return p.setIsVerseSearchOpen(false);
        if (p.isSidebarOpen) return p.setIsSidebarOpen(false);
        if (p.isFarewellScreenOpen) return p.setIsFarewellScreenOpen(false);

        // 2. Jeśli jesteśmy w widoku innym niż startowy (Radio)
        if (p.currentView !== "radio") {
          p.setCurrentView("radio");
          return;
        }

        // 3. Obsługa wyjścia (Press to show Farewell)
        if (!p.isFarewellScreenOpen) {
          p.setIsFarewellScreenOpen(true);
        } else {
          CapacitorApp.exitApp();
        }
      },
    );

    return () => {
      backButtonListener.then((l) => l.remove());
      if (backPressTimer) clearTimeout(backPressTimer);
    };
  }, []);
}
