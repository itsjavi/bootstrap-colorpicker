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

    var settings = {
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

    // Picker object

    var Colorpicker = function(element, options) {
        Colorpicker._numInstances++;
        this.options = options;
        this.element = $(element).attr('data-colorpicker-uid', Colorpicker._numInstances);
        var format = options.format || this.element.data('color-format') || 'hex';
        this.format = settings.translateFormats[format];
        this.isInput = this.element.is('input');
        this.component = this.element.is('.colorpicker-component') ? this.element.find('.add-on, .input-group-addon') : false;
        this.container = options.container || false;
        this.disabled = false;

        var disabled = options.disabled || this.element.data('disabled');
        if (disabled) {
            this.disabled = true;
            if (this.isInput) {
                this.element.attr('disabled', 'disabled');
            } else {
                this.element.find('input').attr('disabled', 'disabled');
            }
        }

        this.picker = $(settings.template).attr('data-colorpicker-uid', Colorpicker._numInstances)
        if (!this.container) {
            this.picker.appendTo($('body'));
        } else {
            this.picker.appendTo(this.container);
            this.picker.addClass('colorpicker-inline');
        }

        this.picker.on('mousedown.colorpicker', $.proxy(this.mousedown, this));

        this.isHorizontal = options.horizontal;
        if (this.isHorizontal) {
            this.picker.addClass('colorpicker-horizontal');
        }

        if (this.isInput) {
            this.element.on({
                'focus.colorpicker': $.proxy(this.show, this),
                'keyup.colorpicker': $.proxy(this.update, this)
            });
            if (!this.element.hasClass('colorpicker-inline')) {
                this.element.on({
                    'focusout.colorpicker': $.proxy(this.hide, this)
                });
            }
        } else if (this.component) {
            this.element.on({
                'keyup.colorpicker': $.proxy(this.updateComponent, this)
            });
            this.component.on({
                'click.colorpicker': $.proxy(this.show, this)
            });
        } else {
            this.element.on({
                'click.colorpicker': $.proxy(this.show, this)
            });
        }
        if (format === 'rgba' || format === 'hsla') {
            this.picker.addClass('alpha');
            this.alpha = this.picker.find('.colorpicker-alpha')[0].style;
        }

        if (this.component) {
            this.picker.find('.colorpicker-color').hide();
            this.preview = this.element.find('i')[0].style;
        } else {
            this.preview = this.picker.find('div:last')[0].style;
        }

        this.base = this.picker.find('div:first')[0].style;
        this.update();

        $($.proxy(function() {
            this.element.trigger('create', [this]);
        }, this));
    };

    Colorpicker._numInstances = 0;

    Colorpicker.prototype = {
        constructor: Colorpicker,
        show: function(e) {

            //don't show it if it's disabled
            if (this.disabled)
                return;

            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            $(window).on('resize.colorpicker', $.proxy(this.place, this));
            if (!this.isInput) {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
            $(document).on({
                'mousedown.colorpicker': $.proxy(this.hide, this)
            });
            this.element.trigger({
                type: 'showPicker',
                color: this.color
            });
        },
        updateComponent: function() {
            var value = $(this.element).children("input").val();
            if (value) {
                this.element.data('color', value);
                this.update();
            }
        },
        update: function() {
            var color = this.isInput ? this.element.prop('value') : this.element.data('color');
            if (typeof color === "undefined" || color === null) {
                color = '#000000';
            }
            this.color = new Color(color);
            this.picker.find('i')
                .eq(0).css({
                    left: this.color.value.s * 100,
                    top: 100 - this.color.value.b * 100
                }).end()
                .eq(1).css('top', 100 * (1 - this.color.value.h)).end()
                .eq(2).css('top', 100 * (1 - this.color.value.a));
            if (this.component) {
                this.component.find('i').css('background-color', this.format());
            }
            this.previewColor();
        },
        hide: function() {
            this.picker.hide();
            $(window).off('resize', this.place);
            $(document).off({
                'mousedown': this.hide
            });
            if (!this.isInput) {
                if (this.component) {
                    //if the input value is empty, do not set any color
                    if (this.element.find('input').val() !== '') {
                        this.element.find('input').prop('value', this.format.call(this)).trigger('change');
                    }
                }
                this.element.data('color', this.format.call(this));
            } else {
                //if the input value is empty, do not set any color
                if (this.element.val() !== '') {
                    this.element.prop('value', this.format.call(this)).trigger('change');
                }
            }
            this.element.trigger({
                type: 'hidePicker',
                color: this.color
            });
        },
        place: function() {
            var offset = this.component ? this.component.offset() : this.element.offset();
            this.picker.css({
                top: offset.top + this.height,
                left: offset.left
            });
        },
        disable: function() {
            this.disabled = true;
            if (this.isInput) {
                this.element.attr('disabled', 'disabled').trigger('disable');
            } else {
                this.element.find("input").attr('disabled', 'disabled').trigger('disable');
            }
        },
        enable: function() {
            this.disabled = false;
            if (this.isInput) {
                this.element.removeAttr('disabled').trigger('enable');
            } else {
                this.element.find("input").removeAttr('disabled').trigger('enable');
            }
        },
        destroy: function() {
            $('.colorpicker[data-colorpicker-uid=' + this.element.attr('data-colorpicker-uid') + ']').remove();
            this.element.removeData('colorpicker').removeAttr('data-colorpicker-uid').off('.colorpicker');
            if (this.component !== false) {
                this.component.off('.colorpicker');
            }
            this.element.removeClass('colorpicker-element');
            this.element.trigger("destroy", [this]);
        },
        setValue: function(value) {
            // set the input or component value
            if (this.isInput) {
                this.element.prop('value', value);
            } else {
                this.element.find('input').val(value);
                this.element.data('color', value);
            }
            this.update();
            this.element.trigger({
                type: 'changeColor',
                color: this.color
            });
        },
        //preview color change
        previewColor: function() {
            try {
                this.preview.backgroundColor = this.format.call(this);
            } catch (e) {
                this.preview.backgroundColor = this.color.toHex();
            }
            //set the color for brightness/saturation slider
            this.base.backgroundColor = this.color.toHex(this.color.value.h, 1, 1, 1);
            //set te color for alpha slider
            if (this.alpha) {
                this.alpha.backgroundColor = this.color.toHex();
            }
        },
        pointer: null,
        slider: null,
        mousedown: function(e) {
            e.stopPropagation();
            e.preventDefault();

            var target = $(e.target);

            //detect the slider and set the limits and callbacks
            var zone = target.closest('div');
            if (!zone.is('.colorpicker')) {
                var sliderOptions = this.isHorizontal ? settings.slidersHorizontal : settings.sliders;
                if (zone.is('.colorpicker-saturation')) {
                    this.slider = $.extend({}, sliderOptions.saturation);
                } else if (zone.is('.colorpicker-hue')) {
                    this.slider = $.extend({}, sliderOptions.hue);
                } else if (zone.is('.colorpicker-alpha')) {
                    this.slider = $.extend({}, sliderOptions.alpha);
                } else {
                    return false;
                }
                var offset = zone.offset();
                //reference to knob's style
                this.slider.knob = zone.find('i')[0].style;
                this.slider.left = e.pageX - offset.left;
                this.slider.top = e.pageY - offset.top;
                this.pointer = {
                    left: e.pageX,
                    top: e.pageY
                };
                //trigger mousemove to move the knob to the current position
                $(document).on({
                    'mousemove.colorpicker': $.proxy(this.mousemove, this),
                    'mouseup.colorpicker': $.proxy(this.mouseup, this)
                }).trigger('mousemove');
            }
            return false;
        },
        mousemove: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var left = Math.max(
                0,
                Math.min(
                    this.slider.maxLeft,
                    this.slider.left + ((e.pageX || this.pointer.left) - this.pointer.left)
                )
            );
            var top = Math.max(
                0,
                Math.min(
                    this.slider.maxTop,
                    this.slider.top + ((e.pageY || this.pointer.top) - this.pointer.top)
                )
            );
            this.slider.knob.left = left + 'px';
            this.slider.knob.top = top + 'px';
            if (this.slider.callLeft) {
                this.color[this.slider.callLeft].call(this.color, left / 100);
            }
            if (this.slider.callTop) {
                this.color[this.slider.callTop].call(this.color, top / 100);
            }
            this.previewColor();

            // Set input value on mousemove
            if (!this.isInput) {
                try {
                    this.element.find('input').val(this.format.call(this)).trigger('change');
                } catch (e) {
                    this.element.find('input').val(this.color.toHex()).trigger('change');
                }
            } else {
                try {
                    this.element.val(this.format.call(this)).trigger('change');
                } catch (e) {
                    this.element.val(this.color.toHex()).trigger('change');
                }
            }

            this.element.trigger({
                type: 'changeColor',
                color: this.color
            });
            return false;
        },
        mouseup: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(document).off({
                mousemove: this.mousemove,
                mouseup: this.mouseup
            });
            return false;
        }
    };

    $.fn.colorpicker = function(option, value) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('colorpicker'),
                options = typeof option === 'object' && option;
            if (!data) {
                if (option !== "destroy") {
                    $this.addClass('colorpicker-element').data('colorpicker', (data = new Colorpicker(this, $.extend({}, settings, options))));
                }
            } else {
                if (typeof option === 'string') {
                    data[option](value);
                }
            }
        });
    };

    $.fn.colorpicker.defaults = {};

    $.fn.colorpicker.Constructor = Colorpicker;

})(window.jQuery);
