'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  util = require('../../../common/server/util.server.js'),
  mongoose = require('mongoose'),
  CinemaActivity = mongoose.model('CinemaActivity');

var request = require('request');
var cheerio = require('cheerio');

function wrapper () {}

wrapper.extractItems = function (html) {

  var $ = cheerio.load(html);

  if ($('div.theater').length === 0) {

    return [];
  }

  var item = {
    theater: {},
    showings: []
  };

  $('div.theater').each(function(i, element) {

    var desc = $(this).children('.desc');

    item.theater.name = $(desc).children('.name').text();
    item.theater.address = $(desc).children('.info').text();

    var showtimes = $(this).children('.showtimes');

    $(showtimes).find('.name').each(function(i, elem) {

      var showing = {
        title: '',
        infos: '',
        times: ''
      };

      showing.title = $(this).text();

      var infos = $(this).next() ;

      showing.infos = infos.text();

      var times = $(infos).next() ;

      showing.times = times.text();

      console.log(showing);

      // Save to DB

      var movie = new CinemaActivity(showing);

      movie.save(function (err) {
        if (err) {

        } else {

        }
      });
    });
  });
};

/**
 */

wrapper.responseHandler = function (error, response, html) {

  if (!error && response.statusCode === 200) {

    wrapper.extractItems(html);
  }
};

/**
 * Retrieve movie showtimes by scraping Google
 * This will likely get us blacklisted
 */

wrapper.fetch = function () {

  var near = 'Berlin';
  var baseurl = 'http://www.google.de/movies';
  var params = {

    near: near,
    start: 0
  };

  for (var i = 0; i <= 70; i += 10) {

    params.start = i;

    request(util.makeurl(baseurl, params), this.responseHandler);
  }

  return 'Done';
};

module.exports = wrapper;
