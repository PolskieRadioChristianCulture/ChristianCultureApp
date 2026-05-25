import React from "react";
import { DashboardVerseGraphic } from "./DashboardVerseGraphic";
import { RadioModePlayer } from "./RadioModePlayer";

import { SupportedLanguage } from "../types";

interface MobileLandscapeCarModeProps {
  dailyVerse: any;
  uiLang: SupportedLanguage;
  addToast: any;
  radio: any;
  userPersona: any;
  spatialMode: any;
  setSpatialMode: any;
  equalizer: any;
  setEqualizer: any;
  setCurrentView: any;
  openCentralChat: any;
}

export default function MobileLandscapeCarMode({
  dailyVerse,
  uiLang,
  addToast,
  radio,
  userPersona,
  spatialMode,
  setSpatialMode,
  equalizer,
  setEqualizer,
  setCurrentView,
  openCentralChat,
}: MobileLandscapeCarModeProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black vw-100 vh-100 overflow-hidden flex flex-col pointer-events-auto">
      {/* Scrollable Container */}
      <div className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scroll-smooth hide-scrollbar">
        {/* Panel 1: Radio Odtwarzacz */}
        <div className="w-screen h-full min-w-[100vw] flex-shrink-0 snap-center p-4 flex items-center justify-center bg-black">
          <div className="w-full max-w-3xl h-full flex flex-col justify-center relative">
            <div className="absolute right-2 bottom-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs font-semibold uppercase tracking-widest pointer-events-none flex items-center gap-2 animate-pulse z-50">
              Werset
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>

            {/* Uproszczony lub standardowy widok Radia */}
            <div className="w-full h-full scale-90 md:scale-100 flex items-center justify-center">
              <RadioModePlayer
                isRadioPlaying={radio.isRadioPlaying}
                onToggleRadio={radio.toggleRadio}
                onOpenSupport={() => {}}
                onShareRadio={() => {}}
                appLanguage={uiLang}
                activeStream={radio.activeStream}
                onSwitchStream={(s) => radio.playStream(s)}
                onOpenLeftPanel={() => {}}
                onOpenRightPanel={() => {}}
                onOpenManagement={() => {}}
                onOpenBiblicalSchool={() => {}}
                onOpenVerseSearch={() => {}}
                userPersona={userPersona}
                dailyVerse={dailyVerse}
                onRefreshDailyVerse={() => {}}
                onOpenVoiceAssistant={() => {}}
                isMiriamUnlocked={true}
                radioAlarm={radio.radioAlarm}
                installStatus="installed"
                onInstallClick={() => {}}
                onOpenDailyVerseModal={() => {}}
                onOpenSmsSubscriptionModal={() => {}}
                onOpenStore={() => {}}
                onOpenReadingRoom={() => {}}
                onOpenYouTubeLiveModal={() => {}}
                onOpenGames={() => {}}
                unreadNotificationsCount={0}
                onBibleSearch={() => {}}
                onEcosystemAction={() => {}}
                visualMode="standard"
                isTickerExpanded={false}
                incomingBubbles={[]}
                onRemoveBubble={() => {}}
                onReplyBubble={() => {}}
                showMatrix={false}
                onMatrixToggle={() => {}}
                volume={radio.volume}
                onVolumeChange={radio.updateVolume}
                isLandscape={true}
                spatialMode={spatialMode}
                onSpatialModeChange={setSpatialMode}
                equalizer={equalizer}
                onEqualizerChange={setEqualizer}
                onOpenCommunity={() => setCurrentView("community")}
                onOpenCentralChat={openCentralChat}
                liveUsers={[]}
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Werset Dnia */}
        <div className="w-screen h-full min-w-[100vw] flex-shrink-0 snap-center p-4 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]">
          <div className="w-full max-w-3xl h-full flex flex-col justify-center relative">
            <DashboardVerseGraphic
              verse={dailyVerse}
              appLanguage={uiLang === "pl" || uiLang === "en" ? uiLang : "en"}
              addToast={addToast}
            />
            {/* Minimalistyczny Wskaźnik "Przesuń po Radio" w rogu */}
            <div className="absolute left-2 bottom-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs font-semibold uppercase tracking-widest pointer-events-none flex items-center gap-2 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Radio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
