'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var RestaurantActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  infos: {
    type: String,
    default: '',
    trim: true
  },
  times: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('RestaurantActivity', RestaurantActivitySchema);
