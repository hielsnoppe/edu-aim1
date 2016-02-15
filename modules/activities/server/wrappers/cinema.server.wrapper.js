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

  console.log('fetch');

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

exports.extract = function (item) {

  console.log('extract', item);

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
};

exports.enrich = function (item) {

  console.log('enrich');

  var results = [];
  var mdb = moviedb(keys.moviedb);

  mdb.searchMovie({ query: item.movie.title }, function (error, response) {

    if (error) {

      //deferred.reject(new Error(error));
      console.log(error);
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

      results.push(movie);
    }
  });

  return results;
};

exports.clean = function (item) {

  console.log('clean');

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
};

exports.filter = function (item) {

  console.log('filter');

  if (item === null) return [];

  return item;
};

exports.save = function (item) {

  console.log('save');

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
};

exports.find = function (activityDescription) {

  var query = {}; // make from activityDescription

  for (var property in activityDescription.properties) {

    var propertyDescription = activityDescription.properties[property];

    if (propertyDescription.hasOwnProperty('weight')) {}

    if (propertyDescription.hasOwnProperty('minimumValue')) {

      query[property] = {
        $gt: propertyDescription.minimumValue
      };
    }
    else if (propertyDescription.hasOwnProperty('values')) {

      for (var val in propertyDescription.values) {

        query[property] = val;

        // FIXME This neglects all but the first value!
        break;
      }
    }
  }

  return CinemaActivity.find(query);
};
