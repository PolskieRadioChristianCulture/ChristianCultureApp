module.exports = {
  files: 'components/RadioModePlayer.tsx',
  from: /<div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-start pl-3 gap-2 z-10">\s*<button\s*onClick=\{\(\) => window\.open\(ytUrl, "_blank"\)\}\s*className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6"\s*title="YouTube"\s*>\s*<svg\s*className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-\[0_0_5px_rgba\(220,38,38,0\.5\)\]"\s*viewBox="0 0 24 24"\s*>\s*<path d="M19\.615 3\.184c-3\.604-\.246-11\.631-\.245-15\.23 0-3\.897\.266-4\.356 2\.62-4\.385 8\.816\.029 6\.185\.484 8\.549 4\.385 8\.816 3\.6\.245 11\.626\.246 15\.23 0 3\.897-\.266 4\.356-2\.62 4\.385-8\.816-\.029-6\.185-\.484-8\.549-4\.385-8\.816zm-10\.615 12\.816v-8l8 3\.993-8 4\.007z" \/>\s*<\/svg>\s*<\/button>/g,
  to: `<div className="w-24 sm:w-32 flex-shrink-0 flex-grow-0 flex items-center justify-start pl-3 gap-2 z-10">
                  <button
                    onClick={() => window.open(ytUrl, "_blank")}
                    className="group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all w-6 h-6 shrink-0"
                    title="YouTube"
                  >
                    <svg
                      className="w-4 h-4 text-red-600 fill-current relative z-10 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </button>
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
                  </button>`
};
