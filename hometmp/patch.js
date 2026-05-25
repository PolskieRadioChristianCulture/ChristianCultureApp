const fs = require('fs');
let code = fs.readFileSync('./components/RadioModePlayer.tsx', 'utf8');

code = code.replace(
  /<div className="flex flex-row items-center gap-4 transition-all duration-300">/g,
  '<div className="flex flex-col items-center gap-2 sm:gap-4 transition-all duration-300 w-full">'
);

code = code.replace(
  /\) : \(\n\s*<>\n\s*<button\n\s*onClick={\(e\) => {\n\s*e\.stopPropagation\(\);\n\s*setIsVerseGeneratorOpen\(true\);/g,
  `) : (
                      <>
                        <div className="flex flex-row items-center justify-center gap-4 w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVerseGeneratorOpen(true);`
);

code = code.replace(
  /<Share className="w-4 h-4 sm:w-5 sm:h-5" \/>\n\s*<\/button>\n\s*<button\n\s*onClick={\(e\) => {\n\s*e\.stopPropagation\(\);\n\s*const currFonts = \['lora', 'sans', 'serif', 'mono'\];/g,
  `<Share className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currFonts = ['lora', 'sans', 'serif', 'mono'];`
);

code = code.replace(
  /\} \}\n\s*className="p-2 ml-2 sm:ml-4 rounded-full bg-white\/10 /g,
  `} }
                          className="p-2 rounded-full bg-white/10 `
);

code = code.replace(
  /A\+\n\s*<\/button>\n\s*\n\s*<\/>\n\s*\)}/g,
  `A+
                        </button>
                        </div>
                      </>
                    )}`
);

fs.writeFileSync('./components/RadioModePlayer.tsx', code);
console.log('patched successfully!');
