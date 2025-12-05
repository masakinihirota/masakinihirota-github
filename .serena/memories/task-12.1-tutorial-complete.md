# Task 12.1: チュートリアル導線の実装 完了

## 完了日時
2025年1月

## 作成ファイル

### src/lib/tutorial/tutorial.ts
チュートリアル導線ロジックの実装

**定数定義:**
- `TutorialStatus` - not_started, in_progress, completed, skipped
- `TutorialRoute` - org, nation, both, skip
- `TUTORIAL_STEPS` - ステップ定義配列（login, profile_creation, route_selection等）

**関数:**
- `getTutorialProgress(step, status)` - 進捗情報取得
- `canSkipTutorial(level)` - スキップ可否判定（Lv2以上でスキップ可）
- `getNextStep(step, status, route)` - 次ステップ取得
- `isStepCompleted(stepId, step)` - ステップ完了判定
- `calculateTutorialRewards(step, route)` - 報酬計算（スキップボーナス500pt含む）
- `isFeatureUnlocked(feature, level)` - 機能解放判定
- `getFeatureUnlockLevel(feature)` - 機能解放レベル取得
- `shouldShowTutorialPrompt(status, level)` - プロンプト表示判定
- `getTutorialRouteDescription(route)` - ルート説明取得

### src/lib/tutorial/tutorial.test.ts
38テストケース

### src/components/tutorial/KingDialog/KingDialog.tsx
王様との対話ダイアログUI
- 4つのルート選択ボタン（組織編🏰、国編🗺️、両方⚔️、スキップ🕊️）
- カスタムメッセージ対応

### src/components/tutorial/TutorialPrompt/TutorialPrompt.tsx
チュートリアル導線バナー
- ホームページなどに表示
- 進捗表示、次ステップへのリンク
- 完了/スキップ時は非表示

### src/app/(protected)/(menu)/(90-tutorial)/tutorial/route-selection/page.tsx
ルート選択ページ
- プロフィール作成後に表示
- 王様ダイアログを表示
- ルート選択後、適切なページへリダイレクト

## 機能解放レベル
- Lv1: home, profiles
- Lv3: matching, organizations, works
- Lv4: values
- Lv5: nations

## 使用例
```typescript
import { 
  TutorialStatus, 
  getTutorialProgress, 
  shouldShowTutorialPrompt 
} from '@/lib/tutorial';
import { KingDialog, TutorialPrompt } from '@/components/tutorial';

// 進捗取得
const progress = getTutorialProgress(2, TutorialStatus.IN_PROGRESS);

// プロンプト表示判定
if (shouldShowTutorialPrompt(status, level)) {
  <TutorialPrompt status={status} currentLevel={level} ... />
}

// 王様ダイアログ
<KingDialog onSelectRoute={(route) => handleRoute(route)} />
```

## テスト結果
- 179ファイルパス、790テストパス
