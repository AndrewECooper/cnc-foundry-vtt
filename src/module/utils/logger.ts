enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private isEnabled: boolean = true;
  private logLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.isEnabled || level < this.logLevel) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `TLGCC | [${timestamp}] ${LogLevel[level]}: ${message}`;

    // Convert objects to string representation
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return arg;
    });

    switch (level) {
      case LogLevel.DEBUG:
        console.log('%c' + formattedMessage, 'color: #888', ...formattedArgs);
        break;
      case LogLevel.INFO:
        console.log('%c' + formattedMessage, 'color: #0f0', ...formattedArgs);
        break;
      case LogLevel.WARN:
        console.warn('%c' + formattedMessage, 'color: #ff0', ...formattedArgs);
        break;
      case LogLevel.ERROR:
        console.error('%c' + formattedMessage, 'color: #f00', ...formattedArgs);
        break;
    }
  }
}

export { Logger, LogLevel };

// // Usage example
// const logger = Logger.getInstance();
//
// // Set log level (optional, default is INFO)
// logger.setLogLevel(LogLevel.DEBUG);
//
// // Log messages
// logger.debug('This is a debug message');
// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');
//
// // Disable logging
// logger.disable();
//
// // This won't be logged
// logger.info('This message won't be logged');
//
// // Enable logging again
// logger.enable();
//
// // This will be logged
// logger.info('Logging is enabled again');