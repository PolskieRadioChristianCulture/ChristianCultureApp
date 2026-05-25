const fs = require('fs');
const path = require('path');

const srcFiles = ['public/lessons/', 'public/'];
srcFiles.forEach(dir => {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return;
  const files = fs.readdirSync(full);
  files.forEach(f => {
    if (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')) {
      const img = path.join(full, f);
      const target = img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      fs.renameSync(img, target);
      console.log('Renamed', f);
    }
  });
});
