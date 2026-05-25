const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'lessons');
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.jpg')) {
    const img = path.join(dir, f);
    const webp = path.join(dir, f.replace('.jpg', '.webp'));
    try {
      execSync(`npx -y cwebp-bin "${img}" -o "${webp}"`);
      console.log(`cwebp: ${f}`);
      fs.unlinkSync(img);
    } catch(e) {
      console.error('Failed', f);
    }
  }
});
