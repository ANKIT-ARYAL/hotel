const fs = require('fs');
const lines = fs.readFileSync('/Users/ankitaryal/.gemini/antigravity-ide/brain/b37d3b44-2a45-45dd-825c-f820840e56b2/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');

let latestCode = null;

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (let tc of obj.tool_calls) {
        if (tc.name === 'write_to_file' || tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content') {
          if (tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('RoomsEditor.tsx')) {
            if (tc.name === 'write_to_file') {
              latestCode = tc.args.CodeContent;
            }
          }
        }
      }
    }
  } catch (e) {}
}

if (latestCode) {
  fs.writeFileSync('restored_RoomsEditor.tsx', latestCode);
  console.log('Successfully restored RoomsEditor.tsx to restored_RoomsEditor.tsx');
} else {
  console.log('Could not find latest CodeContent');
}
