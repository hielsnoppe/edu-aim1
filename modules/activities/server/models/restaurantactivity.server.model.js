'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restaurant Schema
 */
var RestaurantActivitySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  }
});

mongoose.model('RestaurantActivity', RestaurantActivitySchema);
