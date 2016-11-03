var App = App || {};

(function (App, $) {
    /**
     * Insert html with animation or not :)
     * @param data
     * @param animate - bool show with animation
     * @returns {jQuery}
     */
    $.fn.putHtml = function (data, animate) {
        var currentObject = this;
        if (animate) {
            var promise = currentObject.fadeOut(400).promise();
            promise.done(function () {
                currentObject.html(data);
                currentObject.fadeIn(400);
            });
        } else {
            currentObject.html(data);
        }

        return this;
    };

    App.debug = true;//false for production
    App.modal = function () {
        var modalSelector, modalHeader, modalBody, modalFooter, modalContent;

        $(document).ready(function () {
            modalSelector = $('#test-modal');
            modalContent = modalSelector.find('.modal-content');
            modalHeader = modalSelector.find('#test-modal-header');
            modalBody = modalSelector.find('.modal-body');
            modalFooter = modalSelector.find('.modal-footer');

            modalSelector.on('hidden.bs.modal', function () {
                modalHeader.html('');
                modalBody.html('');
                modalContent.removeClass().addClass('modal-content');
            })
        });

        return {
            show: function () {
                modalSelector.modal('show');
            },

            hide: function () {
                modalSelector.modal('hide');
            },

            setBody: function (data) {
                modalBody.putHtml(data, true);
            },

            setHeader: function (data) {
                modalHeader.html(data);
            },

            setFooter: function (data) {
                modalFooter.html(data);
            },

            showPreLoader: function () {
                var preLoader = '<div class="row"><div class="center-block col-md-2 pre-loader-center"><img src="images/ajax-loader.gif"></div></div>';
                modalBody.html(preLoader);
            },

            setError: function (errorText) {
                App.modal.setHeader('Error');
                modalContent.addClass('modal-error');
                var errorMessage = '<div class="alert" role="alert">';
                errorMessage += '<strong>If the problem persists please contact us support@hell.yeah</strong>';
                if (App.debug) {
                    errorMessage += '<br><br>' + errorText;
                }
                errorMessage += '</div>';
                App.modal.setBody(errorMessage);
            }
        }
    }();

    App.test = {
        testFunction: function (url) {
            App.modal.setHeader('Loading...');
            App.modal.showPreLoader(false);
            App.modal.show();

            try {
                var request = App.request.make({url: url});
            } catch (e) {
                App.modal.setError(e.toString());
            }

            request.done(function (data) {
                if (data) {
                    App.modal.setHeader('Some header');
                    App.modal.setBody(data);
                } else {
                    App.modal.setError('Empty answer!');
                }
            });

            request.fail(function (jqXHR, textStatus, errorThrown) {
                App.modal.setError('Request error:' + jqXHR.status + ' ' + errorThrown);
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
