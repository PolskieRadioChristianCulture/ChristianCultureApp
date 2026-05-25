import React, { useState, useEffect, useMemo } from "react";
import { SystemNotification, fixOrphans, SupportedLanguage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface NotificationCascadeProps {
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  appLanguage: SupportedLanguage;
  isIntentionsVisible?: boolean;
}

export const NotificationCascade: React.FC<NotificationCascadeProps> = ({
  notifications,
  onMarkRead,
  appLanguage,
  isIntentionsVisible = false,
}) => {
  const unreadNotifications = useMemo(
    () =>
      notifications
        .filter((n) => !n.isRead)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
    [notifications],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (unreadNotifications.length > 0 && !isVisible) {
      setCurrentIndex(0);
      setIsVisible(true);
    } else if (unreadNotifications.length === 0) {
      setIsVisible(false);
    }
  }, [unreadNotifications.length, isVisible]);

  if (!isVisible || unreadNotifications.length === 0) return null;

  const currentNotif = unreadNotifications[currentIndex];
  if (!currentNotif) return null;

  const handleNext = () => {
    onMarkRead(currentNotif.id);
    if (currentIndex < unreadNotifications.length - 1) {
      // Stay visible, but the memo will re-filter and we'll show the next one at index 0
      // Actually, since we mark as read, the unreadNotifications array will change.
      // So we should keep currentIndex at 0.
    } else {
      setIsVisible(false);
    }
  };

  const handleAction = () => {
    if (
      currentNotif &&
      currentNotif.action &&
      typeof currentNotif.action.onClick === "function"
    ) {
      try {
        currentNotif.action.onClick();
      } catch (err) {
        console.error("[Notification] Error executing action:", err);
      }
    }
    handleNext();
  };

  const topClass = isIntentionsVisible
    ? "top-[60px] sm:top-[112px]"
    : "top-4 sm:top-8";

  return (
    <AnimatePresence>
      {isVisible && currentNotif && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed ${topClass} inset-x-0 z-[6000] px-0 sm:px-6 flex justify-center pointer-events-none`}
        >
          <motion.div
            className="pointer-events-auto w-full max-w-2xl bg-transparent sm:rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, info) => {
              if (
                Math.abs(info.offset.x) > 80 ||
                Math.abs(info.velocity.x) > 500
              ) {
                handleNext();
              }
            }}
          >
            {/* Animated glowing snake border */}
            <div
              className="absolute inset-[-500%] z-0 rounded-full animate-[spin_8s_linear_infinite]"
              style={{
                background:
                  currentNotif.type === "alert"
                    ? "conic-gradient(from 0deg, transparent 0 270deg, rgba(220,38,38,0.1) 270deg 330deg, #dc2626 360deg)"
                    : "conic-gradient(from 0deg, transparent 0 270deg, rgba(197,160,89,0.1) 270deg 330deg, #C5A059 360deg)",
              }}
            />
            <div
              className={`absolute inset-[1px] rounded-none sm:rounded-[calc(2rem-1px)] z-0 pointer-events-none bg-gradient-to-br ${currentNotif.type === "alert" ? "from-red-950 via-[#1a0505] to-black" : "from-zinc-900 via-[#0a0a0a] to-black"} shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl`}
            />

            <div className="relative z-10 p-4 sm:p-6 flex flex-col">
              {/* Premium Header Line */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${currentNotif.type === "alert" ? "via-red-500/50" : "via-[#C5A059]/50"} to-transparent`}
              ></div>

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 bg-zinc-900 rounded-xl border ${currentNotif.type === "alert" ? "border-red-500/50 bg-red-900/20 text-white" : "border-[#C5A059]/30 text-lg"} flex items-center justify-center shadow-lg pb-0.5`}
                  >
                    {currentNotif.icon}
                  </div>
                  <div>
                    <h3
                      className={`${currentNotif.type === "alert" ? "text-red-500" : "text-[#C5A059]"} font-black text-[8px] uppercase tracking-[0.3em] mb-0.5 animate-pulse`}
                    >
                      {appLanguage === "pl"
                        ? "POWIADOMIENIE SYSTEMOWE CC"
                        : "CC SYSTEM NOTIFICATION"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[8px] font-bold ${currentNotif.type === "alert" ? "text-white" : "text-[#C5A059]"} uppercase tracking-widest`}
                      >
                        {unreadNotifications.length > 1
                          ? `${currentIndex + 1} / ${unreadNotifications.length}`
                          : appLanguage === "pl"
                            ? "NOWE"
                            : "NEW"}
                      </span>
                      <div className="w-0.5 h-0.5 rounded-full bg-zinc-700"></div>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                        {new Date(currentNotif.timestamp).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  aria-label="Ulubione"
                  onClick={handleNext}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-1 mb-4">
                <h2
                  className={`text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight italic drop-shadow-[0_2px_4px_${currentNotif.type === "alert" ? "rgba(220,38,38,0.5)" : "rgba(197,160,89,0.3)"}]`}
                >
                  {currentNotif.title}
                </h2>
                <p
                  className={`${currentNotif.type === "alert" ? "text-red-100" : "text-zinc-400"} text-[11px] sm:text-xs leading-relaxed font-medium italic line-clamp-2`}
                >
                  {fixOrphans(currentNotif.message)}
                </p>
              </div>

              <div className="flex gap-2">
                {currentNotif.actions ? (
                  currentNotif.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (act && typeof act.onClick === "function") {
                          try {
                            act.onClick();
                          } catch (err) {
                            console.error(
                              "[Notification] Error executing multi-action:",
                              err,
                            );
                          }
                        }
                        handleNext();
                      }}
                      className={`flex-1 py-2.5 ${currentNotif.type === "alert" ? "bg-red-600" : "bg-[#C5A059]"} text-white font-black text-[9px] uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}
                    >
                      {act.label}
                    </button>
                  ))
                ) : (
                  <>
                    {currentNotif.action && (
                      <button
                        onClick={handleAction}
                        className={`flex-1 py-2.5 ${currentNotif.type === "alert" ? "bg-red-600" : "bg-[#C5A059]"} text-white font-black text-[9px] uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}
                      >
                        {currentNotif.action.label}
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className={`flex-1 py-2.5 ${currentNotif.action ? "bg-zinc-900 text-zinc-400" : currentNotif.type === "alert" ? "bg-red-600 text-white" : "bg-[#C5A059] text-white"} font-black text-[9px] uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all border border-white/5`}
                    >
                      {unreadNotifications.length > 1
                        ? appLanguage === "pl"
                          ? "NASTĘPNE"
                          : "NEXT"
                        : appLanguage === "pl"
                          ? "ZAMKNIJ"
                          : "CLOSE"}
                    </button>
                  </>
                )}
              </div>

              {unreadNotifications.length > 1 && (
                <div className="mt-3 flex justify-center">
                  <div className="flex gap-1">
                    {unreadNotifications.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-0.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-4 bg-[#C5A059]" : "w-1 bg-zinc-800"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
