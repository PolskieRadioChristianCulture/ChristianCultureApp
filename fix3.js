import fs from 'fs';

const content = fs.readFileSync('./components/RadioModePlayer.tsx', 'utf8');
const lines = content.split('\n');

const verseStartI = lines.findIndex(l => l.includes('  const renderDailyVerseMobile = () => {'));
const radioPlayerEndI = lines.findIndex((l, i) => i > verseStartI && l.includes('    );') && lines[i+1].includes('  };') && lines[i+3].includes('  useEffect(() => {'));

console.log('verseStartI:', verseStartI, 'radioPlayerEndI:', radioPlayerEndI);

const extracted = lines.slice(verseStartI, radioPlayerEndI + 2);

lines.splice(verseStartI, radioPlayerEndI + 2 - verseStartI); // remove

const bodyStartI = lines.findIndex(l => l.includes('    landscapeTouchStartRef.current = null;'));

lines.splice(bodyStartI + 2, 0, ...extracted);

fs.writeFileSync('./components/RadioModePlayer.tsx', lines.join('\n'));
console.log('SUCCESS');

