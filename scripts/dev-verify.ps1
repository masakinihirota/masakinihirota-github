<#
dev-verify.ps1

Quick local environment verification script for the masakinihirota project.
Runs safe checks (Supabase status, DATABASE_URL connectivity) and optionally runs migrations/seeds/tests.

Usage (PowerShell):
  pwsh ./scripts/dev-verify.ps1            # run checks only
  pwsh ./scripts/dev-verify.ps1 -RunAll   # run migrations, apply triggers, seeds, and tests

This script assumes you are developing locally with Supabase Local (Docker) and have pnpm installed.
#>

param(
  [switch]$RunAll,
  [switch]$RunTests
)

Write-Host "== dev-verify: local environment health check ==" -ForegroundColor Cyan

# 1) Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Warning "pnpm not found in PATH. Please install pnpm and try again."
  exit 2
}

# 2) Supabase status (if supabase CLI available via pnpm scripts)
Write-Host "\nChecking local Supabase status (pnpm run supabase:status)" -ForegroundColor Yellow
try {
  pnpm run supabase:status
} catch {
  Write-Warning "Failed to run 'pnpm run supabase:status'. Is Supabase Local running?"
}

# 3) DATABASE_URL check
if (-not $env:DATABASE_URL) {
  Write-Warning "DATABASE_URL not set in environment. Set it to your local Supabase DB URL (e.g. 'postgresql://postgres:postgres@127.0.0.1:54322/postgres')."
} else {
  Write-Host "DATABASE_URL: $($env:DATABASE_URL)" -ForegroundColor Green
  Write-Host "Testing DB connectivity (SELECT 1)" -ForegroundColor Yellow
  try {
    pnpm exec -- node -e "(async()=>{ const sql = require('postgres')(process.env.DATABASE_URL); const r = await sql`SELECT 1 as ok`; console.log('OK ->', r); await sql.end(); })().catch(e=>{ console.error(e); process.exit(3) })"
  } catch {
    Write-Error "DB connectivity test failed. Ensure DATABASE_URL points to your local Supabase/Postgres instance."
  }
}

if ($RunAll) {
  Write-Host "\nRunning migrations, applying auth trigger, and seeding DB..." -ForegroundColor Cyan
  $env:DATABASE_URL = $env:DATABASE_URL -or 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  # Reset supabase local DB and re-apply Drizzle migrations, triggers and canonical SQL seeds
  # Reset without running the supabase built-in seeder (we will run our drizzle migrations + custom seed afterwards)
  pnpm run supabase:reset -- --no-seed --yes
  # Apply Drizzle SQL files in order (ensures columns/tables are created as expected)
  node ./scripts/apply-drizzle-sql.js
  node scripts/apply-auth-trigger.js || Write-Warning 'apply-auth-trigger.js failed (may be permission related).'
  # Finally run the SQL seed entrypoint directly in the supabase directory
  Push-Location supabase
  $env:PGPASSWORD = $env:PGPASSWORD -or 'postgres'
  $env:PGCLIENTENCODING = 'UTF8'
  pnpm exec -- psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f seed.sql
  Pop-Location
  if ($RunTests) {
    Write-Host "\nRunning tests including DB integration tests..." -ForegroundColor Cyan
    $env:RUN_DB_TESTS = '1'
    pnpm test
  }
}

Write-Host "\nDone. If you want a full run, use: pwsh ./scripts/dev-verify.ps1 -RunAll -RunTests" -ForegroundColor Cyan
