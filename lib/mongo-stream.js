'use strict';

var WritableStream = require('stream').Writable
  , util = require('util')
  , dao = require('./dao/bunyan-logs'),
  flag = false,
  TIME_TO_UNLOCK = 60000;

function MongoStream() {
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
        if (isMongoConnectionError(err) && !flag) {                    //if the error is caused by the unavailability of mongodb
          console.error('fh-bunyan failed to write log to mongodb', err);
          flag = true;
          setTimeout(function () {
            flag = false;
          }, TIME_TO_UNLOCK);
        }
        else {
          console.error('fh-bunyan failed to write log to mongodb', err);
          console.error((err && err.stack) ? err.stack : 'no stack available');
          flag = true;
        }
      }

      done();
    });
  } catch (e) {
    done(e);
  }
};

function isMongoConnectionError(err) {
  if (err.hasOwnProperty('jse_cause')) {
    if (err.jse_cause.jse_shortmsg == 'failed to connect to mongodb') {
      return true
    }
  }
  else {
    return false;
  }
}

module.exports = new MongoStream();
