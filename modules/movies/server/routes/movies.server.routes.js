'use strict';

/**
 * Module dependencies.
 */
var movieShowings = require('../controllers/movies.server.controller');

module.exports = function (app) {
  // movieShowings routes
  app.route('/api/movies')
    .get(movieShowings.findABetterName);
};
