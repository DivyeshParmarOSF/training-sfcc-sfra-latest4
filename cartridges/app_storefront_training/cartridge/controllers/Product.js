'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var PagingModel = require('dw/web/PagingModel'); 
    var productID = ProductMgr.getProduct(req.querystring.pid);
    var apiProductSearch = new ProductSearchModel();
    var categoryId = productID.getPrimaryCategory().ID;
    var sortingRule = CatalogMgr.getSortingRule('price-low-to-high');
    apiProductSearch.setSortingRule(sortingRule);
    apiProductSearch.setCategoryID(categoryId);
    apiProductSearch.search();
    var pagingModel = new PagingModel(apiProductSearch.getProductSearchHits(), apiProductSearch.count);
    pagingModel.setStart(0);
    pagingModel.setPageSize(4);
    var products = pagingModel.pageElements.asList();

    res.setViewData({
        products: products
    });
    next();
});

module.exports = server.exports();
