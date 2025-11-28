// Ensure module resolution patch runs from the project root before ESLint loads
import '@rushstack/eslint-patch/modern-module-resolution';
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ignore common build/output directories so lint doesn't scan generated files
  { ignores: [".next/**", "dist/**", "node_modules/**", ".vercel/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
