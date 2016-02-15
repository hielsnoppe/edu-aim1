'use strict';

/**
 * Module dependencies.
 */

var
  mongoose = require('mongoose'),
  Q = require('q'),
  request = require('request-promise'),
  _ = require('lodash')
  ;

var
  RestaurantActivity = mongoose.model('RestaurantActivity'),
  keys = require('../../../../config/keys.js'),
  util = require('../../../common/server/util.server.js')
  ;

/**
 */

function responseHandler (response) {

  if (response.statusCode === 200) {

    var item = {
      date: Date.now(),
      html: response.body
    };

    return item;
  }
}

exports.fetch = function (near, cuisine, radius) {

  console.log('fetch');

  near = near || 'Berlin';
  cuisine = cuisine || 'Italian';
  radius = radius || 5;

  var baseurl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  var params = {
    key: keys.places2,
    location: encodeURIComponent(near),
    radius: radius,
    sensor: false,
    types: 'restaurant',
    keyword: cuisine
  };

  var options = {
    uri: util.makeurl(baseurl, params),
    resolveWithFullResponse: true
  };

  return request(options).then(responseHandler);
};

exports.extract = function (item) {

  console.log('extract', item);

  // Exit if required properties are missing
  if (!item.body) return [];

  var results = [];
  var result = {
    date: item.date,
    restaurant: {
      name: '',
      address: '',
      aggregateRating: ''
    }
  };

  var places = JSON.parse(item.body);

  if (places.status === 'NOT_FOUND') return [];

  places.results.forEach(function (place) {

    result.restaurant.name = place.name;
    result.restaurant.address = place.vicinity;

    if (place.rating.trim()) {

      result.restaurant.aggregateRating = place.rating;
    }

    results.push(_.cloneDeep(result));
  });

  return results;
};

exports.clean = function (item) {

  console.log('clean');

  return item;
};

exports.filter = function (item) {

  console.log('filter');

  if (item === null) return [];

  return item;
};

exports.save = function (item) {

  var activity = new RestaurantActivity(item);
  var deferred = Q.defer();

  activity.save(function (error) {

    if (error) {

      //deferred.reject(new Error(error));
      deferred.resolve(error);
    }
    else {

      deferred.resolve(activity);
    }
  });

  return deferred.promise;
};
