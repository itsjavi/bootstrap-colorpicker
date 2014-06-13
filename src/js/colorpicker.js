/*!
 * Bootstrap Colorpicker
 * http://mjolnic.github.io/bootstrap-colorpicker/
 *
 * Originally written by (c) 2012 Stefan Petre
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 * @todo Update DOCS
 */

(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery && !window.jQuery.fn.colorpicker) {
        factory(window.jQuery);
    }
}
(function($) {
    'use strict';
    var defaults = {
        // popover:
        placement: 'auto', // auto, top, bottom, left, right
        selector: false, // If a selector is provided, popover objects will be delegated to the specified targets
        container: false, //  Appends the popover to a specific element.
        animation: true,
        // colorpicker:
        value: false, // forces a color, replacing the original value
        vertical: false, // display controls in vertical alignment
        inline: false, // displays the colorpicker as an inline element
        format: false, // forces a format: 'hex', 'rgb', 'rgba', 'hsl' or 'hsla'
        component: false, // children component selector
        template: '<div class="colorpicker dropdown-menu">' +
                '<div class="colorpicker-saturation"><i><b></b></i></div>' +
                '<div class="colorpicker-hue"><i></i></div>' +
                '<div class="colorpicker-alpha"><i></i></div>' +
                '<div class="colorpicker-color"><div /></div>' +
                '</div>'
    };
}));
