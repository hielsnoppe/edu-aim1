'use strict';

/**
 * Module dependencies.
 */

var
  mongoose = require('mongoose'),
  path = require('path')
  ;

var
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Pipeline = require(path.resolve('./modules/common/server/pipeline.server'))
  ;

var wrappers = {
  'cinema': require('../wrappers/cinema.server.wrapper'),
  'restaurant': require('../wrappers/restaurant.server.wrapper'),
  'transport': require('../wrappers/transport.server.wrapper')
};

exports.specifications = function (req, res) {

  res.json({
    foo: 'bar'
  });
};

exports.find = function (req, res) {

  var type = req.params.type;

  var activityDescription = {
    "_type": "RestaurantActivity",
    "weight": 5,
    "properties": {
      "cuisine": {
        "weight": 5,
        "values": {
          "Italian": 5
        }
      },
      "aggregateRating": {
        "weight": 5,
        "minimumValue": 3
      }
    }
  };

  activityDescription = {
    "_type": "CinemaActivity",
    "weight": 5,
    "properties": {
      "startTime": {
        "weight": 5,
        "minimumValue": new Date()
      }
    }
  };

  var activities;

  if (!wrappers.hasOwnProperty(type)) {

    return res.status(400).json('No such wrapper');
  }

  wrappers[type].find(activityDescription)
  .then(function (result) {

    res.json(result);
  });
};

/**
 * Update cinema activities
 */

exports.cinema = function (req, res) {

  var cinemaWrapper = wrappers.cinema;

  var pipeline = new Pipeline()
    .pipe(cinemaWrapper.fetch)
    .pipe(cinemaWrapper.extract)
    //.pipe(cinemaWrapper.enrich)
    .pipe(cinemaWrapper.clean)
    .pipe(cinemaWrapper.filter)
    .pipe(cinemaWrapper.save);

  var results = pipeline.start('Berlin');

  results.then(function (result) {
    res.json(result);
  });
};

/**
 * Update restaurant
 */

exports.restaurant = function (req, res) {

  var restaurantWrapper = wrappers.restaurant;

  var pipeline = new Pipeline()
    .pipe(restaurantWrapper.fetch)
    .pipe(restaurantWrapper.extract)
    .pipe(restaurantWrapper.clean)
    .pipe(restaurantWrapper.filter)
    .pipe(restaurantWrapper.save);

  var results = pipeline.start('Berlin', 'Italian', 5);

  results.then(function (result) {
    res.json(result);
  });
};

/**
 * Test transportation
 */

exports.transport = function (req, res) {

  var src = req.params.src;
  var dest = req.params.dest;

  var transportWrapper = wrappers.transport;

  var result = transportWrapper.fetch(src, dest);

  res.json(result);
};
