import fs from 'fs';

let content = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

content = content.replace(
  /bg-zinc-950\/80 backdrop-blur-md relative z-10 pl-1 pr-1/g,
  'bg-black relative z-10 pl-1 pr-1 rounded-l-full'
);

content = content.replace(
  /bg-zinc-950\/80 backdrop-blur-md relative z-10 pl-2 pr-1/g,
  'bg-black relative z-10 pl-2 pr-1 rounded-l-full'
);


fs.writeFileSync('components/RadioModePlayer.tsx', content);
console.log('done bg-black fix');
