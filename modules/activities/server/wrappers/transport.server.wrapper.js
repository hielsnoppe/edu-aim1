'use strict';

/**
 * Module dependencies.
 */
/*var path = require('path'),
  request = require('request'),
  util = require('../../../common/server/util.server.js');

var apiKey = require('../../../../config/keys.js').transport;

function wrapper () {}

wrapper.extractItems = function (body) {

  var json = JSON.parse(body);

  var direction_string = [];

  if (json.status === 'NOT_FOUND') {

    return {
      error: true,
      message: 'Not found'
    };
  }

  console.log(json); /*

  /*



//not remove
/**};
wrapper.responseHandler = function (error, response, body) {

  if (!error && response.statusCode === 200) {

    wrapper.extractItems(body);
  }
};

/**
 */

/**wrapper.fetch = function (origin, destination) {

  var baseurl = 'https://maps.googleapis.com/maps/api/directions/json';
  var params = {
    origin: origin,
    destination: destination,
    mode: 'transit',
    key: apiKey
  };

  request.get(util.makeurl(baseurl, params), this.responseHandler);

  return true;
};

module.exports = wrapper; */ 
