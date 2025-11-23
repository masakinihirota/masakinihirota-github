import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    // @ts-ignore
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});


// Supabase用
// import { config } from "dotenv";
// import { defineConfig } from "drizzle-kit";

// config({ path: ".env" });

// export default defineConfig({
//   // フォルダ内にあるスキーマファイルを読み込む
//   schema: "./drizzle/schema/**/*.ts",
//   // Supabase へのマイグレーションファイルを出力するディレクトリ
//   out: "./supabase/migrations",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });
