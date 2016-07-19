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
        msg: 'test',
        time: new Date().toJSON()
      });

      mod._write(data, null, function (err) {
        expect(err).to.not.exist;
        expect(_writeStub.called).to.be.true;
        expect(_writeStub.getCall(0).args[0]).to.have.property('name');
        expect(_writeStub.getCall(0).args[0]).to.have.property('time');
        expect(_writeStub.getCall(0).args[0]).to.have.property('msg');
        expect(_writeStub.getCall(0).args[0].name).to.equal('logger');
        expect(_writeStub.getCall(0).args[0].msg).to.equal('test');
        expect(_writeStub.getCall(0).args[0].time).to.be.a('Date');
      });
    });

    it('should handle a JSON.parse error safely', function () {
      mod._write('{ not real json', null, function (err) {
        expect(err).to.be.an('Error');
        expect(err.toString()).to.contain('Unexpected token');
        expect(_writeStub.called).to.be.false;
      });
    });

    it('should handle a db write error when mongo is unavailable', function () {
      var fakeMongoError = {
        jse_shortmsg: 'failed to get collection',
        jse_cause: {
          jse_shortmsg: 'failed to connect to mongodb'
        }
      }

      _writeStub.callsArgWith(1, fakeMongoError, null);

      mod._write(JSON.stringify({
        name: 'logger',
        msg: 'test'
      }), null, function (err) {
        expect(err).to.not.exist;
        expect(_writeStub.called).to.be.true;
      });
    });

    it('should handle a db write error', function () {
      _writeStub.callsArgWith(1, new Error('fake mongodb error'), null);

      mod._write(JSON.stringify({
        name: 'logger',
        msg: 'test'
      }), null, function (err) {
        expect(err).to.not.exist;
        expect(_writeStub.called).to.be.true;
      });
    });
  });

});
