import fs from 'fs';

let content = fs.readFileSync('components/RadioModePlayer.tsx', 'utf8');

content = content.replace(
  /<>(\s*)<div className="flex flex-row items-center justify-center gap-4 w-full">/g,
  `<div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">$1<div className="flex flex-row items-center justify-center gap-3 sm:gap-4">`
);

content = content.replace(
  /<\/div>(\s*)<div className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full mt-1">/g,
  `</div>$1<div className="flex flex-row items-center justify-center gap-3 sm:gap-4">`
);

content = content.replace(
  /<\/div>(\s*)<\/>/g,
  `</div>$1</div>`
);

fs.writeFileSync('components/RadioModePlayer.tsx', content);
