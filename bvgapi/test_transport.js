var src = process.argv[2];
var dest = process.argv[3];



if(src===null || dest ===null){
    console.log("Please give command line argument for example 'node test.js alexanderplatz wedding' ");
}else{

	console.log("^^^^^^Inside Test source^^^^^^^^^ ")


	
	var transport = require('./transport_json_parser.js')(src, dest);



	//Displaying on Console
	transport.test();


	/*********How to get general travel journey info "arrival_time", "departure_time", "distance", 
					"duration" by the example shown in console.log statement*/

	transport.getTransInfo(function(err, transInfo){
		//Your code. Below is an example
			/*console.log("\n\t<<<<<<<General Details from Test_Transport>>>>>>>"+
				"\n\t Departure Time: "+transInfo.departure_time+
				"\n\t Arrival Time: "+transInfo.arrival_time+
				"\n\t Duration: "+transInfo.duration+
				"\n\t Distance: "+transInfo.distance );*/
	});


	//**********To get Direction JSON
	transport.direction(function(err, directionInfo){

	  //Your code. Below is an example
		/*console.log("\n\t ##########Directions########## \n\t Total Number of Steps: "+directionInfo.length+
			"\n\t Step Number: "+directionInfo[0].step+
			"\n\t Travel Mode: "+ directionInfo[0].travel_mode);*/
	});
}
