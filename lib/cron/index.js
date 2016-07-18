'use strict';

var path = require('path')
  , VError = require('verror')
  , cmaster = require('cron-master')
  , handlers = require('./handlers.js');

exports.load = function (callback) {
  var jobsDir = path.join(__dirname, './jobs');

  cmaster.loadJobs(jobsDir, function (err, jobs) {
    if (err) {
      callback(
        new VError(err, 'failed to load cron-master jobs from: %s', jobsDir),
        null);
    } else {
      jobs.forEach(function (job) {
        // Using String for event name.
        // Log output when the job has complete.
        job.on('tick-complete', handlers.tickComplete.bind(job));
      });

      cmaster.startJobs(function(err) {
        if (err) {
          callback(
            new VError(err, 'failed to start cron-master jobs'),
            null);
        } else {
          callback(null, jobs);
        }
      });
    }
  });
};
