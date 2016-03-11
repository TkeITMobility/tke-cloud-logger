'use strict';

var bunyan = require('bunyan')
  , util = require('./util.js');

// Load our cron jobs
require('./cron').load(function (err) {
  if (err) {
    throw err;
  }
});

/**
 * Returns a logger instance with the given name
 * @param  {String|Object} Either the logger name, or an options object with a name property
 * @return {Object}
 */
exports.getLogger = function (opts) {
  if (typeof opts === 'string') {
    opts = {
      name: opts
    };
  }
  return bunyan.createLogger({
    name: util.generateName(opts.name),
    level: util.getLogLevel(),
    src: util.isDev(),
    streams: util.getDefaultStreams()
  });
};
