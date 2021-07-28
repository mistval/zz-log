export enum LogLevel {
  fatal = 1,
  error = 2,
  warn = 4,
  info = 8,
  debug = 16,
  trace = 32,

  // eslint-disable-next-line no-bitwise
  all = 1 | 2 | 4 | 8 | 16 | 32,
  none = 65536,
}
