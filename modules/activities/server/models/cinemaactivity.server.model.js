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
  theater: {
    name: {
      type: String,
      default: '',
      //required: 'Name cannot be blank',
      trim: true
    },
    address: {
      type: String,
      default: '',
      trim: true
    },
    geo_location: {
          latitude: {
            type: String,
            default: '',
            trim: true
          },
          longitude: {
            type: String,
            default: '',
            trim: true
          }
    }
  },
  movie: {
    title: {
      type: String,
      default: '',
      //required: 'Title cannot be blank',
      trim: true
    },
    aggregateRating: {
      type: Number,
      default: 0.0
      //required: 'Must have a rating'
    },
    releaseDate: {
      type: Date,
      default: Date.now,
      trim: true
    },
    rating: {
      type: String,
      default: '',
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
