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
 * Retrieve movie showtimes by scraping Google
 * This will likely get us blacklisted
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

  var results = [];

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
    uri: '',
    resolveWithFullResponse: true
  };

  options.uri = util.makeurl(baseurl, params);

  results.push(request(options).then(responseHandler));

  return results;
};

exports.extract = function (items) {

  console.log('extract', items.length);

  return items.map(function (item) {

    // Exit if required properties are missing
    if (!item.body) return null;

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

    if (places.status === "NOT_FOUND") return null;

    places.results.forEach(function (place) {

      result.restaurant.name = place.name;
      result.restaurant.address = place.vicinity;

      if (place.rating.trim()) {

        result.restaurant.aggregateRating = place.rating;
      }

      results.push(_.cloneDeep(result));
    });

    return results;
  }).reduce(function(a, b) {

    return a.concat(b);
  }, []);
};

exports.clean = function (items) {

  console.log('clean', items.length);

  return items.map(function (item) {

    return item;
  });
};

exports.filter = function (items) {

  console.log('filter', items.length);

  return items.filter(function (item, index, array) {

    return (item !== null);
  });
};

exports.save = function (items) {

  return items.map(function (item) {

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
  });
};
