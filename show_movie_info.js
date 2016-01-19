
var mdb = require('moviedb')('bcb140e66b61bf2f4c6da5401d14de3b');
var text = '' ;

process.argv.forEach(function (val, index, array) {
  if (index == 2){
	text += val ;
  }
  if (index > 2){
  	text += " " + val ;
  }
});

console.log('Movie name: ' + text);
mdb.searchMovie({query: text }, function(err, res){
  console.log(res);
});
