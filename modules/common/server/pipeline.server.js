'use strict';

var async = require('async');
var Q = require('q');

function Pipeline () {

  this.stages = [];
}

Pipeline.prototype.pipe = function (callback) {

  this.stages.push(callback);

  return this;
};

Pipeline.prototype.start = function (seed) {

  var deferred = Q.defer();

  var qu = async.queue(function (item, done) {

    console.log(item);
    done();
  });

  function queue (callback, next) {

    return async.queue(function (item, done) {

      var result = callback(item);

      // meant to check whether the result is a promise
      if (typeof result.then === 'function') {

        result.then(function (result) {

          next.push(result);
          done();
        });
      }
      else {

        next.push(result);
        done();
      }
    });
  }

  this.stages.reverse().forEach(function (stage) {

    qu = queue(stage, qu);
  });

  qu.push(seed, function (result) {

    deferred.resolve(result);
  });

  return deferred.promise;
};

module.exports = Pipeline;
