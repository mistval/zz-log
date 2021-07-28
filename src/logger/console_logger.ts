import assert from 'assert';
import Chalk from 'chalk';
import { isPresent } from 'ts-is-present';
import { format } from 'date-fns';
import { BaseLogger } from './base_logger';
import { LogItem } from './log_item';
import { LogLevel } from './log_level';

/* eslint-disable no-console */

const headerForLogLevel = {
  [LogLevel.trace]: Chalk.black.bgHex('#DEADED')(' TRACE '),
  [LogLevel.debug]: Chalk.black.bgHex('#DEADED')(' DEBUG '),
  [LogLevel.info]: Chalk.white.bgBlue(' INFO '),
  [LogLevel.warn]: Chalk.black.bgYellow(' WARNING '),
  [LogLevel.error]: Chalk.yellow.bgRed(' ERROR '),
  [LogLevel.fatal]: Chalk.yellow.bgRed.bold(' FATAL ERROR '),
};

const consoleFuncForLogLevel = {
  [LogLevel.trace]: console.log,
  [LogLevel.debug]: console.log,
  [LogLevel.info]: console.log,
  [LogLevel.warn]: console.warn,
  [LogLevel.error]: console.error,
  [LogLevel.fatal]: console.error,
};

function stringify(obj: string | object) {
  if (typeof obj === 'string') {
    return obj;
  }

  if (obj.toString === Object.prototype.toString) {
    return JSON.stringify(obj);
  }

  return obj.toString();
}

export class ConsoleLogger extends BaseLogger {
  protected log(info: LogItem, logLevel: LogLevel): void {
    const logFunc = consoleFuncForLogLevel[logLevel];
    assert(logFunc, `Unknown log level ${logLevel}`);

    const result = this.format(info, logLevel);
    logFunc(result);
  }

  protected format(logItem: LogItem, logLevel: LogLevel) {
    const errorPart = this.formatError(logItem);
    const parts = [
      this.formatTimestamp(),
      this.formatLogLevel(logLevel),
      this.formatTitle(logItem),
      this.formatDetail(logItem),
      this.formatSubDetail(logItem),
      errorPart && `\n${errorPart}`,
    ].filter(isPresent);

    return parts.join(' ');
  }

  protected formatTimestamp() {
    return format(new Date(), '[MM/dd/yyyy HH:mm:ss]');
  }

  protected formatLogLevel(logLevel: LogLevel) {
    return headerForLogLevel[logLevel];
  }

  protected formatTitle(logItem: LogItem) {
    if (typeof logItem === 'string') {
      return undefined;
    }

    return logItem.title && Chalk.underline(stringify(logItem.title));
  }

  protected formatDetail(logItem: LogItem) {
    const detail = typeof logItem === 'string'
      ? logItem
      : logItem.detail;

    return detail && Chalk.yellow(stringify(detail));
  }

  protected formatSubDetail(logItem: LogItem) {
    if (typeof logItem === 'string') {
      return undefined;
    }

    return logItem.subDetail && `[${Chalk.magenta(stringify(logItem.subDetail))}]`;
  }

  protected formatError(logItem: LogItem) {
    if (typeof logItem === 'string') {
      return undefined;
    }

    const errors = [];
    let nextError = logItem.error;
    while (nextError) {
      errors.push(nextError);
      nextError = (nextError as any).innerError;
    }

    if (errors.length === 0) {
      return undefined;
    }

    const errorText = errors.map((e, i) => {
      if (i > 0) {
        return `Inner Error: ${e.stack}`;
      }

      return e.stack;
    }).join('\n');

    return logItem.error && Chalk.red(errorText);
  }
}
