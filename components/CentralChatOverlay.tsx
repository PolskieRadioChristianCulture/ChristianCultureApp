import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityChat } from "./CommunityChat";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface CentralChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar?: string;
  initialView?:
    | "lobby"
    | "global"
    | "private_list"
    | "private_chat"
    | "search"
    | "invitations"
    | "all_users";
  initialUserId?: string;
  initialMessage?: string;
  onOpenUserPanel?: (uid: string) => void;
  isTickerExpanded?: boolean;
}

export const CentralChatOverlay: React.FC<CentralChatOverlayProps> = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
  initialView,
  initialUserId,
  initialMessage,
  onOpenUserPanel,
  isTickerExpanded = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed bottom-0 left-0 right-0 z-[1999] bg-black/40 backdrop-blur-md ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-[50px] left-[5%] right-[5%] sm:left-[2.5%] sm:right-[2.5%] max-w-4xl mx-auto bg-[#0F0F0F]/95 border border-[#C5A059] rounded-[15px] z-[2000] shadow-[0_0_20px_rgba(197,160,89,0.3)] flex flex-col overflow-hidden ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                  Społeczność Live
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Zamknij czat"
                onClick={onClose}
                className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Content - we need to make CommunityChat take full height */}
            <div className="flex-1 overflow-hidden">
              <CommunityChat
                userName={userName}
                userAvatar={userAvatar}
                fullHeight={true}
                initialView={initialView}
                initialUserId={initialUserId}
                initialMessage={initialMessage}
                onClose={onClose}
                onOpenUserPanel={onOpenUserPanel}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
