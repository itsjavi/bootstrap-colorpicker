/*!
 * Bootstrap Colorpicker
 * http://mjaalnir.github.io/bootstrap-colorpicker/
 *
 * Originally written by (c) 2012 Stefan Petre
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 */
(function($) {
    'use strict';

    '{{color}}';

    var settings = {
        horizontal: false, // horizontal mode layout ?
        inline: false, //forces to show the colorpicker as an inline element
        color: false, //forces a color
        format: false, //forces a format
        inputSelector: 'input',
        containerSelector: false,
        componentSelector: '.add-on, .input-group-addon',
        sliders: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: 'setSaturation',
                callTop: 'setBrightness'
            },
            hue: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: false,
                callTop: 'setHue'
            },
            alpha: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: false,
                callTop: 'setAlpha'
            }
        },
        slidersHorz: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: 'setSaturation',
                callTop: 'setBrightness'
            },
            hue: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: 'setHue',
                callTop: false
            },
            alpha: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: 'setAlpha',
                callTop: false
            }
        },
        template: '<div class="colorpicker dropdown-menu">' +
            '<div class="colorpicker-saturation"><i><b></b></i></div>' +
            '<div class="colorpicker-hue"><i></i></div>' +
            '<div class="colorpicker-alpha"><i></i></div>' +
            '<div class="colorpicker-color"><div /></div>' +
            '</div>'
    };

    var Colorpicker = function(element, options) {
        this.options = $.extend({}, settings, options);
        this.element = $(element).addClass('colorpicker-element');
        this.component = this.getOption('componentSelector');
        this.component = (this.component !== false) ? this.element.find(this.component) : false;
        this.container = this.getOption('containerSelector');
        this.container = (this.container !== false) ? $(this.container) : false;

        // Is the element an input? Should we search inside for any input?
        this.input = this.element.is('input') ? this.element : (this.getOption('inputSelector', false) ?
            this.element.find(this.getOption('inputSelector', 'input')) : false);
        if (this.input && (this.input.length === 0)) {
            this.input = false;
        }
        // Set HSB color
        this.color = new Color(this.options.color !== false ? this.options.color : this.getValue());
        this.format = this.options.format !== false ? this.options.format : this.color.origFormat;
        this.update();

        this.picker = $(this.getOption('template', settings.template));
        if (this.getOption('inline')) {
            this.picker.addClass('colorpicker-inline colorpicker-visible');
        } else {
            this.picker.addClass('colorpicker-hidden');
        }
        if (this.getOption('horizontal')) {
            this.picker.addClass('colorpicker-horizontal');
        }
        if (this.format === 'rgba' || this.format === 'hsla') {
            this.picker.addClass('colorpicker-with-alpha');
        }
        this.picker.appendTo(this.container ? this.container : $('body'));

        console.log(this);
    };

    Colorpicker.Color = Color;

    Colorpicker.prototype = {
        constructor: Colorpicker,
        show: function() {
            this.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');
        },
        hide: function() {
            this.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');
        },
        update: function() {
            //update input
            if (this.isInput()) {
                this.input.val(this.color.toString(this.format));
            }
            //trigger event
        },
        setValue: function(val) {

        },
        getValue: function() {
            var val;
            if (this.isInput()) {
                val = this.input.val();
            } else {
                val = this.element.data('color');
            }
            if ((val === undefined) || (val === '') || (val === null)) {
                // if not defined or empty, return black as default
                val = '#000000';
            }
            return val;
        },
        isInput: function() {
            return (this.input !== false);
        },
        isDisabled: function() {
            if (this.isInput()) {
                return (this.input.prop('disabled') === true);
            }
            return false;
        },
        disable: function() {
            if (this.isInput()) {
                this.input.prop('disabled', true);
                return true;
            }
            return false;
        },
        enable: function() {
            if (this.isInput()) {
                this.input.prop('disabled', false);
                return true;
            }
            return false;
        },
        getOption: function(name, defaultValue) {
            defaultValue = defaultValue === undefined ? false : defaultValue;
            var dataOpt = this.element.data(name.replace(/[A-Z]/g, '-$&').toLowerCase());
            if (dataOpt !== undefined) {
                return dataOpt;
            }
            if ((this.options[name] === undefined) || (this.options[name] === false)) {
                return defaultValue;
            } else {
                return this.options[name];
            }
        }
    };

    $.colorpicker = Colorpicker;

    $.fn.colorpicker = function(option) {
        return this.each(function() {
            var $this = $(this),
                inst = $this.data('colorpicker'),
                options = ((typeof option === 'object') ? option : {});
            if ((!inst) && (typeof option !== 'string')) {
                $this.data('colorpicker', new Colorpicker(this, options));
            } else {
                if (typeof option === 'string') {
                    inst[option].apply(inst, Array.prototype.slice.call(arguments, 1));
                }
            }
        });
    };

    $.fn.colorpicker.constructor = Colorpicker;

})(window.jQuery);
