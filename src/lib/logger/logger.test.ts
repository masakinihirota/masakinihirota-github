/**
 * @file logger.test.ts
 * @description アプリケーションロガーのユニットテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLogger, LogLevel, type Logger, type LogEntry } from './logger';

describe('Logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createLogger', () => {
    it('creates a logger with default options', () => {
      const logger = createLogger();
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('creates a logger with custom name', () => {
      const logger = createLogger({ name: 'TestLogger' });
      logger.info('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    it('logs info messages', () => {
      const logger = createLogger({ level: LogLevel.INFO });
      logger.info('info message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('logs warn messages', () => {
      const logger = createLogger({ level: LogLevel.INFO });
      logger.warn('warn message');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('logs error messages', () => {
      const logger = createLogger({ level: LogLevel.INFO });
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('respects minimum log level', () => {
      const logger = createLogger({ level: LogLevel.WARN });
      logger.info('should not appear');
      logger.debug('should not appear');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('debug messages only appear at DEBUG level', () => {
      const logger = createLogger({ level: LogLevel.DEBUG });
      logger.debug('debug message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('structured logging', () => {
    it('includes metadata in log entries', () => {
      const logger = createLogger({ name: 'TestApp' });
      logger.info('test', { userId: '123', action: 'login' });
      expect(consoleSpy.log).toHaveBeenCalled();
      const callArgs = consoleSpy.log.mock.calls[0];
      expect(callArgs[0]).toContain('TestApp');
    });

    it('creates child logger with additional context', () => {
      const logger = createLogger({ name: 'App' });
      const childLogger = logger.child({ requestId: 'req-123' });
      childLogger.info('child message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('audit logging', () => {
    it('logs audit events with required fields', () => {
      const logger = createLogger({ name: 'AuditLog' });
      const entries: LogEntry[] = [];
      const auditLogger = createLogger({
        name: 'Audit',
        onLog: (entry) => entries.push(entry),
      });

      auditLogger.audit({
        action: 'user.login',
        userId: 'user-123',
        resource: 'auth',
        details: { ip: '127.0.0.1' },
      });

      expect(entries.length).toBe(1);
      expect(entries[0].action).toBe('user.login');
      expect(entries[0].userId).toBe('user-123');
    });
  });

  describe('error handling', () => {
    it('handles Error objects properly', () => {
      const logger = createLogger();
      const error = new Error('test error');
      logger.error('Operation failed', { error });
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('handles non-Error objects', () => {
      const logger = createLogger();
      logger.error('Operation failed', { error: 'string error' });
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('performance logging', () => {
    it('logs execution time', async () => {
      const logger = createLogger();
      const result = await logger.time('test-operation', async () => {
        return 'result';
      });
      expect(result).toBe('result');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });
});
