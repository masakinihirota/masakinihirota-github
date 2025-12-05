# Task 11.3: エラーハンドリングの統一 完了

## 完了日時
2025年1月

## 作成ファイル

### src/lib/errors/errors.ts
統一エラーハンドリングシステムの実装

**クラス構成:**
- `AppError` - 基底クラス（code, name, message, details, cause）
- `ValidationError` - 400 Bad Request
- `UnauthorizedError` - 401 Unauthorized
- `ForbiddenError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `ConflictError` - 409 Conflict
- `InternalError` - 500 Internal Server Error

**ユーティリティ関数:**
- `isAppError(error)` - AppErrorインスタンス判定
- `toAppError(error)` - 任意のエラーをAppErrorに変換
- `formatErrorResponse(error)` - APIレスポンス形式に整形
- `fromLegacyError(legacy)` - レガシーエラー形式からの変換

### src/lib/errors/errors.test.ts
15テストケース

### src/lib/errors/index.ts
モジュールエクスポート

## レガシーエラーパターン
既存コードで発見されたパターン（`createWork.logic.ts`、`createProfile.logic.ts`）:
```typescript
{ code: string, name: string, message: string }
```
→ `fromLegacyError()` で変換可能

## 使用例
```typescript
import { ValidationError, NotFoundError, formatErrorResponse } from '@/lib/errors';

// エラーのスロー
throw new ValidationError('入力値が不正です', { field: 'title' });

// APIレスポンス
const response = formatErrorResponse(error);
// { error: { code: 'VALIDATION_ERROR', message: '入力値が不正です', details: { field: 'title' } } }
```

## テスト結果
- 175ファイルパス、732テストパス
