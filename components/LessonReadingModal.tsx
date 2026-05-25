import React, { useState, useEffect, useRef } from "react";
import { fixOrphans, SupportedLanguage } from "../types";

interface LessonReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | null;
  imageUrl?: string | null;
  content: string | null;
  loading: boolean;
  appLanguage: SupportedLanguage;
  onSpeakLesson: (title: string, content: string) => void;
  isMiriamSpeaking: boolean;
  onLessonComplete?: () => void;
  isTickerExpanded?: boolean;
}

export const getHeroImageForLesson = (title: string | null): string => {
  if (!title) return "/backgrounds/6.webp";

  const normalized = title.toLowerCase();

  // Specific longer phrases first
  if (
    normalized.includes("wielki bój") ||
    normalized.includes("great controversy")
  )
    return "/lessons/8.webp";
  if (
    normalized.includes("natura ludzka") ||
    normalized.includes("nature of humanity")
  )
    return "/lessons/7.webp";
  if (normalized.includes("nowa ziemia") || normalized.includes("new earth"))
    return "/lessons/28.webp";
  if (normalized.includes("tysiąclecie") || normalized.includes("millennium"))
    return "/lessons/27.webp";

  // Lesson 26 vs Lesson 9 (both have death/resurrection keywords)
  if (
    normalized.includes("śmierć i zmartwychwstanie") &&
    !normalized.includes("chrystusa")
  )
    return "/lessons/26.webp";
  if (
    normalized.includes("życie, śmierć i zmartwychwstanie") ||
    normalized.includes("life, death and resurrection")
  )
    return "/lessons/9.webp";

  // 28 Beliefs Categories
  if (normalized.includes("powtórne") || normalized.includes("second coming"))
    return "/lessons/25.webp";
  if (normalized.includes("świątyni") || normalized.includes("sanctuary"))
    return "/lessons/24.webp";
  if (
    normalized.includes("małżeństwo") ||
    normalized.includes("marriage") ||
    normalized.includes("rodzina") ||
    normalized.includes("family")
  )
    return "/lessons/23.webp";
  if (normalized.includes("zachowanie") || normalized.includes("behavior"))
    return "/lessons/22.webp";
  if (normalized.includes("szafarstwo") || normalized.includes("stewardship"))
    return "/lessons/21.webp";
  if (normalized.includes("szabat") || normalized.includes("sabbath"))
    return "/lessons/20.webp";
  if (normalized.includes("prawo") || normalized.includes("law"))
    return "/lessons/19.webp";
  if (normalized.includes("proroctwa") || normalized.includes("prophecy"))
    return "/lessons/18.webp";
  if (
    normalized.includes("dary") ||
    normalized.includes("gifts") ||
    normalized.includes("posługi")
  )
    return "/lessons/17.webp";
  if (normalized.includes("wieczerza") || normalized.includes("supper"))
    return "/lessons/16.webp";
  if (normalized.includes("chrzest") || normalized.includes("baptism"))
    return "/lessons/15.webp";
  if (normalized.includes("jedność") || normalized.includes("unity"))
    return "/lessons/14.webp";
  if (normalized.includes("ostatek") || normalized.includes("remnant"))
    return "/lessons/13.webp";
  if (normalized.includes("kościół") || normalized.includes("church"))
    return "/lessons/12.webp";
  if (normalized.includes("wzrastanie") || normalized.includes("growing"))
    return "/lessons/11.webp";
  if (normalized.includes("zbawienia") || normalized.includes("salvation"))
    return "/lessons/10.webp";
  if (
    normalized.includes("zmartwychwstanie") ||
    normalized.includes("resurrection")
  )
    return "/lessons/9.webp";
  if (normalized.includes("stworzenie") || normalized.includes("creation"))
    return "/lessons/6.webp";
  if (normalized.includes("duch") || normalized.includes("spirit"))
    return "/lessons/5.webp";
  if (normalized.includes("syn") || normalized.includes("son"))
    return "/lessons/4.webp";
  if (normalized.includes("ojciec") || normalized.includes("father"))
    return "/lessons/3.webp";
  if (
    normalized.includes("trójca") ||
    normalized.includes("trinity") ||
    normalized.includes("trójjedynym")
  )
    return "/lessons/2.webp";
  if (
    normalized.includes("pismo święte") ||
    normalized.includes("bible") ||
    normalized.includes("scriptures") ||
    normalized.includes("słowem")
  )
    return "/lessons/1.webp";

  // Other categories
  if (normalized.includes("modlitwy") || normalized.includes("prayer"))
    return "/backgrounds/2.webp";
  if (normalized.includes("postu") || normalized.includes("fasting"))
    return "/backgrounds/3.webp";
  if (normalized.includes("jezus") || normalized.includes("jesus"))
    return "/backgrounds/4.webp";
  if (normalized.includes("łaskę") || normalized.includes("grace"))
    return "/backgrounds/5.webp";
  if (normalized.includes("ostateczne") || normalized.includes("end times"))
    return "/backgrounds/7.webp";
  if (normalized.includes("posłannictwo") || normalized.includes("commission"))
    return "/backgrounds/8.webp";
  if (normalized.includes("świadectwo") || normalized.includes("witnessing"))
    return "/backgrounds/9.webp";

  return "/backgrounds/10.webp";
};

const renderMarkdownContent = (markdown: string) => {
  if (!markdown) return null;

  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\* (.*$)/gim, "<li>$1</li>")
    .replace(/__(.*?)__/gim, "<strong>$1</strong>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/_(.*?)_/gim, "<em>$1</em>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>");

  html = html.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />");
  html = `<p>${html}</p>`;

  // Restyling based on new premium aesthetic
  html = html.replace(
    /<h1/g,
    '<h1 class="mt-12 mb-6 text-4xl sm:text-5xl font-black text-[#C5A059] uppercase tracking-tighter"',
  );
  html = html.replace(
    /<h2/g,
    '<h2 class="mt-10 mb-4 text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter border-b border-zinc-800 pb-3"',
  );
  html = html.replace(
    /<h3/g,
    '<h3 class="mt-8 mb-3 text-xl sm:text-2xl font-bold text-white tracking-tight"',
  );
  html = html.replace(
    /<li>/g,
    '<li class="ml-5 list-decimal text-zinc-300 font-serif leading-relaxed mb-1">',
  );
  html = html.replace(/<br \/>/g, '<div class="h-2"></div>');

  // Poprawa sierot w tekście i obsługa obrazów markdown
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/gim,
    '<img src="$2" alt="$1" style="width: 100%; border-radius: 1rem; margin: 2rem 0; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);" referrerPolicy="no-referrer" />',
  );

  return <div dangerouslySetInnerHTML={{ __html: fixOrphans(html) }} />;
};

export const LessonReadingModal: React.FC<LessonReadingModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  loading,
  appLanguage,
  onSpeakLesson,
  isMiriamSpeaking,
  onLessonComplete,
  imageUrl,
  isTickerExpanded = false,
}) => {
  const [fontSize, setFontSize] = useState<
    "text-base" | "text-lg" | "text-xl" | "text-2xl"
  >("text-xl");
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleScrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || "Christian Culture Biblical School",
          text:
            appLanguage === "pl"
              ? `Sprawdź lekcję: ${title}`
              : `Check out this lesson: ${title}`,
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[5000] bg-[#050505] overflow-y-auto overflow-x-hidden animate-fade-in text-zinc-200 scrollbar-thin flex flex-col ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      {/* Sticky Header for Mobile Comfort */}
      <div className="sticky top-0 left-0 w-full z-[100] p-4 flex justify-between items-center bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A059] hover:text-black transition-all shadow-lg active:scale-95"
            title={appLanguage === "pl" ? "Zamknij" : "Close"}
          >
            <svg
              className="w-5 h-5 ml-[-2px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest leading-none">
              Christian Culture
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-tight truncate max-w-[200px]">
              {title}
            </span>
          </div>
        </div>

        <button
          aria-label="Ulubione"
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg active:scale-95"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>

      {/* 1. LAYER: HERO BACKGROUND */}
      <div className="relative w-full h-[55vh] sm:h-[60vh] flex-shrink-0 mt-[calc(4rem+env(safe-area-inset-top,0px))]">
        <img
          src={imageUrl || getHeroImageForLesson(title)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-10000 z-0"
          style={{ filter: "brightness(0.65) contrast(1.1)" }}
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("backgrounds")) {
              target.src = "/backgrounds/6.webp";
            }
          }}
        />
        {/* Vignette & Blur Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-x from-black/40 via-transparent to-black/40 z-[2]" />

        {/* 3. LAYER: HERO CONTENT (Center aligned) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pt-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl max-w-4xl leading-tight">
            {loading
              ? appLanguage === "pl"
                ? "Ładowanie..."
                : "Loading..."
              : title}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3 sm:mt-5 drop-shadow-lg">
            Christian Culture Biblical School
          </p>

          <button
            aria-label="Ulubione"
            onClick={handleScrollToContent}
            disabled={loading}
            className="mt-8 sm:mt-10 px-12 py-4 bg-[#B8860B] text-black font-black text-sm sm:text-base uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(184,134,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-3"
          >
            {appLanguage === "pl" ? "Czytaj" : "Read Now"}
            <svg
              className="w-5 h-5 group-hover:translate-y-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 4. LAYER: CONTENT AREA */}
      <div className="flex-1 bg-[#050505] relative z-20" ref={contentRef}>
        <div className="max-w-4xl mx-auto px-6 sm:px-12 py-8 sm:py-16">
          {/* Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-zinc-800/50 pb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSpeakLesson(title || "", content || "")}
                disabled={loading || !content}
                className={`w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#B8860B] hover:bg-[#B8860B] hover:text-black transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isMiriamSpeaking ? "animate-pulse ring-2 ring-[#B8860B] ring-offset-2 ring-offset-[#050505]" : ""}`}
              >
                <svg
                  className="w-5 h-5 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
                {appLanguage === "pl" ? "Posłuchaj Lekcji" : "Listen to Lesson"}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/50 rounded-full px-4 py-2 border border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                {appLanguage === "pl" ? "Aa" : "Aa"}
              </span>
              {["text-lg", "text-xl", "text-2xl"].map((size, idx) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size as any)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${fontSize === size ? "bg-[#B8860B] text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Markdown Output */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 opacity-50">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-[#B8860B] rounded-full animate-spin"></div>
              <p className="text-sm font-black uppercase tracking-widest text-[#B8860B]">
                {appLanguage === "pl"
                  ? "Konstruowanie lekcji..."
                  : "Constructing lesson..."}
              </p>
            </div>
          ) : (
            <div
              className={`prose prose-invert max-w-none prose-p:font-serif prose-p:text-zinc-300 prose-p:leading-[1.8] prose-p:tracking-wide ${fontSize}`}
            >
              {/* 5. LIST VIEW STRUCTURE IS PART OF MARKDOWN RENDER CONTENT */}
              {renderMarkdownContent(content || "")}
            </div>
          )}

          {/* Ask Clergyman Section */}
          {!loading && content && (
            <div className="mt-16 pt-8 border-t border-zinc-900/50 flex flex-col items-center">
              <p className="text-zinc-400 text-sm italic font-serif text-center mb-6 max-w-lg">
                {appLanguage === "pl"
                  ? "Masz pytania dotyczące tej lekcji lub potrzebujesz wsparcia modlitewnego?"
                  : "Do you have questions about this lesson or need prayer support?"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="tel:+48608337477"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all border border-zinc-700/50"
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
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {appLanguage === "pl"
                    ? "Zadzwoń do Duchownego"
                    : "Call a Clergyman"}
                </a>
                <a
                  href="sms:+48608337477"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all border border-zinc-700/50"
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
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {appLanguage === "pl" ? "Wyślij SMS" : "Send SMS"}
                </a>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {!loading && content && (
            <div className="mt-12 pt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center gap-6 justify-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-zinc-300 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                {appLanguage === "pl" ? "Wróć do Panelu" : "Back to Dashboard"}
              </button>

              {onLessonComplete && (
                <button
                  onClick={() => onLessonComplete()}
                  className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#C5A059] to-[#B8860B] text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(184,134,11,0.2)]"
                >
                  {appLanguage === "pl" ? "Ukończ lekcję" : "Complete lesson"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
