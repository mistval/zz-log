import { ILogger } from './i_logger';

export class CompositeLogger implements ILogger {
  constructor(private readonly loggers: ILogger[]) {
  }

  fatal = (info: object) => this.loggers.forEach((l) => l.fatal(info));

  error = (info: object) => this.loggers.forEach((l) => l.error(info));

  warn = (info: object) => this.loggers.forEach((l) => l.warn(info));

  info = (info: object) => this.loggers.forEach((l) => l.info(info));

  debug = (info: object) => this.loggers.forEach((l) => l.debug(info));

  trace = (info: object) => this.loggers.forEach((l) => l.trace(info));
}
