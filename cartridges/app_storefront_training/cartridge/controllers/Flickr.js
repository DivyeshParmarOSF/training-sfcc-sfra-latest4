'use strict';

var server = require('server');
var HTTPClient = require('dw/net/HTTPClient');
var Service = require('dw/svc/Service');
var HTTPService = require('dw/svc/HTTPService');

server.get('Show',  function (req, res, next) {
    
    var flickrsGet = dw.svc.LocalServiceRegistry.createService("storefronttraining.http.flickr.get", {
        createRequest: function(Service , args) {
            Service.setRequestMethod("GET");
        },
        parseResponse: function(Service, client) {
            return client.text;
        },
    });
    var flickrStrObj = flickrsGet.call();
    var flickrDataObj =  JSON.parse(flickrStrObj.object)

    res.render('/flickr.isml', {
        flickrData : flickrDataObj, 
    });
    next();
});

module.exports = server.exports();
