import fs from 'fs';
let code = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

const buttonRegex = /<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+if \(typeof window !== "undefined" && "vibrate" in navigator\) \{\s+navigator\.vibrate\(10\);\s+\}\s+CommunityService\.incrementGlobalCounter\('pray'\)\.catch\(err => console\.error\(err\)\);\s+\}\}\s+className="p-2 flex items-center justify-center gap-1 rounded-full transition-all active:scale-90 shadow-xl border border-white\/5 bg-zinc-900\/80 hover:bg-zinc-800\/80 text-zinc-400 hover:text-white group relative"\s+title=\{appLanguage === 'pl' \? 'Amen \(modlitwa\)' : 'Amen \(prayer\)'\}\s*>\s*<span className="flex items-center justify-center text-\[16px\] sm:text-\[18px\] leading-none" role="img" aria-label="Amen">🙏<\/span>\s*\{globalAmensCount > 0 && \(\s*<span className="text-\[10px\] font-black text-white relative flex h-full items-center ml-1">\s*\+\{globalAmensCount\}\s*<\/span>\s*\)\}\s*<\/button>/g;

const replacement = `<button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== "undefined" && "vibrate" in navigator) {
                              navigator.vibrate(10);
                            }
                            CommunityService.incrementGlobalCounter('pray').catch(err => console.error(err));
                            
                            const newAnimId = Date.now() + Math.random();
                            const randomX = Math.floor(Math.random() * 20) - 10;
                            setPlusAnimations(prev => [...prev, { id: newAnimId, x: randomX }]);
                            setTimeout(() => {
                              setPlusAnimations(prev => prev.filter(anim => anim.id !== newAnimId));
                            }, 800);
                          }}
                          className="p-2 flex items-center justify-center gap-1 rounded-full transition-all active:scale-90 shadow-xl border border-white/5 bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-400 hover:text-white group relative"
                          title={appLanguage === 'pl' ? 'Amen (modlitwa)' : 'Amen (prayer)'}
                        >
                          <span className="flex items-center justify-center text-[16px] sm:text-[18px] leading-none" role="img" aria-label="Amen">🙏</span>
                          
                          {plusAnimations.map(anim => (
                            <span
                              key={anim.id}
                              className="absolute top-0 text-green-400 font-extrabold text-[12px] pointer-events-none z-50 animate-fly-up-plus drop-shadow-md"
                              style={{ left: \`calc(50% + \${anim.x}px)\` }}
                            >
                              +
                            </span>
                          ))}

                          {globalAmensCount > 0 && (
                            <span className="text-[10px] font-black text-white relative flex h-full items-center ml-1">
                              +{globalAmensCount}
                            </span>
                          )}
                        </button>`;

code = code.replace(buttonRegex, replacement);

fs.writeFileSync('components/RadioModePlayer.tsx', code);
console.log("Done updating RadioModePlayer.");
