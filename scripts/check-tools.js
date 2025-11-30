#!/usr/bin/env node
/*
  check-tools.js

  Small helper script for developer friendliness.
  Usage:
    node ./scripts/check-tools.js biome

  It checks for a local installation (node_modules/.bin/biome) and prints
  a short, actionable message if not found.
*/

const fs = require('fs');
const path = require('path');

function existsSyncAny(p) {
  return fs.existsSync(p) || fs.existsSync(p + '.cmd') || fs.existsSync(p + '.ps1');
}

function checkBiome() {
  const repoRoot = path.resolve(__dirname, '..');
  const candidate = path.join(repoRoot, 'node_modules', '.bin', 'biome');

  if (existsSyncAny(candidate)) {
    console.log('✅ biome binary found in node_modules/.bin');
    process.exit(0);
  }

  console.error('\n⚠️  Could not find the `biome` binary in this repository.');
  console.error('\nPossible fixes:');
  console.error('  1) Install dependencies: `pnpm install`');
  console.error('  2) Install biome locally: `pnpm add -D biome`');
  console.error('  3) If you use the VS Code Biome extension, configure it to use the workspace binary or install a global biome.');
  console.error('\nExample (Windows pwsh):');
  console.error('  pnpm install');
  console.error('  pnpm add -D biome');

  // Helpful exit code for CI / scripts so the caller can fail fast
  process.exit(2);
}

function main() {
  const args = process.argv.slice(2);
  if (!args || args.length === 0) {
    console.error('Usage: node ./scripts/check-tools.js <tool>');
    process.exit(1);
  }

  const tool = args[0].toLowerCase();
  if (tool === 'biome') {
    checkBiome();
  } else {
    console.error('Unknown tool:', tool);
    process.exit(1);
  }
}

main();
