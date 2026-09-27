/**
 * Structured Observability Logger for Outstand
 * Provides JSON-structured logging with context tagging, correlation IDs, and production sanitization.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, unknown>;
  correlationId?: string;
}

class StructuredLogger {
  private isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;

  private formatEntry(level: LogLevel, context: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(metadata ? { metadata } : {}),
    };
  }

  public debug(context: string, message: string, metadata?: Record<string, unknown>): void {
    if (this.isProd) return; // Suppress debug in production
    const entry = this.formatEntry('debug', context, message, metadata);
    console.debug(`[${entry.timestamp}] [DEBUG] [${context}]`, message, metadata || '');
  }

  public info(context: string, message: string, metadata?: Record<string, unknown>): void {
    const entry = this.formatEntry('info', context, message, metadata);
    if (this.isProd) {
      console.info(JSON.stringify(entry));
    } else {
      console.info(`[${entry.timestamp}] [INFO] [${context}]`, message, metadata || '');
    }
  }

  public warn(context: string, message: string, metadata?: Record<string, unknown>): void {
    const entry = this.formatEntry('warn', context, message, metadata);
    if (this.isProd) {
      console.warn(JSON.stringify(entry));
    } else {
      console.warn(`[${entry.timestamp}] [WARN] [${context}]`, message, metadata || '');
    }
  }

  public error(context: string, message: string, error?: unknown, metadata?: Record<string, unknown>): void {
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: this.isProd ? undefined : error.stack }
      : { raw: String(error) };

    const entry = this.formatEntry('error', context, message, {
      ...metadata,
      error: errorDetails,
    });

    if (this.isProd) {
      console.error(JSON.stringify(entry));
    } else {
      console.error(`[${entry.timestamp}] [ERROR] [${context}]`, message, error || '', metadata || '');
    }
  }
}

export const logger = new StructuredLogger();
export default logger;
