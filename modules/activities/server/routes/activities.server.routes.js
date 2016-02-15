'use strict';

/**
 * Module dependencies.
 */
var activitiesPolicy = require('../policies/activities.server.policy'),
  activities = require('../controllers/activities.server.controller'),
  schedules = require('../controllers/schedules.server.controller');

module.exports = function (app) {

  // Activities collection routes
  app.route('/api/activities/:type')
    .get(activities.find);

  app.route('/api/fetch/cinemas')
    .get(activities.cinema);

  app.route('/api/fetch/restaurants')
    .get(activities.restaurant);

  app.route('/api/activities/transport/:src/:dest')
    .get(activities.transport);

  app.route('/api/descriptions')
    .get(activities.specifications);

  app.route('/api/schedules')
    .get(schedules.calculate);

  /*
  // Single movie routes
  app.route('/api/activities/:movieId').all(activitiesPolicy.isAllowed)
    .get(activities.read)
    .put(activities.update)
    .delete(activities.delete);

  // Finish by binding the movie middleware
  app.param('activityId', activities.movieByID);
  */
};
