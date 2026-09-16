const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/app/admin -name "*client.tsx" -o -name "*Editor.tsx"').toString().split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // The regex to fix the broken arrow functions
  const brokenPattern = /onClick=\{\(\) => toast\.success\('Success!'\);\s+setIsDialogOpen\(false\)\}/g;
  if (brokenPattern.test(content)) {
    content = content.replace(brokenPattern, "onClick={() => { toast.success('Success!'); setIsDialogOpen(false); }}");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
