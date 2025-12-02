const fs = require('fs');
const { execSync } = require('child_process');

const manifest = JSON.parse(fs.readFileSync('src/config/routes.manifest.json', 'utf8'));

manifest.forEach(route => {
  const path = route.path;
  // search for occurrences of the path (as-is) and /home-prefixed
  let total = 0;
  try {
    const out1 = execSync(`git grep -n -- "${path}" || true`, {encoding: 'utf8'});
    total += out1 ? out1.split('\n').filter(Boolean).length : 0;
  } catch(e) {
    // ignore
  }
  const homePath = path === '/' ? '/home' : `/home${path}`;
  try {
    const out2 = execSync(`git grep -n -- "${homePath}" || true`, {encoding: 'utf8'});
    total += out2 ? out2.split('\n').filter(Boolean).length : 0;
  } catch(e) {}

  console.log(`${path}|${route.label}|${route.group}|${route.visibleInMenu}|${total}`);
});
