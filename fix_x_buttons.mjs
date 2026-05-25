import fs from 'fs';

const filePath = 'components/TopNewsTicker.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// First make all flex-1 containers relative if they contain an X button
content = content.replace(/<div className="flex-1 h-full overflow-hidden flex items-center group cursor-default scrollbar-hide">/g, 
  '<div className="relative flex-1 h-full overflow-hidden flex items-center group cursor-default scrollbar-hide">');
content = content.replace(/<div className="flex-1 h-full overflow-hidden flex items-center">/g, 
  '<div className="relative flex-1 h-full overflow-hidden flex items-center">');

// Now replace the X button styling to be absolute on the right
content = content.replace(/className="flex-shrink-0 p-1 text-black\/50 hover:text-black transition-colors z-10 bg-\[#DFB467\]"/g,
  'className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-[#DFB467] via-[#DFB467] to-transparent text-black/50 hover:text-black transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"');

content = content.replace(/className="flex-shrink-0 p-1 text-white\/50 hover:text-white transition-colors z-10 bg-\[#DFB467\]"/g,
  'className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-[#DFB467] via-[#DFB467] to-transparent text-white/50 hover:text-white transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"');

content = content.replace(/className="flex-shrink-0 p-1 text-gold\/50 hover:text-gold transition-colors z-10 bg-black pr-4"/g,
  'className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-black via-black to-transparent text-[#C5A059]/50 hover:text-[#C5A059] transition-colors z-10 flex items-center justify-center cursor-pointer pointer-events-auto"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
