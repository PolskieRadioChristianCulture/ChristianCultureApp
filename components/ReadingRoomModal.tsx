import React from "react";
import {
  X,
  Book,
  Download,
  ShoppingCart,
  BookOpen,
  Globe,
  Share2,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { SupportedLanguage } from "../types";

interface ReadingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  onOpenGlobe?: () => void;
  onOpenSupport?: () => void;
  isTickerExpanded?: boolean;
  addToast?: (message: string, type?: "info" | "success" | "alert") => void;
}

import { SEOSchema } from "./SEOSchema";

export const ReadingRoomModal: React.FC<ReadingRoomModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  onOpenGlobe,
  onOpenSupport,
  isTickerExpanded,
  addToast,
}) => {
  const isPl = appLanguage === "pl";
  const [activeUbgOfferIndex, setActiveUbgOfferIndex] = React.useState(0);
  const [isPdfReaderOpen, setIsPdfReaderOpen] = React.useState(false);
  const [isMissionSupportOpen, setIsMissionSupportOpen] = React.useState(false);

  const [favorites, setFavorites] = React.useState<Record<string, boolean>>(
    () => {
      try {
        return JSON.parse(
          localStorage.getItem("cc_reading_room_favorites") || "{}",
        );
      } catch {
        return {};
      }
    },
  );

  const toggleFavorite = (id: string) => {
    const newFavs = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavs);
    localStorage.setItem("cc_reading_room_favorites", JSON.stringify(newFavs));
    if (addToast)
      addToast(
        isPl
          ? newFavs[id]
            ? "Dodano do ulubionych"
            : "Usunięto z ulubionych"
          : newFavs[id]
            ? "Added to favorites"
            : "Removed from favorites",
        "success",
      );
  };

  const handleShare = (id: string, title: string, text: string) => {
    const url = window.location.origin + "/ksiazka/" + id;
    const shareText = `${title}\n\n${text}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${title} - Christian Culture`,
          text: shareText,
          url: url,
        })
        .then(() => {
          if (addToast) addToast(isPl ? "Udostępniono!" : "Shared!", "success");
        })
        .catch((e) => {
          if (e.name !== "AbortError" && addToast) {
            addToast(isPl ? "Błąd udostępniania." : "Error sharing.", "alert");
          }
        });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${url}`).then(() => {
        if (addToast)
          addToast(
            isPl ? "Skopiowano do schowka!" : "Copied to clipboard!",
            "info",
          );
      });
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveUbgOfferIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000); // 6 seconds per card

    const handleDeeplink = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = customEvent.detail?.bookId;
      if (id) {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    window.addEventListener("deeplink-ksiazka", handleDeeplink);

    return () => {
      clearInterval(interval);
      window.removeEventListener("deeplink-ksiazka", handleDeeplink);
    };
  }, [isOpen]);

  const ubgOffers = [
    {
      author: isPl ? "Wydanie Fundacji Wrota" : "Wrota Foundation Edition",
      desc: isPl
        ? 'Biblia UBG za darmo. Wyślij SMS o treści "Biblia" lub zadzwoń na nr telefonu +48 799 082 024. Ponosisz tylko koszty przesyłki.'
        : 'Bible UBG for free. Send SMS with "Biblia" or call +48 799 082 024. You only pay for shipping.',
      actions: [
        {
          label: isPl ? "Wyślij SMS" : "Send SMS",
          icon: <Download className="w-4 h-4" />,
          onClick: () => window.open("sms:+48799082024?body=Biblia", "_blank"),
          active: true,
        },
        {
          label: isPl ? "Zadzwoń" : "Call",
          icon: <BookOpen className="w-4 h-4" />,
          onClick: () => window.open("tel:+48799082024", "_blank"),
          active: true,
        },
        {
          label: isPl ? "Udostępnij" : "Share",
          icon: <Share2 className="w-4 h-4" />,
          active: true,
          onClick: () =>
            handleShare(
              "biblia-ubg",
              "Biblia UBG",
              "Darmowa Biblia UBG. Ponosisz tylko koszt przesyłki.",
            ),
        },
        {
          label: isPl ? "Ulubione" : "Favorite",
          icon: (
            <Heart
              className={`w-4 h-4 ${favorites["biblia-ubg"] ? "fill-gold text-gold" : ""}`}
            />
          ),
          active: true,
          onClick: () => toggleFavorite("biblia-ubg"),
        },
      ],
      descriptionBtn: {
        label: isPl ? "ZAMÓW DARMOWĄ BIBLIĘ" : "ORDER FREE BIBLE",
        onClick: () => window.open("tel:+48799082024", "_blank"),
        active: true,
      },
    },
    {
      author: "Marek Strękowski",
      desc: isPl
        ? 'Biblia UBG za darmo. Wyślij SMS o treści "Biblia" lub zadzwoń na nr telefonu +48 530 736 155. Ponosisz tylko koszty przesyłki.'
        : 'Bible UBG for free. Send SMS with "Biblia" or call +48 530 736 155. You only pay for shipping.',
      actions: [
        {
          label: isPl ? "Wyślij SMS" : "Send SMS",
          icon: <Download className="w-4 h-4" />,
          onClick: () => window.open("sms:+48530736155?body=Biblia", "_blank"),
          active: true,
        },
        {
          label: isPl ? "Zadzwoń" : "Call",
          icon: <BookOpen className="w-4 h-4" />,
          onClick: () => window.open("tel:+48530736155", "_blank"),
          active: true,
        },
        {
          label: isPl ? "Udostępnij" : "Share",
          icon: <Share2 className="w-4 h-4" />,
          active: true,
          onClick: () =>
            handleShare(
              "biblia-ubg",
              "Biblia UBG",
              "Darmowa Biblia UBG. Ponosisz tylko koszt przesyłki.",
            ),
        },
        {
          label: isPl ? "Ulubione" : "Favorite",
          icon: (
            <Heart
              className={`w-4 h-4 ${favorites["biblia-ubg"] ? "fill-gold text-gold" : ""}`}
            />
          ),
          active: true,
          onClick: () => toggleFavorite("biblia-ubg"),
        },
      ],
      descriptionBtn: {
        label: isPl ? "ZAMÓW DARMOWĄ BIBLIĘ" : "ORDER FREE BIBLE",
        onClick: () => window.open("tel:+48530736155", "_blank"),
        active: true,
      },
    },
  ];

  const activeUbgOffer = ubgOffers[activeUbgOfferIndex];

  const books = [
    {
      id: "biblia-ubg",
      title: "Biblia UBG",
      author: activeUbgOffer.author,
      desc: activeUbgOffer.desc,
      cover: "/books/biblia_ubg_cover.webp",
      status: isPl ? "DOSTĘPNA" : "AVAILABLE",
      statusColor: "bg-green-600",
      actions: activeUbgOffer.actions,
      descriptionBtn: activeUbgOffer.descriptionBtn,
      isRotator: true,
    },
    {
      id: "kod-zrodlowy",
      title: "Kod Źródłowy",
      author: "Cezary Rogowski",
      desc: isPl
        ? "Niezwykła podróż do fundamentów wiary i zrozumienia duchowej rzeczywistości. Odkryj zasady, które odmienią Twoje życie z Bogiem. Czytaj za darmo."
        : "An extraordinary journey to the foundations of faith and understanding spiritual reality. Discover the principles that will transform your life with God. Read for free.",
      cover: "/books/kod_zrodlowy_cover.webp",
      status: isPl ? "DOSTĘPNA" : "AVAILABLE",
      statusColor: "bg-green-600",
      actions: [
        {
          label: isPl ? "Pobierz" : "Download",
          icon: <Download className="w-4 h-4" />,
          active: true,
          onClick: () => setIsMissionSupportOpen(true),
        },
        {
          label: isPl ? "Otwórz" : "Open",
          icon: <BookOpen className="w-4 h-4" />,
          onClick: () => setIsPdfReaderOpen(true),
          active: true,
        },
        {
          label: isPl ? "Udostępnij" : "Share",
          icon: <Share2 className="w-4 h-4" />,
          active: true,
          onClick: () =>
            handleShare(
              "kod-zrodlowy",
              "Kod Źródłowy",
              "Niezwykła podróż do fundamentów wiary i zrozumienia duchowej rzeczywistości.",
            ),
        },
        {
          label: isPl ? "Ulubione" : "Favorite",
          icon: (
            <Heart
              className={`w-4 h-4 ${favorites["kod-zrodlowy"] ? "fill-gold text-gold" : ""}`}
            />
          ),
          active: true,
          onClick: () => toggleFavorite("kod-zrodlowy"),
        },
      ],
      descriptionBtn: {
        label: isPl ? "OTWÓRZ KSIĄŻKĘ" : "OPEN BOOK",
        onClick: () => setIsPdfReaderOpen(true),
        active: true,
      },
    },
  ];

  const t = {
    title: isPl ? "Czytelnia" : "Reading Room",
    subtitle: isPl
      ? "Biblioteka Publikacji Christian Culture"
      : "Christian Culture Publication Library",
    back: isPl ? "POWRÓT DO BIBLIOTEKI" : "BACK TO LIBRARY",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[5000] bg-black overflow-hidden flex flex-col font-sans"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.1),transparent_70%)] pointer-events-none" />

          <SEOSchema
            type="Book"
            data={{
              "@graph": books.map((book) => ({
                "@type": "Book",
                name: book.title,
                author: { "@type": "Person", name: book.author },
                description: book.desc,
                image: window.location.origin + book.cover,
                offers: {
                  "@type": "Offer",
                  availability: "https://schema.org/InStock",
                  price: "0",
                  priceCurrency: "PLN",
                },
              })),
            }}
          />

          {/* Header */}
          <div
            className={`flex justify-between items-center px-6 sm:px-12 ${isTickerExpanded ? "pt-20 sm:pt-24" : "pt-8"} pb-4 shrink-0 relative z-10`}
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                <Book className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
                {t.title} <span className="text-gold">CC</span>
              </h2>
              <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                {t.subtitle}
              </p>
            </div>
            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-gold hover:border-gold/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 relative z-10 scrollbar-hide">
            <div className="max-w-5xl mx-auto w-full space-y-24">
              {books.map((book) => (
                <div
                  key={book.id}
                  id={book.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center pt-16 -mt-16"
                >
                  {/* Book Visual */}
                  <div className="relative group max-w-[280px] mx-auto w-full md:max-w-none">
                    <div
                      className={`absolute -inset-8 ${book.statusColor}/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 group-hover:scale-[1.02] transition-transform duration-500 bg-zinc-900">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover z-20"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error(
                            `[ReadingRoom] Failed to load image: ${book.cover}. Current src: ${target.src}`,
                          );
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-25 pointer-events-none" />

                      {/* Status Badge */}
                      <div
                        className={`absolute top-6 -right-12 ${book.statusColor} text-white font-black text-[9px] py-1.5 w-40 text-center uppercase tracking-widest rotate-45 shadow-xl border-y border-white/10 z-30`}
                      >
                        {book.status}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-center md:text-left relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={book.isRotator ? activeUbgOfferIndex : book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 absolute inset-0 sm:pr-4"
                      >
                        <div>
                          <div
                            className={`inline-block px-3 py-1 ${book.statusColor}/20 border border-${book.statusColor}/40 rounded-full text-${book.statusColor.split("-")[1]}-400 font-bold text-[9px] uppercase tracking-widest mb-4`}
                          >
                            {book.status}
                          </div>
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-1 leading-none hyphens-none break-keep">
                            {book.title}
                          </h3>
                          <p className="text-base sm:text-lg font-bold text-zinc-500">
                            {book.author}
                          </p>
                        </div>

                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                          {book.desc}
                        </p>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {book.actions.map((action, idx) => (
                              <button
                                key={idx}
                                disabled={!action.active}
                                onClick={action.onClick}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                  action.active
                                    ? "bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800"
                                    : "bg-zinc-900/50 border border-white/5 text-zinc-600 cursor-not-allowed"
                                }`}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </div>
                          <button
                            disabled={!book.descriptionBtn.active}
                            onClick={book.descriptionBtn.onClick}
                            className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                              book.descriptionBtn.active
                                ? "bg-gold text-black hover:bg-gold/90 shadow-lg shadow-gold/20"
                                : "bg-gold/10 border border-gold/20 text-gold/20 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {book.descriptionBtn.label}
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-8 shrink-0 relative z-20">
            <button
              onClick={onClose}
              className="max-w-4xl mx-auto w-full py-5 bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-700 transition-all border border-zinc-700 shadow-xl flex items-center justify-center gap-2 active:scale-95"
            >
              <Book className="w-4 h-4" />
              {appLanguage === "pl"
                ? "ZAMKNIJ I WRÓĆ DO MENU GŁÓWNEGO"
                : "CLOSE AND RETURN TO MAIN MENU"}
            </button>
          </div>
        </motion.div>
      )}

      {/* PDF Reader Modal */}
      {isPdfReaderOpen && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-2 sm:p-8">
          <div className="relative w-full h-full max-w-5xl mx-auto border-[3px] border-gold rounded-xl overflow-hidden bg-black flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-zinc-900/50">
              <div className="text-gold font-bold font-serif uppercase tracking-widest text-sm lg:text-base">
                KOD ŹRÓDŁOWY
              </div>
              <button
                aria-label="Zamknij"
                onClick={() => setIsPdfReaderOpen(false)}
                className="text-gold hover:text-white transition-colors flex items-center gap-2 font-bold select-none cursor-pointer"
              >
                <span className="hidden sm:inline text-xs uppercase tracking-widest">
                  {isPl ? "Zamknij" : "Close"}
                </span>{" "}
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src="https://drive.google.com/file/d/1hw_zGuYxnClvF87hCnqugpBXjdsWIm_Y/preview"
                className="absolute inset-0 w-full h-full border-none"
                title="Wirtualna Czytelnia Christian Culture"
              />
            </div>
            <div className="p-4 bg-zinc-950 border-t border-gold/30 text-center text-zinc-400 text-xs sm:text-sm">
              {isPl
                ? "Spodobał Ci się ten rozdział? Wesprzyj nasze działania, aby otrzymać dostęp do kolejnych materiałów."
                : "Did you like this chapter? Support our activities to get access to more materials."}{" "}
              <button
                onClick={() => {
                  setIsPdfReaderOpen(false);
                  setIsMissionSupportOpen(true);
                }}
                className="text-gold underline hover:text-white font-bold ml-2"
              >
                {isPl ? "WESPRZYJ" : "SUPPORT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission Support Modal */}
      {isMissionSupportOpen && (
        <div className="fixed inset-0 z-[7000] bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-gold/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider text-gold">
                  {isPl ? "Wsparcie Misji CC" : "CC Mission Support"}
                </h3>
                <button
                  aria-label="Zamknij"
                  onClick={() => setIsMissionSupportOpen(false)}
                  className="text-zinc-400 hover:text-white p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
                <p>
                  🙏 Możesz wspierać misję Christian Culture modlitwą,
                  udostępniając i polecając książkę "Kod Źródłowy" oraz poprzez
                  dar finansowy 🤍
                </p>
                <p>
                  Każde wsparcie pomaga nam docierać z Ewangelią dalej i tworzyć
                  przestrzeń wzrostu duchowego dla tysięcy osób 🌱✨
                </p>

                <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3">
                  <p className="font-bold text-white">Wspieraj Bożą misję:</p>
                  <p>
                    👉{" "}
                    <a
                      href="https://patronite.pl/osobowoscplus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline font-medium break-all"
                    >
                      https://patronite.pl/osobowoscplus
                    </a>
                  </p>

                  <div className="pt-2">
                    <p className="font-bold text-white">
                      💳 Nr konta (Bank / Revolut):
                    </p>
                    <p className="text-lg sm:text-xl font-mono text-gold selection:bg-gold/30 break-all">
                      48 2910 0006 0000 0000 0527 2629
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      👉 z dopiskiem: „Dar misyjny”
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold text-white">
                      🌍 Wsparcie przez bezpieczny link Revolut:
                    </p>
                    <p>
                      <a
                        href="https://revolut.me/christianculture"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline font-medium break-all"
                      >
                        https://revolut.me/christianculture
                      </a>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold text-white">📱 BLIK:</p>
                    <p className="text-xl font-mono text-gold selection:bg-gold/30">
                      537 147 043
                    </p>
                  </div>
                </div>

                <p className="font-bold text-center mt-6 text-white">
                  🙏 Dziękujemy za Twoje wsparcie, modlitwę i zaufanie.
                </p>
                <p className="text-center text-zinc-400">
                  Razem budujemy Christian Culture — ku Bożej chwale i dla dobra
                  ludzi 🔥✝️
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href="https://drive.google.com/file/d/1hw_zGuYxnClvF87hCnqugpBXjdsWIm_Y/view?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center gap-2 py-4 bg-gold text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors shadow-lg shadow-gold/10"
                >
                  <Download className="w-5 h-5" />{" "}
                  {isPl
                    ? "Wesprzyj i pobierz Kod Żródłowy"
                    : "Support and Download"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
