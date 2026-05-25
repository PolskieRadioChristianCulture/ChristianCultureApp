import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');
code = code.replace(/<DailyDetail/g, '<DailyDetail globalAmensCount={globalAmensCount}');
fs.writeFileSync('App.tsx', code);
console.log("Done");
