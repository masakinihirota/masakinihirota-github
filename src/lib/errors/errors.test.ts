/**
 * @file errors.test.ts
 * @description カスタムエラークラスのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import {
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
  type ErrorResponse,
} from './errors';

describe('AppError', () => {
  it('creates an error with code and message', () => {
    const error = new AppError(400, 'Bad Request', 'Something went wrong');
    expect(error.code).toBe(400);
    expect(error.name).toBe('Bad Request');
    expect(error.message).toBe('Something went wrong');
  });

  it('includes stack trace', () => {
    const error = new AppError(500, 'Error', 'Test');
    expect(error.stack).toBeDefined();
  });
});

describe('ValidationError', () => {
  it('creates a 400 error with ValidationError name', () => {
    const error = new ValidationError('Invalid input');
    expect(error.code).toBe(400);
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('Invalid input');
  });

  it('can include field errors', () => {
    const error = new ValidationError('Validation failed', {
      email: 'Invalid email format',
      name: 'Name is required',
    });
    expect(error.details).toEqual({
      email: 'Invalid email format',
      name: 'Name is required',
    });
  });
});

describe('UnauthorizedError', () => {
  it('creates a 401 error', () => {
    const error = new UnauthorizedError();
    expect(error.code).toBe(401);
    expect(error.name).toBe('UnauthorizedError');
    expect(error.message).toBe('Unauthorized');
  });

  it('accepts custom message', () => {
    const error = new UnauthorizedError('Invalid token');
    expect(error.message).toBe('Invalid token');
  });
});

describe('ForbiddenError', () => {
  it('creates a 403 error', () => {
    const error = new ForbiddenError();
    expect(error.code).toBe(403);
    expect(error.name).toBe('ForbiddenError');
    expect(error.message).toBe('Forbidden');
  });
});

describe('NotFoundError', () => {
  it('creates a 404 error', () => {
    const error = new NotFoundError('User');
    expect(error.code).toBe(404);
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('User not found');
  });

  it('uses default resource name', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
  });
});

describe('ConflictError', () => {
  it('creates a 409 error', () => {
    const error = new ConflictError('Email already exists');
    expect(error.code).toBe(409);
    expect(error.name).toBe('ConflictError');
    expect(error.message).toBe('Email already exists');
  });
});

describe('InternalError', () => {
  it('creates a 500 error', () => {
    const error = new InternalError();
    expect(error.code).toBe(500);
    expect(error.name).toBe('InternalError');
    expect(error.message).toBe('Internal server error');
  });

  it('accepts custom message', () => {
    const error = new InternalError('Database connection failed');
    expect(error.message).toBe('Database connection failed');
  });
});

describe('isAppError', () => {
  it('returns true for AppError instances', () => {
    expect(isAppError(new AppError(400, 'Test', 'test'))).toBe(true);
    expect(isAppError(new ValidationError('test'))).toBe(true);
    expect(isAppError(new UnauthorizedError())).toBe(true);
  });

  it('returns false for non-AppError objects', () => {
    expect(isAppError(new Error('test'))).toBe(false);
    expect(isAppError({ code: 400, message: 'test' })).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
  });
});

describe('toAppError', () => {
  it('returns AppError as-is', () => {
    const original = new ValidationError('test');
    expect(toAppError(original)).toBe(original);
  });

  it('converts regular Error to InternalError', () => {
    const original = new Error('Something failed');
    const converted = toAppError(original);
    expect(converted.code).toBe(500);
    expect(converted.message).toBe('Something failed');
  });

  it('converts unknown types to InternalError', () => {
    const converted = toAppError('string error');
    expect(converted.code).toBe(500);
    expect(converted.message).toBe('string error');
  });

  it('handles null/undefined', () => {
    expect(toAppError(null).message).toBe('Unknown error');
    expect(toAppError(undefined).message).toBe('Unknown error');
  });
});

describe('formatErrorResponse', () => {
  it('formats AppError to ErrorResponse', () => {
    const error = new ValidationError('Invalid input', { field: 'error' });
    const response = formatErrorResponse(error);

    expect(response.error.code).toBe(400);
    expect(response.error.name).toBe('ValidationError');
    expect(response.error.message).toBe('Invalid input');
    expect(response.error.details).toEqual({ field: 'error' });
  });

  it('includes requestId when provided', () => {
    const error = new InternalError();
    const response = formatErrorResponse(error, 'req-123');

    expect(response.error.requestId).toBe('req-123');
  });

  it('excludes stack in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new InternalError();
    const response = formatErrorResponse(error);

    expect(response.error.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
