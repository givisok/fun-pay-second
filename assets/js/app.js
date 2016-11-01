var App = App || {};

(function (App, $) {
    App.debug = true;//false for production
    App.modal = function () {
        var modalSelector, modalHeader, modalBody, modalFooter;

        $(document).ready(function () {
            modalSelector = $('#test-modal');
            modalHeader = modalSelector.find('#test-modal-header');
            modalBody = modalSelector.find('.modal-body');
            modalFooter = modalSelector.find('.modal-footer');
        });

        return {
            show: function () {
                return modalSelector.modal('show');
            },

            hide: function () {
                return modalSelector.modal('hide');
            },

            setBody: function (data) {
                modalBody.html(data);
            },

            setHeader: function (data) {
                modalHeader.html(data);
            },

            setFooter: function (data) {
                modalFooter.html(data);
            },

            showPreLoader: function () {
                this.setBody('<div class="center-block"><img src="images/ajax-loader.gif"></div>');
            }
        }
    }();

    App.test = {
        testFunction: function (url) {
            App.modal.setHeader('Loading...');
            App.modal.showPreLoader();
            App.modal.show();

            function showError(errorText) {
                App.modal.setHeader('Error');

                var errorMessage = ' <strong>If the problem persists please contact us support@hell.yeah</strong>';
                if (App.debug) {
                    errorMessage += '<br><br>' + errorText;
                }
                App.modal.setBody(errorMessage);
            }

            try {
                var request = App.request.make({url: url});
            } catch (e) {
                showError(e.toString());
            }

            request.done(function (data) {
                if(data) {
                    App.modal.setHeader('Header');
                    App.modal.setBody(data);
                } else {
                    showError('Empty answer!');
                }
            });

            request.fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.statusCode());
                showError('Request error:' + jqXHR.statusCode() + errorThrown);
            });
        }
    };

    App.helpers = {
        isString: function (value) {
            return (typeof value === 'string' || value instanceof String);
        },
        isObject: function (value) {
            return (value === Object(value));
        },
        setDefaultValue: function (value, defaultValue) {
            return typeof value !== 'undefined' ? value : defaultValue;
        }
    };

    App.request = {
        /**
         * @throws error
         * @param params - ajax params {url, method, data}
         */
        make: function (params) {

            if (!App.helpers.isObject(params)) {
                throw new TypeError('Bad params type. Wait type object, but ' + typeof params + ' given');
            }

            if (!App.request.validateUrl(params.url)) {
                throw new Error('Url invalid');
            }

            params.method = App.helpers.setDefaultValue(params.method, 'GET');
            var availMethods = ['GET', 'POST', 'DELETE', 'PUT'];
            if (!App.helpers.isString(params.method) || availMethods.indexOf(params.method) === -1) {
                throw new Error('Method invalid');
            }

            params.data = App.helpers.setDefaultValue(params.data, {});
            if (!App.helpers.isObject(params.data)) {
                throw new TypeError('Bad params type. Wait type object, but ' + typeof params.data + ' given');
            }

            return $.ajax({
                url: params.url,
                method: params.method,
                data: params.data
            });
        },

        /**
         *
         * @param url
         * @returns {boolean}
         */
        validateUrl: function (url) {

            if (!App.helpers.isString(url)) {
                throw new TypeError('Bad url type. Wait type string, but ' + typeof url + ' given');
            }

            var urlRegExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

            return urlRegExp.test(url);
        }
    };
})(App, jQuery);

//# sourceMappingURL=app.js.map
