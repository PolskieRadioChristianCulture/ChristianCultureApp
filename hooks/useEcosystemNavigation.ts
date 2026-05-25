import { useCallback } from 'react';
import { RadioStreamType } from '../types';

interface EcosystemNavigationProps {
  radio: any;
  setModalOpen: (name: string, isOpen: boolean) => void;
  setCurrentView: (view: any) => void;
  setYoutubeInitialSource: (source: any) => void;
  openManagement: (tab: any) => void;
}

export const useEcosystemNavigation = ({
  radio,
  setModalOpen,
  setCurrentView,
  setYoutubeInitialSource,
  openManagement
}: EcosystemNavigationProps) => {

  const handleEcosystemNavigation = useCallback((action: string) => {
    const [type, target] = action.split(":");

    if (type === "radio") {
      if (target === "play") radio.toggleRadio();
      if (target === "stop" && radio.isRadioPlaying) radio.toggleRadio();
      return;
    }

    if (type === "open") {
      switch (target) {
        case "business_card": setModalOpen("businessCard", true); break;
        case "zbyszek_gieron": setModalOpen("zbyszekGieron", true); break;
        case "katarzyna_fedkow":
          if (radio.isRadioPlaying) radio.toggleRadio();
          setModalOpen("katarzynaFedkow", true);
          break;
        case "emi_media":
          if (radio.isRadioPlaying) radio.toggleRadio();
          setModalOpen("emiMedia", true);
          break;
        case "slideshow": setModalOpen("slideshow", true); break;
        case "yellow_card": setModalOpen("yellowCard", true); break;
        case "wikifaith": window.open("https://wikifaith.org/pl", "_blank"); break;
        case "bible_courses": window.open("https://kursybiblijne.pl/", "_blank"); break;
        case "notifications": openManagement("notifications"); break;
        case "bible": setModalOpen("verseSearch", true); break;
        case "my_files": setModalOpen("myFiles", true); break;
        case "wdowi_grosz": setModalOpen("wdowiGrosz", true); break;
        case "resources_cc": setModalOpen("ccResources", true); break;
        case "media_player_page": setModalOpen("ccMediaPlayerPage", true); break;
        case "patrons_page": setModalOpen("ccPatronsPage", true); break;
        case "daily_reflections_pdf":
          window.open("https://drive.google.com/file/d/1gxrZFQHNnbQR6r0sBta42u-AiQQvdaQM/view?usp=sharing", "_blank");
          break;
      }
      return;
    }

    if (type === "navigate") {
      switch (target) {
        case "school": setModalOpen("biblicalSchool", true); break;
        case "chat": setModalOpen("centralChat", true); break;
        case "mentor": setModalOpen("voiceAssistant", true); break;
        case "support": setModalOpen("support", true); break;
        case "helping-hand": setModalOpen("helpingHand", true); break;
        case "studio-ds": setModalOpen("studioDobregoSlowa", true); break;
        case "coaching": setModalOpen("coaching", true); break;
        case "profile": openManagement("profile"); break;
        case "dashboard": setCurrentView("dashboard"); break;
        case "spotify": setModalOpen("spotify", true); break;
        case "testimonies":
          setYoutubeInitialSource("testimonies");
          setModalOpen("youtubeLive", true);
          break;
        case "radio": setCurrentView("radio"); break;
        case "store": setModalOpen("store", true); break;
        case "ecosystem-map":
        case "live-global": setModalOpen("liveGlobalMap", true); break;
        case "reading-room": setModalOpen("readingRoom", true); break;
        case "law-decalogue": setModalOpen("lawDecalogue", true); break;
        case "imagination-studio": setCurrentView("imagination-studio"); break;
        case "song-creator": setCurrentView("song-creator"); break;
        case "biblia": setModalOpen("verseSearch", true); break;
        case "news": setModalOpen("ccNews", true); break;
        case "calendar": setModalOpen("weeklySchedule", true); break;
        case "open-letter": setModalOpen("openLetter", true); break;
        case "partners": setModalOpen("strategicPartners", true); break;
        case "sms": setModalOpen("smsSubscription", true); break;
      }
    }
  }, [radio, setModalOpen, setCurrentView, setYoutubeInitialSource, openManagement]);

  return { handleEcosystemNavigation };
};
