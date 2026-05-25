const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Known corrupted patterns: 
      // 1. `={...} aria-label="...">` where `<button ... ={...}>` was the first `>`.
      // 2. `={() = aria-label="...">` instead of `={() =>`
      
      // Let's just find where `aria-label=` occurs right before `>`
      // and remove it, restoring the original `>`.
      // The issue is my script did:
      // substring(0, openingEndIdx) + ` aria-label="..."` + substring(openingEndIdx)
      // Since it replaced nothing, it just inserted ` aria-label="..."` before the first `>`.
      // So `= aria-label="Głośność">` means it was `=>`.
      
      let modified = content.replace(/ aria-label=("[^"]+"|`[^`]+`|\{\`[^`]+\`\})(>)/g, '$2');
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified, 'utf8');
      }
    }
  }
}

processDir('./components');
