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
var middlewarify = require('middlewarify');

function noop() {}

/**
 * The Idify Constructor.
 *
 * @constructor
 */
var Idify = module.exports = cip.extend(function() {});
