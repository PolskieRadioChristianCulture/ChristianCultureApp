import fs from 'fs';
const content = fs.readFileSync('./components/RadioModePlayer.tsx', 'utf-8');

let newContent = content.replace(/<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+setIsVerseToolsVisible\(false\);\s+\}\}\s+className="p-2 rounded-full bg-white\/10 hover:bg-red-500\/80 text-white\/50 hover:text-white transition-all active:scale-90 shadow-xl border border-white\/5 ml-1 sm:ml-2"\s+title=\{[^\}]+\}\s+>\s+<X className="w-3 h-3 sm:w-4 sm:h-4" \/>\s+<\/button>/g, "");

const effectCode = `  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isVerseToolsVisible) {
      timeoutId = setTimeout(() => {
        setIsVerseToolsVisible(false);
      }, 8000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVerseToolsVisible]);`;

newContent = newContent.replace('const [isVerseToolsVisible, setIsVerseToolsVisible] = useState(false);', `const [isVerseToolsVisible, setIsVerseToolsVisible] = useState(false);\n${effectCode}`);

fs.writeFileSync('./components/RadioModePlayer.tsx', newContent);
console.log(content === newContent ? "No changes!" : "Changes applied!");
