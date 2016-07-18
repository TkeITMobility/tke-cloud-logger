'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon')
  , EventEmitter = require('events').EventEmitter;

describe(__filename, function () {

  var mod
    , loadStub
    , startStub;

  beforeEach(function () {
    loadStub = sinon.stub();
    startStub = sinon.stub();

    mod = proxyquire('./index.js', {
      'cron-master': {
        loadJobs: loadStub,
        startJobs: startStub
      }
    });
  });

  describe('#load', function () {
    it('should load jobs', function () {
      var jobs = [new EventEmitter()];

      loadStub.yields(null, jobs);
      startStub.yields(null);

      mod.load(function (err, jerbs) {
        expect(err).to.not.exist;
        expect(loadStub.callCount).to.eql(1);
        expect(startStub.callCount).to.eql(1);
        expect(jerbs).to.deep.equal(jobs);
      });
    });

    it('should handle an error in loading jobs', function () {
      loadStub.yields(new Error('oh noes!'), null);

      mod.load(function (err, jerbs) {
        expect(jerbs).to.not.exist;
        expect(err).to.exit;
        expect(err.message).to.contain('failed to load cron-master jobs from');
        expect(err.message).to.contain('oh noes');
        expect(startStub.callCount).to.eql(0);
      });
    });

    it('should handle an error in starting jobs', function () {
      loadStub.yields(null, []);
      startStub.yields(new Error('oh noes!'), null);

      mod.load(function (err, jerbs) {
        expect(jerbs).to.not.exist;
        expect(err).to.exit;
        expect(err.message).to.contain('failed to start cron-master jobs');
        expect(err.message).to.contain('oh noes');
        expect(loadStub.callCount).to.eql(1);
        expect(startStub.callCount).to.eql(1);
      });
    });
  });

});
