'use strict';

var CronMasterJob = require('cron-master').CronMasterJob;
var env = require('../../env.js');

var cleanup = (function() {
  // Only cleanup the logs if we have a database
  if (env.get('FH_MONGODB_CONN_URL')) {
    return require('../../dao/bunyan-logs').cleanUpLogs;

  } else {
    // No database, so nothing to do for cleaning
    return function(job, callback) {
      callback(null);
    };
  }
})();

module.exports = new CronMasterJob({
  // Some meta data to assist the job/logging
  meta: {
    name: 'clean-logs'
  },
  // The usual params that you pass to the "cron" module go here
  cronParams: {
    cronTime: '*/10 * * * *',
    onTick: cleanup
  }
});
