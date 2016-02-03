'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var ScheduleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  }
});

ScheduleSchema.methods.rank = function rankActivity (cb) {

  return;
  //return this.model('Activity').find({ type: this.type }, cb);
};

ScheduleSchema.statics.example = function example (name, cb) {

  return;
  //return this.where('name', new RegExp(name, 'i')).exec(cb);
};

mongoose.model('Schedule', ScheduleSchema);
