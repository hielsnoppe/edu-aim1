'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();
require('request');

var request = require('request');
request('https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073&key=AIzaSyBCroIiU9zWXaFxW0SE62fcSGxdQsP0XiY', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})
;
