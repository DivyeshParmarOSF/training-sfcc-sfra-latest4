'use strict';

const base = module.superModule;
const server = require('server');
server.extend(base);

server.append('Show', function (req, res, next) {
   var Site = require('dw/system/Site');
   var value = Site.current.getCustomPreferenceValue('exeedPrice');
   res.setViewData({
       exceedsPrice: value
   });
   next();
});


module.exports = server.exports();
