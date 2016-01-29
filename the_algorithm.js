'use strict';

var dummy = {
  ActivityDescription: [
    {
      "type": "RestaurantActivity",
      "properties": [
        {
          "weight": 5,
          "name": "cuisine",
          "values": [
            {
              "weight": 5,
              "value": "Italian"
            }
          ]
        }
      ]
    }
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

/**
 * @param ActivityDescription
 * @return [Activity]
 */
function wrapperDummy () {

  return dummy.Activity;
}

var wrapperRegistry = {
  RestaurantActivity: [
    wrapperDummy
  ]
};

var asdf = {
  key: [
    'asdf', 10, 1.5, [], { key: value }
  ]
};

/**
 * @param ActivityDescription
 * @return [Activity]
 */
function expand (description) {

  // find appropriate wrapper
  var wrappers = wrapperRegistry[description.type];
  var result = [];

  wrappers.forEach(function (wrapper) {

    // call wrapper
    var activities = wrapper.getActivities(description);

    result.push(activities);
  });

  return result;
}

/**
 * @param [[Activity]]
 * @return [[Activity]]
 */
function combinations () {

}

function rank () {

}
