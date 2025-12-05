/**
 * @file index.ts
 * @description エラーハンドリングモジュールのエクスポート
 */

export {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError,
  isAppError,
  toAppError,
  formatErrorResponse,
  fromLegacyError,
  type ErrorResponse,
} from './errors';
