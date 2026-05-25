import fs from 'fs';

const files = [
  'src/verses.ts',
  'src/sw.js',
  'components/GamesPortalModal.tsx',
  'components/CcPatronsPage.tsx',
  'components/DailyVerseModal.tsx',
  'components/LawDecalogueModal.tsx',
  'components/CcMediaPlayerPage.tsx',
  'components/SettingsModal.tsx',
  'components/ViewUserCardModal.tsx',
  'components/Onboarding.tsx',
  'components/CcEcosystemMapModal.tsx',
  'components/TopNewsTicker.tsx',
  'components/MaxVerseGenerator.tsx',
  'components/OpenLetterModal.tsx',
  'components/RadioModePlayer.tsx',
  'components/SongCreator.tsx'
];

const replacements = [
  { regex: /\b(Pana|Panu|Panie|Panem|Pańskie|Pański|Pańscy|Pańskim|Pan)\b/g, text: 'Jahwe' },
  { regex: /\b(PANA|PANU|PANIE|PANEM|PAŃSKIE|PAŃSKI|PAŃSCY|PAŃSKIM|PAN)\b/g, text: 'JAHWE' }
];

let totalMatchCount = 0;

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let matchCount = 0;
    
    replacements.forEach(r => {
      const matches = content.match(r.regex);
      if (matches) matchCount += matches.length;
      content = content.replace(r.regex, r.text);
    });

    if (matchCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Replaced ${matchCount} occurrences in ${filePath}`);
      totalMatchCount += matchCount;
    }
  }
});

console.log('Total replaced: ' + totalMatchCount + ' occurrences');

