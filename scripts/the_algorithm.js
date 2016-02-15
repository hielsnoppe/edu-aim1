'use strict';

var dummy = {
  ActivityDescription: [
    require('./config/assets/schema/ActivityDescription.json')
  ],
  ScheduleDescription: [
    require('./config/assets/schema/ScheduleDescription.json')
  ],
  Activity: [
    {
      "type": "RestaurantActivity",
      "name": "Hans im Glueck",
      "cuisine": [
        "Burgers"
      ],
      "aggregateRating": 5.0
    },
    {
      "type": "RestaurantActivity",
      "name": "Burger King",
      "cuisine": [
        "Burgers"
      ],
      "aggregateRating": 3.8
    },
    {
      "type": "RestaurantActivity",
      "name": "Vapiano",
      "cuisine": [
        "Italian"
      ],
      "aggregateRating": 3.6
    },
    {
      "type": "RestaurantActivity",
      "name": "Trattoria del Corso",
      "cuisine": [
        "Italian"
      ],
      "aggregateRating": 4.3
    },
    {
      "type": "RestaurantActivity",
      "name": "Boussi Falafel",
      "cuisine": [
        "Lebanese"
      ],
      "aggregateRating": 4.7
    }
  ]
};

var restaurantWrapper = {
  getActivities: function (description) {

    return dummy.Activity;
  }
};

var wrapperRegistry = {
  RestaurantActivity: [
    restaurantWrapper
  ]
};

/**
 *
 */
function expandSchedule (description) {

  var result = [];

  description.activities.forEach(function (description) {

    var activities = [];

    description.options.forEach(function (description) {

      activities = activities.concat(expandActivity(description));
    });

    result.push(activities);
  });

  return result;
}

/**
 * @param ActivityDescription
 * @return [Activity]
 */
function expandActivity (description) {

  console.log(description);

  // find appropriate wrapper
  var wrappers = wrapperRegistry[description.type];
  var result = [];

  wrappers.forEach(function (wrapper) {

    // call wrapper
    var activities = wrapper.getActivities(description);

    result = result.concat(activities);
  });

  return result;
}

/**
 * @param [[Activity]]
 * @return [[Activity]]
 */
function combinations (activities) {

  activities.each(function (options) {

  });
}

function Activity () {

}

Activity.prototype.rank = function (description) {

};

function main () {

  var result = expandSchedule(dummy.ScheduleDescription[0]);

  console.log(result);
}

main();
