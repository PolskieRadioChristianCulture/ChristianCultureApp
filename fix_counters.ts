import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// The block we want to update is around 3296.
content = content.replace(
  /<div className=\{\`absolute inset-0 flex items-center justify-center w-full h-full gap-1.5 sm:gap-2 transition-opacity duration-500 ease-in-out \$\{\!showPraying \? "opacity-100" : "opacity-0"\}\`\}>[\s\S]*?<\/span>\s*<\/div>/g,
  `<div className={\`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-500 ease-in-out \${!showPraying ? "opacity-100 scale-100" : "opacity-0 scale-95"}\`}>
                          <div className={\`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-700 \${isTopNewsExpanded ? "bg-gradient-to-r from-black/80 via-black/60 to-black/80 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] border border-black/30" : "bg-transparent border border-transparent shadow-none"}\`}>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0"></div>
                            <span className={\`leading-none pt-[0.0625rem] sm:pt-[0.125rem] text-[0.6875rem] sm:text-[0.8125rem] font-black uppercase transition-colors duration-700 \${isTopNewsExpanded ? "text-gold" : "text-gold"}\`}>
                              <span className="text-white ml-0.5">{count}</span> <span className="hidden sm:inline">{osobyPl} </span>ONLINE
                            </span>
                          </div>
                        </div>`
);

content = content.replace(
  /<div className=\{\`flex items-center justify-center gap-1\.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1\.5 rounded-full transition-all duration-700 \$\{isTopNewsExpanded \? "bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gold\/50 shadow-\[0_0_12px_rgba\(197,160,89,0\.4\)\]" : "bg-transparent border border-transparent shadow-none"\}\`\}>/g,
  `<div className={\`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-700 \${isTopNewsExpanded ? "bg-gradient-to-r from-black/80 via-black/60 to-black/80 border border-black/40 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]" : "bg-transparent border border-transparent shadow-none"}\`}>`
);

content = content.replace(
  /bg-gold shadow-xl border-black\/10/g,
  `bg-gradient-to-r from-[#DFB467] to-[#C5A059] shadow-[0_5px_25px_rgba(0,0,0,0.6)] border-black/20`
);

fs.writeFileSync('App.tsx', content);
