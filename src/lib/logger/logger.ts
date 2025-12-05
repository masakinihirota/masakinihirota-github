/**
 * @file logger.ts
 * @description アプリケーションロガー
 * 構造化ログ、監査ログ、パフォーマンス計測をサポート
 */

/**
 * ログレベル
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

/**
 * ログエントリの型
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  name: string;
  message: string;
  context?: Record<string, unknown>;
  // 監査ログ用フィールド
  action?: string;
  userId?: string;
  resource?: string;
  details?: Record<string, unknown>;
  // パフォーマンスログ用
  duration?: number;
}

/**
 * 監査ログパラメータ
 */
export interface AuditParams {
  action: string;
  userId: string;
  resource: string;
  details?: Record<string, unknown>;
}

/**
 * ロガーオプション
 */
export interface LoggerOptions {
  /** ロガー名 */
  name?: string;
  /** 最小ログレベル */
  level?: LogLevel;
  /** ログ出力時のコールバック */
  onLog?: (entry: LogEntry) => void;
  /** 追加コンテキスト */
  context?: Record<string, unknown>;
}

/**
 * ロガーインターフェース
 */
export interface Logger {
  /** デバッグログ */
  debug(message: string, context?: Record<string, unknown>): void;
  /** 情報ログ */
  info(message: string, context?: Record<string, unknown>): void;
  /** 警告ログ */
  warn(message: string, context?: Record<string, unknown>): void;
  /** エラーログ */
  error(message: string, context?: Record<string, unknown>): void;
  /** 監査ログ */
  audit(params: AuditParams): void;
  /** 子ロガーを作成（追加コンテキスト付き） */
  child(context: Record<string, unknown>): Logger;
  /** 実行時間計測付きログ */
  time<T>(label: string, fn: () => Promise<T>): Promise<T>;
}

/**
 * ログレベル名のマッピング
 */
const levelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.SILENT]: 'SILENT',
};

/**
 * 現在のタイムスタンプを取得
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * ログエントリをフォーマット
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level}]`,
    `[${entry.name}]`,
    entry.message,
  ];

  if (entry.context && Object.keys(entry.context).length > 0) {
    parts.push(JSON.stringify(entry.context));
  }

  return parts.join(' ');
}

/**
 * ロガーを作成
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const {
    name = 'App',
    level = LogLevel.INFO,
    onLog,
    context: baseContext = {},
  } = options;

  function log(
    logLevel: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (logLevel < level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: getTimestamp(),
      level: levelNames[logLevel],
      name,
      message,
      context: { ...baseContext, ...context },
    };

    if (onLog) {
      onLog(entry);
    }

    const formatted = formatLogEntry(entry);

    switch (logLevel) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  const logger: Logger = {
    debug(message: string, context?: Record<string, unknown>): void {
      log(LogLevel.DEBUG, message, context);
    },

    info(message: string, context?: Record<string, unknown>): void {
      log(LogLevel.INFO, message, context);
    },

    warn(message: string, context?: Record<string, unknown>): void {
      log(LogLevel.WARN, message, context);
    },

    error(message: string, context?: Record<string, unknown>): void {
      log(LogLevel.ERROR, message, context);
    },

    audit(params: AuditParams): void {
      const entry: LogEntry = {
        timestamp: getTimestamp(),
        level: 'AUDIT',
        name,
        message: `Audit: ${params.action}`,
        action: params.action,
        userId: params.userId,
        resource: params.resource,
        details: params.details,
        context: baseContext,
      };

      if (onLog) {
        onLog(entry);
      }

      console.log(formatLogEntry(entry));
    },

    child(additionalContext: Record<string, unknown>): Logger {
      return createLogger({
        name,
        level,
        onLog,
        context: { ...baseContext, ...additionalContext },
      });
    },

    async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
      const start = performance.now();
      try {
        const result = await fn();
        const duration = performance.now() - start;
        log(LogLevel.INFO, `${label} completed`, { duration: `${duration.toFixed(2)}ms` });
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        log(LogLevel.ERROR, `${label} failed`, { duration: `${duration.toFixed(2)}ms`, error: String(error) });
        throw error;
      }
    },
  };

  return logger;
}

/**
 * デフォルトロガーインスタンス
 */
export const defaultLogger = createLogger({ name: 'VNS' });
