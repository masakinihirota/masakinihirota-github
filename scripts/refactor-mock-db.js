#!/usr/bin/env node
/*
Simple helper to find files that reference `vi.mock('@/lib/db'` and print them out.
This script DOES NOT do automatic edits by default — run with --apply to attempt a simple transformation.

Note: Vitest mocking patterns can be complex; inspect each file after transformation.
*/

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'src');

function walk(dir) {
    const res = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) res.push(...walk(full));
        else res.push(full);
    }
    return res;
}

const files = walk(SRC).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

const matches = [];
for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes("vi.mock('@/lib/db'")) matches.push(file);
}

console.log('Found', matches.length, "files that contain vi.mock('@/lib/db')\n");
for (const f of matches) console.log('-', path.relative(root, f));

if (process.argv.includes('--apply')) {
    console.log('\n--apply: attempting lightweight transformations (may be incomplete)');
    for (const file of matches) {
        let text = fs.readFileSync(file, 'utf8');
        // naive transform: replace vi.mock('@/lib/db', () => ({ with import and setupDbMock call
        const mockStart = "vi.mock('@/lib/db'";
        const idx = text.indexOf(mockStart);
        if (idx === -1) continue;

        // Try to extract the factory object (between => and closing ))
        // This is fragile; we will replace the whole vi.mock(...) call with a placeholder
        const newText = `import { setupDbMock } from '@/tests/setup'\n\n// NOTE: migrated from vi.mock to setupDbMock; please review contents manually\nsetupDbMock({ /* TODO: copy/mock implementations from old vi.mock call */ })\n` + text.slice(idx + mockStart.length);
        // To avoid corrupting imports, simply insert the setupDbMock import at the top
        // We'll perform a safer approach: add import at file head and replace the first occurrence of vi.mock(...) with a setupDbMock call
        const headInsert = "import { setupDbMock } from '@/tests/setup'\n";
        if (!text.includes("import { setupDbMock } from '@/tests/setup'")) text = headInsert + text;

        // Replace the first vi.mock occurrence with setupDbMock placeholder
        const replaced = text.replace(/vi\.mock\('\/lib\/db'[\s\S]*?\)\s*\)/m, "setupDbMock({ /* TODO: migrate mock implementation here */ })");
        fs.writeFileSync(file, replaced, 'utf8');
        console.log('Updated', path.relative(root, file));
    }
    console.log('\nTransformation finished. Manual review required.');
} else {
    console.log('\nRun with --apply to attempt a simple transform (manual review required).');
}
