const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const OUT_FILE = path.join(process.cwd(), 'src', 'config', 'routes.manifest.json');

function isGroupFolder(name) {
    return /^\(.+\)$/.test(name);
}

function walkDir(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkDir(full));
        } else if (entry.isFile() && entry.name === 'route.json') {
            results.push(full);
        }
    }
    return results;
}

function deriveUrlFromDir(dir) {
    const rel = path.relative(APP_DIR, dir).split(path.sep);
    // remove group folders like (public) and other parentheses
    const segments = rel.filter(s => !isGroupFolder(s));
    // if last segment is 'page' or 'index', we shouldn't get here because dir is route.json directory
    const url = '/' + segments.join('/');
    return url === '/' ? '/' : url.replace(/\\/g, '/');
}

function buildManifest() {
    if (!fs.existsSync(APP_DIR)) {
        console.error('app directory not found at', APP_DIR);
        process.exit(1);
    }

    const files = walkDir(APP_DIR);
    const routes = [];
    for (const file of files) {
        try {
            const raw = fs.readFileSync(file, 'utf8');
            const meta = JSON.parse(raw);
            const dir = path.dirname(file);
            const url = deriveUrlFromDir(dir);
            routes.push({
                path: url,
                ...meta,
                source: path.relative(process.cwd(), file)
            });
        } catch (err) {
            console.warn('failed to read/parse', file, err.message);
        }
    }

    // sort by order (missing order -> 9999) then label
    routes.sort((a, b) => ((a.order ?? 9999) - (b.order ?? 9999)) || (a.label || '').localeCompare(b.label || ''));

    // ensure output directory exists
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(routes, null, 2));
    console.log('Wrote', OUT_FILE, 'with', routes.length, 'entries');
}

buildManifest();
