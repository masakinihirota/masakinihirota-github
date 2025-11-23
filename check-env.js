const dotenv = require('dotenv');

// .env と .env.local を読み込む
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
const dbUrl = process.env.DATABASE_URL;
const authToken = process.env.AUTH_TOKEN;

console.log('--- 環境変数チェック ---');
if (tursoUrl) console.log('TURSO_DATABASE_URL: 設定済み');
if (tursoToken) console.log('TURSO_AUTH_TOKEN: 設定済み');
if (dbUrl) console.log('DATABASE_URL: 設定済み');
if (authToken) console.log('AUTH_TOKEN: 設定済み');

if (!tursoUrl && !dbUrl) {
    console.log('エラー: データベースURLが見つかりません (TURSO_DATABASE_URL または DATABASE_URL)。');
    process.exit(1);
}

if (!tursoToken && !authToken) {
    console.log('エラー: 認証トークンが見つかりません (TURSO_AUTH_TOKEN または AUTH_TOKEN)。');
    process.exit(1);
}

console.log('準備完了: 認証情報が見つかりました。');
