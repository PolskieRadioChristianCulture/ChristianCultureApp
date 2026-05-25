import fs from 'fs';

let content = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

const buttonCode = `
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dailyVerse) {
                              onOpenDailyVerseModal(dailyVerse);
                            }
                          }}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F2D08C] hover:text-white transition-all active:scale-90 shadow-xl border border-white/5"
                          title={appLanguage === "pl" ? "Czytaj Biblię" : "Read Bible"}
                        >
                          <BookText className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>`;

content = content.replace(
  /<div className="flex flex-row items-center justify-center gap-3 sm:gap-4">\s*<button\s*onClick=\{\(e\) => \{\s*e.stopPropagation\(\);\s*setIsVerseGeneratorOpen\(true\);/g,
  `<div className="flex flex-row items-center justify-center gap-3 sm:gap-4">${buttonCode}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVerseGeneratorOpen(true);`
);

fs.writeFileSync('components/RadioModePlayer.tsx', content);
console.log('done');
