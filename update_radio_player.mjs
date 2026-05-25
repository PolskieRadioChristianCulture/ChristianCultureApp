import fs from 'fs';

let code = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

// Find the start and end of daily_verse wrapper
let verseRegex = /<FloatingWidgetWrapper\s*id="daily_verse"[\s\S]*?(<div[\s\S]*?className=[^>]*isVerseElementGlowing[\s\S]*?)<\/FloatingWidgetWrapper>/;
let verseMatch = code.match(verseRegex);

if (!verseMatch) {
  console.log("Could not match verse");
}

let verseDivContent = verseMatch[1]; // The inner <div ... > ... </div>

// Find the start and end of radio_player wrapper
let radioRegex = /<FloatingWidgetWrapper\s*id="radio_player"[\s\S]*?(<div[\s\S]*?Sekcja Play[\s\S]*?)<\/FloatingWidgetWrapper>/;
let radioMatch = code.match(radioRegex);

if (!radioMatch) {
  console.log("Could not match radio");
}

let radioDivContent = radioMatch[1];

let newRenderFunctions = `
  const renderDailyVerseMobile = () => {
    return (
      <div className="w-full h-full relative flex flex-col justify-center items-center pointer-events-auto px-4 no-scrollbar">
` + verseDivContent + `
      </div>
    );
  };

  const renderRadioPlayerMobile = () => {
    return (
      <div className="w-full h-full relative flex flex-col justify-center items-center pointer-events-auto px-4 no-scrollbar pt-6">
` + radioDivContent + `
      </div>
    );
  };
`;

// Insert the functions right before "return ("
let returnIndex = code.indexOf('  return (\n');
if (returnIndex === -1) returnIndex = code.indexOf('  return (');

code = code.substring(0, returnIndex) + newRenderFunctions + '\n' + code.substring(returnIndex);

// Replace MAIN CONTENT AREA
let mainSectionRegex = /{\/\* MAIN CONTENT AREA \*\/}[\s\S]*?(?={\/\* Matrix Panel \*\/})/;

let newMainBlock = `
      {/* ================================== */}
      {/* MOBILE FULLSCREEN LANDSCAPE VIEWS  */}
      {/* ================================== */}
      {isLandscape && !isDesktop ? (
        <div 
          className="fixed inset-0 z-[5000] bg-black flex overflow-hidden touch-none"
          onTouchStart={handleLandscapeTouchStart}
          onTouchEnd={handleLandscapeTouchEnd}
        >
          <div 
            className="w-full h-full flex transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" 
            style={{ transform: \`translateX(\${landscapeActiveCard === 'verse' ? '0%' : '-100%'})\` }}
          >
            {/* Slide 1 - VERSE */}
            <div className="w-full h-full flex-shrink-0 relative overflow-y-auto no-scrollbar">
              {dailyVerse ? renderDailyVerseMobile() : (
                <div className="py-20 animate-pulse text-[#C5A059] flex w-full h-full justify-center items-center font-black uppercase text-[10px]">
                  Ładowanie Słowa...
                </div>
              )}
            </div>

            {/* Slide 2 - RADIO */}
            <div className="w-full h-full flex-shrink-0 relative overflow-y-auto no-scrollbar">
              {renderRadioPlayerMobile()}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[6000] pointer-events-none">
            <div className={\`w-2.5 h-2.5 rounded-full transition-all duration-300 \${landscapeActiveCard === "verse" ? "bg-[#C5A059] w-6" : "bg-white/20"}\`} />
            <div className={\`w-2.5 h-2.5 rounded-full transition-all duration-300 \${landscapeActiveCard === "radio" ? "bg-[#C5A059] w-6" : "bg-white/20"}\`} />
          </div>
        </div>
      ) : (
      <>
$&
      </>
      )}
`;

code = code.replace(mainSectionRegex, newMainBlock);

fs.writeFileSync('components/RadioModePlayer.tsx', code);
console.log("Updated components/RadioModePlayer.tsx successfully!");
