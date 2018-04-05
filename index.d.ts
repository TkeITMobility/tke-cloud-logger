
declare module 'tke-logger' {
  import * as bunyan from 'bunyan';

  interface LoggerFactory {
    getLogger: (filename?: string) => bunyan;
  }

  const instance: LoggerFactory;
  export = instance;
}
