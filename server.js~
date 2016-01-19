'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();
require('request');

var request = require('request');
request('https://bvg-api.herokuapp.com/station?input=alexanderplatz', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
});
