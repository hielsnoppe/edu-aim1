//Arrays to manage activities
var activities = new Array(); //Only activities and its description
var activitiesDescription = new Array(); //Only descriptions, means user preferences
var filteredActivities = new Array(); //Temp Array with filtered activities by user preferences
var activityTypeList = new Array(); //Chonologically ordered type of activity to be done
var activitiesGraphEdges = new Array(); //Steps chronologically ordered in a edges of graph-like structure
var activitiesGraphNodes = new Array(); //Steps chronologically ordered in a nodes of graph-like structure
var activityID = 0; //Counter for the activities, works as ID
var activitiesSchedules = new Array(); //Combinations chronologically ordered

//Read Sources
var cinema = require("./cinema0.json");
var restaurant = require("./restaurant0.json");
var initialPoint = require("./initial.json");
var theater = require("./theater.json");

//Checking

var transport = require('../bvgapi/transport_json_parser.js')("wedding", "Hansaplatz");
transport.getTransInfo(function(err, directionInfo) {
  console.log("here "+directionInfo[0].duration);
  //travelTime = directionInfo[0].duration;
});

//Separate activities and descriptions into different arrays
console.log('Separate Activities and Descriptions');
activities.push(initialPoint.Activity);
activities.push(cinema.Activity);
activities.push(theater.Activity);
activities.push(restaurant.Activity);
//console.log('Separate Activities and Descriptions');
activitiesDescription.push(initialPoint.ActivityDescription);
activitiesDescription.push(cinema.ActivityDescription);
activitiesDescription.push(theater.ActivityDescription);
activitiesDescription.push(restaurant.ActivityDescription);

//Create the chronologically ordered list of activity types
activitiesDescription.forEach(listActivityTypes);
//console.log(activityTypeList);

console.log('Filter Activities and Descriptions');
//Filter activities, by user preferences
activitiesDescription.forEach(filterActivities);
//console.log(filteredActivities);

console.log("Adding Tree Properties");
//Create Tree properties in filtered activities
filteredActivities.forEach(addTreeProperties);
//console.log(filteredActivities);

//Combine activities chronologically into a Graph-alike structure
console.log("Combining activities chronologically into a Graph-alike structure");
activityTypeList.forEach(createGraph);
//console.log(activitiesGraphEdges);
//console.log(activitiesGraphNodes);

//Create Schedules by traversing the Tree-like structure from leaves to root
console.log("Creating Schedules by traversing the Tree-like structure from leaves to root");
activitiesGraphEdges.forEach(createWeightedSchedule);
console.log(activitiesSchedules);

//Functions

//1.0 Filter activities by user preferences: raiting, property specific by activity type
function filterActivities(element, index, array){
  var activityValue = element.properties.value;
  var activityValueName = element.properties.name;
  var activityRating = element.properties.weight;
  var activityType = element.type;
  //console.log(activityType+' '+activityValueName +' '+' '+activityValue+' '+activityRating);
  activities.forEach(function(element, index){
    //console.log(element);
    //console.log('------- Element -----');
    element.forEach(function(element, index){
      if(element.type===activityType && element[activityValueName].indexOf(activityValue)>=0 && element.aggregateRating>= activityRating){
        element.activityID = activityID;
        activityID = activityID + 1;
        //console.log(element);
        //console.log(index);
        //console.log(activityID);
        //element.activityID = activityID;
        filteredActivities.push(element);
      }
    })
  });
};

//2.0 Extract chronologically the activity types
function listActivityTypes(element, index, array){
  activityTypeList.push(element.type);
};
//Fake function to get a travel time
function fakeTravelTime(origin, destiny, time){
  console.log("From: "+origin.lat+','+origin.lng);
  console.log("To: "+destiny.lat+','+destiny.lng);
  console.log("At: "+time);
  return (Math.round(45*Math.random()));
};

//Create Tree-like structure
function createGraph(activityType, index, array){
  //console.log(element+' '+index+''+array.length+''+array);
  if(index<array.length-1){
    //console.log(array[index]);
    //console.log(array[index+1]);
    filteredActivities.forEach(function(Origin){
      if(Origin.type===array[index]){
        var origin = Origin.activityID;
        var destiny = "";
        var travelTime = 0;
        filteredActivities.forEach(function(Destiny){
          if(Destiny.type===array[index+1]){
            destiny = Destiny.activityID;
            var stOrigin = Origin.location.lat+","+Origin.location.lng;
            var stDestiny = Destiny.location.lat+","+Destiny.location.lng;
            travelTime = fakeTravelTime(Origin.location, Destiny.location, '0:00');
            /*var transport = require('../bvgapi/transport_json_parser.js')(stOrigin, stDestiny);
            transport.getTransInfo(function(err, directionInfo) {
              console.log("here "+directionInfo);
              //travelTime = directionInfo[0].duration;
            });*/
            Destiny.parent.push(origin);
            Origin.child.push(destiny);
            Destiny.leaf=true;
            Origin.leaf=false;
            //console.log('From '+origin+' To '+destiny+' in '+travelTime)
            activitiesGraphEdges.push( {'origin':origin,'destiny':destiny,'travelTime':travelTime});
          }
        });
      }
    });
  }
};

//Function to insert tree properties to the
function addTreeProperties(element){
  if(element.type==="StartingPoint"){
    element.root=true;
    element.parent=[];
    element.child=[];
    element.leaf=false;
  }
  else{
    element.root=false;
    element.parent=[];
    element.child=[];
    element.leaf=false;
  }
}

//Copy and object
function insertActivity(obj){
  var obj2=JSON.parse(JSON.stringify(obj));
  return obj2;
};

//Create Schedules with weight
function createWeightedSchedule(element, index, array){
  var normRating = 0;
  var step = activityTypeList.length - 1;
  var thisSchedule = new Array();
  var nextNode = element.origin;
  var node = filteredActivities.find(function(item){
    return (item.activityID===element.destiny);
  });
  //console.log(node.leaf);
  if(node.leaf===true){
    normRating=nomalizeRating(node);
    thisSchedule.push({'step':step, 'origin': element.origin, 'destiny': element.destiny, 'travelTime': element.travelTime, 'normRating': normRating });
    step = step -1;
    while(step > 0){
      var next = array.find(function (item){
        return (item.destiny===nextNode);
      });
      nextNode = next.origin;
      //console.log(next);
      node = filteredActivities.find(function(item){
        return (item.activityID===next.destiny);
      });
      normRating=nomalizeRating(node);
      thisSchedule.push({'step':step, 'origin': next.origin, 'destiny': next.destiny, 'travelTime': next.travelTime, 'normRating': normRating });
      step = step - 1;
    }
  }
  //console.log(element);
  //console.log(thisSchedule);
  if(thisSchedule.length>0){
      activitiesSchedules.push(thisSchedule.reverse());
  }
  //cleaning Schedule
};

//Function to normalize the raiting
function nomalizeRating(node){
  var actDescription = activitiesDescription.find(function(item){
    return (item.type===node.type);
  });
  return(node.aggregateRating/actDescription.properties.maxWeight);
};
