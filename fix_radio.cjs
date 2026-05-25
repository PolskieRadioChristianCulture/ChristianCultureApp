const fs = require('fs');

const file = './components/RadioModePlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

// We will use a regex that safely finds <button and injects aria-label after it if no aria-label exists in the block, based on what string is inside the block.

let newContent = content.replace(/<button([\s\S]*?)<\/button>/g, (match, inner) => {
  if (match.includes('aria-label=')) return match;
  
  // if it has actual text (excluding stuff in curlies), we might skip it
  let stripped = inner.replace(/<[^>]+>/g, '').trim();
  let hasText = stripped.match(/[a-zA-Z]/);
  
  // A heuristic: if it has text like "FM", "AM", "CC", it might be fine, but let's just tag them safely if we guess it's an icon.
  let label = null;
  if(match.includes('<X ')) label = "Zamknij";
  else if (match.includes('<SkipBack ')) label = "Poprzedni utwór";
  else if (match.includes('<SkipForward ')) label = "Następny utwór";
  else if (match.includes('<Play ')) label = "Odtwarzaj";
  else if (match.includes('<Pause ')) label = "Pauza";
  else if (match.includes('<Volume') || match.includes('<Volume2') || match.includes('<VolumeX')) label = "Głośność";
  else if (match.includes('<Maximize ')) label = "Pełny ekran";
  else if (match.includes('<Message')) label = "Wiadomości";
  else if (match.includes('<Download')) label = "Pobierz";
  else if (match.includes('<Heart') || match.includes('stroke="currentColor"')) label = "Ulubione";
  else if (match.includes('<BookOpen')) label = "Otwórz Biblię";
  else if (match.includes('<BookText')) label = "Czytaj Biblię";
  else if (match.includes('<ImageIcon')) label = "Kreator Wersetu";
  else if (match.includes('<Share2')) label = "Udostępnij";
  else if (match.includes('title="YouTube"')) label = "YouTube";
  else if (match.includes('title="Spotify"')) label = "Spotify";
  else if (!hasText || !stripped.includes('{')) {
    label = "Przycisk";
  }

  if (label) {
    if (label === 'Ulubione' && match.includes('isVerseFavorite')) label = "Ulubione werset";
    if (label === 'Ulubione' && match.includes('isMotivationFavorite')) label = "Ulubiona motywacja";
    
    // Inject aria-label right after <button
    return match.replace('<button', `<button aria-label="${label}"`);
  }
  
  return match;
});

if (content !== newContent) {
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Modified', file);
} else {
  console.log('No changes');
}
