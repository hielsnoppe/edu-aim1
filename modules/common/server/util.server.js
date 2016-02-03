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
