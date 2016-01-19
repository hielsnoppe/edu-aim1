BVG API
===================

An inofficial API to the BVG (Berlin Transport Services) written in Coffeescript.

[Demo](https://bvg-api.herokuapp.com/station?input=Alexanderplatz)

__Dependencies__

* [request](https://github.com/request/request) to fetch HTML from http://mobil.bvg.de
* [cheerio](https://github.com/cheeriojs/cheerio) to extract data from the HTML DOM tree
* [restify](https://github.com/mcavage/node-restify) to serve the extracted data via REST API


Install
-------------------

    cd bvg-api
    npm install

Run
-------------------

    npm start


How to use
-------------------

After you have successfully started the server by the above command, now you can open the browser and enter in the URL with the name of the station. For example, `http://localhost:3000/station/Leopolplatz`. You will get a JSON having information about the station and the directions to other stations. 


Develop
-------------------

Watch for changes and restart server automatically:

    gulp develop
