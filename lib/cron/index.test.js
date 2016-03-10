'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon')
  , EventEmitter = require('events').EventEmitter;

describe(__filename, function () {

  var mod
    , loadStub;

  beforeEach(function () {
    loadStub = sinon.stub();

    mod = proxyquire('./index.js', {
      'cron-master': {
        loadJobs: loadStub
      }
    });
  });

  describe('#load', function () {
    it('should load jobs', function () {
      var jobs = [new EventEmitter()];
      
      loadStub.callsArgWith(1, null, jobs);

      mod.load(function (err, jerbs) {
        expect(err).to.not.exist;
        expect(jerbs).to.deep.equal(jobs);
      });
    });

    it('should handle an error', function () {
      loadStub.callsArgWith(1, new Error('oh noes!'), null);

      mod.load(function (err, jerbs) {
        expect(jerbs).to.not.exist;
        expect(err).to.exit;
        expect(err.toString()).to.contain('failed to load cron-master jobs from');
        expect(err.toString()).to.contain('oh noes');
      });
    });
  });

});
