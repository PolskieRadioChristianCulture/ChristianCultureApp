import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.join(process.cwd(), 'public');
const dirsToScan = [publicDir, path.join(publicDir, 'backgrounds'), path.join(publicDir, 'books'), path.join(publicDir, 'lessons')];
const imagesToProcess = [];

dirsToScan.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        imagesToProcess.push(path.join(dir, file));
      }
    });
  }
});

console.log(`Found ${imagesToProcess.length} images to convert to webp.`);

imagesToProcess.forEach(img => {
  const ext = path.extname(img);
  let baseName = path.basename(img, ext);
  const outPath = path.join(path.dirname(img), `${baseName}.webp`);
  
  try {
    execSync(`npx -y sharp-cli -i "${img}" -o "${outPath}" -f webp -q 80`);
    console.log(`Converted ${img} to ${outPath}`);
    fs.unlinkSync(img); // remove original
  } catch(e) {
    console.error(`Failed converting ${img}`, e.message);
  }
});

console.log('Conversion completed.');

// Now replace references in source files
function replaceInFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') replaceInFiles(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/\.jpg(\?.*?|)/gi, '.webp');
      content = content.replace(/\.jpeg(\?.*?|)/gi, '.webp');
      content = content.replace(/\.png(\?.*?|)/gi, '.webp');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated references in ${fullPath}`);
      }
    }
  });
}

replaceInFiles(path.join(process.cwd(), 'components'));
replaceInFiles(path.join(process.cwd(), 'src'));

const appTsxPath = path.join(process.cwd(), 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  let content = fs.readFileSync(appTsxPath, 'utf8');
  const original = content;
  content = content.replace(/\.jpg/g, '.webp');
  content = content.replace(/\.jpeg/g, '.webp');
  content = content.replace(/\.png/g, '.webp');
  if (content !== original) {
    fs.writeFileSync(appTsxPath, content, 'utf8');
    console.log(`Updated references in App.tsx`);
  }
}
