;
(function($) {
    $.fn.cdzQuickshop = function(options) {
        var defaultConfig = {
            iframe: '#cdz-qsiframe',
            loader: '.ajax-load-wrapper',
            afterLoad: null
        };
        var conf = $.extend({}, defaultConfig, options);
        $(this).each(function() {
            var showQuickView = function() {
                var $iframe = $(conf.iframe);
                var $loader = $iframe.find(conf.loader);
                $iframe.on('show.bs.modal', function(e) {
                    var url = window.quickshopUrl;
                    url = url.replace('https:', '').replace('http:', '');
                    $iframe.find('.product-content').empty();
                    $loader.show();
                    jQuery.ajax({
                        url: url,
                        type: 'POST',
                        data: {
                            curUrl: conf.curUrl
                        },
                        dataType: "html",
                        success: function(res) {
                            $loader.hide();
                            var $dialog = $iframe.find('.modal-dialog');
                            $dialog.html(res);
                            $dialog.show();
                            $dialog.trigger('animated');
                            $dialog.trigger('product-media-loaded');
                            $(window).trigger('quickviewLoad');
                            if (typeof conf.afterLoad == 'function') {
                                setTimeout(conf.afterLoad, 300);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {}
                    }).always(function() {
                        $loader.hide();
                    });
                });
                $iframe.on('hide.bs.modal', function(e) {
                    $iframe.find('.modal-dialog').hide();
                    $iframe.find('.product-content *').removeData();
                    $iframe.find('.product-content').empty();
                    swatchesConfig = undefined;
                    optionsPrice = undefined;
                });
            };
            showQuickView();
            $('body').on('click', '[data-target="#cdz-qsiframe"]', function(e) {
                window.quickshopUrl = $(e.target).data('url');
            });
        });
    }
})(jQuery);