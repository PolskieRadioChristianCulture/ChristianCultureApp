import React from "react";
import { Button } from "../ui/button";
import { CommunityChat } from "../CommunityChat";
import { PrayerIntentions } from "../PrayerIntentions";
import { UserPersona } from "../../types";

interface CommunityViewProps {
  userPersona: UserPersona;
  setCurrentView: (view: any) => void;
  isIntentionsBarVisible: boolean;
  t: (key: string) => string;
}

export function CommunityView({
  userPersona,
  setCurrentView,
  isIntentionsBarVisible,
  t,
}: CommunityViewProps) {
  return (
    <div
      className={`w-full h-full flex flex-col overflow-y-auto px-4 pt-4 ${isIntentionsBarVisible ? "sm:pt-20" : "sm:pt-8"} pb-20 scrollbar-thin animate-fade-in`}
    >
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("radio")}
          className="text-gold hover:bg-gold/10 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
          {t("community.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        <div className="space-y-8">
          <CommunityChat
            userName={userPersona.name}
            userAvatar={userPersona.profilePicture}
          />
        </div>
        <div className="space-y-8">
          <PrayerIntentions
            userId={userPersona.googleEmail || "guest"}
            userName={userPersona.name}
          />
        </div>
      </div>
    </div>
  );
}
