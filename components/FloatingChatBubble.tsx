import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ref, onChildAdded, query, limitToLast, off } from "firebase/database";
import { rtdb } from "../firebase";

interface ChatMessage {
  id: string;
  text: string;
  userName: string;
  userAvatar?: string;
  timestamp: number;
}

interface FloatingChatBubbleProps {
  onOpenChat: () => void;
  isLandscape?: boolean;
}

export const FloatingChatBubble: React.FC<FloatingChatBubbleProps> = ({
  onOpenChat,
  isLandscape,
}) => {
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const messagesRef = ref(rtdb, "chat_messages");
    const recentMessagesQuery = query(messagesRef, limitToLast(1));

    let isInitialLoad = true;

    const unsubscribe = onChildAdded(recentMessagesQuery, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      const data = snapshot.val();
      if (data) {
        const newMessage: ChatMessage = {
          id: snapshot.key || Date.now().toString(),
          text: data.text || "",
          userName: data.userName || "Użytkownik",
          userAvatar:
            data.userAvatar ||
            `https://ui-avatars.com/api/?name=${data.userName}&background=random`,
          timestamp: data.timestamp || Date.now(),
        };

        setCurrentMessage(newMessage);
        setIsVisible(true);

        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Calculate bottom position based on layout
  // Portrait: bottom-20 (80px) + Matrix (50px) + Gap (16px) + RDS (56px) + 10px = 212px
  // Landscape: bottom-10 (40px) + Matrix (50px) + Gap (16px) + RDS (42px) + 10px = 158px
  const bottomPos = isLandscape ? "158px" : "212px";

  return (
    <AnimatePresence>
      {isVisible && currentMessage && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            opacity: { duration: 0.3 },
          }}
          onClick={onOpenChat}
          aria-label="Otwórz czat"
          className="fixed left-1/2 -translate-x-1/2 z-[2500] cursor-pointer"
          style={{ bottom: bottomPos }}
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-[10px] border border-[#C5A059] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-w-[280px] sm:max-w-[400px] border-solid">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A059]/40 flex-shrink-0 shadow-inner">
              <img
                src={currentMessage.userAvatar}
                alt={currentMessage.userName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col overflow-hidden pr-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-wider truncate">
                  {currentMessage.userName}
                </span>
                <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase">
                  NOW
                </span>
              </div>
              <p className="text-[11px] text-white font-medium truncate leading-tight">
                {currentMessage.text}
              </p>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
