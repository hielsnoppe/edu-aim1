'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  request = require('request'),
  util = require('../../../common/server/util.server.js');

var apiKey = require('../../../../config/keys.js').transport;

function wrapper () {}

wrapper.extractItems = function (body) {

  var json = JSON.parse(body);

  var direction_string = [];

  if (json.status === 'NOT_FOUND') {

    return {
      error: true,
      message: 'Not found'
    };
  }

  console.log(json);

  /*

  var legs = json.routes[0].legs[0];
  var steps = json.routes[0].legs[0].steps;

  if (typeof (legs.departure_time) !== 'undefined') {

    //Extracting basic travel details
    var time_zone = legs.departure_time.time_zone;
    var depart_time = legs.departure_time.text;
    var arrival_time = legs.arrival_time.text;
    var duration = legs.duration.text;
    var distance = legs.distance.text;

    direction_string.push("***********Route from " + src + " to " + dest + " in the time zone " + time_zone + "************");
    //Displaying basic travel details
    direction_string.push("\n\t#####Your Journey Details#####");
    direction_string.push("\tDeparture time from " + src + ": " + depart_time +
      "\n\tArrival time at " + dest + ": " + arrival_time +
      "\n\tDistance: " + distance +
      "\n\tduration: " + duration
    );

    //Fetching Directions
    if (typeof (json.routes[0].legs[0].steps) === 'undefined') {

      direction_string.push("No Directions for the given source and destination");
    }
    else {

      //Printing directions until no steps left
      var noStep = steps;
      var steps_count = 1;

      direction_string.push("\n\t---->Directions<----");

      for (var i = 0; i < steps.length; i++) {

        //****It Works. Only if you want to parse the steps from JSON****

        / * while (typeof noStep !='undefined'){
             var step_instructions = noStep[0].html_instructions;
             console.log("\nStep"+steps_count+": "+noStep[0].travel_mode+": "+ step_instructions);
             var start_end_location_step = {
                 slat: noStep[0].start_location.lat,
                 slon: noStep[0].start_location.lng,
                 elat: noStep[0].end_location.lat,
                 elon: noStep[0].end_location.lng
             }
             console.log("\n\tStart Location: "+start_end_location_step.slat, start_end_location_step.slon+
                 "\n\tEnd Location: "+start_end_location_step.elat, start_end_location_step.slon+
                 "\n\tDistance: "+noStep[0].distance.text+
                 "\n\tduration: "+noStep[0].duration.text);
             noStep = noStep[0].steps;
             steps_count++;
         }
         * /

        //Checking the condition whether it's a transit or walking to calculate no. of stops
        var no_of_stops = (typeof (steps[i].transit_details) !== 'undefined') ? steps[i].transit_details.num_stops : 'Not Applicable';
        var line_name = (typeof (steps[i].transit_details) !== 'undefined')? steps[i].transit_details.line.short_name : 'Not Applicable';
        var direction = (typeof (steps[i].transit_details) !== 'undefined')? steps[i].transit_details.headsign : 'Not Applicable';

        direction_string.push("\n\tStep" + (i + 1) + ":\n\tTravel Mode: " + steps[i].travel_mode +
          "\n\tInstruction: " + steps[i].html_instructions +
          "\n\tStart Location: " + steps[i].start_location.lat, steps[i].start_location.lng +
          "\n\tEnd Location: " + steps[i].end_location.lat, steps[i].end_location.lng +
          "\n\tDistance: " + steps[i].distance.text +
          "\n\tduration: " + steps[i].duration.text +
          "\n\tNumber of Stops: " + no_of_stops+
          "\n\tLine: "+line_name+
          "\n\tDirection: "+direction);
      }
    }
  }
  else {

    direction_string.push("***********Route from " + src + " to " + dest + "*************");

    var duration = legs.duration.text;
    var distance = legs.distance.text;

    //Displaying basic travel details
    direction_string.push("\n\t#####Your Journey Details#####"+
      "\n\t@@ 'No transport available for this journey, so don't be lazy and start walking' @@"+
      "\n\tDistance: " + distance +
      "\n\tduration: " + duration);

    //Fetching Directions
    if (typeof (json.routes[0].legs[0].steps) === 'undefined') {

      direction_string.push("No Directions for the given source and destination");
    }
    else {

      //Printing directions until no steps left
      var noStep = steps;
      var steps_count = 1;

      direction_string.push("\n\t---->Directions<----");

      for (var i = 0; i < steps.length; i++) {

         //****It Works. Only if you want to parse the steps from JSON****

        / * while (typeof noStep !='undefined'){
             var step_instructions = noStep[0].html_instructions;
             console.log("\nStep"+steps_count+": "+noStep[0].travel_mode+": "+ step_instructions);
             var start_end_location_step = {
                 slat: noStep[0].start_location.lat,
                 slon: noStep[0].start_location.lng,
                 elat: noStep[0].end_location.lat,
                 elon: noStep[0].end_location.lng
             }
             console.log("\n\tStart Location: "+start_end_location_step.slat, start_end_location_step.slon+
                 "\n\tEnd Location: "+start_end_location_step.elat, start_end_location_step.slon+
                 "\n\tDistance: "+noStep[0].distance.text+
                 "\n\tduration: "+noStep[0].duration.text);
             noStep = noStep[0].steps;
             steps_count++;
         }
         * /

        //Checking the condition whether it's a transit or walking to calculate no. of stops
        var no_of_stops = (typeof (steps[i].transit_details) !== 'undefined') ? steps[i].transit_details.num_stops : 'Not Applicable'
        var line_name = (typeof (steps[i].transit_details) !== 'undefined')? steps[i].transit_details.line.short_name : 'Not Applicable';
        var direction = (typeof (steps[i].transit_details) !== 'undefined')? steps[i].transit_details.headsign : 'Not Applicable';

        direction_string.push("\n\tStep" + (i + 1) + ":\n\tTravel Mode: " + steps[i].travel_mode +
          "\n\tInstruction: " + steps[i].html_instructions +
          "\n\tStart Location: " + steps[i].start_location.lat, steps[i].start_location.lng +
          "\n\tEnd Location: " + steps[i].end_location.lat, steps[i].end_location.lng +
          "\n\tDistance: " + steps[i].distance.text +
          "\n\tduration: " + steps[i].duration.text +
          "\n\tNumber of Stops: " + no_of_stops);
      }
    }
  }
  */
};

/**
 */

wrapper.responseHandler = function (error, response, body) {

  if (!error && response.statusCode === 200) {

    wrapper.extractItems(body);
  }
};

/**
 */

wrapper.fetch = function (origin, destination) {

  var baseurl = 'https://maps.googleapis.com/maps/api/directions/json';
  var params = {
    origin: origin,
    destination: destination,
    mode: 'transit',
    key: apiKey
  };

  request.get(util.makeurl(baseurl, params), this.responseHandler);

  return true;
};

module.exports = wrapper;
