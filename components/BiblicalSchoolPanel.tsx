import React from "react";
import {
  APP_VERSION,
  UserPersona,
  USER_ROLES,
  fixOrphans,
  SupportedLanguage,
} from "../types";
import { Separator } from "./Separator";
import { useAppStore } from "../useAppStore";
import { NotificationService } from "../services/notificationService";
import { getHeroImageForLesson } from "./LessonReadingModal";
import { SchemaInjector } from "./SchemaInjector";

interface BiblicalSchoolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  userPersona: UserPersona;
  onUpdateUserPersonaStatus: (status: string, startDate?: string) => void;
  onOpenLesson: (title: string, imageUrl?: string) => void;
  onOpenRadioMode: () => void;
  onOpenDashboard: () => void;
  onShareApp: () => void;
  isTickerExpanded?: boolean;
  isLandscape?: boolean;
}

export const BiblicalSchoolPanel: React.FC<BiblicalSchoolPanelProps> = ({
  isOpen,
  onClose,
  appLanguage,
  userPersona,
  onUpdateUserPersonaStatus,
  onOpenLesson,
  onOpenRadioMode,
  onOpenDashboard,
  onShareApp,
  isTickerExpanded = false,
  isLandscape = false,
}) => {
  const currentRole =
    userPersona.personalStatus ||
    (appLanguage === "pl"
      ? "Cyfrowy Świadek Chrystusa"
      : "Digital Witness of Christ");
  const { setUserPersona } = useAppStore();

  const handleFrequencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const val = e.target.value as "daily" | "weekly" | "biweekly";
    const newPersona = { ...userPersona, lessonFrequency: val };
    setUserPersona(newPersona);
    // Zintegruj z powiadomieniami
    await NotificationService.scheduleAll(newPersona);
  };

  const handleLessonClick = (lessonTitle: string, imageUrl?: string) => {
    onOpenLesson(lessonTitle, imageUrl);
  };

  const LESSON_CATEGORIES = [
    {
      id: "beliefs",
      title_pl: "Biblijne Zasady Wiary",
      title_en: "Biblical Fundamental Beliefs",
      lessons: [
        {
          id: "belief_1",
          title_pl: "Pismo Święte",
          title_en: "The Holy Scriptures",
          icon: "📖",
          image: "/lessons/1.webp",
        },
        {
          id: "belief_2",
          title_pl: "Trójca",
          title_en: "The Trinity",
          icon: "✨",
          image: "/lessons/2.webp",
        },
        {
          id: "belief_3",
          title_pl: "Bóg Ojciec",
          title_en: "God the Father",
          icon: "👑",
          image: "/lessons/3.webp",
        },
        {
          id: "belief_4",
          title_pl: "Bóg Syn",
          title_en: "God the Son",
          icon: "✝️",
          image: "/lessons/4.webp",
        },
        {
          id: "belief_5",
          title_pl: "Bóg Duch Święty",
          title_en: "God the Holy Spirit",
          icon: "🕊️",
          image: "/lessons/5.webp",
        },
        {
          id: "belief_6",
          title_pl: "Stworzenie",
          title_en: "Creation",
          icon: "🌍",
          image: "/lessons/6.webp",
        },
        {
          id: "belief_7",
          title_pl: "Natura ludzka",
          title_en: "The Nature of Humanity",
          icon: "👤",
          image: "/lessons/7.webp",
        },
        {
          id: "belief_8",
          title_pl: "Wielki Bój",
          title_en: "The Great Controversy",
          icon: "⚔️",
          image: "/lessons/8.webp",
        },
        {
          id: "belief_9",
          title_pl: "Życie, śmierć i zmartwychwstanie Chrystusa",
          title_en: "The Life, Death, and Resurrection of Christ",
          icon: "🌅",
          image: "/lessons/9.webp",
        },
        {
          id: "belief_10",
          title_pl: "Doświadczenie zbawienia",
          title_en: "The Experience of Salvation",
          icon: "🛡️",
          image: "/lessons/10.webp",
        },
        {
          id: "belief_11",
          title_pl: "Wzrastanie w Chrystusie",
          title_en: "Growing in Christ",
          icon: "🌱",
          image: "/lessons/11.webp",
        },
        {
          id: "belief_12",
          title_pl: "Kościół Boży",
          title_en: "The Church of God",
          icon: "⛪",
          image: "/lessons/12.webp",
        },
        {
          id: "belief_13",
          title_pl: "Ostatek i jego misja",
          title_en: "The Remnant and Its Mission",
          icon: "🔥",
          image: "/lessons/13.webp",
        },
        {
          id: "belief_14",
          title_pl: "Jedność Ciała Chrystusa",
          title_en: "Unity in the Body of Christ",
          icon: "🤝",
          image: "/lessons/14.webp",
        },
        {
          id: "belief_15",
          title_pl: "Chrzest",
          title_en: "Baptism",
          icon: "💧",
          image: "/lessons/15.webp",
        },
        {
          id: "belief_16",
          title_pl: "Wieczerza Pańska",
          title_en: "The Lord Supper",
          icon: "🍞",
          image: "/lessons/16.webp",
        },
        {
          id: "belief_17",
          title_pl: "Dary i posługi duchowe",
          title_en: "Spiritual Gifts and Ministries",
          icon: "🎁",
          image: "/lessons/17.webp",
        },
        {
          id: "belief_18",
          title_pl: "Dar proroctwa",
          title_en: "The Gift of Prophecy",
          icon: "👁️",
          image: "/lessons/18.webp",
        },
        {
          id: "belief_19",
          title_pl: "Prawo Boże",
          title_en: "The Law of God",
          icon: "📜",
          image: "/lessons/19.webp",
        },
        {
          id: "belief_20",
          title_pl: "Szabat",
          title_en: "The Sabbath",
          icon: "🕯️",
          image: "/lessons/20.webp",
        },
        {
          id: "belief_21",
          title_pl: "Szafarstwo",
          title_en: "Stewardship",
          icon: "⚖️",
          image: "/lessons/21.webp",
        },
        {
          id: "belief_22",
          title_pl: "Chrześcijańskie zachowanie",
          title_en: "Christian Behavior",
          icon: "🤍",
          image: "/lessons/22.webp",
        },
        {
          id: "belief_23",
          title_pl: "Małżeństwo i rodzina",
          title_en: "Marriage and the Family",
          icon: "👨‍👩‍👧‍👦",
          image: "/lessons/23.webp",
        },
        {
          id: "belief_24",
          title_pl: "Służba Chrystusa w niebiańskiej świątyni",
          title_en: "Christ Ministry in the Heavenly Sanctuary",
          icon: "🏛️",
          image: "/lessons/24.webp",
        },
        {
          id: "belief_25",
          title_pl: "Powtórne przyjście Chrystusa",
          title_en: "The Second Coming of Christ",
          icon: "☁️",
          image: "/lessons/25.webp",
        },
        {
          id: "belief_26",
          title_pl: "Śmierć i zmartwychwstanie",
          title_en: "Death and Resurrection",
          icon: "⚰️",
          image: "/lessons/26.webp",
        },
        {
          id: "belief_27",
          title_pl: "Tysiąclecie i koniec grzechu",
          title_en: "The Millennium and the End of Sin",
          icon: "⛓️",
          image: "/lessons/27.webp",
        },
        {
          id: "belief_28",
          title_pl: "Nowa Ziemia",
          title_en: "The New Earth",
          icon: "🏞️",
          image: "/lessons/28.webp",
        },
      ],
    },

    {
      id: "sanctification",
      title_pl: "Uświęcenie i Wzrost Duchowy",
      title_en: "Sanctification and Spiritual Growth",
      lessons: [
        {
          id: "prayer",
          title_pl: "Moc Modlitwy",
          title_en: "The Power of Prayer",
          icon: "🙏",
          image: "/backgrounds/2.webp",
        },
        {
          id: "word",
          title_pl: "Życie Słowem Bożym",
          title_en: "Living by the Word of God",
          icon: "📖",
          image: "/lessons/1.webp",
        },
        {
          id: "fasting",
          title_pl: "Dyscyplina Postu",
          title_en: "The Discipline of Fasting",
          icon: "🍞",
          image: "/backgrounds/3.webp",
        },
        {
          id: "holyspirit",
          title_pl: "Prowadzenie Ducha Świętego",
          title_en: "Guidance of the Holy Spirit",
          icon: "🕊️",
          image: "/lessons/5.webp",
        },
      ],
    },
    {
      id: "theology",
      title_pl: "Fundamenty Teologiczne",
      title_en: "Theological Foundations",
      lessons: [
        {
          id: "trinity",
          title_pl: "Nauka o Trójjedynym Bogu",
          title_en: "The Doctrine of the Triune God",
          icon: "✨",
          image: "/lessons/2.webp",
        },
        {
          id: "christology",
          title_pl: "Kim jest Jezus Chrystus?",
          title_en: "Who is Jesus Christ?",
          icon: "👑",
          image: "/backgrounds/4.webp",
        },
        {
          id: "soteriology",
          title_pl: "Zbawienie przez Łaskę",
          title_en: "Salvation by Grace",
          icon: "✝️",
          image: "/backgrounds/5.webp",
        },
        {
          id: "eschatology",
          title_pl: "Czasy Ostateczne",
          title_en: "The End Times",
          icon: "⏳",
          image: "/backgrounds/7.webp",
        },
      ],
    },
    {
      id: "evangelism",
      title_pl: "Ewangelizacja i Misja",
      title_en: "Evangelism and Mission",
      lessons: [
        {
          id: "greatcommission",
          title_pl: "Wielkie Posłannictwo",
          title_en: "The Great Commission",
          icon: "🌎",
          image: "/backgrounds/8.webp",
        },
        {
          id: "witnessing",
          title_pl: "Skuteczne Świadectwo",
          title_en: "Effective Witnessing",
          icon: "🗣️",
          image: "/backgrounds/9.webp",
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[4000] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[4001] bg-black transform transition-all duration-700 ease-in-out overflow-hidden flex flex-col ${isTickerExpanded ? "top-[calc(52px+env(safe-area-inset-top,0px))] sm:top-[calc(140px+env(safe-area-inset-top,0px))]" : "top-[calc(28px+env(safe-area-inset-top,0px))] sm:top-[calc(92px+env(safe-area-inset-top,0px))]"} ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        {/* Dekoracja tła */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        <div className="flex justify-between items-center px-8 sm:px-10 py-8 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/80 backdrop-blur-xl border-b border-white/5 flex-shrink-0 relative z-50">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
              {appLanguage === "pl" ? "Szkoła" : "Biblical"}{" "}
              <span className="text-[#C5A059]">
                {appLanguage === "pl" ? "Biblijna" : "School"}
              </span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
              Christian Culture v{APP_VERSION}
            </p>
          </div>
          <button
            aria-label="Ulubione"
            onClick={onClose}
            className="p-3 bg-zinc-900 rounded-full text-zinc-400 shadow-xl hover:bg-zinc-800 transition-all hover:text-[#C5A059] active:scale-95 border border-zinc-800"
            title={appLanguage === "pl" ? "Zamknij" : "Close"}
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

        <div className="flex-1 overflow-y-auto px-6 sm:px-20 pb-10 space-y-12 relative z-10 scrollbar-hide">
          <div className="max-w-4xl mx-auto w-full space-y-12">
            <div className="bg-[#C5A059]/5 rounded-3xl p-8 border border-[#C5A059]/10 backdrop-blur-sm">
              <p className="text-[#C5A059] text-sm sm:text-lg font-medium italic leading-relaxed text-center">
                {appLanguage === "pl"
                  ? "„Pójdźcie za mną, a uczynię was rybakami ludzi.”"
                  : '"Follow me, and I will make you fishers of men."'}
              </p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-tighter text-center mt-3 font-black">
                Mateusza 4:19
              </p>
            </div>

            <div className="space-y-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5">
              <div className="flex flex-col items-center gap-2 mb-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  {appLanguage === "pl" ? "Twój status:" : "Your status:"}
                </h3>
                <span className="text-[#C5A059] text-xl font-black uppercase tracking-tighter bg-[#C5A059]/10 px-6 py-2 rounded-full border border-[#C5A059]/20">
                  {userPersona.personalStatus ||
                    (appLanguage === "pl"
                      ? USER_ROLES[0].pl
                      : USER_ROLES[0].en)}
                </span>

                {userPersona.badges && userPersona.badges.length > 0 && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                      {appLanguage === "pl"
                        ? "Zdobyte odznaki:"
                        : "Earned badges:"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {userPersona.badges.map((badge, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full"
                        >
                          <span className="text-xl">🏅</span>
                          <span className="text-xs font-black text-[#C5A059] uppercase tracking-tight">
                            {badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userPersona.discipleStartDate ? (
                  <div className="flex flex-col items-center mt-2 w-full">
                    <p className="text-zinc-400 text-xs text-center mb-4">
                      {appLanguage === "pl"
                        ? `Jesteś uczniem Jezusa od ${new Date(userPersona.discipleStartDate).toLocaleDateString()}, to już ${Math.floor((Date.now() - new Date(userPersona.discipleStartDate).getTime()) / (1000 * 3600 * 24))} dni, a cała wieczność jeszcze przed Tobą.`
                        : `You have been a disciple of Jesus since ${new Date(userPersona.discipleStartDate).toLocaleDateString()}, it's been ${Math.floor((Date.now() - new Date(userPersona.discipleStartDate).getTime()) / (1000 * 3600 * 24))} days, and all eternity is still ahead of you.`}
                    </p>
                    <div className="w-full flex-col flex items-center bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/40 p-4 rounded-xl border border-white/5">
                      <label
                        htmlFor="lesson-frequency"
                        className="text-zinc-500 text-[10px] uppercase mb-2 font-black"
                      >
                        {appLanguage === "pl"
                          ? "CZĘSTOTLIWOŚĆ PRZYPOMNIEŃ O LEKCJACH:"
                          : "LESSON REMINDER FREQUENCY:"}
                      </label>
                      <select
                        id="lesson-frequency"
                        value={userPersona.lessonFrequency || "weekly"}
                        onChange={handleFrequencyChange}
                        className="bg-black text-[#C5A059] p-3 rounded-lg border border-white/10 text-xs focus:border-[#C5A059] outline-none w-full max-w-[250px] font-black uppercase tracking-tight"
                      >
                        <option value="daily">
                          {appLanguage === "pl" ? "Codziennie" : "Daily"}
                        </option>
                        <option value="weekly">
                          {appLanguage === "pl" ? "Co tydzień" : "Weekly"}
                        </option>
                        <option value="biweekly">
                          {appLanguage === "pl"
                            ? "Co dwa tygodnie"
                            : "Biweekly"}
                        </option>
                      </select>
                      <p className="text-zinc-600 text-[9px] uppercase mt-3 text-center">
                        {appLanguage === "pl"
                          ? "Otrzymasz powiadomienia systemowe Android o nadchodzących lekcjach."
                          : "You will receive Android system notifications for upcoming lessons."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-4 w-full">
                    <p className="text-zinc-500 text-[10px] uppercase mb-2">
                      {appLanguage === "pl"
                        ? "Ustaw datę rozpoczęcia:"
                        : "Set start date:"}
                    </p>
                    <input
                      type="date"
                      className="bg-zinc-800 text-white p-2 rounded-lg border border-white/10 text-sm focus:border-[#C5A059] outline-none"
                      onChange={(e) => {
                        if (e.target.value) {
                          onUpdateUserPersonaStatus(
                            appLanguage === "pl"
                              ? USER_ROLES[1].pl
                              : USER_ROLES[1].en,
                            e.target.value,
                          );
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              {!userPersona.discipleStartDate && (
                <button
                  onClick={() => {
                    const now = new Date().toISOString().split("T")[0];
                    onUpdateUserPersonaStatus(
                      appLanguage === "pl"
                        ? USER_ROLES[1].pl
                        : USER_ROLES[1].en,
                      now,
                    );
                  }}
                  className="w-full py-5 bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  {appLanguage === "pl"
                    ? "ZOSTAŃ UCZNIEM JEZUSA CHRYSTUSA"
                    : "BECOME A DISCIPLE OF JESUS CHRIST"}
                </button>
              )}
            </div>

            {LESSON_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-6">
                <Separator
                  text={
                    appLanguage === "pl" ? category.title_pl : category.title_en
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.lessons.map((lesson) => {
                    const isCompleted = userPersona.completedLessons?.includes(
                      appLanguage === "pl" ? lesson.title_pl : lesson.title_en,
                    );
                    return (
                      <button
                        aria-label="Ulubione"
                        key={lesson.id}
                        onClick={() =>
                          handleLessonClick(
                            appLanguage === "pl"
                              ? lesson.title_pl
                              : lesson.title_en,
                            lesson.image,
                          )
                        }
                        className="relative overflow-hidden flex flex-col p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-[#C5A059]/40 transition-all group shadow-2xl hover:shadow-[0_0_40px_rgba(197,160,89,0.15)] text-left min-h-[160px] sm:min-h-[180px]"
                      >
                        <img
                          src={
                            lesson.image ||
                            getHeroImageForLesson(
                              appLanguage === "pl"
                                ? lesson.title_pl
                                : lesson.title_en,
                            )
                          }
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700 z-0"
                          style={{ filter: "brightness(0.65) contrast(1.1)" }}
                          loading="eager"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("backgrounds")) {
                              target.src = "/backgrounds/6.webp";
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-[1]" />

                        <div className="relative z-10 flex-1 flex flex-col justify-between w-full">
                          <div className="flex justify-between items-start w-full">
                            <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-lg shadow-lg">
                              {lesson.icon}
                            </div>
                            {isCompleted ? (
                              <span className="bg-[#C5A059] text-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-1 shadow-lg">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {appLanguage === "pl" ? "Zaliczona" : "Done"}
                              </span>
                            ) : (
                              <span className="bg-black/60 backdrop-blur-md text-zinc-400 border border-white/10 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black shadow-lg">
                                {category.id.substring(0, 3).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-end justify-between w-full">
                            <div className="flex-1 pr-4">
                              <div
                                className={`text-base sm:text-lg font-black text-white uppercase tracking-tighter group-hover:text-[#C5A059] transition-colors leading-tight drop-shadow-xl`}
                              >
                                {appLanguage === "pl"
                                  ? lesson.title_pl
                                  : lesson.title_en}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059] group-hover:text-black transition-colors">
                              <svg
                                className="w-4 h-4 text-white/50 group-hover:text-black group-hover:translate-x-0.5 transition-all"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <SchemaInjector
              type="EducationalOccupationalProgram"
              data={{
                name:
                  appLanguage === "pl"
                    ? "Wirtualny Uniwersytet Biblijny CC"
                    : "CC Virtual Biblical University",
                provider: {
                  "@type": "Organization",
                  name: "Christian Culture",
                },
                hasCourse: LESSON_CATEGORIES.flatMap((c) => c.lessons).map(
                  (l) => ({
                    "@type": "Course",
                    name: appLanguage === "pl" ? l.title_pl : l.title_en,
                    description: "Biblical Studies Lesson",
                  }),
                ),
              }}
            />
          </div>
        </div>

        <div className="px-6 sm:px-20 py-10 border-t border-white/5 bg-black/80 backdrop-blur-xl flex-shrink-0 relative z-20">
          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              aria-label="Ulubione"
              onClick={onShareApp}
              className="py-5 bg-zinc-900 text-[#C5A059] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl text-[10px] border border-white/5 flex items-center justify-center gap-3 active:scale-95 transition-all order-2 sm:order-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {appLanguage === "pl" ? "UDOSTĘPNIJ APLIKACJĘ" : "SHARE APP"}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRadioMode();
              }}
              className="py-5 bg-gradient-to-r from-[#C5A059] to-[#B49048] text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl text-xs active:scale-95 transition-all order-1 sm:order-2"
            >
              {appLanguage === "pl" ? "POWRÓT DO RADIA" : "BACK TO RADIO"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
