'use strict';

/**
 * Module dependencies.
 */
 

var app = require('./config/lib/app');
var server = app.start();
require('request');
var org='alexanderplatz';
var dest='Leopoldplatz';
var place=',+NY';
var postcode=',+NJ+07073';
var request = require('request');
var obj=request('https://maps.googleapis.com/maps/api/directions/json?origin='+org+'&destination='+dest+'&mode=transit&key=AIzaSyBCroIiU9zWXaFxW0SE62fcSGxdQsP0XiY', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage.
	
	
  }
});

