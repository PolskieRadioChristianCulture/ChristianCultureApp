import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Enhance bg-black/XX backdrop-blur modals inside Modal roots
  content = content.replace(
    /className="([^"]*)bg-black\/60 backdrop-blur-sm/g,
    `className="$1bg-black/80 backdrop-blur-md`
  );
  
  content = content.replace(
    /className="([^"]*)bg-zinc-950(?!.*gradient)/g,
    `className="$1bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)]`
  );
  
  content = content.replace(
    /bg-black border border-\[\#C5A059\]\/30/g,
    `bg-gradient-to-b from-zinc-900 to-black border border-[#C5A059]/30 shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.8)]`
  );
  
  content = content.replace(
    /bg-zinc-900 rounded-2xl/g,
    `bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]`
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Processed', filePath);
  }
}

const dir = 'components';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    processFile(path.join(dir, file));
  }
}

// Do the same for App.tsx
processFile('App.tsx');
