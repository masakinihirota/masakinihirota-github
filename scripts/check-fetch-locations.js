#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

function isFetchFile(filename) {
    return /\.fetch\.(ts|tsx|js|jsx)$/.test(filename);
}

function walk(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        if (e.name === 'node_modules' || e.name === '.git') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, results);
        else results.push(full);
    }
    return results;
}

function main() {
    if (!fs.existsSync(SRC)) {
        console.log('No src/ directory — skipping fetch-location check.');
        return 0;
    }

    const files = walk(SRC);
    const violations = [];

    for (const f of files) {
        if (isFetchFile(f)) {
            // normalize path for checking
            const rel = path.relative(ROOT, f).replace(/\\/g, '/');
            if (!rel.includes('/components/')) {
                violations.push(rel);
            }
        }
    }

    if (violations.length) {
        console.error('\nFetch-location check failed — the following fetch files are NOT under a components/ folder:');
        for (const v of violations) console.error(' -', v);
        console.error('\nRule: *.fetch.(ts|tsx|js|jsx) must live inside a components/ directory (e.g. src/.../components/...).');
        process.exitCode = 2;
        return 2;
    }

    console.log('Fetch-location check passed.');
    return 0;
}

if (require.main === module) process.exitCode = main();
