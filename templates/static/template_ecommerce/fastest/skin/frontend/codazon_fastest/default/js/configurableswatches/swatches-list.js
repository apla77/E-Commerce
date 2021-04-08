/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magento.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magento.com for more information.
 *
 * @category    design
 * @package     rwd_default
 * @copyright   Copyright (c) 2006-2015 X.commerce, Inc. (http://www.magento.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

var ConfigurableSwatchesList = {
    swatchesByProduct: {},

    init: function($container) {
        var that = this;
        that.container = $container;
        if (typeof $container !== 'undefined') {
            var $items = $j('.configurable-swatch-list li', $container);
        } else {
            var $items = $j('.configurable-swatch-list li');
        }
        $items.each(function() {
            that.initSwatch(this, $container);
            var $swatch = $j(this);
            if ($swatch.hasClass('filter-match')) {
                that.handleSwatchSelect($swatch, $container);
            }
        });
    },

    initSwatch: function(swatch, $container) {
        var that = this;
        var $swatch = $j(swatch);
        var productId;
        $swatch.container = $container;
        if (productId = $swatch.data('product-id')) {
            if (typeof(this.swatchesByProduct[productId]) == 'undefined') {
                this.swatchesByProduct[productId] = [];
            }
            if (typeof $swatch.container !== 'undefined') {
                if (typeof this.swatchesByProduct[$swatch.container.attr('id')] == 'undefined') {
                    this.swatchesByProduct[$swatch.container.attr('id')] = [];
                }
                if (typeof this.swatchesByProduct[$swatch.container.attr('id')][productId] == 'undefined') {
                    this.swatchesByProduct[$swatch.container.attr('id')][productId] = [];
                }
                this.swatchesByProduct[$swatch.container.attr('id')][productId].push($swatch);
            }
            this.swatchesByProduct[productId].push($swatch);


            $swatch.find('a').on('click', function() {
                that.handleSwatchSelect($swatch);
                return false;
            });
        }
    },

    handleSwatchSelect: function($swatch) {
        var productId = $swatch.data('product-id');
        var label;
        if (label = $swatch.data('option-label')) {
            ConfigurableMediaImages.swapListImageByOption(productId, label, $swatch);
        }

        if (typeof $swatch.container == 'undefined') {
            $j.each(this.swatchesByProduct[productId], function(key, $productSwatch) {
                $productSwatch.removeClass('selected');
            });
        } else {
            $j.each(this.swatchesByProduct[$swatch.container.attr('id')][productId], function(key, $productSwatch) {
                $productSwatch.removeClass('selected');
            });
        }

        $swatch.addClass('selected');
    }
}

$j(document).on('configurable-media-images-init', function(e, ConfigurableMediaImages, $container) {
    ConfigurableSwatchesList.init($container);
});