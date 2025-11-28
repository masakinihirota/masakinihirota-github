const fs = require('fs');
const postgres = require('postgres');

// Prefer DATABASE_URL or SUPABASE_DB_URL (useful when working locally with `supabase start` or env var)
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const sql = postgres(connectionString, { ssl: false });

async function main() {
    try {
        const triggerSql = fs.readFileSync('drizzle/auth_trigger_manual.sql', 'utf8');
        console.log('Applying auth trigger...');

        // Split by semicolon to execute statements one by one if needed,
        // but postgres.js can handle multiple statements if simple.
        // However, for safety with DO blocks and DELIMITERs, simple execution is best.
        // The file contains comments and standard SQL.

        // Apply SQL - this will create the function (if missing) and create the auth.users trigger when possible.
        // Note: On hosted Supabase projects, creation of triggers on the `auth` schema may fail due to permission restrictions.
        await sql.unsafe(triggerSql);
        console.log('Auth trigger applied successfully.');

        // Verification
        const triggers = await sql`
      SELECT trigger_name
      FROM information_schema.triggers
      WHERE event_object_schema = 'auth'
      AND trigger_name = 'on_auth_user_created'
    `;

        console.log('Verification Result (Triggers):', triggers);

        const functions = await sql`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_name = 'handle_new_user'
    `;

        console.log('Verification Result (Functions):', functions);

    } catch (error) {
        console.error('Error applying trigger:', error);
    } finally {
        await sql.end();
    }
}

main();
