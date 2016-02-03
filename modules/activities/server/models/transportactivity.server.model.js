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
var TransportActivitySchema = ActivitySchema.extend({
  details: {
    type: Schema.Types.Mixed
  }
});

mongoose.model('TransportActivity', TransportActivitySchema);
