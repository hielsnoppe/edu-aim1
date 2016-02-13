'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActivitySchema = require('./activity.server.model.js').schema;

/**
 * Restaurant Schema
 */
var RestaurantActivitySchema = ActivitySchema.extend({
  restaurant: {
    name: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
    address: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
    location: {
      latitude: {},
    }
  }
});

mongoose.model('RestaurantActivity', RestaurantActivitySchema);
