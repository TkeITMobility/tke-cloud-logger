'use strict';

var VError = require('verror');

exports.tickComplete = function (err) {
  if (err) {
    var e = new VError(
      'Error running job %s: %s',
      this.meta.name,
      err
    );
    console.error(e.toString());
    console.error(e.stack);
  }
};
