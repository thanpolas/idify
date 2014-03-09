/*
 * Idify
 * Get any unique Id format guaranteed
 * https://github.com/thanpolas/idify
 *
 * Copyright (c) 2014 Thanasis Polychronakis
 * Licensed under the MIT license.
 */
var cip = require('cip');
var __ = require('lodash');
var Promise = require('bluebird');
// var middlewarify = require('middlewarify');

var Redis = require('./redis');


/**
 * The Idify Constructor.
 *
 * @param {Object=} optOptions Options to configure Kansas.
 * @constructor
 */
var Idify = module.exports = cip.extend(function(optOptions) {

  /** @type {boolean} Indicates active connection to db. */
  this.connected = false;

  /** @type {Object} A dict with options */
  this._options = {
    prefix: '',
    logging: true,
    logg: null,
    console: true,
    logLevel: 600,
    redis: {
      port: 6379,
      host: 'localhost',
      pass: null,
      redisOptions: null,
    },
  };

  // populate options
  this.setup(optOptions);

  /** @type {?idify.Redis} Instance of Redis connection manager */
  this.conn = null;

  /** @type {?redis.RedisClient} The redis client */
  this.client = null;
});

/**
 * Initiate database connections and boot models.
 *
 * @return {Promise} A promise.
 */
Idify.prototype.connect = Promise.method(function() {
  if (this.connected) {
    return;
  }

  if (this.client) {
    return this._onConnect(this.client);
  }

  this.conn = new Redis(this._options.redis);
  return this.conn.connect()
    .then(this._onConnect.bind(this))
    .catch(function(err) {
      console.error('connect() :: Failed to connect to Redis:', err);
      throw err;
    });
});

/**
 * Define default options and apply user defined ones.
 *
 * @param {Object=} optOptions Options to configure Idify.
 */
Idify.prototype.setup = function(optOptions) {
  var userOpts = {};
  if (__.isObject(optOptions)) {
    userOpts = optOptions;
  }

  this._options = __.defaults(userOpts, this._options);
};

/**
 * Trigger on connect and populate exported API.
 *
 * @param {redis.RedisClient} client The redis client.
 * @private
 */
Idify.prototype._onConnect = function(client) {
  this.connected = true;
  this.client = client;
};
