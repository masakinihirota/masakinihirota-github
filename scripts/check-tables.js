const postgres = require('postgres');

const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');

async function main() {
    try {
        const tables = await sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `;
        console.log('Tables in public schema:', tables.map(t => t.table_name));
    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        await sql.end();
    }
}

main();
