import fs from 'fs';

const file = 'components/RadioModePlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement1 = `<div className="w-full flex justify-center mt-3 z-20 relative">
               <button 
                  onClick={() => {
                      setIsRdsVisible(prev => {
                        const next = !prev;
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cc_rds_visible", String(next));
                        }
                        return next;
                      });
                    }}
                  className={\`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-lg \${isRdsVisible ? "bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]" : "bg-[#C5A059]/5 border-white/5 border text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10"}\`}
               >
                 <RadioIcon className="w-3 h-3" /> {isRdsVisible ? "Ukryj Odtwarzacz RDS" : "Odtwarzacz RDS"}
               </button>
            </div>
            <div className={\`w-full flex justify-center px-4 sm:px-6 transition-all duration-500 overflow-visible \${isRdsVisible ? (isLandscape ? "h-[42px] mt-2 opacity-100" : "h-[56px] mt-2 opacity-100 scale-y-100") : "h-0 mt-0 opacity-0 scale-y-0 pointer-events-none"}\`}>`;

content = content.replace(
  /<div className="w-full flex justify-center mt-2 px-4 sm:px-6">/g,
  replacement1
);

const replacement2 = `<div className="w-full flex justify-center mt-4 z-20 relative">
               <button 
                  onClick={() => {
                      setIsRdsVisible(prev => {
                        const next = !prev;
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cc_rds_visible", String(next));
                        }
                        return next;
                      });
                    }}
                  className={\`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg \${isRdsVisible ? "bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]" : "bg-[#C5A059]/5 border-white/5 border text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10"}\`}
               >
                 <RadioIcon className="w-3.5 h-3.5" /> {isRdsVisible ? "Ukryj Odtwarzacz RDS" : "Odtwarzacz RDS"}
               </button>
            </div>
            <div className={\`w-full flex justify-center px-4 sm:px-6 transition-all duration-500 overflow-visible \${isRdsVisible ? "h-[64px] mt-6 opacity-100 scale-y-100" : "h-0 mt-0 opacity-0 scale-y-0 pointer-events-none"}\`}>`;

content = content.replace(
  /<div className="w-full flex justify-center px-4 sm:px-6">/g,
  replacement2
);

// We need to remove the small RDS buttons I added inside
const rdsButtonRegex = /<button[\s\S]*?onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setIsRdsVisible[\s\S]*?className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all[^>]*>\s*RDS\s*<\/button>/g;
content = content.replace(rdsButtonRegex, '');

// Also remove the opacity-0 pointer-events-none on the scrolling text container
const scrollingTextRegex1 = /\$\{showVolumeSlider \|\| !isRdsVisible \? "opacity-0 pointer-events-none" : "opacity-100"\}/g;
content = content.replace(scrollingTextRegex1, '${showVolumeSlider ? "opacity-0" : "opacity-100"}');

fs.writeFileSync(file, content);
console.log("Replaced");
