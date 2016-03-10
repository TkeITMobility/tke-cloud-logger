'use strict';

var db = require('mongo-utils').getDatabaseManager({
    mongoUrl: process.env.FH_MONGODB_CONN_URL || 'mongodb://127.0.0.1:27017/FH_LOCAL'
  });

[
  function writeLog (collection, log, callback) {
    collection.insert(log, callback);
  },

  function getLogsAsArray (collection, limit, callback) {
    if (typeof limit === 'function') {
      callback = limit;
      limit = 127;
    }

    collection.find({}).limit(limit).toArray(callback);
  },

  function purge (collection, callback) {
    collection.remove({}, callback);
  }
].forEach(function (fn) {
  // Wrap each funciton to auto inject the "collection" parameter
  exports[fn.name] = db.composeInteraction(
    'bunyan-logs',
    fn
  );
});
