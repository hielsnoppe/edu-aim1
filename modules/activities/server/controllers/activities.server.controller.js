'use strict';

/**
 * Module dependencies.
 */

var
  cheerio = require('cheerio'),
  mongoose = require('mongoose'),
  path = require('path'),
  Q = require('q'),
  request = require('request')
  ;

var
  CinemaActivity = mongoose.model('CinemaActivity'),
  cinemaWrapper = require('../wrappers/cinema.server.wrapper'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  transportWrapper = require('../wrappers/transport.server.wrapper')
  ;


/**
 * Create a movie
 */

exports.create = function (req, res) {
  var movie = new CinemaActivity(req.body);
  movie.user = req.user;

  movie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(movie);
    }
  });
};

/**
 * Show the current movie
 */

exports.read = function (req, res) {
  res.json(req.movie);
};

/**
 * Update a movie
 */

exports.update = function (req, res) {
  var movie = req.movie;

  movie.title = req.body.title;
  movie.content = req.body.content;

  movie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(movie);
    }
  });
};

/**
 * Delete an movie
 */

exports.delete = function (req, res) {
  var movie = req.movie;

  movie.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(movie);
    }
  });
};

/**
 * List of Movies
 */

exports.list = function (req, res) {
  CinemaActivity.find().sort('-created').populate('user', 'displayName').exec(function (err, movies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(movies);
    }
  });
};

/**
 * Movie middleware
 */
/*
exports.activityByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Movie is invalid'
    });
  }

  Activity.findById(id).populate('user', 'displayName').exec(function (err, movie) {
    if (err) {
      return next(err);
    } else if (!movie) {
      return res.status(404).send({
        message: 'No movie with that identifier has been found'
      });
    }
    req.movie = movie;
    next();
  });
};
*/

/**
 * Update activities
 */

exports.update = function (req, res) {

  cinemaWrapper.fetch('Berlin')
    .then(cinemaWrapper.extract)
    //.then(cinemaWrapper.enrich)
    .then(cinemaWrapper.clean)
    .then(cinemaWrapper.filter)
    .then(cinemaWrapper.save)
    .then(function (report) {

      console.log('done', report);

      res.json(report);
    })
    .done();
};

/**
 * Test transportation
 */

exports.transport = function (req, res) {

  var src = req.params.src;
  var dest = req.params.dest;

  var result = transportWrapper.fetch(src, dest);

  res.json(result);
};
