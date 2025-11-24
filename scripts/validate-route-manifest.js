const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const SCHEMA_PATH = path.join(process.cwd(), 'src', 'config', 'route.schema.json');
const MANIFEST_PATH = path.join(process.cwd(), 'src', 'config', 'routes.manifest.json');

function loadJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('Manifest not found. Run generate:routes first.');
        process.exit(2);
    }

    const schema = loadJson(SCHEMA_PATH);
    const manifest = loadJson(MANIFEST_PATH);

    const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
    addFormats(ajv);

    const validate = ajv.compile(schema);

    let hasError = false;
    manifest.forEach((item) => {
        // create a copy without path & source when validating
        const { path: pth, source, ...meta } = item;
        const ok = validate(meta);
        if (!ok) {
            console.error('Validation failed for', item.path || '(no path)', 'source:', item.source);
            console.error(validate.errors);
            hasError = true;
        }
    });

    if (hasError) {
        console.error('One or more route manifest entries are invalid.');
        process.exit(1);
    }

    console.log('All route manifest entries passed validation. Total:', manifest.length);
}

main();
