/**
 * Layout コンポーネント集約
 * レイアウトに関連するコンポーネントを名前付きエクスポート
 */

// フォルダ化されたコンポーネント
export { GlobalHeaderMenu } from './GlobalHeaderMenu';

// シンプルなコンポーネント（今後フォルダ化推奨）
export { Header } from './header';
export { Footer } from './footer';
export { GlobalHeader } from './GlobalHeader';
export { AppSidebar } from './AppSidebar';

// デフォルトエクスポートのコンポーネント
export { default as AdToggle } from './AdToggle';
export { default as LanguageToggle } from './LanguageToggle';
