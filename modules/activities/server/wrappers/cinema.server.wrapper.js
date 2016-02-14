'use strict';

/**
 * Module dependencies.
 */

var
  cheerio = require('cheerio'),
  mongoose = require('mongoose'),
  moviedb = require('moviedb'),
  path = require('path'),
  Q = require('q'),
  request = require('request-promise'),
  _ = require('lodash')
  ;

var
  CinemaActivity = mongoose.model('CinemaActivity'),
  keys = require('../../../../config/keys.js'),
  util = require('../../../common/server/util.server.js')
  ;

/**
 * Restrict results to only movies that are released
 * in year1 or year2. Won't work on showings of old
 * movies.
 */
var
  year1 = 2015,
  year2 = 2016;

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

exports.fetch = function (near) {

  near = near || 'Berlin';

  var results = [];

  var baseurl = 'http://www.google.de/movies';
  var params = {
    near: near,
    start: 0
  };

  var options = {
    uri: '',
    resolveWithFullResponse: true
  };

  for (var i = 0; i <= 70 - 69; i += 10) {

    params.start = i;
    options.uri = util.makeurl(baseurl, params);

    results.push(request(options).then(responseHandler));
  }

  return Q.all(results);
};

exports.extract = function (items) {

  console.log('extract', items.length);

  return items.map(function (item) {

    // Exit if required properties are missing
    if (!item.html || !item.date) return [];

    var $ = cheerio.load(item.html);

    // Exit if there is no information
    if ($('div.theater').length === 0) return [];

    var results = [];
    var result = {
      //infos: '',
      time: '',
      date: item.date,
      theater: {
        name: '',
        address: ''
      },
      movie: {
        title: ''
      }
    };

    $('div.theater').each(function(i, element) {

      var desc = $(this).children('.desc');

      result.theater.name = $(desc).children('.name').text();
      result.theater.address = $(desc).children('.info').text();

      var showtimes = $(this).children('.showtimes');

      $(showtimes).find('.name').each(function (i, elem) {

        result.movie.title = $(this).text();

        var infos = $(this).next() ;

        //result.infos = infos.text();

        var times = $(infos).next().text().trim().split(/\s+/);

        times.forEach(function (time) {

          result.time = time;

          results.push(_.cloneDeep(result));
        });
      });
    });

    return results;
  }).reduce(function(a, b) {

    return a.concat(b);
  }, []);
};

exports.enrich = function (item) {

  var mdb = moviedb(keys.moviedb);
  var deferred = Q.defer();

  mdb.searchMovie({ query: item.movie.title }, function (error, response) {

    if (error) {

      deferred.reject(new Error(error));
    }
    else {

      // TODO do something with the response
      // Example of the movie JSON
      // {title: Genius
      //  releaseDate: 2016-02-10
      //  adult: false  *true if adult movie, else false*
      //  plot: Adaptation of the award winning biography Max Perkins
      //  runtime: 114  *in minutes*
      //  genres: [{name: drama}]
      //  countries: [{name: USA}]
      //  director: Michael Grandage
      //  cast: [{name: Colin Firth}, {name: Nicole Kidman}, ...]
      // }

      var movie = {} ; // json object that will contain all infos

      response.results.forEach(function (res) {

        var movie = {
          title: res.title,
          externalID: res.id,
          releaseDate: res.release_date,

          adult: false,
          plot: '',
          runtime: 0,
          genres: [],
          countries: [],

          director: '',
          cast: []
        };

        if (
          movie.releaseDate.indexOf(year1) === -1 &&
          movie.releaseDate.indexOf(year2) === -1
        ) return null;

        mdb.movieInfo({ id: movie.externalID }, function (err, res) {

          movie.adult = res.adult;
          movie.plot = res.overview;
          movie.runtime = res.runtime;
          movie.genres = res.genres;
          movie.countries = res.countries;
        });

        mdb.movieCredits({ id: movie.externalID }, function (err, res) {

          movie.cast = res.cast;
          movie.director = res.crew.filter(function (member) {
            return member.job === 'Director';
          })[0];
        });
      });

      deferred.resolve(movie);
    }
  });

  return deferred.promise;
};

exports.clean = function (items) {

  console.log('clean', items.length);

  return items.map(function (item) {

    var time = item.time.trim();
    var parts = time.split(':');

    if (time === '' || parts.length !== 2) return null;

    // Compute a proper date as startTime

    var startTime = new Date();
    startTime.setTime(item.date);
    startTime.setHours(parts[0]);
    startTime.setMinutes(parts[1]);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    var result = {
      startTime: startTime,
      title: item.title,
      movie: item.movie
    };

    return result;
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

    var movie = new CinemaActivity(item);
    var deferred = Q.defer();

    movie.save(function (error) {

      if (error) {

        //deferred.reject(new Error(error));
        deferred.resolve(error);
      }
      else {

        deferred.resolve(movie);
      }
    });

    return deferred.promise;
  });
};

function matchExact (r, str) {

  var match = str.match(r);

  return match !== null && str === match[0];
}
