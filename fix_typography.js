const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  const sizePattern = /\b(text-(xs|sm|base|lg|[2-9]xl|xl|\[.*?\])|font-(nove|sans|serif|mono|bold|semibold|medium|light|normal)|md:text-[a-z0-9]+|lg:text-[a-z0-9]+)\b/g;

  const cleanClass = (cls) => {
    return cls.replace(sizePattern, '').replace(/\s+/g, ' ').trim();
  };

  content = content.replace(/<(?:motion\.)?(h[1-6]|p)\b([^>]*?)className=(["'])(.*?)(["'])/g, (match, tag, before, q1, cls, q2) => {
    let newCls = cleanClass(cls);
    if (tag === 'p') {
      if (!newCls.includes('text-justify')) newCls += ' text-justify';
      if (!newCls.includes('tracking-tight')) newCls += ' tracking-tight';
    }
    return `<${match.startsWith('<motion.') ? 'motion.' : ''}${tag}${before}className=${q1}${newCls}${q2}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

['src/components/homepage', 'src/app/admin'].forEach(dir => {
  if (fs.existsSync(dir)) walk(dir, processFile);
});

console.log("Done");
