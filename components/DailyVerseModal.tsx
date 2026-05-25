import React, { useState, useEffect, useCallback } from "react";
import {
  BibleVerse,
  fixOrphans,
  normalizeBibleReference,
  ToastMessage,
  splitVerseIntoLines,
  SupportedLanguage,
} from "../types";
import { BibleReadingPlanModal } from "./BibleReadingPlanModal";
import { X, Volume2, Share, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { PersistenceService } from "../services/persistenceService";
import { BibleService } from "../services/bibleService";
import { ChapterReadingModal } from "./ChapterReadingModal";
import { VerseImageGeneratorModal } from "./VerseImageGeneratorModal";
import { Separator } from "./Separator";
import { useAppStore } from "../useAppStore";
import { SchemaInjector } from "./SchemaInjector";

const getMotivationalComment = (dayIndex: number, lang: SupportedLanguage) => {
  const comments = {
    pl: [
      "Nie poddawaj się, Bóg walczy o Ciebie. Jesteś Bożym Wojownikiem.",
      "Niezależnie od tego, jak duży jest Twój Goliat, Jezus przychodzi z mocą. Zrób to Dla Jezusa – On już czeka.",
      "Dzisiejsze Słowo przypomina Ci, że w Chrystusie masz już zwycięstwo.",
      "Niech to Słowo uzbroi Twoje serce. Odrzuć lęk i stań z mocą do walki.",
      "Boża obietnica jest pewna. Bądź mężny i mocny!",
      "W Słowie jest życie. Użyj Go dziś jako miecza w swoich zmaganiach.",
      "Każdy dzień to nowa bitwa, ale i nowa łaska. Jesteś zwycięzcą w Tym, który Cię umiłował.",
      "Twoje wyzwania są tylko areną dla Bożych cudów. Uwierz w to Słowo!",
      "Stoisz po stronie Zwycięzcy. Podnieś głowę i idź naprzód z wiarą.",
      "Twoja wartość jest w Nim. Odrzuć wątpliwości – jesteś wybranym narzędziem w Jego rękach.",
      "Niech ten werset będzie Twoją tarczą na dzisiejsze trudy.",
      "Bóg nie daje ducha lęku, ale mocy. Wykorzystaj to dzisiaj!",
      "Zrób krok wiary. Kiedy Ty walczysz po stronie Nieba, Niebo walczy o Ciebie.",
      "Gdy On idzie przed Tobą, żadna przeszkoda nie jest zbyt trudna.",
      "Zbuduj swój dzisiejszy dzień na tym niewzruszonym fundamencie.",
      "Cierpliwość w walce to połowa zwycięstwa. Czekaj na Jahwe i ufaj.",
      "Wiara to broń, której używasz by zmienić bieg wydarzeń. Walcz dla Niego!",
      "Jesteś niepokonany tak długo, jak trzymasz się tego Słowa.",
      "Przemieniaj swój umysł! Skup się dziś na tym, co mówi Bóg, nie Twoje okoliczności.",
      "Boża moc doskonali się tam, gdzie Ty nie masz już sił. Oddaj Mu to zaufanie.",
      "Twoje decyzje kształtują zwycięstwo. Zrób to Dla Jezusa!",
      "Niewielki krok wiary może uruchomić potężne Boże działanie. Odważ się!",
      "Każde słowo Boga jest wypróbowane i czyste. Możesz postawić na to swoje życie.",
      "Bądź światłem w ciemności, bo to Słowo oświetla Twoją drogę.",
      "Potęga, która wskrzesiła Jezusa działa w Tobie. Bądź pełen nadziei!",
      "Zamiast narzekać na ciemność, zapal to Słowo w swoim sercu.",
      "Jeśli Bóg jest za Tobą, reszta przestaje mieć znaczenie. Tylko Bóg wystarczy.",
      "Spokój wśród burzy to przywilej tych, którzy stoją na Słowie Boga.",
      "Nie jesteś ofiarą. Jesteś wezwany do królowania w życiu przez Jezusa.",
      "Każdy upadek jest okazją by dowieść Bożej miłości. Podnieś się i walcz dalej.",
      "W Nim wszystko jest możliwe! Zanurz to Słowo w sercu i żyj pełnią.",
    ],
    en: [
      "Do not give up, God is fighting for you. You are a Divine Warrior.",
      "No matter how big your Goliath is, Jesus comes with power. Do it For Jesus - He is waiting.",
      "Today's Word reminds you that in Christ you already have the victory.",
      "Let this Word arm your heart. Reject fear and stand with power to fight.",
      "God's promise is sure. Be strong and courageous!",
      "There is life in the Word. Use it today as a sword in your struggles.",
      "Every day is a new battle, but also new grace. You are more than a conqueror.",
      "Your challenges are only an arena for God's miracles. Believe this Word!",
      "You stand on the side of the Victor. Lift your head and move forward with faith.",
      "Your worth is in Him. Reject doubts - you are a chosen tool in His hands.",
      "Let this verse be your shield against today's hardships.",
      "God has not given you a spirit of fear, but of power. Use it today!",
      "Take a step of faith. When you fight on the side of Heaven, Heaven fights for you.",
      "When He goes before you, no obstacle is too difficult.",
      "Build your day today on this unshakable foundation.",
      "Patience in battle is half the victory. Wait on the Lord and trust.",
      "Faith is the weapon you use to change the course of events. Fight for Him!",
      "You are undefeated as long as you hold on to this Word.",
      "Transform your mind! Focus today on what God says, not your circumstances.",
      "God's power is perfected where you have no more strength. Surrender that trust to Him.",
      "Your decisions shape the victory. Do it For Jesus!",
      "A small step of faith can trigger a powerful action of God. Take heart!",
      "Every word of God is flawless. You can stake your life on it.",
      "Be a light in the darkness, because this Word illuminates your path.",
      "The power that raised Jesus operates in you. Be full of hope!",
      "Instead of complaining about the darkness, light this Word in your heart.",
      "If God is for you, the rest ceases to matter. God alone is enough.",
      "Peace amidst the storm is the privilege of those who stand on God's Word.",
      "You are not a victim. You are called to reign in life through Jesus.",
      "Every fall is an opportunity to prove God's love. Rise up and keep fighting.",
      "With Him all things are possible! Immerse this Word in your heart and live fully.",
    ],
  };
  const currentLang = lang === "pl" ? "pl" : "en";
  return comments[currentLang][
    Math.abs(dayIndex) % comments[currentLang].length
  ];
};

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyVerse: BibleVerse | null;
  appLanguage: SupportedLanguage;
  onSpeakVerse: (verse: BibleVerse) => void;
  isMiriamSpeaking: boolean;
  onRefreshDailyVerse: () => void;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  isTickerExpanded?: boolean;
}

export const DailyVerseModal: React.FC<DailyVerseModalProps> = ({
  isOpen,
  onClose,
  dailyVerse,
  appLanguage,
  onSpeakVerse,
  isMiriamSpeaking,
  onRefreshDailyVerse,
  addToast,
  isTickerExpanded = false,
}) => {
  const userPersona = useAppStore((state) => state.userPersona);
  const customConfig = userPersona.dailyVerseConfig;
  const [fontSize, setFontSize] = useState<
    "text-base" | "text-lg" | "text-xl" | "text-2xl"
  >("text-xl");
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false);
  const [isPlannerRead, setIsPlannerRead] = useState(false);
  const [chapterContent, setChapterContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const status = PersistenceService.safeGetItem(
        `bible_reading_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`,
        ""
      );
      setIsPlannerRead(status === "true");
    }
  }, [isOpen]);

  const handleReadChapter = async () => {
    if (!dailyVerse) return;
    const content = await BibleService.getChapter(dailyVerse.reference);
    setChapterContent(content);
    setIsChapterModalOpen(true);
  };

  useEffect(() => {
    if (dailyVerse) {
      setIsLoadingVerse(false);
    }
  }, [dailyVerse]);

  const handleShare = useCallback(() => {
    setIsImageGeneratorOpen(true);
  }, []);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsLoadingVerse(true);
    onRefreshDailyVerse();
  };

  const labels = {
    reflection: appLanguage === "pl" ? "Refleksja" : "Reflection",
    commentary:
      appLanguage === "pl" ? "Komentarz Teologiczny" : "Theological Commentary",
    callToAction:
      appLanguage === "pl" ? "Wezwanie do Działania" : "Call to Action",
    blessing: appLanguage === "pl" ? "Błogosławieństwo" : "Blessing",
    prayer: appLanguage === "pl" ? "Modlitwa" : "Prayer",
    application:
      appLanguage === "pl"
        ? "Zastosowanie Praktyczne"
        : "Practical Application",
    translation:
      appLanguage === "pl"
        ? "Biblia Warszawska (BW)"
        : "New International Version (NIV)",
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center animate-fade-in-scale-up">
      <div
        className="relative w-full h-full bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 flex justify-between items-center px-8 sm:px-12 py-6 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 backdrop-blur-xl border-b border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-none">
              {(() => {
                const isEnglish = dailyVerse.reference.includes(":");
                if (isEnglish)
                  return appLanguage === "pl"
                    ? "Werset z Biblii (NIV/NKJV)"
                    : "Bible Verse (NIV/NKJV)";
                return appLanguage === "pl"
                  ? "Werset z Biblii Warszawskiej"
                  : "Warsaw Bible Verse";
              })()}
            </h2>
            <p className="text-[0.625rem] font-black text-[#C5A059] uppercase tracking-widest mt-2">
              {normalizeBibleReference(dailyVerse.reference, appLanguage)}
            </p>
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-3 bg-zinc-900 text-zinc-500 hover:text-white rounded-full transition-all border border-zinc-800 shadow-xl active:scale-95"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        <article
          className={`flex-1 overflow-y-auto px-8 sm:px-12 space-y-8 scrollbar-thin ${fontSize} text-zinc-300 leading-relaxed font-serif pb-10`}
        >
          {!dailyVerse || isLoadingVerse ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#C5A059] font-black uppercase text-xs tracking-widest">
                {appLanguage === "pl"
                  ? "Losowanie wersetu..."
                  : "Drawing new verse..."}
              </p>
            </div>
          ) : (
            <>
              {/* SŁOWO BOŻE */}
              <div className="flex items-center gap-4 mb-4 w-full justify-center pointer-events-none">
                <div className="h-[1px] flex-1 bg-gradient-to-l from-[#C5A059] to-transparent opacity-40"></div>
                <div className="relative flex items-center justify-center">
                  <p className="text-[0.625rem] font-black text-[#C5A059] uppercase tracking-[0.5em] whitespace-nowrap relative z-10">
                    {appLanguage === "pl" ? "SŁOWO BOŻE" : "WORD OF GOD"}
                  </p>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C5A059] to-transparent opacity-40"></div>
              </div>

              <div className="text-center py-6">
                <div
                  className="text-white font-black drop-shadow-lg [hyphens:none]"
                  style={{
                    fontSize: customConfig?.fontSize
                      ? `${customConfig.fontSize / 16}rem`
                      : undefined,
                    fontFamily:
                      customConfig?.fontFamily === "mono"
                        ? "var(--font-mono)"
                        : customConfig?.fontFamily === "serif"
                          ? "ui-serif, Georgia, serif"
                          : customConfig?.fontFamily === "lora"
                            ? '"Lora", serif'
                            : customConfig?.fontFamily === "sans"
                              ? "ui-sans-serif, system-ui, sans-serif"
                              : undefined,
                  }}
                >
                  {splitVerseIntoLines(
                    dailyVerse.text,
                    dailyVerse.reference,
                  ).map((line, idx) => (
                    <p
                      key={idx}
                      className={`${customConfig?.fontSize ? "" : "text-3xl sm:text-4xl"} mb-1 last:mb-0`}
                    >
                      {idx === 0 ? `"${fixOrphans(line)}` : fixOrphans(line)}
                      {idx ===
                      splitVerseIntoLines(dailyVerse.text, dailyVerse.reference)
                        .length -
                        1
                        ? '"'
                        : ""}
                    </p>
                  ))}
                </div>

                <Separator
                  text={normalizeBibleReference(
                    dailyVerse.reference,
                    appLanguage,
                  )}
                  className="mt-6 opacity-90 scale-90 sm:scale-100"
                />

                {/* MOTYWACYJNY KOMENTARZ DNIA */}
                <aside className="mt-8 px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 justify-center animate-fade-in shadow-xl mx-auto max-w-3xl">
                  <span className="text-[#C5A059] text-2xl flex-shrink-0 animate-pulse">
                    ⚔️
                  </span>
                  <p className="text-zinc-300 font-bold text-sm tracking-wide text-left leading-relaxed italic">
                    "
                    {fixOrphans(
                      getMotivationalComment(
                        new Date().getDate() - 1,
                        appLanguage,
                      ),
                    )}
                    "
                  </p>
                </aside>
              </div>

              <section className="space-y-6">
                {dailyVerse.reflection && (
                  <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 animate-fade-in">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.reflection}
                    </h3>
                    <p className="text-zinc-200">
                      {fixOrphans(dailyVerse.reflection)}
                    </p>
                  </div>
                )}

                {dailyVerse.commentary && (
                  <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 animate-fade-in delay-100">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.commentary}
                    </h3>
                    <p className="text-zinc-300">
                      {fixOrphans(dailyVerse.commentary)}
                    </p>
                  </div>
                )}

                {dailyVerse.application && (
                  <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 animate-fade-in delay-200">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.application}
                    </h3>
                    <p className="text-zinc-300">
                      {fixOrphans(dailyVerse.application)}
                    </p>
                  </div>
                )}

                {dailyVerse.callToAction && (
                  <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 animate-fade-in delay-300">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.callToAction}
                    </h3>
                    <p className="text-zinc-300">
                      {fixOrphans(dailyVerse.callToAction)}
                    </p>
                  </div>
                )}

                {dailyVerse.prayer && (
                  <div className="bg-[#C5A059]/5 p-6 rounded-[2rem] border border-[#C5A059]/20 animate-fade-in delay-400">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.prayer}
                    </h3>
                    <p className="text-zinc-200">
                      "{fixOrphans(dailyVerse.prayer)}"
                    </p>
                  </div>
                )}

                {dailyVerse.blessing && (
                  <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 animate-fade-in delay-500">
                    <h3 className="font-black text-[#C5A059] uppercase tracking-widest mb-3 text-[0.6875rem] border-b border-[#C5A059]/20 pb-2">
                      {labels.blessing}
                    </h3>
                    <p className="text-zinc-300">
                      {fixOrphans(dailyVerse.blessing)}
                    </p>
                  </div>
                )}
              </section>

              <div className="p-6 border-t border-zinc-800 text-center opacity-40">
                <p className="text-[0.625rem] uppercase font-black tracking-[0.3em]">
                  {labels.translation}
                </p>
              </div>

              <div className="px-6 pb-6 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleReadChapter}
                    className="flex-1 py-5 bg-zinc-800 text-[#C5A059] font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-zinc-700 active:scale-95 transition-all text-center"
                  >
                    {appLanguage === "pl"
                      ? "Czytaj cały rozdział"
                      : "Read whole chapter"}
                  </button>
                  <button
                    onClick={() => setIsPlannerModalOpen(true)}
                    className={`py-5 px-6 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-center ${
                      isPlannerRead
                        ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-zinc-800 text-[#C5A059] hover:bg-zinc-700"
                    }`}
                    title={appLanguage === "pl" ? "Planer Biblijny" : "Bible Planner"}
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-[#C5A059] text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  {appLanguage === "pl" ? "ZAMKNIJ OKNO" : "CLOSE WINDOW"}
                </button>
              </div>

              <BibleReadingPlanModal
                isOpen={isPlannerModalOpen}
                onClose={() => {
                  setIsPlannerModalOpen(false);
                  const today = new Date();
                  const status = PersistenceService.safeGetItem(
                    `bible_reading_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`,
                    ""
                  );
                  setIsPlannerRead(status === "true");
                }}
                date={new Date()}
                onConfirmRead={() => setIsPlannerRead(true)}
              />
              <ChapterReadingModal
                isOpen={isChapterModalOpen}
                onClose={() => setIsChapterModalOpen(false)}
                title={
                  normalizeBibleReference(
                    dailyVerse.reference,
                    appLanguage,
                  ).split(":")[0]
                }
                content={chapterContent}
                appLanguage={appLanguage}
                isTickerExpanded={isTickerExpanded}
              />
            </>
          )}

          {dailyVerse && (
            <SchemaInjector
              type="Quotation"
              data={{
                text: dailyVerse.text,
                citation: dailyVerse.reference,
                author: {
                  "@type": "Person",
                  name: "God",
                },
              }}
            />
          )}
        </article>

        <div className="flex-shrink-0 px-8 py-6 flex items-center justify-center gap-6 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border-t border-zinc-800">
          <button
            aria-label="Głośność"
            onClick={() => dailyVerse && onSpeakVerse(dailyVerse)}
            disabled={isMiriamSpeaking || !dailyVerse}
            className={`w-14 h-14 bg-zinc-900 rounded-full text-[#C5A059] flex items-center justify-center border border-zinc-800 shadow-md active:scale-90 transition-all ${isMiriamSpeaking ? "animate-pulse" : ""} ${!dailyVerse ? "opacity-50" : ""}`}
            title={appLanguage === "pl" ? "Czytaj werset" : "Read verse"}
          >
            <Volume2 className="w-8 h-8" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleShare}
            disabled={!dailyVerse}
            className={`w-16 h-16 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] active:scale-90 transition-all ${!dailyVerse ? "opacity-50" : ""}`}
            title={appLanguage === "pl" ? "Udostępnij werset" : "Share verse"}
          >
            <Share className="w-9 h-9" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoadingVerse}
            className="w-14 h-14 bg-zinc-900 text-[#C5A059] rounded-full flex items-center justify-center border border-zinc-800 shadow-md active:scale-90 transition-all"
            title={
              appLanguage === "pl" ? "Losuj nowy werset" : "Randomize new verse"
            }
          >
            <RefreshCw
              className={`w-8 h-8 ${isLoadingVerse ? "animate-spin" : ""}`}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>
      <VerseImageGeneratorModal
        isOpen={isImageGeneratorOpen}
        onClose={() => setIsImageGeneratorOpen(false)}
        verse={dailyVerse}
        appLanguage={appLanguage}
        addToast={addToast}
        isTickerExpanded={isTickerExpanded}
      />
    </div>
  );
};
