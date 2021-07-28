import { LogItem } from './log_item';

export interface ILogger {
  fatal(info: LogItem): void;
  error(info: LogItem): void;
  warn(info: LogItem): void;
  info(info: LogItem): void;
  debug(info: LogItem): void;
  trace(info: LogItem): void;
}
