const postgres = require('postgres');

const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');

async function main() {
    try {
        const columns = await sql`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'users'
        `;
        console.log('Columns in users table:', columns.map(c => c.column_name));
    } catch (error) {
        console.error('Error checking columns:', error);
    } finally {
        await sql.end();
    }
}

main();
