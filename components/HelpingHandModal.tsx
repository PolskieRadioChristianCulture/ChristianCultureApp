import React from "react";
import { X, MapPin, Phone, Mail } from "lucide-react";
import { SupportedLanguage } from "../types";

interface HelpingHandModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  isTickerExpanded?: boolean;
}

export const HelpingHandModal: React.FC<HelpingHandModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  isTickerExpanded,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[3000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 rounded-[3rem] shadow-3xl flex flex-col max-h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Pomocna" : "Helping"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Dłoń" : "Hand"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              {appLanguage === "pl"
                ? "Chrześcijańskie Centrum Rozwoju"
                : "Christian Development Center"}
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-3 bg-zinc-900 text-zinc-500 hover:text-white rounded-full transition-all border border-zinc-800"
          >
            <svg
              className="w-6 h-6"
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

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          <div className="bg-[#C5A059]/10 p-6 rounded-[2rem] border border-[#C5A059]/20">
            <h3 className="text-white font-black text-lg mb-4">
              🌿{" "}
              {appLanguage === "pl"
                ? "Wiosna w pełni – Czas na Twój Rozkwit w Pomocnej Dłoni!"
                : "Spring is here – Time for your flourish!"}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {appLanguage === "pl"
                ? "Świat wokół nas już się obudził, a Ty? Kwiecień w Starogardzie Gdańskim to nie tylko coraz dłuższe dni, to przede wszystkim Twoja szansa na nowy początek. W Chrześcijańskim Centrum Rozwoju Pomocna Dłoń wierzymy, że każda zmiana zaczyna się od małego ziarna wiary i dbania o siebie. Sprawdź, jak możesz rozkwitnąć z nami w tym tygodniu:"
                : "The world around us has awakened, what about you? April in Starogard Gdański is not just longer days, it is your chance for a new beginning. At Christian Development Center Helping Hand, we believe that every change starts with a small seed of faith and self-care. See how you can flourish with us this week:"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">✨</span>{" "}
                {appLanguage === "pl"
                  ? "Odnowa: Ciało jako Świątynia"
                  : "Renewal: Body as Temple"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {appLanguage === "pl"
                  ? "Zdejmij z barków ciężar minionych miesięcy. Nasze wiosenne masaże relaksacyjne dla kobiet to coś więcej niż odprężenie – to regeneracja sił do pełnienia Twoich codziennych ról. Pozwól sobie na chwilę ciszy, która przywraca witalność."
                  : "Remove the burden of past months. Our spring relaxation massages for women are more than just relaxation – they are strength regeneration for your daily roles. Allow yourself a moment of silence that restores vitality."}
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">☕</span>{" "}
                {appLanguage === "pl"
                  ? "Relacje: Serce przy Herbacie"
                  : "Relationships: Heart over tea"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {appLanguage === "pl"
                  ? "Izolacja to już przeszłość. Zapraszamy na nasze „Czwartki z Wartościami”. To tutaj, przy kubku ciepłego naparu, łączymy rzetelną wiedzę psychologiczną z fundamentem chrześcijańskim. Przyjdź, posłuchaj, podziel się sobą – budujemy społeczność, która naprawdę się wspiera."
                  : 'Isolation is in the past. We invite you to our "Thursdays with Values". Here, over a cup of warm brew, we combine reliable psychological knowledge with a Christian foundation. Come, listen, share yourself – we are building a community that really supports each other.'}
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">⚓</span>{" "}
                {appLanguage === "pl"
                  ? "Fundament: Spokój, który trwa"
                  : "Foundation: Peace that lasts"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {appLanguage === "pl"
                  ? "Wiosenne porządki warto zacząć od wnętrza. Nasz Gabinet Wsparcia to bezpieczna przystań dla każdego, kto szuka nowej perspektywy lub po prostu potrzebuje zostać wysłuchanego. Kalibrujemy wewnętrzny kompas, opierając się na prawdzie i empatii."
                  : "Spring cleaning is worth starting from the inside. Our Support Office is a safe haven for anyone looking for a new perspective or just needing to be heard. We calibrate the internal compass, based on truth and empathy."}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-3 mt-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center mb-2">
              {appLanguage === "pl"
                ? "Nie pozwól, by ta wiosna Cię ominęła. Zasiej zmianę już dziś!"
                : "Don't let this spring pass you by. Sow change today!"}
            </p>
            <div className="flex flex-col gap-2 text-xs text-zinc-300">
              <a
                href="https://maps.app.goo.gl/kLt9y2qzzRUu2MZy9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <MapPin className="text-[#C5A059]" size={16} />
                <span>ul. Pomorska 2a, Starogard Gdański</span>
              </a>
              <a
                href="tel:+48790577194"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <Phone className="text-[#C5A059]" size={16} />
                <span>790 577 194</span>
              </a>
              <a
                href="mailto:centrumrozwojupd@gmail.com"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10"
              >
                <Mail className="text-[#C5A059]" size={16} />
                <span>centrumrozwojupd@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex flex-col gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="w-full py-3 bg-white/5 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
          >
            {appLanguage === "pl"
              ? "Udostępnij tę treść"
              : "Share this content"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-[1.5rem] shadow-2xl text-xs hover:scale-[1.02] active:scale-95 transition-all"
          >
            {appLanguage === "pl" ? "WRÓĆ DO RADIA" : "BACK TO RADIO"}
          </button>
        </div>
      </div>
    </div>
  );
};
