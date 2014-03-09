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
    name: this.generateRandomString(4),
    idLength: 5,
    maxLoops: 100,
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

  /** @type {?Function} Promisified redis.SADD */
  this.sadd = null;

  /** @type {string} Cache the key to use for redis SET store */
  this.key = null;
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

  // promisify redis commands
  this.sadd = Promise.promisify(this.client.sadd, this.client);

};

/**
 * Get a unique id Guarantee
 *
 * @return {Promise(string)} A promise with the unique id.
 */
Idify.prototype.get = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!self.connected) {
      throw new Error('Not connected to Redis');
    }

    var loops = 0;
    var id = self.generateRandomString(self._options.idLength);
    var key = self.getKey();
    self.recurse(key, id, resolve, reject, loops);
  });
};

Idify.prototype.recurse = function(key, id, resolve, reject, loops) {
  var self;
  if (++loops > this._options.maxLoops) {
    return reject('Maximum loops exceeded');
  }
  this.sadd(key, id).then(function(res) {
    if (res === 1) {
      resolve(id);
    } else {
      self.recurse(key, id, resolve, reject, loops);
    }
  });
};

/**
 * Generate a random string.
 *
 * @param  {number=} optLength How long the string should be, default 32.
 * @return {string} a random string.
 */
Idify.prototype.generateRandomString = function(optLength) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

  var length = optLength || 32;
  var string = '';
  var randomNumber = 0;
  for (var i = 0; i < length; i++) {
    randomNumber = Math.floor(Math.random() * chars.length);
    string += chars.substring(randomNumber, randomNumber + 1);
  }

  return string;
};

/**
 * Get the redis SET key to store to.
 *
 * @return {string} the key.
 */
Idify.prototype.getKey = function() {
  if (this.key) {
    return this.key;
  }
  if (typeof this._options.prefix === 'string' && this._options.prefix.length) {
    this.key = this._options.prefix + ':';
  }
  this.key += 'idify:' + this._options.name;

  return this.key;
};
