;
(function($) {
    var cdzFilterProducts = Class.create();
    cdzFilterProducts.prototype = {
        curPage: 1,
        element: null,
        options: {
            element: $('[data-role="cdz_product_list"]'),
            jsonData: null,
            trigger: '.cdz-ajax-trigger',
            ajaxLoader: '.ajax-loader',
            itemsWrap: '.product-items',
            ajaxUrl: null,
            jsonData: {},
            currentUrl: null,
            lastPage: 100
        },
        initialize: function(options) {
            this.options = Object.extend(this.options, options || {});
            var self = this;
            this.element = this.options.element;
            if (self.options.lastPage <= self.curPage) {
                self.element.find(self.options.trigger).hide();
            }
            this.element.find(self.options.trigger).click(function() {
                self.ajaxLoadProducts();
            });
        },
        ajaxLoadProducts: function() {
            var self = this;
            var config = this.options;
            var $trigger = self.element.find(config.trigger);
            var $ajaxLoader = self.element.find(config.ajaxLoader);
            var hasLastPage = false;
            $trigger.hide();
            $ajaxLoader.show();
            self.curPage++;
            config.jsonData.cur_page = self.curPage;
            config.jsonData.current_url = config.currentUrl;
            $.ajax({
                url: config.ajaxUrl,
                type: "POST",
                data: config.jsonData,
                cache: false,
                success: function(res) {
                    if (typeof res.html !== 'undefined') {
                        self.element.find(config.itemsWrap).first().append(res.html);
                    } else {
                        self.element.find(config.itemsWrap).first().append(JSON.parse(res).html);
                    }
                    if (config.lastPage <= self.curPage) {
                        hasLastPage = true;
                    }
                    if (self.element.parents('.codazon-ajax-wrap').length > 0) {
                        self.element.parents('.codazon-ajax-wrap').trigger('contentUpdated');
                    }
                    self.element.trigger('contentUpdated');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus);
                }
            }).always(function() {
                $ajaxLoader.hide();
                if (!hasLastPage) {
                    $trigger.show();
                } else {
                    $trigger.hide();
                }
            });
        }
    }
    $.fn.cdzLoadProductBlock = function(options) {
        $(this).each(function() {
            var $this = $(this);
            var scrollEvent = 'scroll.' + options.eventName;
            var clickEvent = 'shown.bs.tab';
            var $tabTrigger = false;
            var loadProductByAjax = function() {
                var wrapTop = $this.offset().top;
                var scrollTop = jQuery(window).scrollTop();
                var winHeight = jQuery(window).height();
                //if( (scrollTop + winHeight) >= wrapTop ){
                if ((!$this.hasClass('loaded')) && $this.is('*:visible')) {
                    $this.addClass('loaded');
                    var $loader = $this.find('.codazon-loader-wrap');
                    $loader.show();
                    jQuery.ajax({
                        url: options.loadProductsUrl,
                        type: 'POST',
                        data: options.postData,
                        cache: false,
                        success: function(res) {
                            $loader.hide(200, 'linear', function() {
                                if (typeof res.html !== 'undefined') {
                                    $this.append(res.html);
                                } else {
                                    $this.append(JSON.parse(res).html);
                                }
                                $this.trigger('contentUpdated');
                            });
                            $(document).unbind(scrollEvent);
                            if ($tabTrigger) {
                                $tabTrigger.off(clickEvent, loadProductByAjax);
                            };
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {}
                    }).always(function() {
                        $loader.hide();
                    });
                }
                //}	
            }

            loadProductByAjax();
            $(document).bind(scrollEvent, function() {
                loadProductByAjax();
            });
            if ($this.parents('.nav-tab-content').length) {
                var $pr = $this.parents('.nav-tab-content').parent();
                var tabId = $this.parents('.tab-pane').attr('id');
                $tabTrigger = $pr.find('a[href="#' + tabId + '"]');
                $tabTrigger.on(clickEvent, loadProductByAjax);
            };
            if ($this.parents('.cdz-tabs').length) {
                var $pr = $this.parents('.cdz-tabs').first();
                var tabId = $this.parents('.tab-pane').first().attr('id');
                $tabTrigger = $pr.find('a[href="#' + tabId + '"]');
                $tabTrigger.on('click.productajaxload',
                    function() {
                        setTimeout(loadProductByAjax, 400);
                        $tabTrigger.off('click.productajaxload');
                    }
                );
            };
        });
    };

    $.fn.cdzFilterProducts = function(options) {
        var $this = $(this);
        options.element = $this;
        new cdzFilterProducts(options);
    };
    $.fn.switchSliderGrid = function(options) {
        var $this = $(this);

        function mobileSlider($this) {
            if (!$this.hasClass('owl-carousel')) {
                $this.addClass('owl-carousel owl-theme');
                $this.owlCarousel({
                    loop: false,
                    margin: (options.carousel.margin) ? options.carousel.margin : 0,
                    responsiveClass: true,
                    nav: true,
                    dots: false,
                    responsive: options.carousel.responsive
                });
            }
        };

        function pcGrid($this) {
            if ($this.hasClass('owl-carousel')) {
                $this.data('owl.carousel').destroy();
                $this.removeClass('owl-carousel owl-loaded owl-theme owl-hidden');
                $this.find('.owl-stage-outer').children().unwrap();
                $this.removeData('owl.carousel');
            }
        };

        function pcMedia() {
            if (options.media) {
                var $media = $this.find('.media-slider');
                $media.addClass('owl-carousel owl-theme');
                $media.owlCarousel({
                    dots: false,
                    nav: true,
                    responsive: options.media.responsive
                });
            }
        };

        function mobileMedia() {
            if (options.media) {
                var $media = $this.find('.media-slider');
                pcGrid($media);
            }
        };
        var curWinWidth = $(window).width();
        if (curWinWidth < 768) {
            mobileSlider($this);
            mobileMedia();
        } else {
            pcGrid($this);
            pcMedia();
        }
        $(window).bind('cdz_mobile', function() {
            mobileSlider($this);
            mobileMedia();
        });
        $(window).bind('cdz_pc', function() {
            pcGrid($this);
            pcMedia();
        });
    }
    window.changeCartQty = function(obj, qty) {
        var $obj = $(obj),
            $pr = $obj.parents('.cart-qty').first(),
            $qtyInput = $('input.qty', $pr),
            curQty = $qtyInput.val() ? parseInt($qtyInput.val()) : 0;
        curQty += qty;
        if (curQty < 1) curQty = 1;
        $qtyInput.val(curQty);
    }
})(jQuery);