'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe(__filename, function () {

  var mod
    , envGetStub;

  beforeEach(function () {
    envGetStub = sinon.stub();

    delete require.cache[require.resolve('./util.js')];
    mod = proxyquire('./util.js', {
      './env.js': {
        get: envGetStub
      }
    });
  });

  describe('#isDev', function () {
    it('should return true', function () {
      envGetStub.returns('tke-dev');

      expect(mod.isDev()).to.be.true;
    });

    it('should return false', function () {
      envGetStub.returns('tke-prod');

      expect(mod.isDev()).to.be.false;
    });
  });

  describe('#generateName', function () {
    it('should return a trimmed name', function () {
      expect('/lib/util.test.js').to.equal(mod.generateName(__filename));
    });
  });

  describe('#getLogLevel', function () {
    it('should return "info"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('tke-prod');
      expect(mod.getLogLevel()).to.equal('info');
    });

    it('should return "trace"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('tke-dev');
      expect(mod.getLogLevel()).to.equal('trace');
    });

    it('should return "debug"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('tke-test');
      expect(mod.getLogLevel()).to.equal('debug');
    });

    it('should return "info"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('tke-preprod');
      expect(mod.getLogLevel()).to.equal('info');
    });

    it('should return "info" by default', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('not-valid-value');
      expect(mod.getLogLevel()).to.equal('info');
    });
  });

  describe('#generateStreamArrayForLevels', function () {
    it(
      'should return array of objects containing "stream" and "level"',
      function () {
        var obj = {};
        var streams = mod.generateStreamArrayForLevels(['info', 'debug'], obj);

        streams.forEach(function (s) {
          expect(s).to.have.property('stream');
          expect(s).to.have.property('level');
        });
      }
    );
  });

  describe('#getDefaultStreams', function () {
    it('should return an array of 3 streams', function () {
      expect(mod.getDefaultStreams()).to.have.length(3);
    });
  });


});
