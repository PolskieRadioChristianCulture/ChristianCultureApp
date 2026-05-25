import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mic, Send, Sparkles } from "lucide-react";
import { MIRIAM_AVATAR_URL, SupportedLanguage, fixOrphans } from "../types";

interface MiriamChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  appLanguage: SupportedLanguage;
  userName: string;
}

export const MiriamChatModal: React.FC<MiriamChatModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
  appLanguage,
  userName,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<
    { role: "user" | "miriam"; text: string }[]
  >([]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleAsk(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const handleAsk = async (textToAsk: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setHistory((prev) => [...prev, { role: "user", text: q }]);

    try {
      const response = await fetch("/api/miriam/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          language: appLanguage,
          userName: userName,
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setAnswer(data.answer);
        setHistory((prev) => [...prev, { role: "miriam", text: data.answer }]);
        setQuery("");
      }
    } catch (err) {
      console.error("Miriam Error:", err);
      setHistory((prev) => [
        ...prev,
        {
          role: "miriam",
          text:
            appLanguage === "pl"
              ? "Przepraszam, wystąpił problem z połączeniem."
              : "Sorry, there was a connection problem.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl h-[85vh] bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/20 rounded-[3rem] shadow-[0_0_100px_rgba(197,160,89,0.15)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={MIRIAM_AVATAR_URL}
                alt="Miriam"
                className="w-16 h-16 rounded-full border-2 border-[#C5A059] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                Miriam <span className="text-[#C5A059]">CC</span>
              </h2>
              <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.3em] mt-1">
                Asystentka Misji Christian Culture
              </p>
            </div>
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center glass rounded-full text-zinc-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-[#C5A059]/20"
          role="log"
          aria-live="polite"
        >
          {history.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <Sparkles className="w-16 h-16 text-[#C5A059]" />
              <p className="text-sm font-black uppercase tracking-widest text-[#C5A059] max-w-xs">
                {appLanguage === "pl"
                  ? "Zadaj pytanie o naszą misję lub funkcje tej aplikacji. Jestem tu, by Ci służyć."
                  : "Ask a question about our mission or features of this app. I am here to serve you."}
              </p>
            </div>
          )}

          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-6 rounded-[2rem] ${
                  msg.role === "user"
                    ? "bg-zinc-900 border border-white/5 text-white"
                    : "bg-[#C5A059]/10 border border-[#C5A059]/20 text-zinc-200"
                }`}
              >
                {msg.role === "miriam" && (
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={MIRIAM_AVATAR_URL}
                      className="w-5 h-5 rounded-full object-cover border border-[#C5A059]"
                      alt="Miriam"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                      Miriam CC
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {fixOrphans(msg.text)}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 p-6 rounded-[2rem] flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/60">
                  Miriam myśli...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-black/40 border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(query);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                appLanguage === "pl"
                  ? "Wpisz swoje pytanie..."
                  : "Type your question..."
              }
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-zinc-600"
            />
            <div className="absolute right-3 flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={`p-3 rounded-xl transition-all ${
                  query.trim() && !isLoading
                    ? "bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em]">
            Zasilane przez Gemini AI • Christian Culture Intelligence
          </p>
        </div>
      </motion.div>
    </div>
  );
};
