/**
 * @file errors.ts
 * @description 統一されたエラーハンドリングシステム
 * アプリケーション全体で一貫したエラー処理を提供
 */

/**
 * エラーレスポンスの型
 */
export interface ErrorResponse {
  error: {
    code: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
    stack?: string;
  };
}

/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
  public readonly code: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: number,
    name: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.details = details;

    // スタックトレースを正しく設定
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * バリデーションエラー (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, 'ValidationError', message, details);
  }
}

/**
 * 認証エラー (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UnauthorizedError', message);
  }
}

/**
 * 権限エラー (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, 'ForbiddenError', message);
  }
}

/**
 * リソース未発見エラー (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, 'NotFoundError', `${resource} not found`);
  }
}

/**
 * 競合エラー (409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'ConflictError', message);
  }
}

/**
 * 内部エラー (500)
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'InternalError', message);
  }
}

/**
 * AppErrorかどうかを判定
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 任意のエラーをAppErrorに変換
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalError(error.message);
  }

  if (typeof error === 'string') {
    return new InternalError(error);
  }

  if (error === null || error === undefined) {
    return new InternalError('Unknown error');
  }

  return new InternalError(String(error));
}

/**
 * エラーをAPIレスポンス形式にフォーマット
 */
export function formatErrorResponse(
  error: AppError,
  requestId?: string
): ErrorResponse {
  const response: ErrorResponse = {
    error: {
      code: error.code,
      name: error.name,
      message: error.message,
    },
  };

  if (error.details) {
    response.error.details = error.details;
  }

  if (requestId) {
    response.error.requestId = requestId;
  }

  // 開発環境でのみスタックトレースを含める
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * レガシーエラーオブジェクトをAppErrorに変換
 * 既存コードとの互換性のため
 */
export function fromLegacyError(error: {
  code?: number;
  name?: string;
  message?: string;
}): AppError {
  const code = error.code ?? 500;
  const name = error.name ?? 'AppError';
  const message = error.message ?? 'Unknown error';

  switch (name) {
    case 'ValidationError':
      return new ValidationError(message);
    case 'UnauthorizedError':
      return new UnauthorizedError(message);
    case 'ForbiddenError':
      return new ForbiddenError(message);
    case 'NotFoundError':
      return new NotFoundError(message.replace(' not found', ''));
    case 'ConflictError':
      return new ConflictError(message);
    default:
      return new AppError(code, name, message);
  }
}
