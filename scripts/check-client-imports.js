#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

const bannedPatterns = [
    /\b@\/lib\/db\b/, // direct db import
    /\bdrizzle-orm(\/|$)/,
    /\bpostgres(\/|$)/,
    /\bpg(\/|$)/,
    /\b@\/db\/schema\b/, // schema import in client files
    /\b@\/actions\/.+\.fetch\b/, // server actions (fetch.*) should not be imported from 'use client' files
]

let violations = []

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const ent of entries) {
        if (ent.name === 'node_modules' || ent.name === '.git') continue
        const full = path.join(dir, ent.name)
        if (ent.isDirectory()) walk(full)
        else if (/\.([tj]sx?|mjs)$/.test(ent.name)) checkFile(full)
    }
}

function checkFile(filePath) {
    let src
    try { src = fs.readFileSync(filePath, 'utf8') } catch { return }

    if (!/\buse client\b/.test(src)) return

    const lines = src.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        for (const pat of bannedPatterns) {
            if (pat.test(line)) {
                violations.push({ file: path.relative(ROOT, filePath), line: i + 1, text: line.trim() })
            }
        }
    }
}

walk(SRC)

if (violations.length) {
    console.error('\nFound client-side imports of server-only modules in files using "use client":')
    for (const v of violations) {
        console.error(`  - ${v.file}:${v.line}  ${v.text}`)
    }
    console.error('\nPlease remove server-only imports (db, drizzle, postgres, @/db/schema) from files that contain "use client". Consider calling server APIs or API routes instead.')
    process.exitCode = 2
} else {
    console.log('No client-import violations found.')
}
