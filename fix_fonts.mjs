import fs from 'fs';

const filePath = 'components/TopNewsTicker.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace left labels (the gold one and black/20 one, etc.)
content = content.replaceAll(
    'font-black',
    'font-normal font-sans'
);

content = content.replaceAll(
    'font-bold',
    'font-normal font-sans'
);

// We need to restore some things? No, the user wants UNIFORM font modeled after ONLINE box which is font-normal font-sans tracking-[0.5px].
// Wait, if I replace ALL font-black and font-bold in TopNewsTicker to font-normal font-sans, that will definitely solve the "zbyt tłusta" feeling and make it uniformly thin in the ticker!

// Let's also enforce tracking-[0.5px] over tracking-widest
content = content.replaceAll(
    'tracking-widest',
    'tracking-[0.5px]'
);

content = content.replaceAll(
    'tracking-wide',
    'tracking-[0.5px]'
);

content = content.replaceAll(
    'font-sans font-sans',
    'font-sans'
);

content = content.replaceAll(
    'font-normal font-normal',
    'font-normal'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fonts updated successfully');
