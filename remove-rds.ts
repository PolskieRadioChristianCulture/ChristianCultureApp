import fs from 'fs';

const file = 'components/RadioModePlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setIsRdsVisible[^>]+>[\s\S]*?Toggle RDS"[\s\S]*?>\s*RDS\s*<\/button>/g;

content = content.replace(regex, '');

fs.writeFileSync(file, content);
