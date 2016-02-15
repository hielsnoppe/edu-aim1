'use strict';

var Pipeline = require('../modules/common/server/util.server.js').Pipeline;

var pipeline = new Pipeline()
.pipe(function (i) {

  console.log('add one', i);

  return i + 1;
})
.pipe(function (i) {

  console.log('double', i);

  return i * 2;
})
.pipe(function (i) {

  console.log('minus one', i);

  return i - 1;
})
;

var results = pipeline.start([1,2,3]);
console.log(results);
