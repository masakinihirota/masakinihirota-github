#!/usr/bin/env node
'use strict'

const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe','pipe','pipe'], ...opts })
  return { status: res.status, stdout: res.stdout || '', stderr: res.stderr || '' }
}

function findBaseRef() {
  // prefer origin/main, fallback to main
  const tryRefs = ['origin/main', 'main']
  for (const r of tryRefs) {
    const rres = run('git', ['rev-parse', '--verify', r])
    if (rres.status === 0) return r
  }
  return null
}

function parseAddedTestsFromDiff(diffOutput) {
  // input from git diff --name-status base...HEAD
  const lines = diffOutput.split(/\r?\n/).filter(Boolean)
  const added = []
  for (const l of lines) {
    // format: A\tpath
    const parts = l.split('\t')
    if (parts.length < 2) continue
    const status = parts[0].trim()
    const file = parts.slice(1).join('\t').trim()
    if (status === 'A' && /\.test\.[jt]sx?$/.test(file)) added.push(file)
  }
  return added
}

function parseVitestJson(stdout) {
  try {
    const obj = JSON.parse(stdout)
    return obj && obj.numFailedTests != null ? Number(obj.numFailedTests) : null
  } catch (e) {
    return null
  }
}

async function main() {
  const base = findBaseRef()
  if (!base) {
    console.log('No base ref found (origin/main or main). Assuming no new tests.')
    process.exit(0)
  }

  // fetch to be safe
  run('git', ['fetch', 'origin', base], { stdio: 'inherit' })

  const diff = run('git', ['diff', '--name-status', `${base}...HEAD`])
  if (diff.status !== 0) {
    console.error('git diff failed:', diff.stderr)
    process.exit(2)
  }

  const addedTests = parseAddedTestsFromDiff(diff.stdout)
  if (!addedTests || addedTests.length === 0) {
    console.log('No newly added test files detected.')
    process.exit(0)
  }

  console.log('New test files:', addedTests)

  // run vitest for these specific files with JSON reporter
  const args = ['--reporter=json', ...addedTests]
  // use npm script 'test' which points to vitest
  const vitest = run('pnpm', ['-s', 'test', ...args])

  if (vitest.status === null) {
    console.error('Failed to run vitest')
    process.exit(3)
  }

  // try parse JSON
  const failed = parseVitestJson(vitest.stdout)
  if (failed === null) {
    // fallback: if exit code nonzero, treat as failure
    if (vitest.status !== 0) {
      console.error('Vitest run failed; unable to parse JSON output.')
      console.error(vitest.stdout || vitest.stderr)
      process.exit(4)
    }
    console.log('Vitest run succeeded, no failing tests.')
    process.exit(0)
  }

  console.log('New test failures count:', failed)
  if (failed === 1) {
    console.log('✅ Exactly 1 new failing test — OK')
    process.exit(0)
  }

  console.error(`❌ Expected exactly 1 failing test among newly added tests, but found ${failed}`)
  console.error('Vitest output:')
  console.error(vitest.stdout)
  process.exit(5)
}

if (require.main === module) main()

module.exports = { parseAddedTestsFromDiff, parseVitestJson, findBaseRef }
