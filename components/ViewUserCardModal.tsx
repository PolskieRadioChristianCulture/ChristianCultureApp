import React from "react";
import {
  OnlineUser,
  ToastMessage,
  fixOrphans,
  MIRIAM_AVATAR_URL,
  CZAREK_AVATAR_URL,
  SupportedLanguage,
} from "../types";

interface ViewUserCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlineUser: OnlineUser | null;
  appLanguage: SupportedLanguage;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  onOpenCCTextAssistant: (targetAssistantId: string) => void;
  onOpenCCVoiceAssistant: (targetAssistantId: string) => void;
  onOpenCentralChat: (view?: any, userId?: string, message?: string) => void;
  isTickerExpanded?: boolean;
  onOpenBusinessCard?: () => void;
}

export const ViewUserCardModal: React.FC<ViewUserCardModalProps> = ({
  isOpen,
  onClose,
  onlineUser,
  appLanguage,
  addToast,
  onOpenCCTextAssistant,
  onOpenCCVoiceAssistant,
  onOpenCentralChat,
  isTickerExpanded = false,
  onOpenBusinessCard,
}) => {
  if (!isOpen || !onlineUser) return null;

  const isCCAssistant = onlineUser.id === "miriam-ai";
  const isAdmin = onlineUser.id === "nazir-admin";
  const isMe = onlineUser.id === "me";

  let avatarUrl = isCCAssistant
    ? MIRIAM_AVATAR_URL
    : isAdmin
      ? CZAREK_AVATAR_URL
      : onlineUser.avatar;

  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    avatarUrl = "/ROGOWSKI.jpg";
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[2001] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-0 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-4xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border-0 sm:border border-white/10 sm:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header Image with Gradient */}
        <div className="relative h-48 sm:h-72 bg-gradient-to-br from-[#C5A059]/20 to-black overflow-hidden flex-shrink-0">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${avatarUrl})` }}
          ></div>
          <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-6">
            <div
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-zinc-950 shadow-2xl relative
                ${isAdmin || isCCAssistant ? "border-[#C5A059] animate-floating-button-pulse" : "border-white/10"}`}
            >
              <img
                src={avatarUrl}
                alt={onlineUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/ROGOWSKI.jpg";
                }}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                {onlineUser.name}
                {(isAdmin || isCCAssistant) && (
                  <span className="text-[#C5A059] text-2xl">✨</span>
                )}
              </h2>
              <p className="text-[12px] font-black text-[#C5A059] uppercase tracking-[0.4em]">
                {onlineUser.roleText ||
                  (appLanguage === "pl"
                    ? "Współpracownik CC"
                    : "CC Contributor")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 pt-12 space-y-8">
          <div className="w-full max-w-2xl mx-auto py-6 px-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 space-y-4">
            <p className="text-zinc-300 text-sm italic leading-relaxed text-center">
              {isCCAssistant
                ? appLanguage === "pl"
                  ? '"Jestem Twoją asystentką w drodze do uświęcenia. Rozmawiaj ze mną głosowo w panelu głównym."'
                  : '"I am your assistant on the path to sanctification. Talk to me in the main panel."'
                : appLanguage === "pl"
                  ? '"Niech Jahwe Cię błogosławi i strzeże. Dobrze, że jesteś we wspólnocie Christian Culture."'
                  : '"May the Lord bless you and keep you. Good to have you in the CC community."'}
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto">
            {isCCAssistant ? (
              <button
                onClick={() => {
                  onOpenCCVoiceAssistant(onlineUser.id);
                  onClose();
                }}
                className="w-full py-5 bg-[#C5A059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                ROZMAWIAJ Z MIRIAM CC
              </button>
            ) : isMe ? (
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-public-profile", {
                      detail: {
                        uid:
                          onlineUser.id === "me"
                            ? (window as any).cc_current_uid || "me"
                            : onlineUser.id,
                      },
                    }),
                  );
                  onClose();
                }}
                className="w-full py-5 bg-[#C5A059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all"
              >
                TWOJA WIZYTÓWKA PUBLICZNA
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("open-public-profile", {
                        detail: { uid: onlineUser.id },
                      }),
                    );
                    onClose();
                  }}
                  className="w-full py-5 bg-[#C5A059] text-black border border-[#C5A059] font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#E2B859] transition-all"
                >
                  ZOBACZ PROFIL PUBLICZNY
                </button>
                <button
                  onClick={() => {
                    onOpenCentralChat(
                      "global",
                      onlineUser.id,
                      `Pozdrawiam Cię w Jahwe, ${onlineUser.name}! ✨`,
                    );
                    onClose();
                  }}
                  className="w-full py-5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-800 transition-all mb-4"
                >
                  WYŚLIJ POZDROWIENIE
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 py-5 bg-zinc-900 border border-white/10 hover:border-[#C5A059]/30 text-zinc-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800"
            >
              Zamknij profil
            </button>
          </div>
        </div>

        <div className="absolute top-6 right-8 flex items-center gap-2">
          {onOpenBusinessCard && (
            <button
              onClick={() => {
                onClose();
                onOpenBusinessCard();
              }}
              className="w-12 h-12 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-full text-[#E2B859] shadow-lg hover:bg-[#E2B859] hover:text-black transition-all border border-[#E2B859]/30 active:scale-90 cursor-pointer"
              title="Wizytówka Twórcy CC"
            >
              <span className="font-black text-sm tracking-tighter leading-none mt-0.5">
                CC
              </span>
            </button>
          )}
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-4 text-zinc-500 hover:text-white transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
