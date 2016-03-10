'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod = null;

  beforeEach(function () {
    delete require.cache[require.resolve('./logger.js')];
    mod = require('./logger.js');
  });

  describe('#getLogger', function () {
    it('should return a logger instance', function (done) {
      var l = mod.getLogger({
        name: 'test'
      });

      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      done();
    });
  });

});
