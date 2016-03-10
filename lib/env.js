'use strict';

/**
 * Wrapper for getting env variables from process.env
 * @param  {String} key
 * @param  {String} defaultVal
 * @return {String}
 */
exports.get = function (key, defaultVal) {
  return process.env[key] || defaultVal;
};
