if (typeof Codazon == 'undefined') {
    var Codazon = {}
    Codazon.ajaxCartPro = {
        enable: true
    };
}
(function($) {
    var cartId = 'footer-cart';
    $.fn.ajaxCartEffect = function(options) {
        var defaultConfig = {
            img: '.product-image img',
            parent: '.item',
            effImg: '#effectImg',
            dest: '#footer-cart .cart-icon',
            fCart: '#footer-cart',
            form: '#product_addtocart_form',
        };

        var conf = Object.extend(defaultConfig, options || {});
        $(this).each(function() {
            var $this = $(this);
            if (!$this.data('hasBindEffect')) {
                $this.data('hasBindEffect', true);
                $this.click(function() {
                    var $pr = $this.parents(conf.parent).first();
                    if ($pr.length == 0) {
                        return false;
                    }
                    globalFlyImage($pr, conf);
                });
            }
        });
    };
    window.toggleCartEditor = function() {
        var $fCart = $('#' + cartId);
        $fCart.find('.cart-item').each(function(index, element) {
            var $cartItem = $(this);
            $cartItem.find('.product').first().click(function(e) {
                e.stopPropagation();
                if ($cartItem.hasClass('active')) {
                    $cartItem.removeClass('active');
                } else {
                    $fCart.find('.cart-item.active').removeClass('active');
                    $cartItem.addClass('active');
                }
            });
        });
    }
    var globalFlyImage = function($pr, options) {
        var defaultConfig = {
            img: '.product-image img',
            dest: '#footer-cart .cart-icon',
            fCart: '#footer-cart'
        };

        var conf = Object.extend(defaultConfig, options || {});

        var $effImg = $('<img class="animated flipInY" style="display:none; position:absolute; z-index:100000"/>');
        $('body').append($effImg);

        var $img = false;
        $pr.find(conf.img).each(function() {
            if (!$(this).hasClass('hidden')) {
                $img = $(this);
                return false;
            }
        });
        if (!$img) return false;
        var src = $img.attr('src');
        var width = $img.width(),
            height = $img.height();
        var step01Css = {
            top: $img.offset().top,
            left: $img.offset().left,
            width: width,
            height: height
        }
        $effImg.attr('src', src);
        $effImg.css(step01Css);
        $effImg.fadeIn(200);

        var $fCart = $(conf.fCart);
        var $dest = $(conf.dest);
        var flyImage = function() {
            var newWidth = 0.1 * width,
                newHeight = 0.1 * height;
            var step02Css = {
                top: $dest.offset().top,
                left: $dest.offset().left,
                width: newWidth,
                height: newHeight
            }
            $effImg.animate(step02Css, 1000, 'linear', function() {
                $effImg.fadeOut(200, 'linear', function() {
                    $effImg.replaceWith('');
                });
            });
        }

        if (!$dest.is('*:visible')) {
            $fCart.addClass('active');
            var $cartContent = $fCart.find('.cart-content');
            $cartContent.css({
                minHeight: 0
            }).slideDown(300, function() {
                $cartContent.css({
                    minHeight: ''
                });
                flyImage();
            });
        } else {
            flyImage();
        }
    }
    var bindEffectEvent = function() {
        var $fCart = $('#' + cartId);
        if ($('#footer-cart').length == 0) {
            var html = '<div class="footer-cart cdz-dropdown" id="' + cartId + '" style="position:fixed; bottom:0; left:0; width:100%; z-index:10000; background:#FFF;"></div>';
            $('body').append(html);
            var $fCart = $('#' + cartId);
            $('#cart-footer-inner').appendTo('#' + cartId);
            $fCart.find('.cart-content').hide();
        }

        $('.btn-cart').ajaxCartEffect();
        toggleCartEditor();
        $(window).on('ajaxCartCompleted getConfigurableOptionsCompleted', function() {
            $fCart.find('.loading').hide();
            $fCart.find('.loaded').show();
        });
        $(window).on('ajaxCartFormAdding', function(e, form) {
            var $form = $(form);
            globalFlyImage($form);
        })
        $(window).on('ajaxCartFormAdding ajaxCartBegin getConfigurableOptionsBegin', function() {
            $fCart.find('.loading').show();
            $fCart.find('.loaded').hide();
        });
        $(window).on('swatchUpdateImage', function(e, swatchImageUrl) {
            if ($('#ajaxcart-img').length > 0) {
                $('#ajaxcart-img').attr('src', swatchImageUrl);
            }
        });
        $fCart.find('.cart-trigger').click(function() {
            var $this = $(this);
            $fCart.toggleClass('active');
            var $cartContent = $fCart.find('.cart-content');
            $cartContent.css({
                minHeight: 0
            }).slideToggle(300, function() {
                $cartContent.css({
                    minHeight: ''
                });
            });
        });
        $('html,body').click(function(e) {
            if ($(e.target).parents('.cart-item.active').length == 0) {
                var $cartItem = $fCart.find('.cart-item.active');
                $cartItem.removeClass('active');
            }
        });
    }
    $(document).ready(function() {
        if (Codazon.ajaxCartPro.enable) {
            bindEffectEvent();
        }
    });
})(jQuery)