const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src/app/admin/(dashboard)');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content.replace(/<h1([^>]*)>/g, (match, attrs) => {
    if (attrs.includes('style=')) return match;
    return `<h1${attrs} style={{ fontSize: 'var(--admin-heading-size)' }}>`;
  });
  if (content !== updated) {
    fs.writeFileSync(file, updated);
    console.log(`Updated ${file}`);
  }
}
