import fs from 'fs';

const file = 'components/RadioModePlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Conditionally hide the main toggle button (mobile views)
content = content.replace(
  /<div className="w-full flex justify-center mt-3 z-20 relative">[\s\S]*?Odtwarzacz RDS"\}\s*<\/button>\s*<\/div>/g,
  `{!isRdsVisible && <div className="w-full flex justify-center mt-3 z-20 relative">
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
                  className={\`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-lg bg-[#C5A059]/5 border-white/5 text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10\`}
               >
                 <RadioIcon className="w-3 h-3" /> Odtwarzacz RDS
               </button>
            </div>}`
);

// 2. Conditionally hide the main toggle button (desktop view)
content = content.replace(
  /<div className="w-full flex justify-center mt-4 z-20 relative">[\s\S]*?Odtwarzacz RDS"\}\s*<\/button>\s*<\/div>/g,
  `{!isRdsVisible && <div className="w-full flex justify-center mt-4 z-20 relative">
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
                  className={\`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg bg-[#C5A059]/5 border-white/5 text-[#C5A059]/50 hover:text-[#C5A059]/80 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10\`}
               >
                 <RadioIcon className="w-3.5 h-3.5" /> Odtwarzacz RDS
               </button>
            </div>}`
);

fs.writeFileSync(file, content);
console.log("Done replace 3");
