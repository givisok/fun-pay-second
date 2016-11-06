var App = App || {};

(function (App, $) {
    /**
     *
     * @returns {boolean}
     */
    $.fn.isScrollable = function () {
        return this.get(0).scrollHeight > this.height();
    };

    App.debug = true;//false for production
    App.modal = function () {
        var modalSelector, modalHeader, modalBody, modalFooter, modalContent, scrollBarWidth;

        $(document).ready(function () {
            modalSelector = $('#test-modal');
            scrollBarWidth = App.helpers.scrollBarWidth();
            modalContent = modalSelector.find('.modal-content');
            modalHeader = modalSelector.find('#test-modal-header');
            modalBody = modalSelector.find('.modal-body');
            modalFooter = modalSelector.find('.modal-footer');

            modalSelector.on('hidden.bs.modal', function () {
                modalHeader.html('');
                modalBody.html('');
                modalSelector.css("padding-left", "");
                modalContent.removeClass().addClass('modal-content');
                modalSelector.off('shown.bs.modal');
            })
        });

        function fixScrollBarBug() {
            if (modalSelector.isScrollable()) {
                modalSelector.css("padding-left", scrollBarWidth);
            } else {
                modalSelector.css("padding-left", '');
            }
        }

        return {
            show: function () {
                modalSelector.modal('show');
            },
            hide: function () {
                modalSelector.modal('hide');
            },
            setBody: function (data) {
                if (!modalSelector.hasClass('in')) {
                    modalSelector.on('shown.bs.modal', function () {
                        modalBody.html(data);
                        fixScrollBarBug();
                    });
                } else {
                    modalBody.html(data);
                    fixScrollBarBug();
                }
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
                return;
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
        },
        isCallback: function (callback) {
            return typeof callback === 'function';
        },
        scrollBarWidth: function () {
            var outer = $('<div>');
            var body = $('body');
            outer.css({
                "visibility": "hidden",
                "width": "100px"
            });
            body.append(outer);
            var widthNoScroll = outer.outerWidth();
            outer.css({"overflow": "scroll"});
            var inner = $('<div>');
            inner.css("width", "100%");
            outer.append(inner);
            var widthWithScroll = inner.outerWidth();
            outer.remove();

            return widthNoScroll - widthWithScroll;
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
