'use strict';

/**
 * @see http://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
 * @see http://stackoverflow.com/questions/28749471/mongoose-schema-for-geojson-coordinates
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  startLocation: {
    coordinates: { type: [Number], index: '2dsphere' }
  },
  endLocation: {
    coordinates: { type: [Number], index: '2dsphere' }
  }
});

ActivitySchema.methods.rank = function rankActivity (cb) {

  return;
  //return this.model('Activity').find({ type: this.type }, cb);
};

ActivitySchema.statics.example = function example (name, cb) {

  return;
  //return this.where('name', new RegExp(name, 'i')).exec(cb);
};

mongoose.model('Activity', ActivitySchema);

module.exports = {

  schema: ActivitySchema
};
