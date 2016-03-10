'use strict';

var map = require('lodash.map')
  , env = require('./env.js');

// Default FeedHenry environments we need mappings for
var FH_ENV_MAP = {
  DEV: 'tke-dev',
  TEST: 'tke-test',
  PREPROD: 'tke-preprod',
  PROD: 'tke-prod',
};


// Default mappings we use to determine the log level to use
var ENV_LOG_LEVEL_MAP = {
  'tke-dev': 'trace',
  'tke-test': 'debug',
  'tke-preprod': 'info',
  'tke-prod': 'info',
};


/**
 * Indicates if the application is currently running in the 'tke-dev' env
 * @return {Boolean}
 */
exports.isDev = function () {
  return (env.get('FH_ENV') === FH_ENV_MAP.DEV);
};


/**
 * Generate a logger name that does not incldue uneccessary absolute path data
 * @param  {String} n
 * @return {String}
 */
exports.generateName = function (n) {
  return n.replace(process.cwd(), '');
};


/**
 * Get the appropriate log level for the current FH_ENV
 * @return {String}
 */
exports.getLogLevel = function () {
  if (env.get('FH_USE_LOCAL_DB') || !env.get('FH_ENV')) {
    // We use trace during local development
    return 'trace';
  } else {
    // Otherwise we go with the FH_ENV mapping or info it that breaks
    return ENV_LOG_LEVEL_MAP[env.get('FH_ENV')] || 'info';
  }
};


/**
 * Generate stream Array of stream Objects for the given log levels
 * @param  {Array}  lvls
 * @param  {Object} stream
 * @return {Array}
 */
exports.generateStreamArrayForLevels = function (lvls, stream) {
  return map(lvls, function (l) {
    return {
      stream: stream,
      level: l
    };
  });
};


/**
 * Returns the default set of streams each logger should use
 * @return {Array}
 */
exports.getDefaultStreams = function () {
  return []
    .concat(
      exports.generateStreamArrayForLevels(
        ['info', 'debug', 'trace'],
        process.stdout
      )
    )
    .concat(
      exports.generateStreamArrayForLevels(
        ['fatal', 'error', 'warn'],
        process.stderr
      )
    )
    .concat(
      exports.generateStreamArrayForLevels(
        ['fatal', 'error', 'warn'],
        require('./mongo-stream')
      )
    );
};
