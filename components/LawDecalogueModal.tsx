import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Scale, Book, ScrollText, ShieldCheck } from "lucide-react";

interface LawDecalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: "pl" | "en";
}

const CATECHISM_DECALOGUE = [
  "1. NIE BĘDZIESZ MIAŁ BOGÓW CUDZYCH PRZEDE MNĄ",
  "2. NIE BĘDZIESZ BRAŁ IMIENIA JAHWE, BOGA SWEGO, NADAREMNIE",
  "3. PAMIĘTAJ, ABYŚ DZIEŃ ŚWIĘTY ŚWIĘCIŁ",
  "4. CZCIJ OJCA SWEGO I MATKĘ SWOJĄ",
  "5. NIE ZABIJAJ",
  "6. NIE CUDZOŁÓŻ",
  "7. NIE KRADNIJ",
  "8. NIE MÓW FAŁSZYWEGO ŚWIADECTWA PRZECIW BLIŹNIEMU SWEMU",
  "9. NIE POŻĄDAJ ŻONY BLIŹNIEGO SWEGO",
  "10. ANI ŻADNEJ RZECZY, KTÓRA JEGO JEST",
];

const BIBLE_DECALOGUE = [
  {
    num: "I",
    text: "Nie będziesz miał bogów cudzych przede mną.",
  },
  {
    num: "II",
    text: "Nie uczynisz sobie obrazu rytego ani żadnej podobizny tego, co jest na niebie w górze i co na ziemi nisko, ani z tych rzeczy, które są w wodach pod ziemią. Nie będziesz się im kłaniał ani służył. Ja jestem Jahwe, Bóg twój, mocny, zawistny, karzący nieprawość ojców na synach do trzeciego i czwartego pokolenia tych, którzy mnie nienawidzą; a czyniący miłosierdzie tysiącom tych, którzy mię miłują i strzegą przykazań moich.",
  },
  {
    num: "III",
    text: "Nie będziesz brał imienia Jahwe, Boga twego, nadaremno; bo nie będzie miał Jahwe za niewinnego tego, który by wziął imię Jahwe, Boga swego, nadaremno.",
  },
  {
    num: "IV",
    text: "Pamiętaj, abyś dzień sobotni święcił. Sześć dni robic będziesz i będziesz wykonywał wszystkie roboty twoje; ale dnia siódmego sabat Jahwe, Boga twego, jest: nie będziesz wykonywał weń żadnej roboty, ty i syn twój, i córka twoja, sługa twój i służebnica twoja, bydlę twoje i gość, który jest między bramami twymi. Przez sześć dni bowiem czynił Jahwe niebo i ziemię, i morze, i wszystko, co w nich jest, a odpoczął dnia siódmego; i dlatego pobłogosławił Jahwe dniowi sobotniemu i poświęcił go.",
  },
  {
    num: "V",
    text: "Czcij ojca twego i matkę twoją, abyś długo żył na ziemi, którą Jahwe, Bóg twój, da tobie.",
  },
  {
    num: "VI",
    text: "Nie będziesz zabijał.",
  },
  {
    num: "VII",
    text: "Nie będziesz cudzołożył.",
  },
  {
    num: "VIII",
    text: "Nie będziesz kradzieży czynił.",
  },
  {
    num: "IX",
    text: "Nie będziesz mówił fałszywego świadectwa przeciw bliźniemu twemu.",
  },
  {
    num: "X",
    text: "Nie będziesz pożądał domu bliźniego twego, ani będziesz pragnął żony jego, ani sługi, ani służebnicy, ani wołu, ani osła, ani żadnej rzeczy, która jego jest.",
  },
];

export const LawDecalogueModal: React.FC<LawDecalogueModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          className="relative w-full h-full max-w-7xl md:h-[90vh] md:rounded-[40px] border-y md:border border-[#C5A059]/30 bg-[#080808] flex flex-col shadow-[0_0_100px_rgba(197,160,89,0.1)]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#C5A059]/10 via-transparent to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059] flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                <Scale className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#E2B859] tracking-tighter uppercase leading-none">
                  PRAWO — DEKALOG
                </h2>
                <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.3em] mt-1">
                  FUNDAMENT SPRAWIEDLIWOŚCI BOŻEJ
                </p>
              </div>
            </div>
            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group"
            >
              <X className="w-6 h-6 text-zinc-400 group-hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 scrollbar-thin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              {/* Column 1: Catechism */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] border border-white/10">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-[#C5A059]/30 pb-2">
                    Katechizm Kościoła Powszechnego
                  </h3>
                </div>

                <div className="space-y-6">
                  {CATECHISM_DECALOGUE.map((rule, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#C5A059]/5 hover:border-[#C5A059]/30 transition-all group"
                    >
                      <p className="text-zinc-200 font-bold group-hover:text-white transition-colors">
                        {rule}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Column 2: Bible (Wujek) */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] border border-white/10">
                    <Book className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-[#C5A059]/30 pb-2 leading-none">
                      Pismo Święte wg ks. Jakuba Wujka
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                      Wydanie III 1962r.
                    </span>
                  </div>
                </div>

                <div className="space-y-10">
                  {BIBLE_DECALOGUE.map((v, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-12 group"
                    >
                      <div className="absolute left-0 top-0 text-[#C5A059] font-black text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
                        {v.num}.
                      </div>
                      <p
                        className="text-lg text-zinc-300 leading-relaxed group-hover:text-white transition-colors"
                        style={{ fontFamily: "Lora, serif" }}
                      >
                        {v.text}
                      </p>
                    </motion.div>
                  ))}

                  <div className="mt-12 p-8 rounded-3xl bg-[#C5A059]/5 border border-[#C5A059]/20 text-center">
                    <p
                      className="text-[#C5A059] italic text-lg"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      "Ja jestem Jahwe, Bóg twój, którym cię wywiódł z ziemi
                      Egipskiej, z domu niewoli."
                    </p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">
                      Księga Wyjścia 20,1-17 (BJW)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-black/40 text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
              Zrób to Dla Jezusa — On już czeka.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
