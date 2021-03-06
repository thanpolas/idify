/*jshint camelcase:false */
/**
 * @fileOverview The redis connection manager.
 */
var EventEmitter = require('events').EventEmitter;

var cip = require('cip');
var Promise = require('bluebird');
var redis = require('redis');
var __ = require('lodash');

var CeventEmitter = cip.cast(EventEmitter);

/**
 * The base Model Class redis models extend from.
 *
 * @event `error` When an error surfaces up from redis.
 *
 * @param {Object=} optOpts A dict with the following options:
 *   @param {string=} uri The URI with the required credentials.
 *   @param {string=} port The port.
 *   @param {string=} host The hostname.
 *   @param {string=} pass The password.
 *   @param {Object=} redisOptions Any redis options.
 *
 * @extents {events.EventEmitter}
 * @constructor
 */
var Redis = module.exports = CeventEmitter.extend(function(optOpts) {
  var opts = optOpts || {};

  /** @type {?redis.Client} The redis client */
  this.client = null;

  this.opts = {
    uri: opts.uri,
    port: opts.port || 6379,
    host: opts.host || 'localhost',
    pass: opts.pass,
    redisOptions: opts.redisOptions,
  };

});

/**
 * Initializes a redis client and provides it.
 *
 * @return {redis.RedisClient} A redis client.
 */
Redis.prototype.getClient = function() {
  if (this.client) {
    return this.client;
  }

  var uri = this.opts.uri;
  var port = this.opts.port;
  var host = this.opts.host;
  var pass = this.opts.pass;
  var redisOptions = this.opts.redisOptions || {};

  if (uri) {
    try {
      redisOptions.url = uri;
      this.client = redis.createClient(redisOptions);
    } catch(ex) {
      return null;
    }
  } else {
    try {
      redisOptions.port = port;
      redisOptions.host = host;
      this.client = redis.createClient(redisOptions);
    } catch(ex) {
      return null;
    }

    if ( __.isString( pass ) ) {
      this.client.auth( pass );
    }
  }

  this.client.on('error', this._onRedisError.bind(this));

  return this.client;
};

/**
 * Logs the error and emits it.
 *
 * @param  {string} err the error message
 */
Redis.prototype._onRedisError = function(err) {
  this.emit(err);
};

/**
 * Perform a connection to redis
 *
 * @return {Promise(redis.RedisClient)} A promise offering a redis client.
 */
Redis.prototype.connect = function() {
  if (this.client) {
    return Promise.resolve(this.client);
  }
  var self = this;
  return new Promise(function(resolve, reject) {

    var client = self.getClient();

    function onConnect() {}

    function onReady() {
      // check for proper redis version
      var vers = client.server_info.versions;
      var verError = 'Kansas will only work with Redis Server v2.8.0 or later';
      if (vers[0] < 2 && vers[1] < 8) {
        return reject(verError);
      }
      client.removeListener('error', onError);
      resolve(client);
    }
    function onError(err) {
      client.removeListener('connect', onConnect);
      reject(err);
    }

    client.once('connect', onConnect);
    client.once('ready', onReady);
    client.once('error', onError);
  });
};
