'use strict';

/**
 * Module dependencies.
 */

var
  mongoose = require('mongoose'),
  path = require('path')
  ;

var
  activities = require('./activities.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Pipeline = require(path.resolve('./modules/common/server/pipeline.server'))
  ;

/**
 * Calculate schedule
 */

exports.calculate = function (req, res) {

  var scheduleDescription = require('../../../../config/assets/schema/ScheduleDescription.json');

  /*
  var pipeline = new Pipeline()
    .pipe(restaurantWrapper.fetch)
    .pipe(restaurantWrapper.extract)
    .pipe(restaurantWrapper.clean)
    .pipe(restaurantWrapper.filter)
    .pipe(restaurantWrapper.save);
  */

  var schedule = require('../../../../config/assets/schema/Schedule.json');
  var result = [ schedule, schedule, schedule ];

  res.json(result);
};
