'use strict';

var log = require('../lib/logger.js');

var logger = log.getLogger(__filename);

var obj = {foo: true};
var err = new Error('test error');
logger.trace('trace', obj);
logger.debug('debug', obj);
logger.info('info', obj);
logger.warn('warn', obj);
logger.error(err, 'error', obj);
logger.fatal(err, 'fatal', obj);
