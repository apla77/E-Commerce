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

var ConfigurableMediaImages = {
    imageType: null,
    productImages: {},
    productListImages: {},
    imageObjects: {},

    arrayIntersect: function(a, b) {
        var ai = 0,
            bi = 0;
        var result = new Array();

        while (ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                ai++;
            } else if (a[ai] > b[bi]) {
                bi++;
            } else /* they're equal */ {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }

        return result;
    },

    getCompatibleProductImages: function(productFallback, selectedLabels) {
        //find compatible products
        var compatibleProducts = [];
        var compatibleProductSets = [];
        selectedLabels.each(function(selectedLabel) {
            if (!productFallback['option_labels'][selectedLabel]) {
                return;
            }

            var optionProducts = productFallback['option_labels'][selectedLabel]['products'];
            compatibleProductSets.push(optionProducts);

            //optimistically push all products
            optionProducts.each(function(productId) {
                compatibleProducts.push(productId);
            });
        });

        //intersect compatible products
        compatibleProductSets.each(function(productSet) {
            compatibleProducts = ConfigurableMediaImages.arrayIntersect(compatibleProducts, productSet);
        });

        return compatibleProducts;
    },

    isValidImage: function(fallbackImageUrl) {
        if (!fallbackImageUrl) {
            return false;
        }

        return true;
    },

    getSwatchImage: function(productId, optionLabel, selectedLabels, $swatch) {
        if (typeof $swatch != 'undefined') {
            var fallback = ConfigurableMediaImages.productListImages[productId];
        } else {
            var fallback = ConfigurableMediaImages.productImages[productId];
        }
        if (typeof $swatch != 'undefined') {
            var imageType = 'small_image';
        } else {
            var imageType = ConfigurableMediaImages.imageType;
        }

        if (!fallback) {
            return null;
        }

        //first, try to get label-matching image on config product for this option's label
        var currentLabelImage = fallback['option_labels'][optionLabel];
        if (currentLabelImage && fallback['option_labels'][optionLabel]['configurable_product'][imageType]) {
            //found label image on configurable product
            return fallback['option_labels'][optionLabel]['configurable_product'][imageType];
        }

        var compatibleProducts = ConfigurableMediaImages.getCompatibleProductImages(fallback, selectedLabels);

        if (compatibleProducts.length == 0) { //no compatible products
            return null; //bail
        }



        //second, get any product which is compatible with currently selected option(s)
        $j.each(fallback['option_labels'], function(key, value) {
            var image = value['configurable_product'][imageType];
            var products = value['products'];

            if (image) { //configurable product has image in the first place
                //if intersection between compatible products and this label's products, we found a match
                var isCompatibleProduct = ConfigurableMediaImages.arrayIntersect(products, compatibleProducts).length > 0;
                if (isCompatibleProduct) {
                    return image;
                }
            }
        });

        //third, get image off of child product which is compatible
        var childSwatchImage = null;
        var childProductImages = fallback[imageType];
        compatibleProducts.each(function(productId) {
            if (childProductImages[productId] && ConfigurableMediaImages.isValidImage(childProductImages[productId])) {
                childSwatchImage = childProductImages[productId];
                return false; //break "loop"
            }
        });
        if (childSwatchImage) {
            return childSwatchImage;
        }

        //fourth, get base image off parent product
        if (childProductImages[productId] && ConfigurableMediaImages.isValidImage(childProductImages[productId])) {
            return childProductImages[productId];
        }

        //no fallback image found
        return null;
    },

    getImageObject: function(productId, imageUrl) {
        var key = productId + '-' + imageUrl;
        if (!ConfigurableMediaImages.imageObjects[key]) {
            var image = $j('<img />');
            image.attr('src', imageUrl);
            ConfigurableMediaImages.imageObjects[key] = image;
        }
        return ConfigurableMediaImages.imageObjects[key];
    },

    updateImage: function(el) {
        var select = $j(el);
        var label = select.find('option:selected').attr('data-label');
        var productId = optionsPrice.productId; //get product ID from options price object

        //find all selected labels
        var selectedLabels = new Array();

        $j('.product-options .super-attribute-select').each(function() {
            var $option = $j(this);
            if ($option.val() != '') {
                selectedLabels.push($option.find('option:selected').attr('data-label'));
            }
        });

        var swatchImageUrl = ConfigurableMediaImages.getSwatchImage(productId, label, selectedLabels);
        if (!ConfigurableMediaImages.isValidImage(swatchImageUrl)) {
            return;
        }

        var swatchImage = ConfigurableMediaImages.getImageObject(productId, swatchImageUrl);

        ProductMediaManager.swapImage(swatchImage);
    },

    wireOptions: function() {
        $j('.product-options .super-attribute-select').change(function(e) {
            ConfigurableMediaImages.updateImage(this);
        });
    },

    swapListImage: function(productId, imageObject, $swatch) {

        if (typeof $swatch.container !== 'undefined') {
            var originalImage = $swatch.container.find('.main-product-collection-image-' + productId).first();
        } else {
            var originalImage = $j('#product-collection-image-' + productId);
        }
        var src = imageObject[0].src;


        if (imageObject[0].complete) { //swap image immediately


            /*originalImage.addClass('hidden');
            $j('.product-collection-image-' + productId,$swatch.container).remove();
            imageObject.insertAfter(originalImage);*/
            originalImage.attr('src', src);

        } else { //need to load image

            var wrapper = originalImage.parent();

            //add spinner
            wrapper.addClass('loading');

            //wait until image is loaded
            imagesLoaded(imageObject, function() {
                wrapper.removeClass('loading');
                /*originalImage.addClass('hidden');
               	$j('.product-collection-image-' + productId,$swatch.container).remove();
                imageObject.insertAfter(originalImage);*/
                originalImage.attr('src', src);
            });

        }
    },

    swapListImageByOption: function(productId, optionLabel, $swatch) {
        var swatchImageUrl = ConfigurableMediaImages.getSwatchImage(productId, optionLabel, [optionLabel], $swatch);
        if (!swatchImageUrl) {
            return;
        }

        var newImage = ConfigurableMediaImages.getImageObject(productId, swatchImageUrl);
        newImage.addClass('product-collection-image-' + productId);

        ConfigurableMediaImages.swapListImage(productId, newImage, $swatch);
    },

    setImageFallback: function(productId, imageFallback) {
        ConfigurableMediaImages.productImages[productId] = imageFallback;
        if (ConfigurableMediaImages.imageType == 'small_image') {
            ConfigurableMediaImages.productListImages[productId] = imageFallback;
        }
    },

    init: function(imageType) {
        ConfigurableMediaImages.imageType = imageType;
        ConfigurableMediaImages.wireOptions();
    }
};