import fs from 'fs';

let content = fs.readFileSync('components/TopNewsTicker.tsx', 'utf8');

// Replace all backgrounds like bg-black/40, bg-emerald-700, bg-indigo-700, bg-green-600, bg-red-600, bg-purple-600, bg-[#8b7346], bg-amber-600, bg-black etc. with bg-[#DFB467]
const replacements = [
  { match: /bg-black\/40/g, replace: "bg-[#DFB467]" },
  { match: /bg-emerald-700/g, replace: "bg-[#DFB467]" },
  { match: /bg-indigo-700/g, replace: "bg-[#DFB467]" },
  { match: /bg-green-600/g, replace: "bg-[#DFB467]" },
  { match: /bg-red-600/g, replace: "bg-[#DFB467]" },
  { match: /bg-purple-600/g, replace: "bg-[#DFB467]" },
  { match: /bg-\[#8b7346\]/g, replace: "bg-[#DFB467]" },
  { match: /bg-amber-600/g, replace: "bg-[#DFB467]" },
  { match: /(className={`w-full )bg-black/g, replace: "$1bg-[#DFB467]"}
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

// For text color, where text-white is used inside these bars, we should change to text-black for visibility on gold!
// Let's replace 'text-white' with 'text-black' inside the TopNewsTicker? That might be too broad.
// Only the left markers have: 
// <span className="text-[7px] sm:text-[10px] font-black text-white 
// Let's replace "font-black text-white" with "font-black text-black"
content = content.replace(/font-black text-white/g, "font-black text-black");

fs.writeFileSync('components/TopNewsTicker.tsx', content, 'utf8');
