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
  time: {
    type: Date,
    default: Date.now,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    trim: true
  },
  theater: {
    name: {
      type: String,
      default: '',
      trim: true,
      required: 'Name cannot be blank'
    },
    address: {
      type: String,
      default: '',
      trim: true
    }
  },
  movie: {
    title: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
    releaseDate: {
      type: Date,
      default: Date.now,
      trim: true
    },
    adult: {
      type: Boolean,
      default: false,
      trim: true
    },
    plot: {
      type: String,
      default: '',
      trim: true
    },
    runtime: {
      type: Number,
      default: 0,
      trim: true
    },
    genres: [ {
      name : {
        type: String,
        default: '',
        trim: true
      }
    }],
    countries: [ {
      name : {
        type: String,
        default: '',
        trim: true
      }
    }],
    director: {
      type: String,
      default: '',
      trim: true
    },
    cast: [ {
      name : {
        type: String,
        default: '',
        trim: true
      }
    }]
  }
});

mongoose.model('CinemaActivity', CinemaActivitySchema);
