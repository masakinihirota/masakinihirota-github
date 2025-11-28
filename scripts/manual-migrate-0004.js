const fs = require('fs');
const postgres = require('postgres');

const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');

async function main() {
    try {
        const migrationSql = fs.readFileSync('drizzle/0005_add_user_features.sql', 'utf8');
        console.log('Applying migration 0004...');

        // Check version - REMOVED to avoid noise
        // const version = await sql`SELECT version()`;
        // console.log('Postgres Version:', version[0].version);

        /*
        // Debug: Run simple query
        await sql.unsafe("ALTER TABLE profile_works ADD COLUMN IF NOT EXISTS status text DEFAULT 'now'");
        console.log('Simple ALTER TABLE succeeded.');
        return;
        */

        // Strip comments
        const cleanSql = migrationSql.replace(/--.*$/gm, '');
        const statements = cleanSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
        console.log(`Found ${statements.length} statements.`);

        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 100) + '...');
            await sql.unsafe(statement);
        }
        console.log('Migration 0004 applied successfully.');

    } catch (error) {
        console.error('Error applying migration 0004:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
