var src = process.argv[2];
var dest = process.argv[3];

if(src===null || dest ===null){
    console.log("Please give command line argument for example 'node test.js alexanderplatz wedding' ");
}else{
	console.log("^^^^^^Inside Test source^^^^^^^^^ ")
	var transport = require('./transport_json_parser.js')(src, dest);
	transport.test();
}


