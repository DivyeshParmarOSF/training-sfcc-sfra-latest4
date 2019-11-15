'use strict';

var server = require('server');

var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');      
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var CouponMgr = require('dw/campaign/CouponMgr');
var newsletterForm = server.forms.getForm('newsletter');
var newsletterEmailHelpers = require('../scripts/helpers/newsletterHelpers');

server.get('Show', function (req, res, next) {   
    var formInfo = res.getViewData();  
    var navTabValue = req.querystring.action; 
    newsletterForm.clear();
    res.render('/account/newsletter', {
        navTabValue: 'login',
        newsletterForm : newsletterForm                   
    });
    next();
    }
);

server.post('Subscribe', function (req, res, next) {  
    var newsletterForm = server.forms.getForm('newsletter');
    res.setViewData(newsletterForm);
    var formInfo = res.getViewData();
    //var emailExist = CustomObjectMgr.createCustomObject('SFRA_Newsletter', formInfo.email.value);
    
    try {
        if (newsletterForm.valid) {
            Transaction.begin();
            var formInfo = res.getViewData();
            var newsletterCoupon = CouponMgr.getCoupon('newsletterCopan');
            var couponCode = newsletterCoupon.getNextCouponCode();
            var newsletter = CustomObjectMgr.createCustomObject('SFRA_Newsletter', formInfo.email.value);
                newsletter.custom.firstName = formInfo.firstName.value;
                newsletter.custom.lastName = formInfo.lastName.value;
                newsletter.custom.coupanCode = couponCode; 
            Transaction.commit();
            newsletterEmailHelpers.sendNewsletterEmail(formInfo,couponCode);
            res.json({
                success: true,
                redirectUrl: URLUtils.url('Home-Show').toString()                
            });
            // res.render('account/newsletterSuccess');
        return next();
        } 
    } catch(e) {
        Transaction.rollback();
        res.json({
            success: false,
            redirectUrl: URLUtils.url('Newsletter-Show').toString()                
        });
        //res.render('/account/newsletterError');
        return next();
    }
   
});

module.exports = server.exports();
