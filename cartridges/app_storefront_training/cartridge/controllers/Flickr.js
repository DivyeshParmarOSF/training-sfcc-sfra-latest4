'use strict';

var server = require('server');
var HTTPClient = require('dw/net/HTTPClient');
 
server.get('Show',  function (req, res, next) {

    var httpClient = new HTTPClient();
    httpClient.open('GET', 'https://api.flickr.com/services/feeds/photos_public.gne/?format=json&nojsoncallback=1');
    httpClient.send();

    if (httpClient.statusCode == 200) {
        var flickrStrObj =  httpClient.text;
        var flickrDataObj = JSON.parse(flickrStrObj);
    }
    else {
        // error handling
        flickrDataObj = "An error occurred with status code "+ httpClient.statusCode;
    }
     
    res.render('/flickr.isml', {
        flickrData : flickrDataObj, 
    });
    next();
});

module.exports = server.exports();
