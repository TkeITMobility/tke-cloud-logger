'use strict';

const bunyan = require('bunyan');
const BunyanFormat = require('bunyan-format');
const env = require('env-var');

const fhEnv = env.get('FH_ENV').default('LOCAL').asString();;
const isLocal = env.get('FH_USE_LOCAL_DB').default('false').asBool();

const ENV_LOG_LEVEL_MAP = {
  'LOCAL': 'trace',
  'tke-dev': 'trace',
  'tke-test': 'debug',
  'tke-preprod': 'info',
  'tke-prod': 'info'
};

exports.getLogger = function getLogger(filename) {
  return bunyan.createLogger({
    name: getCallerFilename(filename),
    streams: [{
      stream: getStream(process.stdout),
      level: getLogLevel()
    }, {
      stream: getStream(process.stderr),
      level: 'warn'
    }]
  });
}

function getStream(out) {
  return new BunyanFormat({
    // Use this formatter to output plain text instead of json
    outputMode: 'long',
    color: isLocal // No colors supported in rhmap
  }, out);
}

function getCallerFilename(filename) {
  if (filename) {
    return removeCwd(filename);
  }

  // Figures out the caller's file name by creating an error and looking at the second item in the stack.
  // This WILL NOT WORK if not called in the top-level buildLogger function!
  const err = new Error();
  const n = err.stack.split('\n')[3];
  const fullname = n.substring(n.lastIndexOf('(') + 1, n.length - 1).split(':')[0];
  return removeCwd(fullname);
}

function removeCwd(filename) {
  return filename.replace(process.cwd(), '');
}

function getLogLevel() {
  if (isLocal) {
    // We use trace during local development
    return 'trace';
  } else {
    // Otherwise we go with the FH_ENV mapping or info it that doesn't match anything
    return ENV_LOG_LEVEL_MAP[fhEnv] || 'info';
  }
}
