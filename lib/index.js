'use strict';

const bunyan = require('bunyan');
const BunyanFormat = require('bunyan-format');

const fhEnv = process.env.FH_ENV;
const isLocal = !!process.env.FH_USE_LOCAL_DB;

const ENV_LOG_LEVEL_MAP = {
  'LOCAL': 'trace',
  'tke-dev': 'trace',
  'tke-test': 'debug',
  'tke-preprod': 'info',
  'tke-prod': 'info'
};

exports.buildLogger = function buildLogger(filename) {
  return bunyan.createLogger({
    name: getCallerFilename(filename),
    stream: new BunyanFormat({
      // Use this formatter to output plain text instead of json
      outputMode: 'long',
      color: isLocal // No colors supported in rhmap
    }),
    level: getLogLevel()
  });
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
