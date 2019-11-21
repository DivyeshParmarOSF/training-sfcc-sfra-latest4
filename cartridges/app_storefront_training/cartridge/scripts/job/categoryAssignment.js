'use strict';

function automaticCategoryAssignment(param) {
    var File = require('dw/io/File');
    var FileWriter = require('dw/io/FileWriter');
    var XMLStreamWriter = require('dw/io/XMLStreamWriter');
    var Logger = require('dw/system/Logger');
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var siteCatlog = CatalogMgr.getSiteCatalog().getID();

    var param = param;    
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var apiProductSearch = new ProductSearchModel();
    apiProductSearch.addRefinementValues('brand', param.brand);
    apiProductSearch.search();
    var asIterator = apiProductSearch.getProductSearchHits().asList();
    var categoryAssignments = [],
        brands = [],
        i = 0;
    while (i < asIterator.length) {
        brands.push({
            value: param.brand,
        }),
        categoryAssignments.push({
            categoryId: param.brand,
            productId: asIterator[i].productID
        }),
        i++;
    };

    if (brands.length > 0) {
        var brandsImport = new File(File.IMPEX + "/src/catalog/category-assignment.xml");
        var fileWriter = new FileWriter(brandsImport, "UTF-8");
        var xsw = new XMLStreamWriter(fileWriter);

        xsw.writeStartDocument();
        xsw.writeStartElement('catalog');
            xsw.writeAttribute('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
            xsw.writeAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
            xsw.writeAttribute('catalog-id', siteCatlog);
            xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/catalog/2006-10-31');
            xsw.writeStartElement('category');
                xsw.writeAttribute('category-id', 'Brands');
                xsw.writeStartElement('display-name');
                    xsw.writeAttribute('xml:lang', 'x-default');
                xsw.writeEndElement();
            xsw.writeEndElement();

            for (var j in brands) {
                xsw.writeStartElement('category');
                    xsw.writeAttribute('category-id', 'Brands');
                    xsw.writeStartElement('display-name');
                        xsw.writeAttribute('xml:lang', 'x-default');
                        xsw.writeCharacters(brands[j].value);
                    xsw.writeEndElement();
                    xsw.writeStartElement('template');
                        xsw.writeCharacters('rendering/brands/brandproducthits');
                    xsw.writeEndElement();
                xsw.writeEndElement();
            }
            for (var k in categoryAssignments) {
                xsw.writeStartElement('category-assignment');
                    xsw.writeAttribute('category-id', categoryAssignments[k].categoryId);
                    xsw.writeAttribute('product-id', categoryAssignments[k].productId);
                xsw.writeEndElement();
            }
        xsw.writeEndElement();
        xsw.writeEndDocument();

        xsw.close();
        fileWriter.close();

        return PIPELET_NEXT;
    }

    Logger.error('[BrandsCategories.ds] - Error importing the brands. No brands found.');
    return PIPELET_ERROR;
}

module.exports = {
    automaticCategoryAssignment : automaticCategoryAssignment
}
 
