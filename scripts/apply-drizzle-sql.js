#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIZZLE_DIR = path.join(__dirname, '..', 'drizzle');

function getDbArgs() {
    const url = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    // parse simple postgres url
    const m = url.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!m) {
        console.error('Failed to parse DATABASE_URL:', url);
        process.exit(1);
    }
    const [, user, password, host, port, database] = m;
    return { user, password, host, port, database };
}

function runPsqlFile(filePath) {
    const { user, password, host, port, database } = getDbArgs();
    const env = Object.assign({}, process.env, { PGPASSWORD: password });
    console.log('Running psql for:', filePath);
    const args = ['-h', host, '-p', port, '-U', user, '-d', database, '-f', filePath];
    const r = spawnSync('psql', args, { stdio: 'inherit', env });
    if (r.status !== 0) {
        console.error('psql failed for', filePath);
        process.exit(r.status || 1);
    }
}

function main() {
    if (!fs.existsSync(DRIZZLE_DIR)) {
        console.warn('No drizzle directory found at', DRIZZLE_DIR);
        return;
    }

    const files = fs.readdirSync(DRIZZLE_DIR)
        .filter(f => f.match(/^\d+_.*\.sql$/))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const f of files) {
        const fp = path.join(DRIZZLE_DIR, f);
        runPsqlFile(fp);
    }
}

main();
