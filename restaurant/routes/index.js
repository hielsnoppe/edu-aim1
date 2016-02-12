
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.randeats = function(req, res){
  var key = "AIzaSyCzqQwN3OL3YdHoY-vD2OFbzGZECUeBfW4";
  var location = encodeURIComponent(req.query.location);
  var radius = req.query.radius;
  var sensor = false;
  var types = "restaurant";
  var keyword = req.query.keyword;

  var https = require('https');
  var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + key + "&location=" + location + "&radius=" + radius + "&sensor=" + sensor + "&types=" + types + "&keyword=" + keyword;
    console.log(url);
  https.get(url, function(response) {
    var body ='';
    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      var places = JSON.parse(body);
      var result;
      var name = " ";
      if (response.statusCode == 200) {

      if (places.status == "NOT_FOUND") {
          console.log("Not found");
        } else
        {
          result = places.results.length;
        //  var name = result.name;
        for(var i=0; i<result; i++)
        {
          //console.log(Object.keys(places.results[i]).length)
          console.log("Name: ", places.results[i].name);
          console.log("Address: ", places.results[i].vicinity);
          if (places.results[i].rating == " ")
            console.log("Not Provided");
          else
            console.log("Rating: ", places.results[i].rating);
          }
          console.log("Total Number of Restaurant: ", result);

        }
      }
      var locations = places.results;
      var randLoc = locations[Math.floor(Math.random() * locations.length)];
      res.json(locations);
      //res.json(locations);

    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

};
