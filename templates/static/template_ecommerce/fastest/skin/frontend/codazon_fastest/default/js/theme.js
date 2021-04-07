if (typeof Codazon == 'undefined') {
    var Codazon = {}
    Codazon.ajaxCartPro = {
        enable: true
    };
};
(function($) {
    var curWinWidth = $(window).prop('innerWidth');
    var adapt = 768;
    /*Label form effect*/
    window.fieldLabelEffect = function() {
        var list = '.form-list input[type=text].input-text,.form-list input[type=password].input-text,.form-list textarea.input-text';
        $('.form-list select').each(function() {
            var $select = $(this);
            $select.parents('.field,.wide').addClass('field-select-box');
        });
        $(list).each(function() {
            var $input = $(this);
            var $parent = $input.parents('.field,.wide,li').first();
            $parent.addClass('active');
            var eventId = Math.round(Math.random() * 100000);
            $('body').on('click.input_' + eventId, function(e) {
                if (!$(e.target).is($input)) {
                    if ($input.val() != '') {
                        $parent.addClass('active');
                    } else {
                        $parent.removeClass('active');
                    }
                    $('body').off('click.input_' + eventId);
                }
            });
            $input.focus(function() {
                $parent.addClass('active');
            }).blur(function() {
                if ($input.val() == '') {
                    $parent.removeClass('active');
                }
            });
            var checkBrowserFilled = function() {
                if ($input.val() != '') {
                    $parent.addClass('active');
                    $input.off('change.checkbrowserfilled', checkBrowserFilled);
                }
            };
            $input.on('change.checkbrowserfilled', checkBrowserFilled);
        });
        if (document.location.href.search('checkout/onepage') !== -1) {
            window.scrollTo(0, 0);
        }
    };
    window.goToSection = function(id, distance, transitionTime, hasTab) {
        var $target = $('#' + id);
        var go = function() {
            var top = $target.offset().top + distance;
            $('body,html').animate({
                scrollTop: top
            }, transitionTime);
            return false;
        }
        if (!$target.is('*:visible')) {
            var $tabPane = $target.parents('.tab-pane');
            var tabId = $tabPane.attr('id');
            $tabLink = $tabPane.parent().prev().find('a[href="#' + tabId + '"]');
            $tabLink.click();
            setTimeout(go, 300);
        } else {
            go();
        }
    }
    window.setUpMediaSlider = function(slideHander, thumbStyle) {
        var $slider = $(slideHander);
        var totalSlides = $slider.find('.rsImg').length;
        var timeoutId = false;
        $slider.royalSlider({
            fullscreen: {
                enabled: true,
                nativeFS: false,
            },
            deeplinking: {
                enabled: true
            },
            controlNavigation: 'thumbnails',
            thumbs: {
                orientation: thumbStyle,
                paddingBottom: 0,
                firstMargin: false,
                appendSpan: true,
                autoCenter: false,
                spacing: 10,
            },
            imageScaleMode: 'none',
            imageAlignCenter: false,
            autoScaleSlider: false,
            usePreloader: true,
            numImagesToPreload: 100,
            transitionType: 'move',
            imageScalePadding: 0,
            autoHeight: false,
            loop: true,
            arrowsNav: true,
            margin: '0px auto',
            keyboardNavEnabled: true,
            addActiveClass: true
        });
        var $curMainSlide = $slider.find('.rsSlide').first();
        $curMainSlide.addClass('product-image');
        var slider = $slider.data('royalSlider');
        var timeout = false;
        var curId;
        var setZoomForActiveSlide = function($rsActiveSlide) {
            if (typeof $rsActiveSlide === 'undefined') {
                $rsActiveSlide = $curMainSlide;
            }
            var $rsInner = $rsActiveSlide.find('.rs-inner');
            if ($rsInner.length == 0) {
                var $rsInner = $('<div class="rs-inner"></div>');
                $('.rsContent', $rsActiveSlide).append($rsInner);
                $('.rsMainSlideImage', $rsActiveSlide).appendTo($rsInner);
                $('.magnify', $rsActiveSlide).appendTo($rsInner);
            }
            if ((!$rsInner.data('cdzZoom')) || ($rsActiveSlide.data('tempImage'))) {
                $rsInner.off('mousemove.cdzZoom');
                $rsInner.off('mouseleave.cdzZoom');
                $rsInner.cdzZoom();
                $rsActiveSlide.data('tempImage', false);
            }
        }
        var zoomImage = function() {
            $slider.find('.rsSlide .rsContent').each(function(index, element) {
                var $pr = $(this).parent();
                setZoomForActiveSlide($pr);
            });
        }
        $.fn.returnImageSrc = function() {
            $(this).each(function() {
                var $this = $(this);
                $this.click(function() {
                    if (!$slider.hasClass('rsFullscreen')) {
                        var src = $this.find('.rsNavSelected img').data('rsmainimg');
                        var $rsActiveSlide = $slider.find('.rsActiveSlide');
                        $('.rsMainSlideImage', $rsActiveSlide).attr('src', src);
                        $('.magnify', $rsActiveSlide).css({
                            background: 'url(' + src + ') no-repeat'
                        });
                        if ($curMainSlide.data('tempImage')) {
                            setZoomForActiveSlide();
                        }
                    }
                });
            });
        };
        var builSlider = function() {
            $slider.find('.rsSlide').removeClass('product-image');
            $curMainSlide = $slider.find('.rsActiveSlide');
            var $newImg = $curMainSlide.find('.rsMainSlideImage');
            $curMainSlide.addClass('product-image');
            var $curThumb = $slider.find('.rsNavSelected img.rsTmb');
            if (!$slider.hasClass('rsFullscreen')) {
                if ($curThumb.data('rsmainimg') != '') {
                    $newImg.attr('src', $curThumb.data('rsmainimg'));
                }
                setZoomForActiveSlide();
            }
        };
        var setSliderHeight = function() {
            if (!$slider.hasClass('rsFullscreen')) {
                var $mainImg = $slider.find('.rsActiveSlide .rsMainSlideImage');
                var height = $mainImg.height();
                $slider.height(height);
                $slider.find('.rsOverflow').height(height);
            }
        }
        slider.ev.on('rsAfterSlideChange', function(event) {
            builSlider();
        });
        slider.ev.on('rsAfterContentSet', function(e, slideObject) {
            $slider.find('.rsThumbs').returnImageSrc();
        });
        slider.ev.on('rsExitFullscreen', function() {
            $slider.addClass('no-fullscreen');
            $slider.find('.rsThumbs').returnImageSrc();
            var src = $slider.find('.rsNavSelected img').data('rsmainimg');
            $slider.find('.rsActiveSlide .magnify').css({
                background: 'url(' + src + ') no-repeat'
            });
            zoomImage();
        });
        slider.ev.on('rsAfterContentSet', function() {
            setTimeout(function() {
                zoomImage();
                setSliderHeight();
            }, 300);
        });
        slider.ev.on('rsEnterFullscreen', function() {
            $slider.removeClass('no-fullscreen');
            var height = $slider.find('.rsOverflow').height() + 'px';
            setTimeout(function() {
                $slider.find('.rsImg').css({
                    'max-height': height
                });
            }, 200);
        });
        $(window).on('swatchUpdateImage', function(event, swatchImageUrl) {
            if (!$slider.hasClass('rsFullscreen')) {
                var $productImg = $curMainSlide.find('img.rsMainSlideImage');
                $productImg.attr('src', swatchImageUrl);
                $curMainSlide.find('.magnify').css({
                    background: 'url(' + swatchImageUrl + ') no-repeat'
                });
                var $rsInner = $productImg.parents('.rs-inner');
                $rsInner.off('mousemove.cdzZoom');
                $rsInner.off('mouseleave.cdzZoom');
                $rsInner.cdzZoom();
                $curMainSlide.data('tempImage', true);
            }
        });
        $(window).on('resize', function() {
            setTimeout(function() {
                setSliderHeight();
                if ($slider.hasClass('rsFullscreen')) {
                    $slider.find('.rsOverflow').height('');
                    var height = $slider.find('.rsOverflow').height() + 'px';
                    $slider.find('.rsImg').css({
                        'max-height': height
                    });
                }
            }, 300);
        });
        if ($(window).width() < adapt) {
            slider.setThumbsOrientation('horizontal');
        }
        $(window).bind('cdz_mobile', function() {
            $slider.find('.rsOverflow').width('100%');
            slider.setThumbsOrientation('horizontal');
        });
        $(window).bind('cdz_pc', function() {
            $slider.find('.rsOverflow').width('');
            slider.setThumbsOrientation(thumbStyle);
        });
    }
    $.fn.cdzCatSearch = function(options) {
        var defaultConfig = {
            catItem: '.cat-tree > li',
            curLabel: '.current-cat',
            catInput: '#cdz-catsearch',
        };
        var config = Object.extend(defaultConfig, options || {});
        var catItem = config.catItem,
            curLabel = config.curLabel;
        catInput = config.catInput;
        $(this).each(function() {
            var $this = $(this);
            var $curLabel = $this.find(curLabel);
            $this.find(catItem).each(function() {
                var $catItem = $(this);
                $catItem.click(function() {
                    catId = $catItem.data('cat');
                    $(catInput).val(catId);
                    var text = $catItem.html();
                    $curLabel.html(text.replace(/&nbsp;/g, ''));
                });
            });
        });
    };
    $.fn.cdzToogleSidebar = function(options) {
        var defaultConfig = {
            title: 'dt',
            content: 'dd',
            onlyMobile: true
        };
        var config = Object.extend(defaultConfig, options || {});
        $(this).each(function() {
            var $this = $(this);
            var $titles = $this.find(config.title);
            if (config.onlyMobile) {
                if (curWinWidth < adapt) {
                    setup();
                }
                $(window).bind('cdz_mobile', setup);
                $(window).bind('cdz_pc', destroy);
            } else {
                setup();
            }

            function getContent($title) {
                if ($title.parent().find(config.content).length == 1) {
                    var $content = $title.parent().find(config.content);
                } else {
                    var $content = $title.next();
                }
                return $content;
            };

            function setup() {
                $titles.each(function() {
                    var $title = $(this);
                    var $content = getContent($title);
                    $content.hide();
                    $title.click(function(e) {
                        e.stopPropagation();
                        $content.slideToggle(100);
                        $title.toggleClass('active');
                    });
                });
            };

            function destroy() {
                $titles.each(function() {
                    var $title = $(this);
                    var $content = getContent($title);
                    $content.show();
                    $title.removeClass('active');
                    $title.unbind('click');
                });
            }
        });
    };
    $.fn.cdzZoom = function(options) {
        var defaultConfig = {
            mainImg: '.rsMainSlideImage',
            magnify: '.magnify'
        };
        options = Object.extend(defaultConfig, options || {});
        $(this).each(function(index, element) {
            var $this = $(this);
            var $magnify = $this.find(options.magnify);
            var $mainImg = $this.find(options.mainImg);
            var nativeWidth = 0;
            var nativeHeight = 0;
            $this.data('cdzZoom', true);
            $this.on('mousemove.cdzZoom', function(e) {
                if (!nativeWidth && !nativeHeight) {
                    var imgObject = new Image();
                    imgObject.src = $mainImg.attr('src');
                    nativeWidth = imgObject.width;
                    nativeHeight = imgObject.height;
                } else {
                    var magnifyOffset = $this.offset();
                    var mx = e.pageX - magnifyOffset.left;
                    var my = e.pageY - magnifyOffset.top;
                }
                if (mx < $this.width() && my < $this.height() && mx > 0 && my > 0) {
                    $magnify.fadeIn(100);
                } else {
                    $magnify.fadeOut(100);
                }
                if ($magnify.is(':visible')) {
                    var rx = Math.round(mx / $mainImg.width() * nativeWidth - $magnify.width() / 2) * (-1);
                    var ry = Math.round(my / $mainImg.height() * nativeHeight - $magnify.height() / 2) * (-1);
                    var bgp = rx + "px " + ry + "px";
                    var px = mx - $magnify.width() / 2;
                    var py = my - $magnify.height() / 2;
                    $magnify.css({
                        left: px,
                        top: py,
                        backgroundPosition: bgp
                    });
                }
            });
            $this.on('mouseleave.cdzZoom', function(e) {
                $magnify.fadeOut(100);
            });
        });
    };
    $.fn.builTabs = function(options) {
        var defaultConfig = {
            tabItem: '.box-collateral',
            wrapCSS: 'product-detail-tab',
            tabTitle: 'h2',
            responsive: true
        };
        conf = Object.extend(defaultConfig, options || {});
        var tabItem = conf.tabItem;
        $(this).each(function() {
            var $this = $(this);
            var tabHtml = '<div class="' + conf.wrapCSS + '">';
            var navTabId = 'cdz-nav-tab' + Math.round(1000 * Math.random());
            if (conf.responsive) {
                tabHtml += '<div class="mobile-nav-tab-dropdown visible-xs" data-target="#' + navTabId + '"></div>';
            }
            tabHtml += '<ul class="nav nav-tabs" id="' + navTabId + '"></ul>';
            tabHtml += '<div class="nav-tab-content tab-content"></div>';
            tabHtml += '</div>';
            var $container = $(tabHtml);
            $this.find('> ' + tabItem).each(function(id, el) {
                var $tabItem = $(this);
                var tabID = $tabItem.attr('id');
                var tabLink = '',
                    tabContent = '';
                if (id == 0) {
                    var activeClass = 'active';
                    $tabItem.addClass('tab-pane fade active in');
                    $('.mobile-nav-tab-dropdown', $container).html($tabItem.find(conf.tabTitle).first().text());
                } else {
                    var activeClass = '';
                    $tabItem.addClass('tab-pane fade');
                }
                tabLink += '<li class="nav-tab-item ' + activeClass + '">';
                tabLink += '<a href="#' + tabID + '" id="link-' + tabID + '" data-toggle="tab" class="data switch"></a>';
                tabLink += '</li>'
                var $tabLink = $(tabLink);
                $container.find('.nav-tabs').append($tabLink);
                $tabItem.find(conf.tabTitle).first().appendTo($tabLink.find('#link-' + tabID));
                $tabItem.appendTo($container.find('.tab-content'));
            });
            $container.appendTo($this);
        });
    }
    $.fn.showMoreGroup = function(options) {
        $(this).each(function() {
            var defaultConfig = {
                trigger: '.view-more',
                groupClass: 'group-item',
                initGroupNum: 1
            };
            var $this = $(this);
            var conf = Object.extend(defaultConfig, options || {});
            var $trigger = $this.find(conf.trigger);
            var initNum = conf.initGroupNum;
            var groupClass = conf.groupClass;
            setup();

            function setup() {
                $('.' + groupClass + ':lt(' + initNum + ')', $this).addClass('shown');
                if ($('.' + groupClass + ':not(.shown)', $this).length == 0) {
                    $trigger.hide();
                }
                $('.' + groupClass + ':not(.shown)', $this).hide();
                $trigger.click(function(e) {
                    var $newGroup = $('.' + groupClass + ':not(.shown)', $this).first();
                    $newGroup.addClass('shown');
                    $newGroup.slideDown(100);
                    if ($('.' + groupClass + ':not(.shown)', $this).length == 0) {
                        $trigger.hide();
                    }
                });
            }
        });
    }
    $.fn.dropdownMenu = function(options) {
        var defaultConfig = {
            trigger: '.cdz-trigger',
            dropdown: '.cdz-dropdown-content',
            exceptClass: null,
            hideAffterClick: false
        };
        var conf = Object.extend(defaultConfig, options || {});
        $(this).each(function() {
            var $cont = $(this);
            if (conf.exceptClass != null) {
                if ($cont.hasClass(conf.exceptClass)) {
                    return false;
                }
            }
            var $trigger = $cont.find(conf.trigger);
            var $dropdown = $cont.find(conf.dropdown);
            $trigger.addClass('dd-trigger');
            $dropdown.addClass('dd-content');
            $trigger.click(function(e) {
                e.stopPropagation();
                if (!$cont.hasClass('dd-open')) {
                    if ($('.dd-open').length > 0) {
                        var $ddopen = $('.dd-open');
                        $ddopen.find('.dd-trigger').removeClass('active');
                        $ddopen.find('.dd-content').slideUp();
                        $ddopen.removeClass('dd-open');
                    }
                }
                $cont.toggleClass('dd-open');
                $trigger.toggleClass('active');
                $dropdown.slideToggle();
            });
            $('html,body').click(function(e) {
                var $target = $(e.target);
                if (($target.parents('.dd-open').first().length == 0) || conf.hideAffterClick) {
                    $cont.find(conf.dropdown).slideUp();
                    $cont.find(conf.trigger).removeClass('active');
                    $cont.removeClass('dd-open');
                }
            });
        });
    }

    function lazyImages() {
        if (typeof $.fn.unveil !== 'undefined') {
            $('.cdz-lazy').addClass('lazy-loading');
            $('.cdz-lazy').unveil(200, function() {
                $(this).removeClass('lazy-loading');
            });
        }
    }

    function cdzSlider() {
        $('.cdz-slider').each(function() {
            var $owl = $(this);
            $owl.addClass('owl-carousel owl-theme');
            $owl.owlCarousel({
                loop: $owl.data('loop') ? $owl.data('loop') : false,
                margin: (typeof $owl.data('margin') !== 'undefined') ? $owl.data('margin') : 10,
                responsiveClass: true,
                nav: $owl.data('nav') ? $owl.data('nav') : true,
                dots: $owl.data('dots') ? $owl.data('dots') : false,
                autoplay: $owl.data('autoplay') ? $owl.data('autoplay') : false,
                responsive: {
                    0: {
                        items: $owl.data('items-0') ? $owl.data('items-0') : 1
                    },
                    320: {
                        items: $owl.data('items-320') ? $owl.data('items-320') : 3
                    },
                    480: {
                        items: $owl.data('items-480') ? $owl.data('items-480') : 4
                    },
                    768: {
                        items: $owl.data('items-768') ? $owl.data('items-768') : 5
                    },
                    1024: {
                        items: $owl.data('items-1024') ? $owl.data('items-1024') : 7
                    },
                    1280: {
                        items: $owl.data('items-1280') ? $owl.data('items-1280') : 7
                    }
                }
            })
        });
    }

    function alignMenu() {
        function alignMenuLeft() {
            $('.cdz-main-menu').each(function() {
                var $menu = $(this);
                var contPadding = (typeof $menu.data('padding') !== 'undefined') ? parseInt($menu.data('padding')) : 10;
                $(' > .groupmenu > .level-top > .groupmenu-drop', $menu).parent().hover(function() {
                    var ddMenu = $(this).children('.groupmenu-drop');
                    if ($(this).hasClass('parent')) ddMenu.css('left', 0);
                    var menuContainer = $(this).parents('.cdz-fix-left').first();
                    if (menuContainer.length) {
                        var left = menuContainer.offset().left + menuContainer.outerWidth() - (ddMenu.offset().left + ddMenu.outerWidth());
                        var leftPos = ddMenu.offset().left + left - menuContainer.offset().left;
                        if (leftPos < 0) left = left - leftPos;
                        if (left < 0) {
                            ddMenu.css('left', left - contPadding + 'px');
                        }
                    }
                }, function() {
                    $(this).children('.groupmenu-drop').css('left', '');
                });
            });
        };

        function alignMenuRight() {
            $('.cdz-main-menu').each(function() {
                var $menu = $(this);
                var contPadding = (typeof $menu.data('padding') !== 'undefined') ? parseInt($menu.data('padding')) : 10;
                $(' > .groupmenu > .level-top > .groupmenu-drop', $menu).parent().hover(function() {
                    var ddMenu = $(this).children('.groupmenu-drop');
                    if ($(this).hasClass('parent')) ddMenu.css('right', 0);
                    var menuContainer = $(this).parents('.cdz-fix-left').first();
                    if (menuContainer.length) {
                        var winWidth = $(window).width();
                        var contOffsetRight = winWidth - (menuContainer.offset().left + menuContainer.outerWidth(true));
                        var ddOffsetRight = winWidth - (ddMenu.offset().left + ddMenu.outerWidth(true));
                        var right = contOffsetRight + menuContainer.outerWidth() - (ddOffsetRight + ddMenu.outerWidth());
                        var rightPos = ddOffsetRight + right - contOffsetRight;
                        if (rightPos < 0) right = right - rightPos;
                        if (right < 0) {
                            ddMenu.css('right', right - 10 + 'px');
                        }
                    }
                }, function() {
                    $(this).children('.groupmenu-drop').css('right', '');
                });
            });
        }
        if ($('body').hasClass('cdz-rtl')) {
            alignMenuRight();
        } else {
            alignMenuLeft();
        }
    };

    function cdzTooltip() {
        $('[data-toggle="tooltip"], .cdz-tooltip').tooltip();
    }
    $.fn.sameHeightItems = function(options) {
        var defaultConfig = {
            parent: '.same-height',
            sItem: '.product-item-details, .ft-item, .cdz-post',
        };
        var conf = Object.extend(defaultConfig, options || {});
        var parent = conf.parent;
        var sItem = conf.sItem;
        $(this).each(function() {
            var processing;
            var $wrap = $(this);
            if ($wrap.find(parent).length > 0) {
                $wrap.find(parent).each(function() {
                    var $ul = $(this);
                    var setMaxHeight = function() {
                        items = sItem.split(',');
                        $(items).each(function(i, el) {
                            $ul.find(items[i]).css('height', '');
                            var maxHeight = 0;
                            $ul.find(items[i]).each(function() {
                                if ($(this).height() >= maxHeight) {
                                    maxHeight = $(this).height();
                                }
                            });
                            $ul.find(items[i]).height(maxHeight);
                        });
                    };
                    //setMaxHeight();
                    if ($ul.find('.product-image').length > 0) {
                        $ul.find('.product-image').last().find('img').last().each(function() {
                            if (this.complete) {
                                setMaxHeight();
                            } else {
                                $(this).on('load.setMaxHeight', function() {
                                    setMaxHeight();
                                    $(this).off('load.setMaxHeight');
                                });
                            }
                        });
                    } else {
                        setMaxHeight();
                    }
                });
            }
        });
    };

    function changeAdapt() {
        $(window).resize(function() {
            setTimeout(function() {
                var winWidth = $(window).prop('innerWidth');
                if ((curWinWidth < adapt) && (winWidth >= adapt)) {
                    $(window).trigger('cdz_pc');
                } else if ((curWinWidth >= adapt) && (winWidth < adapt)) {
                    $(window).trigger('cdz_mobile');
                }
                curWinWidth = winWidth;
            }, 200);
        });
    }

    function stickyMenu() {
        var $stickyMenu = $('.has-sticky-menu').first();
        if ($stickyMenu.length > 0) {
            var threshold = 300;
            var $parent = $stickyMenu.parent();
            var $win = $(window);
            var t = false,
                w = $win.prop('innerWidth');
            $parent.css({
                minHeight: ''
            });
            var parentHeight = $parent.height();
            $parent.css({
                minHeight: parentHeight
            });
            $win.scroll(function() {
                if ($win.scrollTop() > threshold) {
                    $stickyMenu.addClass('active');
                } else {
                    $stickyMenu.removeClass('active');
                }
            });
            $win.on('resize', function() {
                if (t) {
                    clearTimeout(t);
                }
                t = setTimeout(function() {
                    var newWidth = $win.prop('innerWidth');
                    if (w != newWidth) {
                        $stickyMenu.removeClass('active');
                        $parent.css({
                            minHeight: ''
                        });
                        parentHeight = $parent.height();
                        $parent.css({
                            minHeight: parentHeight
                        });
                        w = newWidth;
                    }
                }, 50);
            });
        }
    }

    function responsiveTabs() {
        $('.nav-tab-item a').click(function() {
            var $navTab = $(this);
            var $dropdown = $navTab.parent().parent().parent().find('.mobile-nav-tab-dropdown');
            var tabTitle = $navTab.text();
            $dropdown.text(tabTitle);
            $navTab.parents('.mobile-nav-tabs').first().removeClass('active');
        });
        $('.mobile-nav-tab-dropdown').click(function() {
            var $navTab = $(this);
            var target = $navTab.data('target');
            var $target = $(target);
            $target.toggleClass('active');
        });
        $('body').click(function(e) {
            if (!$(e.target).hasClass('mobile-nav-tab-dropdown')) {
                $('.mobile-nav-tabs').removeClass('active');
            }
        });
    }

    function mobileConfig() {
        function mobileTabs() {
            $('.mobile-nav-tab-dropdown').each(function() {
                var target = $(this).data('target');
                $(target).addClass('mobile-nav-tabs');
            });
        }

        function mobileFooter() {
            $('.cdz-toggle-title').each(function() {
                var $title = $(this);
                if ($title.data('cdz-toggle') != '') {
                    var $content = $($title.data('cdz-toggle'));
                    $content.hide();
                    $title.click(function() {
                        if (!$title.hasClass('active')) {
                            $('.cdz-toggle-title.active').click();
                        }
                        $title.toggleClass('active');
                        $content.slideToggle();
                    });
                }
            });
        }
        mobileTabs();
        mobileFooter();
    }

    function pcConfig() {
        function hideMobileSidebar() {
            if ($('body').hasClass('canvas-slid')) {
                $('#cdz-mobile-nav').offcanvas('hide');
            }
        }

        function pcTabs() {
            $('.mobile-nav-tabs').removeClass('mobile-nav-tabs');
        }

        function pcFooter() {
            $('.cdz-toggle-title').each(function() {
                var $title = $(this);
                if ($title.data('cdz-toggle') != '') {
                    var $content = $($title.data('cdz-toggle'));
                    $content.show();
                    $title.unbind('click');
                    $title.removeClass('active');
                }
            });
        }
        hideMobileSidebar();
        pcTabs();
        pcFooter();
    }
    $.fn.verticalMenu = function(options) {
        var defaultConfig = {
            parent: '.parent',
            subCat: '.cdz-sub-cat',
            trigger: '.dropdown-toggle',
            stopClickOnPC: true
        };
        var conf = Object.extend(defaultConfig, options || {});
        $(this).each(function() {
            var $parent = $(this);
            var mobileMenu = function() {
                $parent.find(conf.subCat).hide();
                $parent.find(conf.trigger).each(function() {
                    var $toggle = $(this);
                    $toggle.click(function() {
                        var $li = $toggle.parents(conf.parent).first();
                        var $subCat = $li.find(conf.subCat).first();
                        $li.toggleClass('open');
                        $subCat.toggleClass('open');
                        $subCat.slideToggle(300);
                    });
                });
            };
            var pcMenu = function() {
                var $subCat = $parent.find(conf.subCat);
                $subCat.css('display', '');
                $subCat.removeClass('open');
                $parent.find(conf.parent).removeClass('open');
            }
            mobileMenu();
            if (conf.stopClickOnPC) {
                if (curWinWidth >= adapt) {
                    pcMenu();
                }
                $(window).bind('cdz_pc', pcMenu);
            }
            $(window).bind('cdz_mobile', function() {
                var $subCat = $parent.find(conf.subCat);
                $subCat.hide();
                $subCat.removeClass('open');
                $parent.find(conf.parent).removeClass('open');
            });
        });
    }

    function mobileMenu() {
        $('.cdz-mobile-menu .root-parent, .cdz-nav-wrap').verticalMenu();
    }

    function cdzBackTopButton() {
        var $backTop = $('#back-top');
        if ($backTop.length) {
            $backTop.hide();
            $(window).scroll(function() {
                if ($(this).scrollTop() > 100) {
                    $backTop.fadeIn();
                } else {
                    $backTop.fadeOut();
                }
            });
            $('a', $backTop).click(function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        }
    }

    function isIpad() {
        var ua = navigator.userAgent;
        var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
        return isiPad;
    }

    function ipadMenu() {
        if (isIpad()) {
            $('.groupmenu, .cdz-nav-wrap').each(function(index, element) {
                var $menu = $(this);
                $('li.level0.parent', $menu).each(function(index, element) {
                    var $li = $(this),
                        active = false;
                    var $a = $li.children('a.menu-link').first();
                    $a.click(function(e) {
                        if (!active) {
                            e.preventDefault();
                        }
                        active = !active;
                    });
                    $('body').click(function(e) {
                        var isA = false;
                        if ($(e.target).is($a) || $(e.target).parent().is($a)) {
                            isA = true;
                        }
                        if ((!isA) && active) {
                            active = false;
                        }
                    });
                });
            });
        }
    }

    function ipadFilter() {
        //if(isIpad()){
        $nav = $('#narrow-by-list');
        if ($nav.length) {
            $nav.children('dd').each(function() {
                var $dd = $(this);
                var $dt = $dd.prev();
                if ($dt.length) {
                    $dt.click(function() {
                        if (window.innerWidth < adapt) {
                            $dd.slideToggle();
                        }
                    });
                }
            });
        }
        $(window).on('cdz_pc', function() {
            $nav.children('dd').css({
                display: ''
            });
        });
        //}
    }

    function toggleDropdownVerNav() {
        //if ($('body').hasClass('cms-index-index')) {
        $('.menu-vertical-title').each(function() {
            var $toggleBtn = $(this),
                $dropdown = $toggleBtn.next('.menu-vertical-content');

            function toggleDropdown() {
                $toggleBtn.css({
                    cursor: 'pointer'
                });
                $dropdown.css({
                    display: 'none'
                });
                $toggleBtn.on('click.toggle_dropdown', function() {
                    $dropdown.slideToggle();
                });
            }
            if (curWinWidth < adapt) {
                toggleDropdown();
            }
            $(window).bind('cdz_mobile', function() {
                toggleDropdown();
            });
            $(window).bind('cdz_pc', function() {
                $toggleBtn.css({
                    cursor: ''
                });
                $dropdown.css({
                    display: ''
                });
                $toggleBtn.off('click.toggle_dropdown');
            });
        });
        //}
    }

    function responsiveDefaultMenu() {
        if ($('.cdz-main-menu-horizontal.default-menu').length > 0) {
            var $defaultMenu = $('.cdz-main-menu-horizontal.default-menu').first();
            $defaultMenu.addClass('cdz-menu');
            var $pcWrap = $defaultMenu.parent();
            var $mbWrap = $('#cdz-mobile-menu');
            if (curWinWidth < adapt) {
                $defaultMenu.appendTo($mbWrap);
            }
            $(window).on('cdz_mobile', function() {
                $defaultMenu.appendTo($mbWrap);
            });
            $(window).on('cdz_pc', function() {
                $defaultMenu.appendTo($pcWrap);
            });
        }
    }
    $(document).ready(function(e) {
        responsiveDefaultMenu();
        responsiveTabs();
        mobileMenu();
        changeAdapt();
        stickyMenu();
        ipadMenu();
        ipadFilter();
        $(window).bind('cdz_mobile', mobileConfig);
        $(window).bind('cdz_pc', pcConfig);
        toggleDropdownVerNav();
        if (curWinWidth < adapt) {
            mobileConfig();
        } else {
            pcConfig();
        }
        $('.cdz-mobile-search').dropdownMenu({
            trigger: '.cdz-search-trigger',
            dropdown: '.cdz-dropdown-content'
        });
        $('.cdz-dropdown').dropdownMenu({
            trigger: '.cdz-trigger',
            dropdown: '.cdz-dropdown-content'
        });
        $('.cat-input').dropdownMenu({
            trigger: '.cdz-trigger',
            dropdown: '.cdz-dropdown-content',
            hideAffterClick: true
        });
        //alignMenu();
        cdzSlider();
        cdzTooltip();
        cdzBackTopButton();
        $(window).resize(function() {
            setTimeout(function() {
                $('body').sameHeightItems();
            }, 300);
        });
        $('.codazon-ajax-wrap').bind('contentUpdated', function() {
            var $this = $(this);
            $this.find('[data-toggle="tooltip"],.cdz-tooltip').tooltip();
            if (typeof $.fn.unveil !== 'undefined') {
                $this.find('.cdz-lazy').unveil();
            }
            if ((typeof $.fn.ajaxCartEffect !== 'undefined') && (Codazon.ajaxCartPro.enable)) {
                $this.find('.btn-cart').ajaxCartEffect();
            }
            $this.sameHeightItems();
        });
        $(window).on('ajaxCartCompleted', function(event, response) {
            var res = response.responseText.evalJSON();
            $('.cdz-top-cart').dropdownMenu({
                trigger: '.cdz-trigger',
                dropdown: '.cdz-dropdown-content'
            });
        });
        $('[data-toggle="tab"]').click(function() {
            var tab = $(this).attr('href');
            var $tab = $(tab);
            setTimeout(function() {
                $tab.sameHeightItems();
            }, 300);
        });
        if (!$('body').hasClass('checkout-onepage-index')) {
            window.fieldLabelEffect();
        }
        $('body').on('click', '[data-role=tab_link]', function(e) {
            e.preventDefault();
            var $link = $(e.target),
                href = $link.attr('href'),
                activeClass = 'in active';
            $(href).addClass(activeClass).siblings().removeClass(activeClass);
            $link.parent().addClass('active').siblings().removeClass('active');
        });
    });
    $(window).load(function() {
        $('body *:not(.codazon-ajax-wrap)').sameHeightItems();
        lazyImages();
    });
})(jQuery);