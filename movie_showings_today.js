var request = require('request');
var cheerio = require('cheerio');


for(i = 0; i <= 70; i+=10) {
	var link = "http://www.google.de/movies?near=berlin&start=" + i ; 
	request(link, function (error, response, html) { 
	if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    if ($('div.theater').length == 0){
		return ;
	    }
	    $('div.theater').each(function(i, element){
		 var desc = $(this).children('.desc');
		 var name = $(desc).children('.name');
		 console.log("Theater name: " + name.text());
		 var address = $(desc).children('.info');
		 console.log("Theater info: " + address.text());
		
		 var showtimes = $(this).children('.showtimes');
		 console.log("Showings: ");
		 $(showtimes).find('.name').each(function(i,elem){
			console.log($(this).text());
			var infos = $(this).next() ;
			console.log(infos.text()) ;
			var times = $(infos).next() ;
			console.log(times.text());
		 }) ;
		 
		 console.log("\n");
	     });
	  }
	});
}
