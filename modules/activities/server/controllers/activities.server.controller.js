'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MovieActivity = mongoose.model('MovieActivity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var movieWrapper = require('../wrappers/googlemovies.server.wrapper');

var request = require('request');
var cheerio = require('cheerio');

/**
 * Create a movie
 */
exports.create = function (req, res) {
  var movie = new MovieActivity(req.body);
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
  MovieActivity.find().sort('-created').populate('user', 'displayName').exec(function (err, movies) {
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

  var result = movieWrapper.fetch();
  
  res.json(result);
};
