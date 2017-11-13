'use strict';

import Color from './Color';
import defaults from './defaults';
import $ from 'jquery';

/**
 * Colorpicker component class
 */
export default class Colorpicker {
  /**
   * @returns {tinycolor}
   */
  static get Color() {
    return Color;
  }

  /**
   * @returns {tinycolor}
   */
  static get TinyColor() {
    return this.Color.TinyColor;
  }

  /**
   * @param {Object|String} element
   * @param {Object} options
   * @constructor
   */
  constructor(element, options) {
    this.element = $(element).addClass('colorpicker-element');
    this.options = $.extend(true, {}, defaults, this.element.data(), options);
    this.component = this.options.component;
    this.component = (this.component !== false) ? this.element.find(this.component) : false;
    if (this.component && (this.component.length === 0)) {
      this.component = false;
    }
    this.container = (this.options.container === true) ? this.element : this.options.container;
    this.container = (this.container !== false) ? $(this.container) : false;
    this.currentSlider = null;
    this.mousePointer = {
      left: 0,
      top: 0
    };

    // Is the element an input? Should we search inside for any input?
    this.input = this.element.is('input') ? this.element : (this.options.input ?
      this.element.find(this.options.input) : false);
    if (this.input && (this.input.length === 0)) {
      this.input = false;
    }

    /**
     * @type {Color}
     */
    this.color = this.createColor(this.options.color !== false ? this.options.color : this.getValue());

    this.disabled = false;

    // Setup picker
    let $picker = this.picker = $(this.options.template);

    if (this.options.customClass) {
      $picker.addClass(this.options.customClass);
    }
    if (this.options.inline) {
      $picker.addClass('colorpicker-inline colorpicker-visible');
    } else {
      $picker.addClass('colorpicker-hidden');
    }
    if (this.options.horizontal) {
      $picker.addClass('colorpicker-horizontal');
    }

    if (
      (this.options.useAlpha || this.color.hasAlpha()) &&
      (this.options.useAlpha !== false)
    ) {
      this.options.useAlpha = true;
      $picker.addClass('colorpicker-with-alpha');
    }

    if (this.options.align === 'right') {
      $picker.addClass('colorpicker-right');
    }
    if (this.options.inline === true) {
      $picker.addClass('colorpicker-no-arrow');
    }
    if (this.options.colorPalette) {
      let colorpicker = this,
        selectorsContainer = colorpicker.picker.find('.colorpicker-palette');

      if (selectorsContainer.length > 0) {
        $.each(this.options.colorPalette, function (name, color) {
          let $btn = $('<i />')
            .addClass('colorpicker-palette-color')
            .css('background-color', color)
            .attr('title', `${name}: ${color}`)
            .data('class', name).data('alias', name);

          $btn.on('mousedown.colorpicker touchstart.colorpicker', function (event) {
            event.preventDefault();
            colorpicker.setValue($(this).data('alias'));
          });
          selectorsContainer.append($btn);
        });
        selectorsContainer.show().addClass('colorpicker-visible');
      }
    }

    // Prevent closing the colorpicker when clicking on itself
    $picker.on('mousedown.colorpicker touchstart.colorpicker', $.proxy(function (e) {
      if (e.target === e.currentTarget) {
        e.preventDefault();
      }
    }, this));

    // Bind click/tap events on the sliders
    $picker.find('.colorpicker-saturation, .colorpicker-hue, .colorpicker-alpha')
      .on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.mousedown, this));

    $picker.appendTo(this.container ? this.container : $('body'));

    // Bind other events
    if (this.input !== false) {
      this.input.on({
        'keyup.colorpicker': $.proxy(this.keyup, this)
      });
      this.input.on({
        'change.colorpicker': $.proxy(this.change, this)
      });
      if (this.component === false) {
        this.element.on({
          'focus.colorpicker': $.proxy(this.show, this)
        });
      }
      if (this.options.inline === false) {
        this.element.on({
          'focusout.colorpicker': $.proxy(this.hide, this)
        });
      }
    }

    if (this.component !== false) {
      this.component.on({
        'click.colorpicker': $.proxy(this.show, this)
      });
    }

    if ((this.input === false) && (this.component === false)) {
      this.element.on({
        'click.colorpicker': $.proxy(this.show, this)
      });
    }

    // for HTML5 input[type='color']
    if ((this.input !== false) && (this.component !== false) && (this.input.attr('type') === 'color')) {

      this.input.on({
        'click.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
    }

    this.update(this.options.color !== false);

    $($.proxy(function () {
      this.element.trigger('create');
    }, this));
  }

  destroy() {
    this.picker.remove();
    this.element.removeData('colorpicker', 'color').off('.colorpicker');
    if (this.input !== false) {
      this.input.off('.colorpicker');
    }
    if (this.component !== false) {
      this.component.off('.colorpicker');
    }
    this.element.removeClass('colorpicker-element');
    this.element.trigger({
      type: 'destroy'
    });
  }

  get color() {
    return this.element.data('color');
  }

  set color(value) {
    this.element.data('color', value);
  }

  get format() {
    if (this.options.format) {
      return this.options.format;
    }

    if (this.color) {
      if (this.color.hasAlpha() && this.color.format.match(/^hex/)) {
        return this.options.enableHex8 ? 'hex8' : 'rgba';
      }
    }

    return null;
  }

  /**
   * Formatted color string, translated to the palette alias if available and with the other formatting options applied
   * (e.g. useHashPrefix)
   * @returns {String}
   */
  getColorString() {
    let str = this.color.toString(this.format);

    if (this.options.useHashPrefix === false) {
      str = str.replace(/^#/g, '');
    }

    return this.getPaletteColorName(str, this.getPaletteColorName('#' + str, str));
  }

  /**
   * Formatted color string, suitable for CSS
   * @returns {String}
   */
  getCssColorString() {
    return this.color.toString(this.format, true);
  }

  reposition() {
    if (this.options.inline !== false || this.options.container) {
      return false;
    }
    let type = this.container && this.container[0] !== window.document.body ? 'position' : 'offset';
    let element = this.component || this.element;
    let offset = element[type]();

    if (this.options.align === 'right') {
      offset.left -= this.picker.outerWidth() - element.outerWidth();
    }
    this.picker.css({
      top: offset.top + element.outerHeight(),
      left: offset.left
    });
    return true;
  }

  show(e) {
    if (this.isDisabled()) {
      // Don't show the widget if it's disabled (the input)
      return;
    }
    this.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');
    this.reposition();
    $(window).on('resize.colorpicker', $.proxy(this.reposition, this));
    if (e && (!this.hasInput() || this.input.attr('type') === 'color')) {
      if (e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    if ((this.component || !this.input) && (this.options.inline === false)) {
      $(window.document).on({
        'mousedown.colorpicker': $.proxy(this.hide, this)
      });
    }
    this.element.trigger({
      type: 'showPicker',
      color: this.color
    });
  }

  hide(e) {
    if ((typeof e !== 'undefined') && e.target) {
      // Prevent hide if triggered by an event and an element inside the colorpicker has been clicked/touched
      if (
        $(e.currentTarget).parents('.colorpicker').length > 0 ||
        $(e.target).parents('.colorpicker').length > 0
      ) {
        return false;
      }
    }
    this.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');
    $(window).off('resize.colorpicker', this.reposition);
    $(window.document).off({
      'mousedown.colorpicker': this.hide
    });
    this.update();
    this.element.trigger({
      type: 'hidePicker',
      color: this.color
    });
    return true;
  }

  updateInput() {
    if (this.input !== false) {
      this.input.prop('value', this.getColorString());
      this.input.trigger('change');
    }
  }

  updatePicker() {
    let sl = (this.options.horizontal === false) ? this.options.sliders : this.options.slidersHorz;
    let icns = this.picker.find('i');

    if (icns.length === 0) {
      return;
    }
    if (this.options.horizontal === false) {
      sl = this.options.sliders;
      icns.eq(1).css('top', sl.hue.maxTop * (1 - this.color.h)).end()
        .eq(2).css('top', sl.alpha.maxTop * (1 - this.color.a));
    } else {
      sl = this.options.slidersHorz;
      icns.eq(1).css('left', sl.hue.maxLeft * (1 - this.color.h)).end()
        .eq(2).css('left', sl.alpha.maxLeft * (1 - this.color.a));
    }
    icns.eq(0).css({
      'top': sl.saturation.maxTop - this.color.v * sl.saturation.maxTop,
      'left': this.color.s * sl.saturation.maxLeft
    });

    this.picker.find('.colorpicker-saturation')
      .css('backgroundColor', this.color.getHueOnlyCopy().toHexString()); // we only need hue

    this.picker.find('.colorpicker-alpha')
      .css('backgroundColor', this.color.toHexString()); // we don't need alpha

    this.picker.find('.colorpicker-color, .colorpicker-color div')
      .css('backgroundColor', this.color.toRgbString()); // we need all the channels
  }

  updateComponent() {
    if (this.component !== false) {
      let icn = this.component.find('i').eq(0);

      if (icn.length > 0) {
        icn.css({
          'backgroundColor': this.getCssColorString()
        });
      } else {
        this.component.css({
          'backgroundColor': this.getCssColorString()
        });
      }
    }
  }

  update(force) {
    if ((this.getValue(false) !== false) || (force === true)) {
      // Update only if the current value (from input or data) is not empty
      this.updateComponent();
      this.updateInput();
      this.updatePicker();
    }
  }

  getValue(defaultValue) {
    defaultValue = (typeof defaultValue === 'undefined') ? this.options.fallbackColor : defaultValue;
    let val;

    if (this.hasInput()) {
      val = this.input.val();
    } else {
      val = this.element.data('color');
    }
    if ((val === undefined) || (val === '') || (val === null)) {
      // if not defined or empty, return default
      val = defaultValue;
    }
    return val;
  }

  setValue(val) { // set color manually
    this.color = this.createColor(val);
    this.update(true);
    this.element.trigger({
      type: 'changeColor',
      color: this.color,
      value: val
    });
  }

  /**
   * Creates a new color using the instance options
   * @protected
   * @param {*} val
   * @returns {Color}
   */
  createColor(val) {
    val = val ? val : null;
    let fallback = this.options.fallbackColor ? this.options.fallbackColor : (this.color ? this.color._hsva : null);

    val = this.getPaletteColor(val, val);
    fallback = this.getPaletteColor(fallback, fallback);

    let color = new Color(val, {fallbackColor: fallback, format: this.format});

    if (color.hasAlpha() && !this.options.useAlpha) {
      // alpha is disabled
      return color.getOpaqueCopy();
    }

    return color;
  }

  getPaletteColor(colorName, defaultValue = null) {
    if (!(typeof colorName === 'string') || !this.options.colorPalette) {
      return defaultValue;
    }
    if (this.options.colorPalette.hasOwnProperty(colorName)) {
      return this.options.colorPalette[colorName];
    }
    return defaultValue;
  }

  getPaletteColorName(colorValue, defaultValue = null) {
    if (!(typeof colorValue === 'string') || !this.options.colorPalette) {
      return defaultValue;
    }
    for (let colorName in this.options.colorPalette) {
      if (!this.options.colorPalette.hasOwnProperty(colorName)) {
        continue;
      }
      if (this.options.colorPalette[colorName].toLowerCase() === colorValue.toLowerCase()) {
        return colorName;
      }
    }
    return defaultValue;
  }

  hasInput() {
    return (this.input !== false);
  }

  isDisabled() {
    return this.disabled;
  }

  disable() {
    if (this.hasInput()) {
      this.input.prop('disabled', true);
    }
    this.disabled = true;
    this.element.trigger({
      type: 'disable',
      color: this.color,
      value: this.getValue()
    });
    return true;
  }

  enable() {
    if (this.hasInput()) {
      this.input.prop('disabled', false);
    }
    this.disabled = false;
    this.element.trigger({
      type: 'enable',
      color: this.color,
      value: this.getValue()
    });
    return true;
  }

  mousedown(e) {
    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }
    e.stopPropagation();
    e.preventDefault();

    let target = $(e.target);

    // detect the slider and set the limits and callbacks
    let zone = target.closest('div');
    let sl = this.options.horizontal ? this.options.slidersHorz : this.options.sliders;

    if (!zone.is('.colorpicker')) {
      if (zone.is('.colorpicker-saturation')) {
        this.currentSlider = $.extend({}, sl.saturation);
      } else if (zone.is('.colorpicker-hue')) {
        this.currentSlider = $.extend({}, sl.hue);
      } else if (zone.is('.colorpicker-alpha')) {
        this.currentSlider = $.extend({}, sl.alpha);
      } else {
        return false;
      }
      let offset = zone.offset();
      // reference to guide's style

      this.currentSlider.guide = zone.find('i')[0].style;
      this.currentSlider.left = e.pageX - offset.left;
      this.currentSlider.top = e.pageY - offset.top;
      this.mousePointer = {
        left: e.pageX,
        top: e.pageY
      };
      // trigger mousemove to move the guide to the current position
      $(window.document).on({
        'mousemove.colorpicker': $.proxy(this.mousemove, this),
        'touchmove.colorpicker': $.proxy(this.mousemove, this),
        'mouseup.colorpicker': $.proxy(this.mouseup, this),
        'touchend.colorpicker': $.proxy(this.mouseup, this)
      }).trigger('mousemove');
    }
    return false;
  }

  mousemove(e) {
    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }
    e.stopPropagation();
    e.preventDefault();
    let left = Math.max(
      0,
      Math.min(
        this.currentSlider.maxLeft,
        this.currentSlider.left + ((e.pageX || this.mousePointer.left) - this.mousePointer.left)
      )
    );
    let top = Math.max(
      0,
      Math.min(
        this.currentSlider.maxTop,
        this.currentSlider.top + ((e.pageY || this.mousePointer.top) - this.mousePointer.top)
      )
    );

    this.currentSlider.guide.left = left + 'px';
    this.currentSlider.guide.top = top + 'px';
    if (this.currentSlider.callLeft) {
      this.color[this.currentSlider.callLeft].call(this.color, left / this.currentSlider.maxLeft);
    }
    if (this.currentSlider.callTop) {
      this.color[this.currentSlider.callTop].call(this.color, top / this.currentSlider.maxTop);
    }

    this.update(true);

    this.element.trigger({
      type: 'changeColor',
      color: this.color
    });
    return false;
  }

  mouseup(e) {
    e.stopPropagation();
    e.preventDefault();
    $(window.document).off({
      'mousemove.colorpicker': this.mousemove,
      'touchmove.colorpicker': this.mousemove,
      'mouseup.colorpicker': this.mouseup,
      'touchend.colorpicker': this.mouseup
    });
    return false;
  }

  change(e) {
    this.keyup(e);
  }

  keyup(e) {
    if ((e.keyCode === 38) && this.options.useAlpha) {
      if (this.color.a < 1) {
        this.color.a = Math.round((this.color.a + 0.01) * 100) / 100;
      }
      this.update(true);
    } else if ((e.keyCode === 40) && this.options.useAlpha) {
      if (this.color.a > 0) {
        this.color.a = Math.round((this.color.a - 0.01) * 100) / 100;
      }
      this.update(true);
    } else if (e.keyCode !== 38 && e.keyCode !== 40) {
      this.color = this.createColor(this.input.val());
      if (this.getValue(false) !== false) {
        this.updateComponent();
        this.updatePicker();
      }
    }
    this.element.trigger({
      type: 'changeColor',
      color: this.color,
      value: this.input.val()
    });
  }
}
