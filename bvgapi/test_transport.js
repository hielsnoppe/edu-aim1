var src = process.argv[2];
var dest = process.argv[3];



if(src===null || dest ===null){
    console.log("Please give command line argument for example 'node test.js alexanderplatz wedding' ");
}else{
	console.log("^^^^^^Inside Test source^^^^^^^^^ ")


	/*********How to get general travel journey info "arrival_time", "departure_time", "distance", 
					"duration" by the example shown in console.log statement*/
	var transport = require('./transport_json_parser.js')(src, dest);
	transport.getTransInfo(function(err, transInfo){
			console.log("\n\t<<<<<<<General Details from Test_Transport>>>>>>>"+
				"\n\t Departure Time: "+transInfo.departure_time+
				"\n\t Arrival Time: "+transInfo.arrival_time+
				"\n\t Duration: "+transInfo.duration+
				"\n\t Distance: "+transInfo.distance );
	});

	//Displaying on Console
	//transport.test();


	//**********To get Direction JSON
	transport.direction(function(err, directionInfo){
		console.log("\n\t ##########Directions########## \n\t Total Number of Steps: "+directionInfo.length+
			"\n\t Step Number: "+directionInfo[0].step+
			"\n\t Travel Mode: "+ directionInfo[0].travel_mode);
	});
}
