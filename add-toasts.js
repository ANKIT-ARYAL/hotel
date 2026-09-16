const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/app/admin -name "*client.tsx" -o -name "*Editor.tsx"').toString().split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!content.includes("import { toast } from 'sonner'")) {
    // try to insert after 'use client'
    if (content.includes("'use client'")) {
      content = content.replace(/'use client';?\n/, "'use client'\nimport { toast } from 'sonner';\n");
    } else if (content.includes('"use client"')) {
      content = content.replace(/"use client";?\n/, '"use client"\nimport { toast } from \'sonner\';\n');
    } else {
      content = "import { toast } from 'sonner';\n" + content;
    }
    changed = true;
  }

  // Find all instances of: setIsDialogOpen(false) inside a successful try block or similar.
  // Actually, we can just replace `setIsDialogOpen(false)` with `toast.success('Saved successfully!'); setIsDialogOpen(false)`
  // But that applies to handleDelete as well. Let's just do it for all setIsDialogOpen(false) where it looks like a success.
  // A safer approach: Look for `handleSave` or `handleSaveTheme` etc.
  
  // For standard handleSave:
  if (content.includes('setIsDialogOpen(false)')) {
    content = content.replace(/setIsDialogOpen\(false\)/g, "toast.success('Success!');\n      setIsDialogOpen(false)");
    changed = true;
  }

  // For settings and editors that use router.refresh() after saving:
  // e.g. updateHomepageSettings(hpSettings)\n    setIsSavingHp(false)\n    router.refresh()
  if (content.includes('router.refresh()') && file.includes('settings-client')) {
    content = content.replace(/router\.refresh\(\)/g, "toast.success('Settings saved!');\n    router.refresh()");
    changed = true;
  }
  
  if (content.includes('router.refresh()') && file.includes('Editor')) {
    content = content.replace(/router\.refresh\(\)/g, "toast.success('Changes saved!');\n    router.refresh()");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
