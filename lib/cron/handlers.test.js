'use strict';

var handlers = require('./handlers');

describe(__filename, function () {

  describe('#tickComplete', function () {
    it('should handle no error', function () {
      handlers.tickComplete.bind(
        {
          meta: {
            name: 'job'
          }
        },
        null
      )();
    });

    it('should handle an error', function () {
      handlers.tickComplete.bind(
        {
          meta: {
            name: 'job'
          }
        },
        new Error('oops')
      )();
    });
  });

});
