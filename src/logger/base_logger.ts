import { ILogger } from './i_logger';
import { LogItem } from './log_item';
import { LogLevel } from './log_level';

export abstract class BaseLogger implements ILogger {
  public readonly logLevel: LogLevel;

  constructor(options: { logLevel?: LogLevel } = {}) {
    this.logLevel = options.logLevel ?? LogLevel.all;
  }

  fatal(info: LogItem) {
    this.doLog(info, LogLevel.fatal);
  }

  error(info: LogItem) {
    this.doLog(info, LogLevel.error);
  }

  warn(info: LogItem) {
    this.doLog(info, LogLevel.warn);
  }

  info(info: LogItem) {
    this.doLog(info, LogLevel.info);
  }

  debug(info: LogItem) {
    this.doLog(info, LogLevel.debug);
  }

  trace(info: LogItem) {
    this.doLog(info, LogLevel.trace);
  }

  protected abstract log(info: LogItem, logLevel: LogLevel): void;

  private doLog(info: LogItem, logLevel: LogLevel) {
    // eslint-disable-next-line no-bitwise
    if ((logLevel & this.logLevel) === logLevel) {
      this.log(info, logLevel);
    }
  }
}
