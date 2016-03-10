'use strict';

var log = require('../lib/logger.js');

var logger = log.getLogger({
  name: __filename
});

logger.trace('trace');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');
logger.fatal('fatal');
