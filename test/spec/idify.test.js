/**
 * @fileOverview Main test
 */
var Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;

var idify = require('../..');

describe('Idify Main', function() {
  var testIdify;
  beforeEach(function(done) {
    testIdify = idify({
      prefix: 'test',
      name: 'test',
    });
    testIdify.connect().then(done.bind(null, null), done);
  });

  it('Will create a unique id', function(done) {
    testIdify.get().then(function(id) {
      expect(id).to.be.a('string');
      expect(id).to.have.length(5);
    }).then(done, done);
  });
});

describe('Connection', function() {
  var testIdify;
  it('Will establish connection successfully using a URI', function(done) {
    testIdify = idify({
      prefix: 'test',
      name: 'test',
      redis: {
        uri: 'redis://localhost:6379',
      },
    });
    testIdify.connect().then(done.bind(null, null), done);
  });
});
