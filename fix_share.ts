import fs from 'fs';

let content = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

const target = `                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareAndCopy();
                    }}
                    className="absolute top-0 right-0 p-2 text-[#C5A059] opacity-0 group-hover/verse:opacity-100 transition-opacity duration-300 z-20 pointer-events-auto"
                    title={appLanguage === "pl" ? "Udostępnij" : "Share"}
                  >
                    <Share className="w-6 h-6" />
                  </button>
`;

content = content.replace(new RegExp(target.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), '');
fs.writeFileSync('components/RadioModePlayer.tsx', content);

console.log('done');
