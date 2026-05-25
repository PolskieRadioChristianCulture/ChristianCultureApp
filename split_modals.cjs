const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');

const modalImportRegex = /^import\s*\{\s*([A-Za-z0-9_]+Modal)\s*\}\s*from\s*["']\.\/components\/([A-Za-z0-9_]+)["'];/gm;

let match;
const matches = [];
while ((match = modalImportRegex.exec(appContent)) !== null) {
  matches.push({
    modalName: match[1],
    fileName: match[2],
    importStatement: match[0],
  });
}

matches.forEach((m) => {
  const lazyStatement = `const ${m.modalName} = React.lazy(() => import("./components/${m.fileName}").then(m => ({ default: m.${m.modalName} })));`;
  appContent = appContent.replace(m.importStatement, lazyStatement);
});

fs.writeFileSync('App.tsx', appContent, 'utf8');
console.log('Done refactoring modals to React.lazy: ' + matches.length);
