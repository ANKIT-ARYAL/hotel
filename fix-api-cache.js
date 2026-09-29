/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'src/app/api');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'route.ts') {
      processRouteFile(fullPath);
    }
  }
}

function processRouteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Check if we need to add import { revalidatePath } from "next/cache";
  const needsRevalidateImport = !content.includes('revalidatePath') && (
    content.includes('export async function POST') ||
    content.includes('export async function PUT') ||
    content.includes('export async function PATCH') ||
    content.includes('export async function DELETE')
  );

  // We want to inject revalidatePath("/", "layout"); before returning successful responses in mutations.
  // A simple heuristic: inject it at the beginning of POST, PUT, PATCH, DELETE blocks just after the opening brace,
  // or before `return NextResponse.json`.
  // Injecting it at the start of the function is safer because it will always execute if the function executes,
  // BUT it might revalidate even on error. That's actually fine for a cache purge.
  // However, it's best to inject it right before `return NextResponse.json` where it's a success response (status 200/201).
  // Let's inject it into any block that has `export async function POST/PUT/PATCH/DELETE` inside it.
  
  const mutationRegex = /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)\s*\([^)]*\)\s*\{/g;
  
  if (mutationRegex.test(content)) {
    // If it doesn't already have revalidatePath, let's inject it before the final returns.
    if (!content.includes('revalidatePath')) {
      content = 'import { revalidatePath } from "next/cache";\n' + content;
    }

    // Replace all `return NextResponse.json(` with `revalidatePath("/", "layout"); return NextResponse.json(`
    // BUT only do this if it's not returning an error (e.g. status 400 or 500).
    // It's safer to just inject `revalidatePath("/", "layout");` at the top of the function if it's a mutation?
    // No, what if validation fails? Revalidating on validation fail is harmless but inefficient.
    // Let's just blindly inject it before any `return NextResponse.json(` that DOES NOT have `{ status: 4` or `{ status: 5`.
    
    // We will do a regex replace on NextResponse.json
    content = content.replace(/return\s+NextResponse\.json\(([^;]+)\);/g, (match, args) => {
      // If the args contain status: 4xx or 5xx, do not inject
      if (/status:\s*[45]\d\d/.test(args)) {
        return match;
      }
      // If it already has revalidatePath right before it, skip
      return `revalidatePath("/", "layout");\n    ${match}`;
    });

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${filePath}`);
  }
}

processDir(apiDir);
console.log('Done');
