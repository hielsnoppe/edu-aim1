var tv4 = require('tv4');

var data = require('./' + process.argv[2]);

var schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "$ref": "definitions.json#/definitions/ActivityDescription"
};

tv4.addSchema('definitions.json', require('./definitions.json'));

if (! tv4.validate(data, schema, true, true)) {

    console.log(tv4.error);
}
