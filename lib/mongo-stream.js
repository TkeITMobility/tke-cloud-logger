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
    var data = JSON.parse(chunk);

    // Store a Date Object, should make for easier queries etc.
    data.time = new Date(data.time);

    dao.writeLog(data, function (err) {
      if (err) {
        console.error('fh-bunyan failed to write log to mongo', err);
        console.log((err && err.stack) ? err.stack : '');
      }

      done();
    });
  } catch (e) {
    done(e);
  }
};

module.exports = new MongoStream();
