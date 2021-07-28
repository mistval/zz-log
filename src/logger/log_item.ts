interface LogItemObj {
  title?: string;
  detail?: string;
  subDetail?: string;
  error?: Error;
  [key: string]: any;
}

export type LogItem = LogItemObj | string;
