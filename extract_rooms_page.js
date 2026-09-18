const fs = require('fs');
const lines = fs.readFileSync('/Users/ankitaryal/.gemini/antigravity-ide/brain/b37d3b44-2a45-45dd-825c-f820840e56b2/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');

let latestCode = null;

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (let tc of obj.tool_calls) {
        if (tc.name === 'replace_file_content' && tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('src/app/admin/(dashboard)/pages/rooms/page.tsx')) {
            latestCode = tc.args.ReplacementContent;
        }
      }
    }
  } catch (e) {}
}

if (latestCode) {
  fs.writeFileSync('restored_rooms_page.tsx', latestCode);
  console.log('Successfully restored page.tsx to restored_rooms_page.tsx');
} else {
  console.log('Could not find latest CodeContent');
}
