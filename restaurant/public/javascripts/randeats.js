console.log("Prompting for location");
function show_map(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("Lat: " + latitude);
    console.log("Lng: " + longitude);
    var radius;
    var keyword;

    $.get( "randeats", { key: "AIzaSyCzqQwN3OL3YdHoY-vD2OFbzGZECUeBfW4", location: latitude + "," + longitude, radius: radius, keyword: keyword })
	.done(function(data) {
      console.log("Got results, updating main page.");
	    console.log(data);
            $('body').html(data.name + "<br/>" + data.vicinity);
        });
}

function handle_err(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User refused to enable geolocation.");
	break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
	break;
      case error.TIMEOUT:
        console.log("User took too long to enable geolocation.");
	break;
      case error.UNKNOWN_ERROR:
        console.log("No idea what happened.");
	break;
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(show_map, handle_err);
} else {
    console.log("Geolocation not supported");
}
