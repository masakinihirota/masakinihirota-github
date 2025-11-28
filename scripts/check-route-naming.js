#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app');

const allowedDirRegex = /^\(\d+-[^)]+\)$/; // (number-name)
const dynamicRegex = /^\[.*\]$/; // [id]

async function exists(p) {
    try { await fs.access(p); return true; } catch { return false; }
}

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const dirs = [];
    for (const entry of entries) {
        if (entry.isDirectory()) dirs.push(path.join(dir, entry.name));
    }
    return dirs;
}

// we're checking for top-level feature directories.
// rules:
// - immediate children of src/app must be either a group (parenthesized string) or a numbered parenthesized feature like (01-something)
// - if child is a group (e.g., (protected)), then its immediate children must be numbered parentheses or groups/dynamic
// - directories inside a numbered parenthesized feature are ignored (they may be route leafs)

async function listDirectories(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
}

async function analyzeApp() {
    const result = { violations: [], checked: 0, duplicates: [] };
    const topChildren = await listDirectories(APP_DIR);
    result.checked = topChildren.length;

    // duplicate check: normalized name -> list of paths
    const normalizedMap = new Map();

    const checkedEntries = [];

    for (const child of topChildren) {
        const childPath = path.join(APP_DIR, child);
        const normalized = normalizeName(child);
        (normalizedMap.get(normalized) || normalizedMap.set(normalized, []).get(normalized)).push(path.relative(ROOT, childPath));

        if (child.startsWith('(')) {
            // group or numbered
            if (/^\(\d+-.*\)$/.test(child)) {
                // numbered parent at top-level -> OK. We still want to include it in normalized map for duplicates.
                continue;
            }
            // it's a group like (protected) — its immediate children must be numbered (or groups/dynamic)
            const grandchildren = await listDirectories(childPath);
            for (const g of grandchildren) {
                const gPath = path.join(childPath, g);
                const allowed = /^\(\d+-.*\)$/.test(g) || /^\(.*\)$/.test(g) || /^\[.*\]$/.test(g);
                if (!allowed) {
                    const suggestion = suggestNumberedName(grandchildren, g);
                    result.violations.push({ path: path.relative(ROOT, gPath), name: g, reason: `child of group ${child} should be numbered or parenthesized`, suggestion });
                }
                // collect normalization for duplicate detection
                const norm = normalizeName(g);
                (normalizedMap.get(norm) || normalizedMap.set(norm, []).get(norm)).push(path.relative(ROOT, gPath));
            }

        } else {
            // top-level route directory that does not start with '(' must be a numbered parenthesized feature
            // but because it doesn't start with '(', it's already a violation
            const suggestion = suggestNumberedName(topChildren, child);
            result.violations.push({ path: path.relative(ROOT, path.join(APP_DIR, child)), name: child, reason: 'top-level route should be parenthesized and numbered (e.g., (10-feature))', suggestion });
            // also collect nested directories for normalization
            const grandchildren = await listDirectories(path.join(APP_DIR, child));
            for (const g of grandchildren) {
                const norm = normalizeName(g);
                (normalizedMap.get(norm) || normalizedMap.set(norm, []).get(norm)).push(path.relative(ROOT, path.join(APP_DIR, child, g)));
            }
        }
    }

    // find duplicate normalized names
    for (const [k, list] of normalizedMap.entries()) {
        if (list.length > 1) {
            // pick canonical candidate
            let canonical = null;
            // prefer number-parenthesized
            canonical = list.find(p => /\/\(\d+-/.test(p));
            if (!canonical) canonical = list.find(p => /\(/.test(p));
            if (!canonical) canonical = list[0];
            result.duplicates.push({ normalized: k, instances: list, canonical });
        }
    }

    return result;
}

// helper: suggest a numbered name for a given name based on existing siblings
function suggestNumberedName(existingNames, rawName) {
    // extract existing numbers
    const nums = existingNames.map(n => {
        const m = n.match(/^\((\d+)-/);
        return m ? Number(m[1]) : null;
    }).filter(n => typeof n === 'number');
    const max = nums.length ? Math.max(...nums) : 0;
    const next = max ? max + 1 : 10;
    const normalized = normalizeName(rawName);
    return `(${String(next).padStart(2, '0')}-${normalized})`;
}

function basename(p) { return path.basename(p); }

function normalizeName(name) {
    return name.toLowerCase().replace(/[_\s]+/g, '-').replace(/[()\[\]]/g, '');
}

async function main() {
    if (!await exists(APP_DIR)) {
        console.error('No src/app directory found. Run this script from the project root.');
        process.exit(2);
    }

    const report = await analyzeApp();

    console.log(JSON.stringify(report, null, 2));

    if (report.violations.length > 0 || report.duplicates.length > 0) process.exit(1);
    process.exit(0);
}

main().catch(err => { console.error(err); process.exit(99); });
