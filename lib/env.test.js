'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod = null;

  beforeEach(function () {
    delete require.cache[require.resolve('./env.js')];
    mod = require('./env.js');
  });

  describe('#get', function () {
    it('should get the value from process.env', function () {
        expect(mod.get('NODE_PATH')).to.equal('test');
    });

    it('should return the default value passed', function () {
      expect(mod.get('NODE_NOT_A_VAL', 'abc')).to.equal('abc');
    });
  });

});
