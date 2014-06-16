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
            // Palette (WIP) possible values:
            // array of 11 colors, 'current', 'previous', 'triad', 'tetrad', 'monochromatic', 'analogous', 'complementary',
            // lightness, lighten, darken, brighten, saturate, desaturate, mixed or false
            // All palletes are distributed horizontally. This must be a multidimensional array.
            palettes: [],
            paletteAdjustment: 9, // user for adjustments like: lighten darken brighten...
            baseWidth: 128, // these base sizes are doubled automatically if large is true
            baseBarWidth: 16,
            baseHeight: 128,
            large: false, //if true, the colorpicker will be double sized
            updatePalettes: true, // WIP. The palettes will be recalculated when color changes.
            okButton: false, // WIP
            cancelButton: false, // WIP
            currentComparer: false, // WIP. Displays the current and compares with the previous color
            tooltip: false, //WIP displays a tooltip near the cursor with color code
            templates: {
                picker: '<div class="colorpicker">' +
                    '<div class="colorpicker-map">' +
                    '<div class="colorpicker-color"></div>' +
                    '<div class="colorpicker-brightness"></div>' +
                    '<div class="colorpicker-saturation"><i><b></b></i></div>' +
                    '</div>' +
                    '<div class="colorpicker-bar"><div class="colorpicker-hue"><i></i></div></div>' +
                    '<div class="colorpicker-bar"><div class="colorpicker-alpha"><i></i></div></div>' +
                    '<div class="colorpicker-palettes"></div>' +
                    '</div>',
                palette: '<div class="colorpicker-bar colorpicker-bar-horizontal colorpicker-palette">' +
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
                popover: '<div class="popover colorpicker-popover"><div class="arrow"></div><div class="popover-content"></div></div>'
            }
        };

        var makeVerticalGradient = function(color1, color2) {
            return "background-image: -moz-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -o-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, {color1}), color-stop(1, {color2})); background-image: -webkit-linear-gradient(top, {color1} 0%, {color2} 100%); background: -ms-linear-gradient(top,  {color1} 0%,{color2} 100%); background: linear-gradient(top,  {color1} 0%,{color2} 100%);".replace(/\{color1\}/g, color1).replace(/\{color2\}/g, color2);
        };

        var Colorpicker = function(element, options) {
            this.element = $(element).addClass('colorpicker-element');
            this.options = $.extend({}, defaults, this.element.data(), options);

            // Set base width
            this.options.baseWidth = (this.options.large ? (this.options.baseWidth * 2) : this.options.baseWidth);
            this.options.baseBarWidth = (this.options.large ? (this.options.baseBarWidth * 2) : this.options.baseBarWidth);
            this.options.baseHeight = (this.options.large ? (this.options.baseHeight * 2) : this.options.baseHeight);

            // Plugin as component
            this.component = this.options.component;
            this.component = ((this.component !== false) ? this.element.find(this.component) : false);

            if ((this.component !== false) && (this.component.length === 0)) {
                this.component = false;
            }

            // Plugin container
            this.container = (this.options.container === true) ? this.element : this.options.container;
            this.container = (this.container !== false) ? $(this.container) : false;

            // Is the element an input? Should we search inside for any input?
            this.input = this.element.is('input') ? this.element : (this.options.input ?
                this.element.find(this.options.input) : false);

            if ((this.input !== false) && (this.input.length === 0)) {
                this.input = false;
            }

            // Create picker HTML and sliders info
            this._createPicker();

            // Set initial color and format
            this.color = tinycolor(this.getValue());
            this.options.format = ((this.options.format === false) ? this.color._format : this.options.format);

            // Bind mouse events
            this._bindMouseEvents();

            // Create popover HTML and events
            this._createPopover();

            // Create palettes HTML and events
            this._setPalettes(this.options.palettes);

            // Bind input keyup event
            if (this.hasInput()) {
                this.input.on('keyup', $.proxy(function(e) {
                    if ($.inArray(e.keyCode, [38, 40, 37, 39, 16, 17, 18, 9, 8, 91, 93, 20, 46, 186, 190, 46, 78, 188, 44, 86]) === -1) {
                        this.update();
                    }
                }, this));
            }

            this._trigger('colorpickerCreate');

            // expose api
            this.element.data('colorpicker', this);

            // Refresh everything
            $($.proxy(function() {
                this.picker.element.trigger('mousedown');
                this.update();
            }, this));
        };

        Colorpicker.prototype = {
            constructor: Colorpicker,
            options: {},
            _mousePointer: {
                top: 0,
                left: 0
            },
            _trigger: function(name, opts) {
                //triggers an event bound to the element

                this.element.trigger($.extend({
                    type: name,
                    colorpicker: this
                }, opts));
            },
            _error: function(text) {
                throw "Bootstrap Colorpicker Exception: " + text;
            },
            _hsvaFromGuides: function() {
                var color = {
                    h: parseInt(this.picker.hue.element.find('i').css('top'), 10),
                    s: parseInt(this.picker.saturation.element.find('i').css('left'), 10),
                    v: parseInt(this.picker.saturation.element.find('i').css('top'), 10),
                    a: parseInt(this.picker.alpha.element.find('i').css('top'), 10)
                };
                //console.log(color);
                for (var n in color) {
                    if (isNaN(color[n]) || (color[n] < 0)) {
                        color[n] = 0;
                        console.error('isNaN or neg for: ' + n);
                    }
                    if (n === 'h') {
                        color[n] = parseInt((color[n] * 360) / this.options.baseWidth, 10);
                    } else {
                        color[n] = parseInt((color[n] * 100) / this.options.baseWidth, 10);
                        if (n === 'v') {
                            color[n] = 100 - color[n];
                            if (color[n] < 0) {
                                color[n] = color[n] * -1;
                            }
                        }
                    }
                    if ((n === 'h') && (color[n] > 360)) {
                        color[n] = 360;
                    } else if ((n !== 'h') && (color[n] > 100)) {
                        color[n] = 100;
                    }
                    if (n === 'a') {
                        color[n] = (color[n] / 100);
                    }
                }
                return color;
            },
            _hsvaFromValue: function(val) {
                var color = tinycolor(val).toHsv();
                if (color['a'] === undefined) {
                    color.a = 1;
                }
                return color;
            },
            _mousedown: function(e) {
                e.stopPropagation();
                e.preventDefault();

                var target = $(e.target);
                //detect the slider and set the limits and callbacks

                var zone = target.closest('div');
                if (!zone.is('.colorpicker')) {
                    if (zone.is('.colorpicker-saturation')) {
                        this.currentSlider = $.extend({}, this.picker.saturation);
                    } else if (zone.is('.colorpicker-hue')) {
                        this.currentSlider = $.extend({}, this.picker.hue);
                    } else if (zone.is('.colorpicker-alpha')) {
                        this.currentSlider = $.extend({}, this.picker.alpha);
                    } else {
                        return false;
                    }
                    var offset = zone.offset();

                    //reference to guide's style
                    this.currentSlider.guide = zone.find('i');
                    this.currentSlider.left = e.pageX - offset.left;
                    this.currentSlider.top = e.pageY - offset.top;
                    this._mousePointer = {
                        left: e.pageX,
                        top: e.pageY
                    };

                    //trigger mousemove to move the guide to the current position
                    $(document).on({
                        'mousemove.colorpicker': $.proxy(this._mousemove, this),
                        'mouseup.colorpicker': $.proxy(this._mouseup, this)
                    }).trigger('mousemove');
                }
                return false;
            },
            _mousemove: function(e) {
                e.stopPropagation();
                e.preventDefault();
                var left = Math.max(0, Math.min(this.currentSlider.maxLeft, this.currentSlider.left + ((e.pageX || this._mousePointer.left) - this._mousePointer.left)));
                var top = Math.max(0, Math.min(this.currentSlider.maxTop, this.currentSlider.top) + ((e.pageY || this._mousePointer.top) - this._mousePointer.top));

                if (top >= this.currentSlider.maxTop) {
                    top = this.currentSlider.maxTop;
                }
                if (left >= this.currentSlider.maxLeft) {
                    left = this.currentSlider.maxLeft;
                }

                this.currentSlider.guide.css('left', left + 'px');
                this.currentSlider.guide.css('top', top + 'px');

                this._trigger('colorpickerMove', {
                    'hsla': this._updateColorFromGuidelines()
                });
                return false;
            },
            _mouseup: function(e) {
                e.stopPropagation();
                e.preventDefault();
                $(document).off({
                    'mousemove.colorpicker': this._mousemove,
                    'mouseup.colorpicker': this._mouseup
                });
                return false;
            },
            _bindMouseEvents: function() {
                this.picker.element.on('mousedown.colorpicker', $.proxy(this._mousedown, this));

                // Hide only when clicking outside
                if (this.options.inline === false) {
                    $(window.document).on('click.colorpicker', $.proxy(function(e) {
                        var _t = $(e.target);
                        if ((!_t.hasClass('colorpicker-element')  ||
                            (_t.hasClass('colorpicker-element') && !_t.is(this.element))) && (_t.parents('.colorpicker-popover').length === 0)) {
                            this.hide();
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }, this));
                }
            },
            _setPalettes: function(palettes) {
                var _self = this;

                if (!$.isArray(palettes)) {
                    return false;
                }

                this.picker.palettes.element.html('');

                $(palettes).each(function(i, values) {
                    var pal = $(_self.options.templates.palette);
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

                this.picker.palettes.element.find('.colorpicker-palette-color').on('click', function(e) {
                    var col = $(this).find('i');
                    if (col.length > 0) {
                        _self.update(col.css('backgroundColor'));
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            },
            _setPaletteColor: function(value, paletteElement, index, hoverText, className) {
                hoverText = hoverText || false;
                className = className || 'custom';
                var col = paletteElement.find('.colorpicker-palette-color:eq(' + index + ')');
                if (col.length > 0) {
                    hoverText = hoverText ? hoverText : value;
                    col.html($('<i class="colorpicker-palette-' + className + '" data-colorpicker-palette-color="' + value + '"></i>').attr('title', hoverText).css('backgroundColor', value));
                }
                return col;
            },
            _fillPalette: function(palette, values, offset) {
                var _self = this;
                var currOffset = offset ||  0;
                offset = currOffset;

                switch (values) {
                    case 'current':
                        {
                            var col = _self.color.toString(_self.options.format);
                            _self._setPaletteColor(col, palette, offset, col + ' current', 'current');
                            currOffset++;
                        }
                        break;
                    case 'previous':
                        {
                            if (_self.previousColor) {
                                var col = _self.previousColor.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, offset, col + ' previous', 'previous');
                                currOffset++;
                            }
                        }
                        break;
                    case 'triad':
                        {
                            $(tinycolor.triad(_self.color)).each(function(i, col) {
                                if (i === 0) {
                                    offset--;
                                    return;
                                }
                                col = col.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' triad', 'triad');
                                currOffset++;
                            });
                        }
                        break;
                    case 'tetrad':
                        {
                            $(tinycolor.tetrad(_self.color)).each(function(i, col) {
                                if (i === 0) {
                                    offset--;
                                    return;
                                }
                                col = col.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' tetrad', 'tetrad');
                                currOffset++;
                            });
                        }
                        break;
                    case 'complementary':
                        {
                            $(tinycolor.splitcomplement(_self.color)).each(function(i, col) {
                                if (i === 0) {
                                    offset--;
                                    return;
                                }
                                col = col.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' complementary', 'complementary');
                                currOffset++;
                            });
                        }
                        break;
                    case 'monochromatic':
                        {
                            $(tinycolor.monochromatic(_self.color, 12)).each(function(i, col) {
                                if (i === 0) {
                                    offset--;
                                    return;
                                }
                                col = col.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' monochromatic', 'monochromatic');
                                currOffset++;
                            });
                        }
                        break;
                    case 'analogous':
                        {
                            $(tinycolor.analogous(_self.color, 12)).each(function(i, col) {
                                if (i === 0) {
                                    offset--;
                                    return;
                                }
                                col = col.toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' analogous', 'analogous');
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
                            for (var i = 0; i < 11; i++) {
                                var pc = _self.options.paletteAdjustment * (i + 1);
                                var col = tinycolor[values](_self.color, pc).toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' ' + values + ' ' + pc + '%', values);
                                currOffset++;
                            };
                        }
                        break;
                    case 'lightness':
                        {
                            var darkColors = [];
                            for (var i = 0; i < 6; i++) {
                                var pc = _self.options.paletteAdjustment * (i + 1);
                                darkColors.push(tinycolor['darken'](_self.color, pc).toString(_self.options.format));
                            }
                            darkColors = darkColors.reverse();
                            for (var i = 6; i >= 0; i--) {
                                var pc2 = 100 - _self.options.paletteAdjustment * (i + 1);
                                _self._setPaletteColor(darkColors[i], palette, i + offset, darkColors[i] + ' darken ' + pc2 + '%', 'darken');
                                currOffset++;
                            }
                            offset += 6;
                            for (var i = 0; i < 5; i++) {
                                var pc = _self.options.paletteAdjustment * (i + 1);
                                var col = tinycolor['lighten'](_self.color, pc).toString(_self.options.format);
                                _self._setPaletteColor(col, palette, i + offset, col + ' lighten ' + pc + '%', 'lighten');
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
                                var _col = tinycolor[fn](_self.color, _self.options.paletteAdjustment * 2).toString(_self.options.format);
                                _self._setPaletteColor(_col, palette, j + offset, _col + ' ' + fn, fn);
                                j++;
                                currOffset++;
                                if (fn !== 'greyscale') {
                                    var _col = tinycolor[fn](_self.color, _self.options.paletteAdjustment * 4).toString(_self.options.format);
                                    _self._setPaletteColor(_col, palette, j + offset, _col + ' ' + fn, fn);
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
                                    _self._setPaletteColor(tinycolor(p).toString(_self.options.format), palette, i + offset, p);
                                    currOffset++;
                                });
                            } else {
                                _self._setPaletteColor(tinycolor(values).toString(_self.options.format), palette, offset, values);
                                currOffset++;
                            }
                        }
                        break;
                }
                return currOffset;
            },
            _createPopover: function() {
                var _self = this;
                this.element.popover({
                    'placement': this.options.placement,
                    'container': this.container,
                    'animation': this.options.animation,
                    'template': this.options.templates.popover,
                    'content': this.picker.element,
                    'html': true,
                    'trigger': 'manual'
                }).on('focus', function() {
                    $(this).popover('show');
                }).on('show.bs.popover', function() {
                    _self.update();
                });
            },
            _createPicker: function(customProps) {
                customProps = customProps ||  {};

                var _picker = $(this.options.templates.picker);

                // set initial positions for guides
                _picker.find('.colorpicker-map i').css({
                    top: (this.options.baseHeight + 2) + "px",
                    left: 2 + "px"
                });
                _picker.find('.colorpicker-bar i').css({
                    top: ((this.options.baseHeight / 2) + 2) + "px",
                    left: '0px'
                });

                this.picker = {
                    element: _picker,
                    map: {
                        element: _picker.find('.colorpicker-map:first'),
                        width: this.options.baseWidth,
                        height: this.options.baseHeight,
                        maxTop: 0,
                        maxLeft: 0
                    },
                    color: {
                        element: _picker.find('.colorpicker-color:first'),
                        width: this.options.baseWidth,
                        height: this.options.baseHeight,
                        maxTop: 0,
                        maxLeft: 0
                    },
                    hue: {
                        element: _picker.find('.colorpicker-hue:first'),
                        width: this.options.baseBarWidth,
                        height: this.options.baseHeight,
                        maxTop: this.options.baseHeight,
                        maxLeft: 0
                    },
                    saturation: {
                        element: _picker.find('.colorpicker-saturation:first'),
                        width: this.options.baseWidth,
                        height: this.options.baseHeight,
                        maxTop: this.options.baseHeight,
                        maxLeft: this.options.baseWidth
                    },
                    brightness: {
                        element: _picker.find('.colorpicker-brightness:first'),
                        width: this.options.baseWidth,
                        height: this.options.baseHeight,
                        maxTop: this.options.baseHeight,
                        maxLeft: this.options.baseWidth
                    },
                    alpha: {
                        element: _picker.find('.colorpicker-alpha:first'),
                        width: this.options.baseBarWidth,
                        height: this.options.baseHeight,
                        maxTop: this.options.baseHeight,
                        maxLeft: 0
                    },
                    palettes: {
                        element: _picker.find('.colorpicker-palettes:first'),
                        width: this.options.baseWidth,
                        height: 0,
                        maxTop: 0,
                        maxLeft: 0
                    }
                };

                this.picker = $.extend(true, this.picker, customProps);

                if (this.options.large === true) {
                    this.picker.element.addClass('colorpicker-2x');
                    this.options.templates.popover = this.options.templates.popover
                        .replace('colorpicker-popover', 'colorpicker-popover colorpicker-popover-2x');
                } else {
                    this.picker.element.removeClass('colorpicker-2x');
                    this.options.templates.popover = this.options.templates.popover
                        .replace('colorpicker-popover-2x', '');
                }
            },
            _updateComponents: function() {

                var hsva = this._hsvaFromValue(this.color);
                hsva.s = 100;
                hsva.v = 1;
                hsva.a = 1;

                // Set hue color behind brightness and saturation
                this.picker.color.element.css('backgroundColor', tinycolor(hsva).toString('hex'));
                // Alpha Bar bg color
                this.picker.alpha.element.css('backgroundColor', this.color.toRgbString());
                // Refresh palettes
                if (this.options.updatePalettes) {
                    this._setPalettes(this.options.palettes);
                }
                // Update component icon backgroundColor
                if (this.component !== false) {
                    var icn = this.component.find('i').eq(0);
                    if (icn.length > 0) {
                        icn.css({
                            'backgroundColor': this.getColor()
                        });
                    } else {
                        this.component.css({
                            'backgroundColor': this.getColor()
                        });
                    }
                }

            },
            _updateGuides: function() {
                // update Guides position based on current color
                var cl = this._hsvaFromValue(this.color);
                console.info(cl);
                var pos = {
                    h: parseInt((cl.h * this.picker.hue.height) / 360, 10),
                    s: parseInt((cl.s * 100) / this.picker.saturation.height, 10),
                    v: parseInt((cl.v * 100) / this.picker.brightness.width, 10),
                    a: parseInt((cl.a * 100 * this.picker.alpha.height) / 100, 10)
                };
                this.picker.hue.element.find('i').css('top', pos.h + "px");
                this.picker.saturation.element.find('i').css({
                    top: pos.s + "px",
                    left: pos.v + "px"
                });
                this.picker.alpha.element.find('i').css('top', pos.a + "px");

                console.log(pos);

                return pos;
            },
            _updateColorFromGuidelines: function() {
                var cl = this._hsvaFromGuides();
                //console.log(cl);
                //console.log(tinycolor(cl).toString());
                this.update(cl, false);
                return cl;
            },
            //
            /**
             * Sets the internal color and updates everything
             * @param {type} val tinycolor object or color string
             * @returns {false|tinycolor}
             */
            setColor: function(val) {
                this.color = tinycolor(val);

                if (this.color.isValid()) {
                    //this.update(); //all separated
                    //this.options.format = this.color._format;
                    this._updateComponents();
                    this.previousColor = tinycolor(this.color.toString());
                    //this._updateGuides();
                } else {
                    console.warn('Invalid color: ');
                    console.log(val);
                    return false;
                }
                this._trigger('colorpickerChange', {
                    value: val
                });
                return this.color;
            },
            /**
             * Returns the formatted color string
             * @returns string
             */
            getColor: function() {
                return this.color.toString(this.options.format);
            },
            /**
             * Calls setColor and if it's a valid color, sets the input or element color value
             * @param {type} val tinycolor object or color string
             * @returns tinycolor object
             */
            setValue: function(val) {
                val = this.setColor(val);
                if (val !== false) {
                    if (this.hasInput()) {
                        this.input.val(this.getColor());
                    } else {
                        this.element.data('color', this.getColor());
                    }
                }
                return val;
            },
            /**
             * Returns the input or element color value, without formatting, or defaultColor
             * if it's empty string, undefined, false or null
             * @param {type} defaultColor
             * @returns string|mixed
             */
            getValue: function(defaultColor) {
                // returns the input or element value, as string
                defaultColor = defaultColor || '';
                var val = defaultColor;

                if (this.hasInput()) {
                    val = this.input.val();
                } else {
                    val = this.element.data('color');
                }
                if ((val === undefined) || (val === '') || (val === null) || (val === false)) {
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
            show: function() {
                this.element.popover('show');
            },
            hide: function() {
                this.element.popover('hide');
            },
            update: function(color, updateGuides) {
                updateGuides = ((updateGuides !== false) ? true : false);
                color = (color ? color :  this.getValue(this.color));
                // reads the input or element color again and tries to update the plugin
                // fallback to the current selected color
                this._trigger('colorpickerUpdating');
                this.setValue(color);
                if (updateGuides) {
                    this._updateGuides();
                }
                this.picker.element.hide().show();
                this._trigger('colorpickerUpdated');
                return color;
            },
            destroy: function() {
                // unbinds events and resets everything to the initial state,
                // including component mode
                this.picker.remove();

                this.element.removeData('colorpicker').removeData('color').off('.colorpicker');
                this.element.popover('destroy');

                if (this.input !== false) {
                    this.input.off('.colorpicker');
                }

                if (this.component !== false) {
                    this.component.off('.colorpicker');
                }
                this.element.removeClass('colorpicker-element');

                this._trigger('colorpickerDestroy');
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
