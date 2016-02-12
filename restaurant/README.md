Restaurant API
========

Intall
------------
``````
cd restaurant
npm install

Run
---------
npm start
````````

Input attributes
---------
We have to provide: 
1. key
2. location
3. radius
4. keyword i.e cuisine

After starting the server user has to open browser and provide following url with all the attributes. It will return a json file file all the information.

======
Eg
http://localhost/randeats?key=AIzaSyCzqQwN3OL3YdHoY-vD2OFbzGZECUeBfW4&location=52.5167,13.3833&radius=1000&keyword=chinese


Output on console
----------
In console url and name, address and rating will printed for the restaurant

https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCzqQwN3OL3YdHoY-vD2OFbzGZECUeBfW4&location=52.5167%2C13.3833&radius=1000&sensor=false&types=restaurant&keyword=chinese

Name:  CHINA CLUB BERLIN GMBH & CO. KG

Address:  Behrenstraße 72, Berlin

Rating:  undefined

Name:  Restaurant Peking Ente Berlin

Address:  Voßstraße 1, Berlin

Rating:  4.1

Name:  China - City

Address:  Leipziger Straße 46, Berlin-Mitte

Rating:  4

Name:  Restaurant Jolly

Address:  Am Kupfergraben 4/4A, Berlin

Rating:  4.5

Name:  Lucky Star Restaurant

Address:  Friedrichstraße 127, Berlin

Rating:  4.4

Name:  China Restaurant Sonne Berlin

Address:  Leipziger Platz 8, Berlin

Rating:  3.4

Total Number of Restaurants: 6

