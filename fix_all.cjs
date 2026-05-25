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
      
      let newContent = content.replace(/<button([\s\S]*?)<\/button>/g, (match, inner) => {
        if (match.includes('aria-label=')) return match;
        
        let stripped = inner.replace(/<[^>]+>/g, '').trim();
        let hasText = stripped.match(/[a-zA-Z]/);
        
        let label = null;
        if(inner.includes('<X ')) label = "Zamknij";
        else if (inner.includes('<SkipBack ')) label = "Poprzedni utwór";
        else if (inner.includes('<SkipForward ')) label = "Następny utwór";
        else if (inner.includes('<Play ')) label = "Odtwarzaj";
        else if (inner.includes('<Pause ')) label = "Pauza";
        else if (inner.includes('<Volume') || inner.includes('<Volume2') || inner.includes('<VolumeX')) label = "Głośność";
        else if (inner.includes('<Maximize ')) label = "Pełny ekran";
        else if (inner.includes('<Message')) label = "Wiadomości";
        else if (inner.includes('<Download')) label = "Pobierz";
        else if (inner.includes('<Heart') || inner.includes('stroke="currentColor"')) label = "Ulubione";
        else if (inner.includes('<BookOpen')) label = "Otwórz Biblię";
        else if (inner.includes('<BookText')) label = "Czytaj Biblię";
        else if (inner.includes('<ImageIcon')) label = "Kreator Wersetu";
        else if (inner.includes('<Share2')) label = "Udostępnij";
        else if (inner.includes('title="YouTube"')) label = "YouTube";
        else if (inner.includes('title="Spotify"')) label = "Spotify";
        else if (inner.includes('<Menu')) label = "Menu";
        else if (inner.includes('<User')) label = "Profil";
        else if (inner.includes('<Settings')) label = "Ustawienia";
        else if (inner.includes('<Search')) label = "Szukaj";
        else if (inner.includes('<Trash')) label = "Usuń";
        else if (inner.includes('<Pencil')) label = "Edytuj";
        else if (inner.includes('<Copy')) label = "Kopiuj";
        else if (inner.includes('<ChevronLeft')) label = "Wstecz";
        else if (inner.includes('<ChevronRight')) label = "Dalej";
        else if (inner.includes('<ChevronUp')) label = "W górę";
        else if (inner.includes('<ChevronDown')) label = "W dół";
        else if (inner.includes('<Bell')) label = "Powiadomienia";
        else if (!hasText || !stripped.includes('{')) {
          label = "Przycisk";
        }

        if (label) {
          // Injection
          return match.replace('<button', `<button aria-label="${label}"`);
        }
        
        return match;
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Modified', fullPath);
      }
    }
  }
}

processDir('./components');
processDir('./');
