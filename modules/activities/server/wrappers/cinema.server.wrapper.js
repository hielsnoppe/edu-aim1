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

var apiKey = require('../../../../config/keys.js').moviedb;
var mdb = require('moviedb')(apiKey);

function wrapper () {}

/**
 * @param String html
 * @param callable next
 */

wrapper.extractItems = function (html, next) {

  var $ = cheerio.load(html);

  if ($('div.theater').length === 0) {

    return [];
  }

  $('div.theater').each(function(i, element) {

    var desc = $(this).children('.desc');

    var theater = {
      name: $(desc).children('.name').text(),
      address: $(desc).children('.info').text()
    };

    var showtimes = $(this).children('.showtimes');

    $(showtimes).find('.name').each(function (i, elem) {

      var showing = {
        title: '',
        infos: '',
        times: '',
        theater: theater
      };

      showing.title = $(this).text();

      var infos = $(this).next() ;

      showing.infos = infos.text();

      var times = $(infos).next() ;

      showing.times = times.text();

      next(showing);
    });
  });
};

/**
 *
 */

wrapper.itemHandler = function (item) {

  // TODO Some cleanup

  mdb.searchMovie({ query: item.title }, function(error, response) {

    item.movie = response;
  });

  // Save to DB

  var movie = new CinemaActivity(item);

  movie.save(function (err) {

    if (err) {

      console.log(err);
    } else {

      console.log('Saved new CinemaActivity');
    }
  });
};

/**
 *
 */

wrapper.responseHandler = function (error, response, html) {

  if (!error && response.statusCode === 200) {

    wrapper.extractItems(html, this.itemHandler);
  }
};

/**
 * Retrieve movie showtimes by scraping Google
 * This will likely get us blacklisted
 */

wrapper.fetch = function (near) {

  near = near | 'Berlin';
  var baseurl = 'http://www.google.de/movies';

  var params = {
    near: near,
    start: 0
  };

  for (var i = 0; i <= 70; i += 10) {

    params.start = i;

    request(util.makeurl(baseurl, params), this.responseHandler);
  }

  return true;
};

module.exports = wrapper;
