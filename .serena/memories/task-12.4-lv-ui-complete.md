# Task 12.4: Lv制UIへの統合 - 完了

## 完了日: 2025-12-04

## 実装内容

### 12.4.1: サイドバーメニューへのLv連動解放表示
- `MENU_UNLOCK_CONFIG` 定義（ゲーミフィケーション設計書 Section 3.2 準拠）
  - matching: Lv1でグレー → Lv3で解放
  - organizations/works: Lv2でグレー → Lv3で解放
  - values: Lv2でグレー → Lv4で解放
  - nations: Lv3でグレー → Lv10で解放（上位機能）
  - skills: Lv10でグレー → Lv12で解放（最上位機能、Lv10まで非表示）
- `getMenuItemState(feature, currentLevel)`: 'hidden' | 'grayed' | 'unlocked' を返す
- `getMenuUnlockTip(feature)`: 解放条件のTipsテキストを返す
- `isNewlyUnlocked(feature, currentLevel, previousLevel)`: 新規解放判定

### 12.4.2: グレーアウト+Tips表示実装
- `NavItem` コンポーネント: グレーアウト時にopacity-50、cursor-not-allowed、tooltip表示
- `NavMore` コンポーネント: 折りたたみメニュー内のグレーアウト+Tips
- `SidebarMenuSubButton`: aria-disabled="true"でアクセシビリティ対応

### 12.4.3: 🆕バッジ表示（機能解放時）
- `newlyUnlockedFeatures` 配列でバッジ表示対象を管理
- NavItem/NavMore内で🆕絵文字バッジを表示

## 追加・変更ファイル

### src/lib/tutorial/tutorial.ts
- `MenuItemState` 型追加
- `MenuUnlockConfig` インターフェース追加
- `MENU_UNLOCK_CONFIG` 定数追加
- `getMenuItemState()` 関数追加
- `getMenuUnlockTip()` 関数追加
- `isNewlyUnlocked()` 関数追加

### src/lib/tutorial/tutorial.test.ts
- 15テスト追加（合計53テスト）
- getMenuItemState、getMenuUnlockTip、MENU_UNLOCK_CONFIG、isNewlyUnlocked

### src/components/layout/AppSidebar.tsx
- `PATH_TO_FEATURE_MAP` 定数追加（URLパス → 機能名マッピング）
- `mapPathToFeature()` 関数追加
- `MenuItemWithState` 型追加
- `getMenuItemsWithState()` 関数追加
- `AppSidebarProps` インターフェース追加（userLevel, newlyUnlockedFeatures）
- `NavItem` コンポーネント: Lv制対応（grayed state, tips, 🆕badge）
- `NavGroup` コンポーネント: userLevel prop追加
- `NavMore` コンポーネント: userLevel, newlyUnlockedFeatures prop追加

### src/components/layout/AppSidebar.test.ts
- 11テスト追加（合計14テスト）
- mapPathToFeature、getMenuItemsWithState

## テスト結果
- tutorial.test.ts: 53 passed
- AppSidebar.test.ts: 14 passed
- 合計: 67 passed

## 2段階解放システム（設計書準拠）
1. 第1段階（グレー表示）: 機能の存在を認識させるが利用不可
2. 第2段階（完全解放）: 機能が利用可能になり🆕バッジ表示

## 次のタスク候補
- Task 12.2: レスポンシブ対応の強化
- Task 12.3: 検索機能の改善
