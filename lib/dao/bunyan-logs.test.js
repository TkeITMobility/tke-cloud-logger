'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod = require('./bunyan-logs.js');

  beforeEach(function (done) {
    mod.purge(done);
  });

  describe('#writeLog', function () {
    // TODO: use tingodb or similar for mocking out mongo
    it('should write a log to mongodb', function (done) {
      mod.writeLog({
        name: 'logger',
        msg: 'test'
      }, function (err) {
        expect(err).to.not.exist;

        mod.getLogsAsArray(function (err, logs) {
          expect(err).to.not.exist;
          expect(logs).to.be.an('Array');
          expect(logs).to.have.length(1);

          done();
        });
      });
    });
  });

  describe('#getLogsAsArray', function () {
    it('should return 0 logs', function (done) {
      mod.getLogsAsArray(10, function (err, logs) {
        expect(err).to.not.exist;
        expect(logs).to.be.an('Array');
        expect(logs).to.have.length(0);

        done();
      });
    });
  });

  describe('#cleanUpLogs', function () {
    it('should return 0 logs', function (done) {
      mod.cleanUpLogs(done);
    });
  });

});
