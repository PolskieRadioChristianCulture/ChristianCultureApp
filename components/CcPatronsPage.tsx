import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, ShieldCheck, Star, Users, Music } from "lucide-react";
import { useAppStore } from "../useAppStore";

interface PatronsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CcPatronsPage: React.FC<PatronsPageProps> = ({
  isOpen,
  onClose,
}) => {
  const { userPersona } = useAppStore();
  const isPl = true; // Always Polish per instructions

  const patrons = [
    {
      id: "bartek",
      name: "Bartek",
      title: "Główny Patron cclite.pl",
      badge: "Mecenas Kultury Chrześcijańskiej",
      description:
        "Bartek wspiera misję Christian Culture systematycznie i to dzięki jego hojności oraz oddaniu ta platforma może służyć społeczności każdego dnia. Jego wsparcie jest fundamentem, na którym budujemy to cyfrowe sanktuarium.",
      prayer:
        "Jahwe Jezu, dziękujemy Ci za serce Bartka, które otworzyłeś na potrzeby Twojej misji. Prosimy Cię, błogosław go obficie w każdym aspekcie jego życia. Niech Twoja łaska otacza go jak tarcza, a Twoja mądrość prowadzi go po Twoich ścieżkach. Daj mu siłę wojownika i pokój, który przewyższa wszelki rozum.",
      blessing:
        "„Niech ci błogosławi Jahwe i niech cię strzeże; Niech Jahwe rozjaśni oblicze swoje nad tobą i niech ci miłościwy będzie; Niech Jahwe zwróci oblicze swoje ku tobie i niech ci da pokój.” (Liczb 6,24-26)",
      dedication:
        "Dedykacja Muzyczna: Dla Bartka - w podziękowaniu za Twoje świadectwo.",
      videoUrl: "https://www.youtube.com/embed/dtxC6GaBU5c?si=_gShCoV6od15y8Hp",
      icon: <ShieldCheck className="w-8 h-8 text-[#C5A059]" />,
    },
    {
      id: "mariusz",
      name: "Mariusz z rodziną",
      title: "Mecenas Radia Christian Culture",
      badge: "Filar Globalnej Ewangelizacji",
      description:
        "Dzięki tej wspaniałej rodzinie z Anglii, Radio CC nie ustaje w nadawaniu Ewangelii. To ich wsparcie pozwoliło na powstanie kanałów Christian Culture Global oraz Biblia Audio, niosąc Słowo Boże do najdalszych zakątków świata.",
      prayer:
        "Wszechmogący Boże, dziękujemy Ci za Mariusza i jego rodzinę. Przez ich ręce sprawiłeś, że Twój głos może brzmieć w eterze i Internecie. Błogosław ich dom, niech będzie on przepełniony Twoją obecnością. Niech każdy wysiłek, który wkładają w Twoje dzieło, wróci do nich stokrotnie w pokoju i radości Ducha Świętego.",
      blessing:
        "„Błogosławiony będziesz w mieście i błogosławiony będziesz na polu. Błogosławione będzie potomstwo twoje... Błogosławiony będziesz, gdy będziesz wchodził, i błogosławiony będziesz, gdy będziesz wychodził.” (Powt. Pr. 28,3-6)",
      dedication:
        "Dedykacja Muzyczna: Dla Mariusza i Rodziny - aby serca zawsze były blisko Mistrza.",
      videoUrl: "https://www.youtube.com/embed/D3IGwR7HII4?si=vcVxui1pKqgjyqWK",
      icon: <Users className="w-8 h-8 text-[#C5A059]" />,
    },
    {
      id: "wanda",
      name: "Wanda",
      title: "Wierna Patronka Misji",
      badge: "Honorowy Strażnik Wiary",
      description:
        "Wanda towarzyszy misji Christian Culture od samego początku. Jej wierność i nieustanne wsparcie są dla nas dowodem na to, że Bóg posyła swoich aniołów w postaci ludzi, aby podtrzymywać ogień wiary i świadectwa.",
      prayer:
        "Drogi Ojcze, dziękujemy Ci za Wandę, która stała przy tej misji w chwilach radosnych i trudnych. Jej wytrwałość jest dla nas wzorem. Prosimy, obdarz ją głębokim poczuciem Twojej obecności. Niech Twój Duch zawsze ją pociesza i umacnia, a Twoje obietnice niech będą dla niej pewną kotwicą duszy.",
      blessing:
        "„Jahwe jest pasterzem moim, niczego mi nie braknie. Na niwach zielonych pasie mnie. Nad wody spokojne prowadzi mnie. Duszę moją pokrzepia. Prowadzi mnie ścieżkami sprawiedliwości ze względu na imię swoje.” (Psalm 23,1-3)",
      dedication:
        "Dedykacja Muzyczna: Dla Wandy - z wdzięcznością za lata wspólnej drogi.",
      videoUrl: "https://www.youtube.com/embed/-6rv3cb-nuE?si=8uPzgR-I0N-oBq-6",
      icon: <Star className="w-8 h-8 text-[#C5A059]" />,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[11000] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 sm:px-10 py-8 border-b border-[#C5A059]/20 flex justify-between items-center bg-black/40 relative z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-600 fill-current animate-pulse" />
              <span>
                PATRON | <span className="text-[#C5A059]">MECENAS KULTURY</span>
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">
              Dziękczynienie za Współpracowników Królestwa Bożego
            </p>
          </div>
          <button
            aria-label="Zamknij"
            onClick={onClose}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-20 pb-20">
            {/* Intro Text */}
            <div className="text-center space-y-6 max-w-3xl mx-auto mb-16 px-4">
              <h2 className="text-3xl font-black text-[#C5A059] uppercase tracking-widest italic font-serif">
                „Dziękuję Bogu mojemu za każdym razem, gdy was wspominam”
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed tracking-wide uppercase font-black opacity-80">
                Ta strona jest wyrazem naszej głębokiej wdzięczności wobec osób,
                które swoją postawą i wsparciem czynią misję Christian Culture
                możliwą. Niech ten wpis będzie trwałym świadectwem Waszego
                oddania dla Jezusa.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
            </div>

            {/* patrons List */}
            <div className="space-y-32">
              {patrons.map((patron, index) => (
                <motion.div
                  key={patron.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-8 order-2 lg:order-1">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] border border-[#C5A059]/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          {patron.icon}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter">
                            {patron.name}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {patron.badge}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[#C5A059] text-xs font-black uppercase tracking-widest border-l-2 border-[#C5A059] pl-4">
                          {patron.title}
                        </h4>
                        <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                          {patron.description}
                        </p>
                      </div>

                      {/* Prayer & Blessing in Lora */}
                      <div className="bg-zinc-900/60 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-3xl">
                        <div className="space-y-4">
                          <h5 className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span>Modlitwa za Patrona</span>
                          </h5>
                          <p
                            className="text-zinc-200 text-lg sm:text-xl italic font-serif leading-relaxed"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {patron.prayer}
                          </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                          <h5 className="flex items-center gap-2 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">
                            <Star className="w-4 h-4 text-[#C5A059]" />
                            <span>Błogosławieństwo Słowa Bożego</span>
                          </h5>
                          <p
                            className="text-[#C5A059] text-xl sm:text-2xl font-bold font-serif leading-tight text-glow-gold"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {patron.blessing}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Media Side */}
                    <div className="order-1 lg:order-2 space-y-6">
                      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-[#C5A059]/40 shadow-[0_0_50px_rgba(197,160,89,0.2)] group-hover:shadow-[0_0_80px_rgba(197,160,89,0.3)] transition-all duration-700">
                        <iframe
                          title="Wideo Patroni CC"
                          width="100%"
                          height="100%"
                          src={patron.videoUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      </div>
                      <div className="flex items-center gap-3 justify-center py-4 glass rounded-3xl border border-white/5">
                        <Music className="w-5 h-5 text-[#C5A059]" />
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                          {patron.dedication}
                        </span>
                      </div>
                    </div>
                  </div>

                  {index < patrons.length - 1 && (
                    <div className="mt-32 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Call */}
            <div className="pt-20 text-center space-y-8 animate-fade-in">
              <div className="inline-block p-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-4 w-full max-w-sm" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                Chcesz dołączyć do grona{" "}
                <span className="text-[#C5A059]">Mecenasów Kultury?</span>
              </h3>
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("cc_open_support"))
                }
                className="px-12 py-6 bg-gold-dark text-black font-black text-xs uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Wspieraj Misję Christian Culture
              </button>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-12">
                Zrób to Dla Jezusa – On już czeka.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CcPatronsPage;
