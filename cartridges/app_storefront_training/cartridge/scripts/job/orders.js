'use strict';

function getOrders() {
    var File = require('dw/io/File');
    var FileWriter = require('dw/io/FileWriter');
    var XMLStreamWriter = require('dw/io/XMLStreamWriter');
    var OrderMgr = require('dw/order/OrderMgr');
    var Logger = require('dw/system/Logger');

    var orderNotExported = OrderMgr.queryOrders('exportStatus={0}', null, 0).asList();
    var orderInfo = [];         
    for (var i in orderNotExported){
        orderInfo.push({
            orderNumber : orderNotExported[i].orderNo,
            customerName :  orderNotExported[i].customerName,
            customerNo : orderNotExported[i].customerNo,
            customerEmail : orderNotExported[i].customerEmail,
            creationDate : orderNotExported[i].creationDate,
            orderTotalAmount : orderNotExported[i].totalGrossPrice,
        });    
    };

    
    if(orderInfo.length > 0) {
        var brandsImport = new File(File.IMPEX + "/src/exports/orders-notexported.xml");
        var fileWriter = new FileWriter(brandsImport, "UTF-8");
        var xsw = new XMLStreamWriter(fileWriter);

        xsw.writeStartDocument();
        xsw.writeStartElement('orders');
            xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/catalog/2006-10-31');

            for(var l in orderInfo) {
                xsw.writeStartElement('order');
                    xsw.writeAttribute('order-no', orderInfo[i].orderNumber);
                    xsw.writeStartElement('customer-name');
                        xsw.writeCharacters(orderInfo[l].customerName);
                    xsw.writeEndElement();
                    xsw.writeStartElement('customer-no');
                        xsw.writeCharacters(orderInfo[l].customerNo);
                    xsw.writeEndElement();
                    xsw.writeStartElement('customer-email');
                        xsw.writeCharacters(orderInfo[l].customerEmail);
                    xsw.writeEndElement();
                    xsw.writeStartElement('order-date');
                        xsw.writeCharacters(orderInfo[l].creationDate);
                    xsw.writeEndElement();
                    xsw.writeStartElement('gross-price');
                        xsw.writeCharacters(orderInfo[l].orderTotalAmount);
                    xsw.writeEndElement();
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
    getOrders: getOrders
};
