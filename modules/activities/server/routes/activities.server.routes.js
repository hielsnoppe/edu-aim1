'use strict';

/**
 * Module dependencies.
 */
var activitiesPolicy = require('../policies/activities.server.policy'),
  activities = require('../controllers/activities.server.controller');

module.exports = function (app) {
  // Activities collection routes
  app.route('/api/activities').all(activitiesPolicy.isAllowed)
    .get(activities.list)
    .post(activities.create);

  app.route('/api/activities/update')
    .get(activities.update);

  app.route('/api/activities/transport/:src/:dest')
    .get(activities.transport);

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
