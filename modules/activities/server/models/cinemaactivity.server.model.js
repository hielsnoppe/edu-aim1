'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  extend = require('mongoose-schema-extend'),
  Schema = mongoose.Schema;

var ActivitySchema = require('./activity.server.model.js').schema;

/**
 * Movie Schema
 */
var CinemaActivitySchema = ActivitySchema.extend({
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

mongoose.model('CinemaActivity', CinemaActivitySchema);
