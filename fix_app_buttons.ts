import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// The bottom action grid buttons - replace bg-zinc-900 with gradients
content = content.replace(
  /className="py-3 sm:py-5 bg-zinc-900 border border-zinc-800 text-\[\#C5A059\] rounded-2xl/g,
  `className="py-3 sm:py-5 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-[inset_0_1px_rgba(255,255,255,0.05)] border border-transparent hover:border-[#C5A059]/50 text-[#C5A059] rounded-2xl`
);

content = content.replace(
  /bg-zinc-900 border-zinc-800 text-\[\#C5A059\] hover:bg-black\/40 hover:border-\[\#C5A059\]/g,
  `bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-[inset_0_1px_rgba(255,255,255,0.05)] border-transparent text-[#C5A059] hover:bg-black hover:border-[#C5A059]/50`
);

// We should also replace bg-black border border-[#C5A059]/30 rounded-2xl p-8 with a nice gradient
content = content.replace(
  /bg-black border border-\[\#C5A059\]\/30 rounded-2xl p-8 max-w-sm w-full text-center relative/g,
  `bg-gradient-to-b from-zinc-900/90 to-black/90 backdrop-blur-xl border border-[#C5A059]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_rgba(255,255,255,0.05)] rounded-2xl p-8 max-w-sm w-full text-center relative`
);

fs.writeFileSync('App.tsx', content);
