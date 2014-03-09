/*
 * Idify
 * Get any unique Id format guaranteed
 * https://github.com/thanpolas/idify
 *
 * Copyright (c) 2014 Thanasis Polychronakis
 * Licensed under the MIT license.
 */
var Idify = require('./lib/idify');

/**
 * Main factory.
 * 
 * @param {Object=} opts Options
 * @return {Idify} A new instance.
 */
module.exports = function(opts) {
  return new Idify(opts);
};
