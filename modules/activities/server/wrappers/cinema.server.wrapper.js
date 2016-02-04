'use strict';

/**
 * Module dependencies.
 */

var
  cheerio = require('cheerio'),
  mongoose = require('mongoose'),
  moviedb = require('moviedb'),
  path = require('path'),
  request = require('request')
  ;

var
  CinemaActivity = mongoose.model('CinemaActivity'),
  keys = require('../../../../config/keys.js'),
  util = require('../../../common/server/util.server.js')
  ;

var pipeline = {};

/**
 * Retrieve movie showtimes by scraping Google
 * This will likely get us blacklisted
 */

pipeline.fetch = function (near, next) {

  function responseHandler (error, response, html) {

    if (!error && response.statusCode === 200) {

      next(html);
    }
  }

  near = near || 'Berlin';
  var baseurl = 'http://www.google.de/movies';

  var params = {
    near: near,
    start: 0
  };

  for (var i = 0; i <= 70; i += 10) {

    params.start = i;

    request(util.makeurl(baseurl, params), responseHandler);
  }

  return true;
};

pipeline.extract = function (item, next) {

  var $ = cheerio.load(item);

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
        times: [],
        theater: theater
      };

      showing.title = $(this).text();

      var infos = $(this).next() ;

      showing.infos = infos.text();

      //var times = $(infos).next() ;
      //
      //showing.times = times.text();

      $(infos).next().find('> span').each(function (i, elem) {

        showing.times.push($(this).text());
      });

      next(showing);
    });
  });
};

pipeline.enrich = function (item, next) {

  var mdb = moviedb(keys.moviedb);

  mdb.searchMovie({ query: item.title }, function(error, response) {

    item.movie = response;

    // Save to DB
    next(item);
  });
};

pipeline.clean = function (item, next) {

  console.log(item);
  next(item);
};

pipeline.save = function (item, next) {

  var movie = new CinemaActivity(item);

  movie.save(function (err) {

    if (err) {

      console.log(err);
    } else {

      next(item);
    }
  });
};

module.exports = pipeline;
