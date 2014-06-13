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
        container: false, //  Appends the popover to a specific element. If true, appends to the jQuery element.
        animation: true,
        // colorpicker:
        value: false, // forces a color, replacing the original value
        vertical: false, // WIP. display controls in vertical alignment
        inline: false, // WIP. displays the colorpicker as an inline element
        format: false, // forces a format: "rgb", "prgb", "hex6", "hex3", "hex8", "name", "hsl", "hsv"
        input: 'input', // children input selector
        component: false, // children component selector
        large: false, //if true, the colorpicker will be double sized
        // Palette (WIP) possible values:
        // array of 11 colors, 'current', 'triad', 'tetrad', 'monochromatic', 'analogous', 'complementary',
        // lightness, lighten, darken, brighten, saturate, desaturate, mixed or false
        // All palletes are distributed horizontally. This must be a multidimensional array.
        palettes: [],
        paletteAdjustment: 9,
        updatePalettes: true, // WIP. The palettes will be recalculated when color changes.
        okButton: false, // WIP
        cancelButton: false, // WIP
        template: '<div class="colorpicker">' +
                '<div class="colorpicker-map">' +
                '<div class="colorpicker-color"></div>' +
                '<div class="colorpicker-lightness"></div>' +
                '<div class="colorpicker-saturation"></div>' +
                '<i><b></b></i></div>' +
                '<div class="colorpicker-bar"><div class="colorpicker-hue"><i></i></div></div>' +
                '<div class="colorpicker-bar"><div class="colorpicker-alpha"><i></i></div></div>' +
                '<div class="colorpicker-palettes"></div>' +
                '</div>',
        paletteTemplate: '<div class="colorpicker-bar colorpicker-bar-horizontal colorpicker-palette">' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '<div class="colorpicker-palette-color"></div>' +
                '</div>',
        popoverTemplate: '<div class="popover colorpicker-popover"><div class="arrow"></div><div class="popover-content"></div></div>'
    };

    var makeVerticalGradient = function(color1, color2) {
        return "background-image: -moz-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -o-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, {color1}), color-stop(1, {color2})); background-image: -webkit-linear-gradient(top, {color1} 0%, {color2} 100%); background: -ms-linear-gradient(top,  {color1} 0%,{color2} 100%); background: linear-gradient(top,  {color1} 0%,{color2} 100%);".replace(/\{color1\}/g, color1).replace(/\{color2\}/g, color2);
    };

    var Colorpicker = function(element, options) {
        this.element = $(element).addClass('colorpicker-element');
        this.options = $.extend({}, defaults, this.element.data(), options);
        this.component = this.options.component;
        this.component = ((this.component !== false) ? this.element.find(this.component) : false);
        if ((this.component != false) && (this.component.length === 0)) {
            this.component = false;
        }
        this.container = (this.options.container === true) ? this.element : this.options.container;
        this.container = (this.container !== false) ? $(this.container) : false;

        // Is the element an input? Should we search inside for any input?
        this.input = this.element.is('input') ? this.element : (this.options.input ?
                this.element.find(this.options.input) : false);

        if ((this.input != false) && (this.input.length === 0)) {
            this.input = false;
        }

        this._createPicker();

        this.setColor(this.getValue());

        this.options.format = ((this.options.format === false) ? this.color._format : this.options.format);

        this.element.popover({
            'placement': this.options.placement,
            'container': this.container,
            'animation': this.options.animation,
            'template': this.options.popoverTemplate,
            'content': this.picker.element,
            'html': true,
            'trigger': 'manual'
        }).on('focus', function() {
            $(this).popover('show');
        }).on('blur', function() {
            //$(this).popover('hide');
        });

        this._setPalettes(this.options.palettes);
        
        var _self = this;

        console.log(this);
    };

    var TinyColorHelper = function(color) {
        this.color = color;
    };

    TinyColorHelper.prototype = {
        constructor: TinyColorHelper,
        clone: function() {
            return $.extend(true, {}, this.color);
        },
        fn: function(fn, arg) {
            var color = this.clone();
            color[fn](arg);
            return color;
        }
    };

    Colorpicker.prototype = {
        constructor: Colorpicker,
        _error: function(text) {
            throw "Bootstrap Colorpicker Exception: " + text;
        },
        _tc: function(fn, arg) {
            // returns a clone of the current color and applies functions without affecting the original
            return new TinyColorHelper(this.color).fn(fn, arg);
        },
        _setPalettes: function(palettes) {
            var _self = this;

            if (!$.isArray(palettes)) {
                return false;
            }
            
            this.picker.palettes.element.html('');

            $(palettes).each(function(i, values) {
                var pal = $(_self.options.paletteTemplate);
                var offset = 0;
                if ($.isArray(values)) {
                    $(values).each(function(j, val) {
                        offset = _self._fillPalette(pal, val, offset);
                    });
                } else {
                    offset = _self._fillPalette(pal, values, offset);
                }
                _self.picker.palettes.element.append(pal);
            });
        
            this.picker.palettes.element.find('.colorpicker-palette-color').on('click', function(){
                var col = $(this).find('i');
                if(col.length > 0){
                    _self.setColor(col.css('backgroundColor'));
                }
            });
        },
        _setPaletteColor: function(value, paletteElement, index, hoverText) {
            hoverText = hoverText || false;
            var col = paletteElement.find('.colorpicker-palette-color:eq(' + index + ')');
            if (col.length > 0) {
                hoverText = hoverText ? hoverText : value;
                col.html($('<i></i>').attr('title', hoverText).css('backgroundColor', value));
            }
            return col;
        },
        _fillPalette: function(palette, values, offset) {
            var _self = this;
            var currOffset = offset || 0;
            offset = currOffset;
            
            switch (values) {
                case 'current':
                    {
                        var col = _self.color.toString(_self.options.format);
                        _self._setPaletteColor(col, palette, offset, col + ' current');
                        currOffset++;
                    }
                    break;
                case 'triad':
                    {
                        $(tinycolor.triad(_self.color)).each(function(i, col) {
                            if((i==0)){
                                offset--;
                                return;
                            }
                            col = col.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' triad');
                            currOffset++;
                        });
                    }
                    break;
                case 'tetrad':
                    {
                        $(tinycolor.tetrad(_self.color)).each(function(i, col) {
                            if((i==0)){
                                offset--;
                                return;
                            }
                            col = col.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' tetrad');
                            currOffset++;
                        });
                    }
                    break;
                case 'complementary':
                    {
                        $(tinycolor.splitcomplement(_self.color)).each(function(i, col) {
                            if((i==0)){
                                offset--;
                                return;
                            }
                            col = col.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' complementary');
                            currOffset++;
                        });
                    }
                    break;
                case 'monochromatic':
                    {
                        $(tinycolor.monochromatic(_self.color, 12)).each(function(i, col) {
                            if((i==0)){
                                offset--;
                                return;
                            }
                            col = col.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' monochromatic');
                            currOffset++;
                        });
                    }
                    break;
                case 'analogous':
                    {
                        $(tinycolor.analogous(_self.color, 12)).each(function(i, col) {
                            if((i==0)){
                                offset--;
                                return;
                            }
                            col = col.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' analogous');
                            currOffset++;
                        });
                    }
                    break;
                case 'lighten':
                case 'darken':
                case 'saturate':
                case 'desaturate':
                case 'brighten':
                    {
                        for(var i=0; i < 11; i++) {
                            var pc = _self.options.paletteAdjustment*(i+1);
                            var col = tinycolor[values](_self.color, pc).toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' '+values+' '+pc+'%');
                            currOffset++;
                        };
                    }
                    break;
                case 'lightness':
                    {
                        var darkColors = [];
                        for(var i=0; i < 6; i++) {
                            var pc = _self.options.paletteAdjustment*(i+1);
                            darkColors.push(tinycolor['darken'](_self.color, pc).toString(_self.options.format));
                        }
                        darkColors = darkColors.reverse();
                        for(var i=6; i >= 0; i--) {
                            var pc2 = 100-_self.options.paletteAdjustment*(i+1);
                            _self._setPaletteColor(darkColors[i], palette, i+offset, darkColors[i] + ' darken '+pc2+'%');
                            currOffset++;
                        }
                        offset+=6;
                        for(var i=0; i < 5; i++) {
                            var pc = _self.options.paletteAdjustment*(i+1);
                            var col = tinycolor['lighten'](_self.color, pc).toString(_self.options.format);
                            _self._setPaletteColor(col, palette, i+offset, col + ' lighten '+pc+'%');
                            currOffset++;
                        }
                    }
                    break;
                case 'mixed':
                    {
                        var _variations = [
                            'lighten', 'darken', 'saturate',
                            'desaturate', 'brighten', 'greyscale'
                        ];
                        var j = 0;
                        $(_variations).each(function(i, fn) {
                            var _col = tinycolor[fn](_self.color, _self.options.paletteAdjustment*2).toString(_self.options.format);
                            _self._setPaletteColor(_col, palette, j+offset, _col + ' ' + fn);
                            j++;
                            currOffset++;
                            if(fn!='greyscale'){
                                var _col = tinycolor[fn](_self.color, _self.options.paletteAdjustment*4).toString(_self.options.format);
                                _self._setPaletteColor(_col, palette, j+offset, _col + ' ' + fn);
                                j++;
                                currOffset++;
                            }
                        });
                    }
                    break;
                default:
                    {
                        if ($.isArray(values)) {
                            $(values).each(function(i, p) {
                                _self._setPaletteColor(tinycolor(p).toString(_self.options.format), palette, i+offset, p);
                                currOffset++;
                            });
                        }else{
                            _self._setPaletteColor(tinycolor(values).toString(_self.options.format), palette, offset, values);
                            currOffset++;
                        }
                    }
                    break;
            }
            return currOffset;
        },
        _createPicker: function(customProps) {
            customProps = customProps ||  {};
            var picker = $(this.options.template);
            var pickerMap = picker.find('.colorpicker-map:first'),
                    pickerColorDiv = picker.find('.colorpicker-color:first'),
                    pickerHue = picker.find('.colorpicker-hue:first'),
                    pickerSaturation = picker.find('.colorpicker-saturation:first'),
                    pickerLightness = picker.find('.colorpicker-lightness:first'),
                    pickerAlpha = picker.find('.colorpicker-alpha:first'),
                    pickerPalettes = picker.find('.colorpicker-palettes:first');

            this.picker = {
                element: picker,
                map: {
                    element: pickerMap,
                    width: pickerMap.width(),
                    height: pickerMap.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                },
                color: {
                    element: pickerColorDiv,
                    width: pickerColorDiv.width(),
                    height: pickerColorDiv.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                },
                hue: {
                    element: pickerHue,
                    width: pickerHue.width(),
                    height: pickerHue.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: (pickerHue.width() != pickerHue.height())
                },
                saturation: {
                    element: pickerSaturation,
                    width: pickerSaturation.width(),
                    height: pickerSaturation.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: (pickerSaturation.width() != pickerSaturation.height())
                },
                lightness: {
                    element: pickerLightness,
                    width: pickerLightness.width(),
                    height: pickerLightness.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: (pickerLightness.width() != pickerLightness.height())
                },
                alpha: {
                    element: pickerAlpha,
                    width: pickerAlpha.width(),
                    height: pickerAlpha.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: (pickerAlpha.width() != pickerAlpha.height())
                },
                palettes: {
                    element: pickerPalettes,
                    width: pickerPalettes.width(),
                    height: 0,
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                },
            };

            this.picker = $.extend(true, this.picker, {
                /*map: { // unnecesary checks
                 maxTop: (this.options.vertical && this.picker.map.isBar) ? 0 : this.picker.map.height,
                 maxLeft: (!this.options.vertical && this.picker.map.isBar) ? 0 : this.picker.map.width
                 },
                 color: {
                 maxTop: (this.options.vertical && this.picker.color.isBar) ? 0 : this.picker.color.height,
                 maxLeft: (!this.options.vertical && this.picker.color.isBar) ? 0 : this.picker.color.width
                 },*/
                hue: {
                    maxTop: (this.options.vertical && this.picker.hue.isBar) ? 0 : this.picker.hue.height,
                    maxLeft: (!this.options.vertical && this.picker.hue.isBar) ? 0 : this.picker.hue.width,
                    callTop: this.picker.hue.isBar ? 'setHue' : 'setBrightness',
                    callLeft: this.picker.hue.isBar ? false : 'setHue'
                },
                saturation: {
                    maxTop: (this.options.vertical && this.picker.saturation.isBar) ? 0 : this.picker.saturation.height,
                    maxLeft: (!this.options.vertical && this.picker.saturation.isBar) ? 0 : this.picker.saturation.width,
                    callTop: this.picker.hue.isBar ? 'setSaturation' : 'setBrightness',
                    callLeft: this.picker.hue.isBar ? false : 'setBrightness'
                },
                lightness: {
                    maxTop: (this.options.vertical && this.picker.lightness.isBar) ? 0 : this.picker.lightness.height,
                    maxLeft: (!this.options.vertical && this.picker.lightness.isBar) ? 0 : this.picker.lightness.width,
                    callTop: false,
                    callLeft: false
                },
                alpha: {
                    maxTop: (this.options.vertical && this.picker.alpha.isBar) ? 0 : this.picker.alpha.height,
                    maxLeft: (!this.options.vertical && this.picker.alpha.isBar) ? 0 : this.picker.alpha.width,
                    callTop: this.picker.hue.isBar ? 'setAlpha' : false,
                    callLeft: this.picker.hue.isBar ? false : 'setAlpha'
                }
            }, customProps);

            if (this.options.large) {
                this.picker.element.addClass('colorpicker-2x');
                this.options.popoverTemplate = this.options.popoverTemplate
                        .replace('colorpicker-popover', 'colorpicker-popover colorpicker-popover-2x');
            }
        },
        api: function() {
            return this;
        },
        updateColor: function() {
            if (this.color.isValid()) {
                this.picker.color.element.css('backgroundColor', this.color.toString('hex'));
                this.picker.alpha.element.attr('style', makeVerticalGradient(this.color.toRgbString(), this._tc('setAlpha', 0).toRgbString()));
                if(this.options.updatePalettes){
                    this._setPalettes(this.options.palettes);
                }
            } else {
                this._error("Invalid color : " + this.color);
            }
        },
        updatePicker: function() {

        },
        updateValue: function(val) {
            val = val || this.color.toString(this.format);
            if (this.input !== false) {
                this.input.prop('value', val);
            }
            if (this.element !== false) {
                this.element.data('color', val);
            }
            return val;
        },
        updateComponent: function(val) {
            val = val || this.color.toString(this.format);
            if (this.component !== false) {
                var icn = this.component.find('i').eq(0);
                if (icn.length > 0) {
                    icn.css({
                        'backgroundColor': val
                    });
                } else {
                    this.component.css({
                        'backgroundColor': val
                    });
                }
            }
        },
        setColor: function(val) { // set color manually
            this.color = tinycolor(val);
            this.updateColor();
            this.element.data('color', this.color.toString(this.options.format)).trigger({
                type: 'colorChange',
                color: this.color,
                value: val
            });
        },
        getColor: function() {
            // returns the formatted color
            return this.color.toString(this.format);
        },
        setValue: function(val) { // set color manually
            this.setColor(val);
            val = this.getColor();

            if ((this.getValue(false) !== false) || (force === true)) {
                // Update input/data only if the current value is not blank
                this.updateInput(val);
                this.updateData(val);
            }
            this.updatePicker();
            this.element.data('color', this.color.toString(this.options.format)).trigger({
                type: 'colorChange',
                color: this.color,
                value: val
            });
        },
        getValue: function(defaultColor) {
            defaultColor = defaultColor || '';
            var val = defaultColor;

            if (this.hasInput()) {
                val = this.input.val();
            } else {
                val = this.element.data('color');
            }
            if ((val === undefined) || (val === '') || (val === null)) {
                // if not defined or empty, return default
                val = defaultColor;
            }
            return val;
        },
        hasInput: function() {
            return (this.input !== false);
        },
        isDisabled: function() {
            if (this.hasInput()) {
                return (this.input.prop('disabled') === true);
            }
            return false;
        },
        disable: function() {
            if (this.hasInput()) {
                this.input.prop('disabled', true);
                return true;
            }
            return false;
        },
        enable: function() {
            if (this.hasInput()) {
                this.input.prop('disabled', false);
                return true;
            }
            return false;
        }
    };

    $.colorpicker = Colorpicker;

    $.fn.colorpicker = function(option) {
        var pickerArguments = arguments;

        return this.each(function() {
            var $this = $(this),
                    pickerInstance = $this.data('colorpicker'),
                    options = ((typeof option === 'object') ? option : {});
            if ((!pickerInstance) && (typeof option !== 'string')) {
                $this.data('colorpicker', new Colorpicker(this, options));
            } else if (typeof option === 'string') {
                pickerInstance[option].apply(pickerInstance, Array.prototype.slice.call(pickerArguments, 1));
            }
        });
    };
}));
