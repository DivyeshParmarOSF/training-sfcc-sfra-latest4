'use strict';

var server = require('server');
var HTTPClient = require('dw/net/HTTPClient');
var Site = require('dw/system/Site');
var URLUtils = require('dw/web/URLUtils');

server.get('Show', function (req, res, next) {

    var httpClient = new HTTPClient();
    var currentURL = URLUtils.https('FbGraphApi-Show').toString();
    var loginPrefixURL = 'https://www.facebook.com/v5.0';
    var fbAuthPreURL = 'https://graph.facebook.com/v5.0';
    var loginURl =  loginPrefixURL + '/dialog/oauth?client_id=464491077751882&redirect_uri='+currentURL;
    var fbCode = (res.viewData.queryString).replace('code=','');
    httpClient.open('GET', fbAuthPreURL + '/oauth/access_token?client_id=464491077751882&client_secret=7ff2180798be4a22238a3ec348814855&code='+fbCode+'&redirect_uri='+currentURL); 
    httpClient.send();    

    if (httpClient.statusCode == 200) {
        var objAccessToken = JSON.parse(httpClient.text);
        var accessToken = objAccessToken.access_token
        httpClient.open('GET', fbAuthPreURL + '/me?access_token='+accessToken+'&fields=id,name,email,birthday,picture.width(300).height(300)');
        httpClient.send();
    }

    res.render('/fbGraphApi.isml', {
        loginurl : loginURl,
        userinfo : JSON.parse(httpClient.text),   
    });
    next();
});

module.exports = server.exports();
