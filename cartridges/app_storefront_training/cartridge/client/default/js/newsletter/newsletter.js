'use strict';

var formValidation = require('../components/formValidation');
var createErrorNotification = require('../components/errorNotification');

function getNewsletterModal() {
    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="NewsletterModal" tabindex="-1" role="dialog">'
        + '<span class="enter-message sr-only" ></span>'
        + '<div class="modal-dialog quick-view-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + '<h3>Confirm Subscription</h3>'
        + '    <button type="button" class="close pull-right" data-dismiss="modal">'
        + '        <span aria-hidden="true">&times;</span>'
        + '        <span class="sr-only"> </span>'
        + '    </button>'
        + '</div>'
        + '<div class="modal-body">'
        + '     <p>Please click OK to confrim your subscription</p>'
        +'</div>'
        + '<div class="modal-footer">'
        + '     <button type="button" class="btn-cancel btn-primary btn btn-default pull-right" data-dismiss="modal">'
        + '        <span aria-hidden="true">Cancel</span>'
        + '    </button>'
        + '     <button type="button" class="btn-success btn btn-default pull-right">'
        + '        <span aria-hidden="true">Yes</span>'
        + '    </button>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    
    $('body').append(htmlString);
    $('#NewsletterModal').modal({
        backdrop: 'static',
        keyboard: false
    })
} 
function getAlertMsgError() {
    var alertMsgError = '<!-Alert Message Failed ->'
        + '<div class="alert alert-danger" role="alert">'
        +   'Newsletter Regisgration Failed'
        + '</div>';
    $('form.newsletter').prepend(alertMsgError);
}
 
module.exports = {
    newsletter: function() {
        $('body').on('click',' #NewsletterModal .btn-success' , function(e) {     
            var form = $('form.newsletter');
            var url = form.attr('action');
            form.spinner().start();
            $('form.newsletter').trigger('submit');
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: form.serialize(),
                success: function (data) {
                    if (!data.success) {
                        formValidation(form, data);
                        $('form.newsletter').trigger('newsletter:error', data);
                        $('#NewsletterModal').modal('hide');
                        form.spinner().stop();
                        getAlertMsgError();
                    } else {
                        form.spinner().start();
                        $('form.newsletter').trigger('newsletter:success', data);
                        location.href = data.redirectUrl;
                    }
                },
                error: function (data) {
                    if (data.redirectUrl) {
                        location.href = data.redirectUrl;
                    } else {
                        $('form.newsletter').trigger('newsletter:error', data);
                        form.spinner().stop();
                    }
                }
            });
            return false;
        }),
        $('form.newsletter').submit(function (e) {
            e.preventDefault();
            getNewsletterModal();
            $('#NewsletterModal').modal('show');
        });
    },
   
    login: function () {
        $('form.login').submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr('action');
            form.spinner().start();
            $('form.login').trigger('login:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: form.serialize(),
                success: function (data) {
                    form.spinner().stop();
                    if (!data.success) {
                        formValidation(form, data);
                        $('form.login').trigger('login:error', data);
                    } else {
                        $('form.login').trigger('login:success', data);
                        location.href = data.redirectUrl;
                    }
                },
                error: function (data) {
                    if (data.responseJSON.redirectUrl) {
                        window.location.href = data.responseJSON.redirectUrl;
                    } else {
                        $('form.login').trigger('login:error', data);
                        form.spinner().stop();
                    }
                }
            });
            return false;
        });
    },

    register: function () {
        $('form.registration').submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr('action');
            form.spinner().start();
            $('form.registration').trigger('login:register', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: form.serialize(),
                success: function (data) {
                    form.spinner().stop();
                    if (!data.success) {
                        formValidation(form, data);
                    } else {
                        location.href = data.redirectUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    } else {
                        createErrorNotification($('.error-messaging'), err.responseJSON.errorMessage);
                    }

                    form.spinner().stop();
                }
            });
            return false;
        });
    },

    resetPassword: function () {
        $('.reset-password-form').submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr('action');
            form.spinner().start();
            $('.reset-password-form').trigger('login:register', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: form.serialize(),
                success: function (data) {
                    form.spinner().stop();
                    if (!data.success) {
                        formValidation(form, data);
                    } else {
                        $('.request-password-title').text(data.receivedMsgHeading);
                        $('.request-password-body').empty()
                            .append('<p>' + data.receivedMsgBody + '</p>');
                        if (!data.mobile) {
                            $('#submitEmailButton').text(data.buttonText)
                                .attr('data-dismiss', 'modal');
                        } else {
                            $('.send-email-btn').empty()
                                .html('<a href="'
                                    + data.returnUrl
                                    + '" class="btn btn-primary btn-block">'
                                    + data.buttonText + '</a>'
                                );
                        }
                    }
                },
                error: function () {
                    form.spinner().stop();
                }
            });
            return false;
        });
    },

    clearResetForm: function () {
        $('#login .modal').on('hidden.bs.modal', function () {
            $('#reset-password-email').val('');
            $('.modal-dialog .form-control.is-invalid').removeClass('is-invalid');
        });
    }
};
