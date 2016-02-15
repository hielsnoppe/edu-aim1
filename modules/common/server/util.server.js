'use strict';

module.exports = {

  makeurl: makeurl
};

function makeurl (baseurl, params) {

  var url = baseurl;

  if (params) {

    url = url + '?';

    Object.keys(params).forEach(function (key) {
      url = url + '&' + key + '=' + params[key];
    });
  }

  return url;
}

function matchExact (r, str) {

  var match = str.match(r);

  return match !== null && str === match[0];
}
