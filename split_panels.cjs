const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');

const componentsToLazy = [
  'UserPanel', 'BiblicalSchoolPanel', 'TutorialPanel', 
  'StartupModeSelection', 'SidePanels', 'CcMediaPlayerPage', 'CcPatronsPage',
  'ImaginationStudio', 'SongCreator', 'MobileLandscapeCarMode', 'AppManagementCenter', 'CommunityChat'
];

componentsToLazy.forEach((name) => {
  const regex = new RegExp(`^import\\s*\\{\\s*${name}\\s*\\}\\s*from\\s*["']\\.\\/components\\/${name}["'];`, 'gm');
  appContent = appContent.replace(regex, `const ${name} = React.lazy(() => import("./components/${name}").then(m => ({ default: m.${name} })));`);
  
  const regexDef = new RegExp(`^import\\s*${name}\\s*from\\s*["']\\.\\/components\\/${name}["'];`, 'gm');
  appContent = appContent.replace(regexDef, `const ${name} = React.lazy(() => import("./components/${name}"));`);
});

fs.writeFileSync('App.tsx', appContent, 'utf8');
console.log('Done refactoring UI panels to React.lazy.');
