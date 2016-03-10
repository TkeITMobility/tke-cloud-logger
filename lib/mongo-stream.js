'use strict';

var WritableStream = require('stream').Writable
  , util = require('util')
  , dao = require('./dao/bunyan-logs');

function MongoStream () {
  WritableStream.call(this);
}
util.inherits(MongoStream, WritableStream);


/**
 * Bunyan will call this to write to our MongoDB collection
 * @param  {String}   chunk
 * @param  {String}   encoding
 * @param  {Function} done
 */
MongoStream.prototype._write = function (chunk, encoding, done) {
  try {
    dao.writeLog(JSON.parse(chunk), done);
  } catch (e) {
    done(e);
  }
};

module.exports = new MongoStream();
