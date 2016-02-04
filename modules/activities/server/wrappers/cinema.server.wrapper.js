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
      infos: '',
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

        result.infos = infos.text();

        var times = $(infos).next().text().trim().split(/\s+/);

        times.forEach(function (time) {

          result.time = time;

          results.push(_.cloneDeep(result));
        });
        /*
        .find('> span').each(function (i, elem) {

          result.time = $(this).text();

          results.push(_.cloneDeep(result));
        });
        */
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
      var example = {
        "page": 1,
        "results": [
          {
            "backdrop_path": "/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg",
            "first_air_date": "2008-01-19",
            "genre_ids": [
              18
            ],
            "id": 1396,
            "original_language": "en",
            "original_name": "Breaking Bad",
            "overview": "Breaking Bad is an American crime drama television series created and produced by Vince Gilligan. Set and produced in Albuquerque, New Mexico, Breaking Bad is the story of Walter White, a struggling high school chemistry teacher who is diagnosed with inoperable lung cancer at the beginning of the series. He turns to a life of crime, producing and selling methamphetamine, in order to secure his family's financial future before he dies, teaming with his former student, Jesse Pinkman. Heavily serialized, the series is known for positioning its characters in seemingly inextricable corners and has been labeled a contemporary western by its creator.",
            "origin_country": [
              "US"
            ],
            "poster_path": "/4yMXf3DW6oCL0lVPZaZM2GypgwE.jpg",
            "popularity": 18.095686,
            "name": "Breaking Bad",
            "vote_average": 8.9,
            "vote_count": 245
          }
        ],
        "total_pages": 1,
        "total_results": 1
      };

      console.log(response);

      deferred.resolve(item);
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
