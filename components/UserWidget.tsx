import React from "react";
import { OnlineUser, fixOrphans, SupportedLanguage } from "../types";

interface UserWidgetProps {
  user: OnlineUser;
  isOnline: boolean;
  appLanguage: SupportedLanguage;
  isDisciple?: boolean;
  onClick: (user: OnlineUser) => void;
}

export const UserWidget: React.FC<UserWidgetProps> = ({
  user,
  isOnline,
  appLanguage,
  isDisciple,
  onClick,
}) => {
  const statusText = user.roleText
    ? user.roleText
    : isOnline
      ? appLanguage === "pl"
        ? "W sieci"
        : "Online"
      : appLanguage === "pl"
        ? "Zajęty"
        : "Offline";

  return (
    <div
      onClick={() => onClick(user)}
      className={`relative flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-500 cursor-pointer group glass
      ${
        isOnline
          ? "border-white/10 hover:bg-white/10 hover:border-[#C5A059]/40 shadow-xl"
          : "opacity-60 hover:opacity-100 border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 shadow-2xl
          ${isDisciple ? "border-[#C5A059]" : "border-white/10"}`}
        >
          <img
            src={user.avatar || "/ROGOWSKI.webp"}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/ROGOWSKI.webp";
            }}
          />
        </div>

        {/* Online/Status Indicator */}
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center
          ${isOnline ? "bg-green-500" : "bg-zinc-600"}`}
        >
          {isOnline && (
            <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-black block text-white uppercase tracking-tight truncate">
            {user.name}
          </span>
          {isDisciple && (
            <span className="text-[8px] px-2 py-0.5 bg-[#C5A059] text-white font-black rounded-full uppercase tracking-tighter shadow-lg shadow-[#C5A059]/20">
              PRO
            </span>
          )}
        </div>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] truncate mt-0.5
          ${isOnline ? "text-[#C5A059]" : "text-zinc-500"}`}
        >
          {statusText}
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#C5A059]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Decorative Glow for VIPs */}
      {isDisciple && isOnline && (
        <div className="absolute inset-0 bg-[#C5A059]/5 rounded-[2rem] pointer-events-none blur-md"></div>
      )}
    </div>
  );
};
