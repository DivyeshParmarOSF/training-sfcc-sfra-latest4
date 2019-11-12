'use strict';
var URLUtils = require('dw/web/URLUtils');
var endpoints = require('*/cartridge/config/oAuthRenentryRedirectEndpoints');
 

/**
 * Send an email that would notify the user that account was edited
 * @param {obj} profile - object that contains user's profile information.
 */
function sendNewsletterEmail(subscribeUser, couponCode) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var userObject = {
        firstName: subscribeUser.firstName.value,
        lastName: subscribeUser.lastName.value,
        email : subscribeUser.email.value,
        couponCode : couponCode,
        url: URLUtils.https('Newsletter-Show')
    };

    var emailObj = {
        to: subscribeUser.email.value,
        subject: Resource.msg('newsletter.success.message', 'login', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
        type: emailHelpers.emailTypes.accountEdited
    };

    emailHelpers.sendEmail(emailObj, 'account/components/newsletterEmail', userObject);
}

module.exports = {
    sendNewsletterEmail : sendNewsletterEmail
};
