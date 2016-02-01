var path = require('path'),
  fs = require('fs');
  request = require('request');
  direction_string = [];



//function to print on command prompt
function print_on_cmd_line(src, dest){
  getDirections(src, dest);
  return direction_string;
}

//Please use 'direction' to use it in other js file or use 'test' to print on command prompt 
module.exports = function (src, dest){
  return{
    direction: function(){
      var returnDir = callDir(src, dest,flag);
      return returnDir;
    },
    test: function(){
      print_on_cmd_line(src, dest);
    }
  }
};

function returnDir(direction_string_from_get){
  direction_string = direction_string_from_get;
}

function callDir (src, dest, flag){
    getDirections(src, dest);
    return direction_string;
}

function getDirections (src, dest) {
  request.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + src +
  '&destination=' + dest + '&mode=transit&key=AIzaSyBCroIiU9zWXaFxW0SE62fcSGxdQsP0XiY',
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var direction_string = [];
        direction_string.push("\nFetching the Directions....\n");
        console.log("\nFetching the Directions....\n");
        var json = JSON.parse(body);
        if (json.status == "NOT_FOUND") {
          direction_string.push("source or destination not found");
          console.log("source or destination not found");
        } else {
          if (src !== dest) {
            var legs = json.routes[0].legs[0];
            var steps = json.routes[0].legs[0].steps;
            if (typeof (legs.departure_time) != 'undefined') {
              //Extracting basic travel details
              var time_zone = legs.departure_time.time_zone;
              var depart_time = legs.departure_time.text;
              var arrival_time = legs.arrival_time.text;
              var duration = legs.duration.text;
              var distance = legs.distance.text;
              direction_string.push("***********Route from " + src + " to " + dest + " in the time zone " + time_zone + "************");
              console.log("***********Route from " + src + " to " + dest + " in the time zone " + time_zone + "************");
              //Displaying basic travel details
              direction_string.push("\n\t#####Your Journey Details#####");
              console.log("\n\t#####Your Journey Details#####");
              direction_string.push("\tDeparture time from " + src + ": " + depart_time +
                "\n\tArrival time at " + dest + ": " + arrival_time +
                "\n\tDistance: " + distance +
                "\n\tduration: " + duration);
              console.log("\tDeparture time from " + src + ": " + depart_time +
                "\n\tArrival time at " + dest + ": " + arrival_time +
                "\n\tDistance: " + distance +
                "\n\tduration: " + duration);
              //console.log("LOGGING "+direction_string.length);
              //Fetching Directions
              if (typeof (json.routes[0].legs[0].steps) == 'undefined') {
                direction_string.push("No Directions for the given source and destination");
                console.log("No Directions for the given source and destination");
              } else {
                //Printing directions until no steps left
                var noStep = steps;
                var steps_count = 1;
                direction_string.push("\n\t---->Directions<----");
                console.log("\n\t---->Directions<----");
                for (var i = 0; i < steps.length; i++) {

                  //****It Works. Only if you want to parse the steps from JSON****

                  /* while (typeof noStep !='undefined'){
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
                   */

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
                  console.log("\n\tStep" + (i + 1) + ":\n\tTravel Mode: " + steps[i].travel_mode +
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
            } else {
              direction_string.push("***********Route from " + src + " to " + dest + "*************");
              console.log("***********Route from " + src + " to " + dest + "*************");
              var duration = legs.duration.text;
              var distance = legs.distance.text;
              //Displaying basic travel details
              direction_string.push("\n\t#####Your Journey Details#####"+
                "\n\t@@ 'No transport available for this journey, so don't be lazy and start walking' @@"+
                "\n\tDistance: " + distance +
                "\n\tduration: " + duration);
              console.log("\n\t#####Your Journey Details#####");
              console.log("\n\t@@ 'No transport available for this journey, so don't be lazy and start walking' @@");
              console.log("\n\tDistance: " + distance +
                "\n\tduration: " + duration);

              //Fetching Directions
              if (typeof (json.routes[0].legs[0].steps) == 'undefined') {
                direction_string.push("No Directions for the given source and destination");
                console.log("No Directions for the given source and destination");
                
              } else {
                //Printing directions until no steps left
                var noStep = steps;
                var steps_count = 1;
                direction_string.push("\n\t---->Directions<----");
                console.log("\n\t---->Directions<----");
                for (var i = 0; i < steps.length; i++) {

                   //****It Works. Only if you want to parse the steps from JSON****

                  /* while (typeof noStep !='undefined'){
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
                   */

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
                  console.log("\n\tStep" + (i + 1) + ":\n\tTravel Mode: " + steps[i].travel_mode +
                    "\n\tInstruction: " + steps[i].html_instructions +
                    "\n\tStart Location: " + steps[i].start_location.lat, steps[i].start_location.lng +
                    "\n\tEnd Location: " + steps[i].end_location.lat, steps[i].end_location.lng +
                    "\n\tDistance: " + steps[i].distance.text +
                    "\n\tduration: " + steps[i].duration.text +
                    "\n\tNumber of Stops: " + no_of_stops);
                }
              }
            }
          } else {
            direction_string.push("Error!! Please enter different source and destination");
            console.log("Error!! Please enter different source and destination");
          }
        }
      } else {
        direction_string.push("Error! " + error);
        console.log("Error! " + error);
      }
      returnDir(direction_string);
    });
}
