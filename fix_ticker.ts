import fs from 'fs';

let content = fs.readFileSync('components/TopNewsTicker.tsx', 'utf8');

content = content.replace(
  /w-full bg-gold border-b border-black\/10 shadow-2xl/g,
  `w-full bg-gradient-to-r from-[#DFB467] to-[#C5A059] shadow-[0_5px_25px_rgba(0,0,0,0.6)] border-b border-black/20`
);

// Oh and there is the CC NEWS button itself!
// "w-[110px] sm:w-[180px] h-full pointer-events-auto rounded-br-xl transition-colors duration-700 hover:brightness-110 ..."
// Let's find it.
content = content.replace(
  /className=\{\`w-\[110px\] sm:w-\[180px\] h-full pointer-events-auto rounded-br-xl flex items-center justify-center cursor-pointer transition-colors duration-700 hover:brightness-110 \$\{[\s\S]*?\}\`\}/g,
  `className={\`w-[110px] sm:w-[180px] h-full pointer-events-auto rounded-br-xl flex items-center justify-center cursor-pointer transition-colors duration-700 hover:brightness-110 \${isExpanded ? "bg-gradient-to-r from-[#DFB467] to-[#C5A059] shadow-[0_5px_25px_rgba(0,0,0,0.6)] border-black/20 text-zinc-900" : "bg-transparent drop-shadow-md border-transparent text-white"}\`}`
);


fs.writeFileSync('components/TopNewsTicker.tsx', content);
