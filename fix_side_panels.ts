import fs from 'fs';

const file = 'components/SidePanels.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add state variables
content = content.replace(
  /const \[isChristianInspirationsModalOpen, setIsChristianInspirationsModalOpen\] = React\.useState\(false\);/,
  `const [isChristianInspirationsModalOpen, setIsChristianInspirationsModalOpen] = React.useState(false);
  const [isLeftExpanded, setIsLeftExpanded] = React.useState(false);
  const [isRightExpanded, setIsRightExpanded] = React.useState(false);`
);

// Replace LEFT panel
content = content.replace(
  /\{\/\* LEWY PANEL - DYNAMICZNY \*\/\}\s*<div\s*onClick=\{left\.action\}\s*onKeyDown=\{\(e\) => e\.key === "Enter" && left\.action\(\)\}\s*role="button"\s*tabIndex=\{0\}\s*className=\{\`fixed left-0 z-\[5001\] flex items-center flex-row-reverse transition-all duration-700 cursor-pointer group -translate-x-\[calc\(100\%-40px\)\] outline-none pointer-events-auto\s*top-\[calc\(50\%\+45px\)\] sm:top-\[calc\(50\%\+80px\)\] -translate-y-1\/2 \$\{isZenMode \? "opacity-0 -translate-x-\[150\%\] pointer-events-none" : "opacity-100 hover:translate-x-0 focus:translate-x-0"\}\`\}\s*>\s*<div className="bg-\[\#C5A059\]\/20 backdrop-blur-xl text-\[\#C5A059\] w-10 h-52 sm:h-64 rounded-r-\[2\.2rem\] flex items-center justify-center shadow-\[inset_0_0_20px_rgba\(197,160,89,0\.1\),0_0_20px_rgba\(197,160,89,0\.2\)\] border-r border-y border-\[\#C5A059\]\/40 animate-side-pulse">\s*<span className="\[writing-mode:vertical-rl\] font-black text-\[10px\] sm:text-\[12px\] uppercase tracking-\[0\.4em\] whitespace-nowrap">\s*\{left\.name\}\s*<\/span>\s*<\/div>\s*<div className="bg-gradient-to-br from-zinc-900 via-\[\#0a0a0a\] to-black shadow-\[inset_0_1px_10px_rgba\(255,255,255,0\.05\),_0_0_50px_rgba\(0,0,0,0\.8\)\]\/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white\/10 shadow-2xl rounded-r-lg -ml-1 border-r border-white\/5">/,
  `{/* LEWY PANEL - DYNAMICZNY */}
      <div
        className={\`fixed left-0 z-[5001] flex items-center flex-row-reverse transition-all duration-700 group outline-none pointer-events-auto
          top-[calc(50%+45px)] sm:top-[calc(50%+80px)] -translate-y-1/2 \${isZenMode ? "opacity-0 -translate-x-[150%] pointer-events-none" : (isLeftExpanded ? "opacity-100 translate-x-0" : "opacity-100 -translate-x-[calc(100%-40px)]")}\`}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsLeftExpanded(!isLeftExpanded);
            if (isRightExpanded) setIsRightExpanded(false);
          }}
          className="bg-[#C5A059]/20 cursor-pointer hover:brightness-125 backdrop-blur-xl text-[#C5A059] w-10 h-52 sm:h-64 rounded-r-[2.2rem] flex items-center justify-center shadow-[inset_0_0_20px_rgba(197,160,89,0.1),0_0_20px_rgba(197,160,89,0.2)] border-r border-y border-[#C5A059]/40 animate-side-pulse">
          <span className="[writing-mode:vertical-rl] font-black text-[10px] sm:text-[12px] uppercase tracking-[0.4em] whitespace-nowrap">
            {left.name}
          </span>
        </div>

        <div 
          onClick={() => {
            left.action();
            setIsLeftExpanded(false);
          }}
          role="button"
          tabIndex={0}
          className="bg-gradient-to-br cursor-pointer hover:brightness-110 from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white/10 shadow-2xl rounded-r-lg -ml-1 border-r border-white/5">`
);

// Replace RIGHT panel
content = content.replace(
  /\{\/\* PRAWY PANEL - DYNAMICZNY \*\/\}\s*<div\s*onClick=\{right\.action\}\s*onKeyDown=\{\(e\) => e\.key === "Enter" && right\.action\(\)\}\s*role="button"\s*tabIndex=\{0\}\s*className=\{\`fixed right-0 z-\[5001\] flex items-center transition-all duration-700 translate-x-\[calc\(100\%-40px\)\] group outline-none pointer-events-auto\s*top-\[calc\(50\%\+45px\)\] sm:top-\[calc\(50\%\+80px\)\] -translate-y-1\/2 \$\{isZenMode \? "opacity-0 translate-x-\[150\%\] pointer-events-none" : "opacity-100 hover:translate-x-0 focus:translate-x-0"\}\`\}\s*>\s*<div className="bg-\[\#C5A059\]\/20 backdrop-blur-xl text-\[\#C5A059\] w-10 h-52 sm:h-64 rounded-l-\[2\.2rem\] flex items-center justify-center shadow-\[inset_0_0_20px_rgba\(197,160,89,0\.1\),0_0_20px_rgba\(197,160,89,0\.2\)\] border-l border-y border-\[\#C5A059\]\/40 animate-side-pulse cursor-pointer">\s*<span className="\[writing-mode:vertical-rl\] rotate-180 font-black text-\[10px\] sm:text-\[12px\] uppercase tracking-\[0\.4em\] whitespace-nowrap drop-shadow-sm">\s*\{right\.name\}\s*<\/span>\s*<\/div>\s*<div className="bg-gradient-to-br from-zinc-900 via-\[\#0a0a0a\] to-black shadow-\[inset_0_1px_10px_rgba\(255,255,255,0\.05\),_0_0_50px_rgba\(0,0,0,0\.8\)\]\/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white\/10 shadow-2xl rounded-l-lg -mr-1 border-l border-white\/5">/,
  `{/* PRAWY PANEL - DYNAMICZNY */}
      <div
        className={\`fixed right-0 z-[5001] flex items-center transition-all duration-700 group outline-none pointer-events-auto
          top-[calc(50%+45px)] sm:top-[calc(50%+80px)] -translate-y-1/2 \${isZenMode ? "opacity-0 translate-x-[150%] pointer-events-none" : (isRightExpanded ? "opacity-100 translate-x-0" : "opacity-100 translate-x-[calc(100%-40px)]")}\`}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsRightExpanded(!isRightExpanded);
            if (isLeftExpanded) setIsLeftExpanded(false);
          }}
          className="bg-[#C5A059]/20 cursor-pointer hover:brightness-125 backdrop-blur-xl text-[#C5A059] w-10 h-52 sm:h-64 rounded-l-[2.2rem] flex items-center justify-center shadow-[inset_0_0_20px_rgba(197,160,89,0.1),0_0_20px_rgba(197,160,89,0.2)] border-l border-y border-[#C5A059]/40 animate-side-pulse">
          <span className="[writing-mode:vertical-rl] rotate-180 font-black text-[10px] sm:text-[12px] uppercase tracking-[0.4em] whitespace-nowrap drop-shadow-sm">
            {right.name}
          </span>
        </div>

        <div 
          onClick={() => {
            right.action();
            setIsRightExpanded(false);
          }}
          role="button"
          tabIndex={0}
          className="bg-gradient-to-br cursor-pointer hover:brightness-110 from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]/95 backdrop-blur-xl text-gold h-52 sm:h-64 px-6 sm:px-8 flex flex-col justify-center border-y border-white/10 shadow-2xl rounded-l-lg -mr-1 border-l border-white/5">`
);

fs.writeFileSync(file, content);
console.log('done');
