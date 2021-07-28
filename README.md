# zz-log

Colorful and extensible logging.

## Usage

### Basic Console Logging

```js
import { ConsoleLogger } from 'zz-log';

const logger = new ConsoleLogger();

// Log a simple message.
logger.info('Starting');

// Log a warning with more complex details.
logger.warn({
  title: 'No cheese left',
  detail: 'Store has no cheese left in stock',
  subDetail: 'Next delivery on Wednesday'
});

const error = new Error('Something bad happened');

// Log an error.
logger.error({
  title: 'Unexpected Error',
  error,
});

error.innerError = new Error('This is an inner error');
error.innerError.innerError = new Error('This is another inner error');

// Log an error that has innerErrors.
logger.fatal({
  title: 'Fatal Error',
  error,
});

// Log a debug message
logger.debug({ title: 'Memory Usage', subDetail: process.memoryUsage() });

// Log a trace message
logger.trace('Bye');
```

This outputs the following to the console:

![Output in the console](https://raw.githubusercontent.com/mistval/zz-log/main/images/console_basic.png)

### Restricting Log Levels

You can choose which log levels are actually logged.

```js
import { ConsoleLogger, LogLevel } from 'zz-log';

const errorOnlyLogger = new ConsoleLogger({ logLevel: LogLevel.error | LogLevel.fatal });

errorOnlyLogger.error('It logs this');
errorOnlyLogger.fatal('It logs this too');
errorOnlyLogger.warn('It does not log this');
```

This outputs the following to the console:

![Output in the console](https://raw.githubusercontent.com/mistval/zz-log/main/images/restrict_levels.png)

### NOOP Logger

The NOOP logger does nothing, and is meant for certain environments like unit testing, where you may not want to log anything.

```js
import { NoopLogger } from 'zz-log';

const noopLogger = new NoopLogger();

noopLogger.warn('It does not log this');
noopLogger.debug('Or this');
noopLogger.fatal('Or anything else');
```

Alternatively, you could use a ConsoleLogger or other logger, and sets its `logLevel` option to `LogLevel.none`.

### Custom ConsoleLogger formatting

You can extend ConsoleLogger and override its functions to custom formatting, for example:

```js
import { ConsoleLogger } from 'zz-log';

class MyConsoleLogger extends ConsoleLogger {
  // Log custom fields instead of just the "detail" field.
  formatDetail(logItem) {
    return `${logItem.part1} -- ${logItem.part2} -- ${logItem.part3}`;
  }

  // Disable timestamp logging.
  formatTimestamp() {
    return undefined;
  }
}

const myLogger = new MyConsoleLogger();

myLogger.warn({
  title: 'Custom Log Fields',
  part1: 'p1',
  part2: 'p2',
  part3: 'p3',
  subDetail: 'XyZ'
});
```

This outputs the following to the console:

![Output in the console](https://raw.githubusercontent.com/mistval/zz-log/main/images/custom_console.png)

### Composite Logger

You can log to more than one logger, by creating a CompositeLogger.

```js
import { CompositeLogger, ConsoleLogger } from 'zz-log';

const compositeLogger = new CompositeLogger([new ConsoleLogger(), new ConsoleLogger()]);
compositeLogger.warn('I get logged twice!');
```

This outputs the following to the console:

![Output in the console](https://raw.githubusercontent.com/mistval/zz-log/main/images/composite.png)

### Custom Logger

You can also go one level higher and extend directly from BaseLogger to implement other log targets besides the console:

```js
class MyCloudLogger extends BaseLogger {
  log(info, logLevel) {
    myLogToCloudFunction(logLevel, {
      title: info.title,
      detail: info.detail,
      error: info.error,
      otherFields: { ...info },
    });
  }
}
```

If that's still not flexible enough, you can also choose to implement the ILogger TypeScript interface (or in plain JS, create a class that implements these functions):

```ts
export interface ILogger {
  fatal(info: LogItem): void;
  error(info: LogItem): void;
  warn(info: LogItem): void;
  info(info: LogItem): void;
  debug(info: LogItem): void;
  trace(info: LogItem): void;
}
```
