import fs from 'fs';

const content = fs.readFileSync('./components/RadioModePlayer.tsx', 'utf8');
const lines = content.split('\n');

// 1. We know the misplaced code starts at line 117 (which is `return (` for renderDailyVerseMobile) 
// but wait, let's find the `renderRadioPlayerMobile` to know we are in the right block.
const playerFnStart = lines.findIndex(l => l.includes('const renderRadioPlayerMobile = () => {'));
// find the end of this block which is right before `return (` of EqualizerGraph.
// We know EqualizerGraph return starts around line 830:
//     <div
//       className={
//         className ||

const eqReturn = lines.findIndex((l, i) => i > playerFnStart && l.includes('      className={') && lines[i-2].includes('  return ('));

// so the misplaced block is from line 116 to eqReturn - 3
const misplacedStart = 116; // This is the 'return (' line
const misplacedEnd = eqReturn - 2;

const misplacedLines = lines.slice(misplacedStart, misplacedEnd);
console.log('Extracting', misplacedLines.length, 'lines from', misplacedStart, 'to', misplacedEnd);

// Remove them from their current place
lines.splice(misplacedStart, misplacedEnd - misplacedStart);

// Now we need to remove that stray `const renderDailyVerseMobile = () => {` at line 1144 which is now shifted.
const strayIndex = lines.findIndex(l => l.includes('  const renderDailyVerseMobile = () => {'));
if(strayIndex !== -1) {
  lines.splice(strayIndex, 1);
  console.log('Removed stray at', strayIndex);
}

// Now insert them into `RadioModePlayer` body
const rmpBodyStart = lines.findIndex(l => l.includes('  useEffect(() => {')); // first useEffect
lines.splice(rmpBodyStart, 0, '  const renderDailyVerseMobile = () => {', ...misplacedLines);

fs.writeFileSync('./components/RadioModePlayer.tsx', lines.join('\n'));
console.log('Fixed!');
