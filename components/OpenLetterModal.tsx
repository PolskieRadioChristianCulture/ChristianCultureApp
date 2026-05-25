import React from "react";
import { X, Share2, Mail } from "lucide-react";
import { SupportedLanguage } from "../types";
import { fixOrphans } from "../types";

interface OpenLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const OpenLetterModal: React.FC<OpenLetterModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded = false,
}) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    const text =
      "LIST OTWARTY - Zaproszenie do Współtworzenia Globalnego Ekosystemu Kultury Chrześcijańskiej.\n\nPrzeczytaj całość na: https://cclite.pl";
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Christian Culture - List Otwarty",
          text: text,
          url: "https://cclite.pl",
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert(
          appLanguage === "pl"
            ? "Skopiowano do schowka!"
            : "Copied to clipboard!",
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed", err);
      }
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[10000] flex items-center justify-center p-4 sm:p-8 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-black text-zinc-300 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col font-serif border border-white/10">
        {/* Background Graphic Header with Fade to Black */}
        <div className="absolute top-0 inset-x-0 h-[40dvh] sm:h-[50dvh] pointer-events-none select-none z-0">
          <img
            src="/List_Otwarty.webp"
            alt="Open Letter Header"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black pointer-events-none"></div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-inner">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-gold text-shadow-sm">
              LIST OTWARTY
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Udostępnij"
              onClick={handleShare}
              className="p-2 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-300 hover:text-white transition-colors flex items-center gap-2 border border-white/10"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:block text-xs font-bold uppercase tracking-widest">
                Udostępnij
              </span>
            </button>
            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-300 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 pb-24 scrollbar-thin relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 text-[17px] sm:text-[19px] leading-[1.8] text-zinc-300 tracking-wide font-medium">
            <div className="text-center mb-16 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold rounded-full mb-8 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
              <h1 className="text-3xl sm:text-5xl border-b border-gold/20 pb-8 mt-12 font-black uppercase tracking-[0.15em] text-white leading-tight drop-shadow-md">
                Zaproszenie do Współtworzenia{" "}
                <span className="text-gold">Globalnego Ekosystemu</span> Kultury
                Chrześcijańskiej
              </h1>
              <p className="text-xl sm:text-2xl italic text-zinc-400 mt-8 mb-4 font-serif">
                Do Czcigodnych Liderów, Pasterzy, Wizjonerów oraz Wszystkich
                Ludzi Dobrej Woli poruszonych Duchem Świętym
              </p>
            </div>

            <p>Bracia i Siostry, Współpracownicy w Winnicy Pańskiej,</p>

            <p>
              Stoimy w obliczu czasów, które wymagają od nas nie tylko głębokiej
              wiary, ale i nowoczesnej, odważnej odpowiedzi na potrzeby
              współczesnego społeczeństwa. Świat cyfrowy stał się nowym
              „Areopagiem”, na którym codziennie toczą się walki o ludzkie serca
              i umysły. W odpowiedzi na to wyzwanie, zwracam się do Was z
              gorącym apelem o zjednoczenie sił w budowie Globalnego Serwisu
              Multimedialnego – Portalu Społeczności Chrześcijańskiej.
            </p>

            <p>
              Moją misją jest stworzenie przestrzeni, która nie tylko promuje
              wartości ewangeliczne, ale staje się żywym centrum kultury
              chrześcijańskiej, edukacji biblijnej i wzajemnego wsparcia.
            </p>

            <div className="my-12 p-8 bg-zinc-900/60 backdrop-blur-sm border border-gold/20 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-gold mb-6 flex items-center gap-4">
                Dlaczego to zaproszenie jest skierowane właśnie do Ciebie?
              </h2>
              <p className="mb-6 text-zinc-300">
                Wierzę, że każdy dar i talent pochodzi od Boga i powinien służyć
                wspólnemu dobru. Zapraszam więc do współpracy:
              </p>

              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-gold font-black mt-1">✦</span>{" "}
                  <span className="text-zinc-300">
                    <strong className="text-white">Kościoły i Zbory:</strong>{" "}
                    Abyście mogli stać się duchowym filarem tej inicjatywy,
                    niosąc słowo pociechy i prawdy do globalnego grona
                    odbiorców.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-black mt-1">✦</span>{" "}
                  <span className="text-zinc-300">
                    <strong className="text-white">
                      Media Chrześcijańskie (Radio, TV, Portale):
                    </strong>{" "}
                    Do wymiany treści i wspólnego budowania zasięgów, które
                    przebiją się przez informacyjny szum współczesności.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-black mt-1">✦</span>{" "}
                  <span className="text-zinc-300">
                    <strong className="text-white">
                      Fundacje i Inicjatywy Społeczne (w tym Kluby Zdrowia):
                    </strong>{" "}
                    Aby promować holistyczne podejście do człowieka – dbając o
                    ducha, umysł i ciało.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-black mt-1">✦</span>{" "}
                  <span className="text-zinc-300">
                    <strong className="text-white">
                      Liderów, Pastorów i Misjonarzy:
                    </strong>{" "}
                    Wasze doświadczenie w prowadzeniu ludzi i wizja
                    ewangelizacyjna są fundamentem, na którym chcemy budować.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-black mt-1">✦</span>{" "}
                  <span className="text-zinc-300">
                    <strong className="text-white">Artystów i Twórców:</strong>{" "}
                    Każdy talent – muzyczny, literacki, graficzny czy
                    technologiczny – jest narzędziem w rękach Boga, które może
                    poruszyć serca poszukujących.
                  </span>
                </li>
              </ul>
            </div>

            <div className="my-12">
              <h2 className="text-2xl font-black uppercase tracking-widest text-gold mb-6">
                Formy współpracy
              </h2>
              <p className="mb-6 text-zinc-300">
                Nie szukam jedynie obserwatorów, ale aktywnych partnerów.
                Proponuję:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 hover:border-gold/30 transition-colors p-6 rounded-2xl">
                  <h3 className="font-bold uppercase tracking-widest text-white mb-2">
                    Oficjalny Patronat
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Uwiarygodnienie projektu autorytetem Waszych instytucji.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 hover:border-gold/30 transition-colors p-6 rounded-2xl">
                  <h3 className="font-bold uppercase tracking-widest text-white mb-2">
                    Partnerstwo Treściowe
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Udostępnianie materiałów edukacyjnych, kazań, wykładów,
                    świadectw oraz wysokiej jakości treści audio i wideo.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 hover:border-gold/30 transition-colors p-6 rounded-2xl">
                  <h3 className="font-bold uppercase tracking-widest text-white mb-2">
                    Aktywne Współtworzenie
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Udział w budowie modułów edukacyjnych oraz wsparcie
                    merytoryczne specjalistycznych poradni CC (Christian
                    Culture).
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 hover:border-gold/30 transition-colors p-6 rounded-2xl">
                  <h3 className="font-bold uppercase tracking-widest text-white mb-2">
                    Wspólnotę Misji
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Wykorzystanie portalu jako narzędzia do Waszej codziennej
                    pracy misyjnej i ewangelizacyjnej.
                  </p>
                </div>
              </div>
            </div>

            <div className="my-12 bg-gradient-to-br from-gold/20 to-black border border-gold/30 p-8 sm:p-10 rounded-[2rem] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent pointer-events-none blur-3xl" />
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 relative z-10 text-white drop-shadow-md">
                Nasz cel: Osobiste Uświęcenie i Globalny Zasięg
              </h2>
              <p className="relative z-10 text-zinc-300">
                Buduję coś więcej niż portal – buduję Ekosystem Osobistego
                Uświęcenia. Miejsce, gdzie technologia służy teologii, a
                elegancja i profesjonalizm oddają godność przekazywanej Prawdy.
                Pragnę, aby każdy użytkownik – od poszukującego agnostyka po
                zaawansowanego biblistę – znalazł tu drogę do głębszej relacji z
                Bogiem.
              </p>
              <div className="w-16 h-px bg-gold/40 mx-auto my-8 relative z-10" />
              <p className="text-lg font-bold italic relative z-10 text-gold drop-shadow-md">
                Przyłączcie się do nas. Niech ten projekt stanie się wspólnym
                świadectwem jedności Ciała Chrystusowego w XXI wieku.
              </p>
            </div>

            <div className="text-center space-y-6 mt-16 pb-8 border-b border-white/10">
              <p className="italic text-zinc-400">
                Z modlitwą i nadzieją na wspólną drogę,
              </p>
              <div>
                <p className="font-black text-2xl tracking-widest uppercase text-white drop-shadow-sm">
                  Cezary Rogowski
                </p>
                <p className="text-sm uppercase tracking-widest text-gold mt-1">
                  Inicjator Projektu Christian Culture Global
                </p>
              </div>
            </div>

            <div className="text-center mt-12 bg-white/5 border border-white/10 p-8 rounded-3xl mx-auto max-w-2xl backdrop-blur-sm">
              <p className="font-serif italic text-xl text-zinc-400 mb-4 leading-relaxed">
                „A tak, moi bracia milsi, bądźcie stali, nieporuszeni,
                obfitujący w dziele Jahwe zawsze, wiedząc, że praca wasza nie
                jest daremna w Jahwe.”
              </p>
              <p className="font-bold text-sm uppercase tracking-widest text-gold">
                (1 Kor 15,58)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
