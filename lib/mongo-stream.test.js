'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe(__filename, function () {

  var mod
    , dao
    , _writeStub
    , getLogsStub;

  beforeEach(function () {
    _writeStub = sinon.stub();
    getLogsStub = sinon.stub();

    mod = proxyquire('./mongo-stream.js', {
      './dao/bunyan-logs': {
        writeLog: _writeStub,
        getLogsAsArray: getLogsStub
      }
    });
  });

  describe('#_write', function () {
    it('should write a log to mongodb', function () {
      _writeStub.callsArgWith(1, null, null);

      var data = JSON.stringify({
        name: 'logger',
        msg: 'test'
      });

      mod._write(data, null, function (err) {
        expect(err).to.not.exist;
        expect(_writeStub.called).to.be.true;
        expect(_writeStub.getCall(0).args[0]).to.deep.equal(JSON.parse(data));
      });
    });

    it('should handle a JSON.parse error safely', function () {
      mod._write('{ not real json', null, function (err) {
        expect(err).to.be.an('Error');
        expect(err.toString()).to.contain('Unexpected token');
        expect(_writeStub.called).to.be.false;
      });
    });

    it('should handle a db write error', function () {
      _writeStub.callsArgWith(1, new Error('fake mongodb error'), null);

      mod._write(JSON.stringify({
        name: 'logger',
        msg: 'test'
      }), null, function (err) {
        expect(err).to.be.an('Error');
        expect(err.toString()).to.contain('fake mongodb error');
        expect(_writeStub.called).to.be.true;
      });
    });
  });

});
