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
      
      let newContent = content.replace(/<iframe([\s\S]*?)>/g, (match, inner) => {
        if (match.includes('title=')) return match;
        
        let label = "Ramka zawartości";
        if (match.includes('youtube')) label = "Odtwarzacz YouTube";
        else if (match.includes('spotify')) label = "Odtwarzacz Spotify";
        else if (match.includes('pdf')) label = "Dokument PDF";
        else if (match.includes('patronite')) label = "Patronite";
        
        return match.replace('<iframe', `<iframe title="${label}"`);
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Modified', fullPath);
      }
    }
  }
}

processDir('./components');
