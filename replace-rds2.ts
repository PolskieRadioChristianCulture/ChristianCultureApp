import fs from 'fs';

const file = 'components/RadioModePlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Conditionally hide the main toggle button (mobile views)
content = content.replace(
  /<div className="w-full flex justify-center mt-3 z-20 relative">[\s\S]*?<RadioIcon className="w-3 h-3" \/>.*?<\/button>\s*<\/div>/g,
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
  /<div className="w-full flex justify-center mt-4 z-20 relative">[\s\S]*?<RadioIcon className="w-3.5 h-3.5" \/>.*?<\/button>\s*<\/div>/g,
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

// 3. Put back the small RDS button
const smallButtonMobile = `</button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRdsVisible(prev => {
                        const next = !prev;
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cc_rds_visible", String(next));
                        }
                        return next;
                      });
                    }}
                    className={\`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all h-5 px-1.5 rounded border text-[7px] font-black uppercase tracking-widest shrink-0 \${isRdsVisible ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/30 shadow-[0_0_8px_rgba(197,160,89,0.2)]" : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500"}\`}
                    title="Toggle RDS"
                  >
                    RDS
                  </button>`;

const smallButtonDesktop = `</button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRdsVisible(prev => {
                        const next = !prev;
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cc_rds_visible", String(next));
                        }
                        return next;
                      });
                    }}
                    className={\`group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all h-6 sm:h-7 px-2 rounded border text-[8px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 \${isRdsVisible ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/30 shadow-[0_0_8px_rgba(197,160,89,0.2)]" : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500"}\`}
                    title="Toggle RDS"
                  >
                    RDS
                  </button>`;

content = content.replace(
  /className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-\[0_0_5px_rgba\(220,38,38,0\.5\)\]"[\s\S]*?<\/svg>\s*<\/button>/g,
  `className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />` + `</svg>\n                  ` + smallButtonMobile
);

content = content.replace(
  /className="w-5 h-5 sm:w-6 h-6 text-red-600 fill-current relative z-10 drop-shadow-\[0_0_8px_rgba\(220,38,38,0\.5\)\]"[\s\S]*?<\/svg>\s*<\/button>/g,
  `className="w-5 h-5 sm:w-6 h-6 text-red-600 fill-current relative z-10 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />` + `</svg>\n                  ` + smallButtonDesktop
);

fs.writeFileSync(file, content);
console.log("Done");
