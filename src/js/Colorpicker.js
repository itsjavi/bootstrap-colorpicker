'use strict';
/**
 * @module
 */

import Color from './Color';
import defaults from './defaults';
import $ from 'jquery';

/**
 * Colorpicker widget class
 */
class Colorpicker {
  /**
   * Color class
   *
   * @static
   * @type {Color}
   */
  static get Color() {
    return Color;
  }

  /**
   * color getter
   *
   * @type {Color|null}
   */
  get color() {
    return this.element.data('color');
  }

  /**
   * color setter
   *
   * @ignore
   * @param {Color|null} value
   */
  set color(value) {
    this.element.data('color', value);
  }

  /**
   * @fires create
   * @param {Object|String} element
   * @param {Object} options
   * @constructor
   */
  constructor(element, options) {
    /**
     * @type {*|jQuery}
     */
    this.element = $(element).addClass('colorpicker-element');
    /**
     * @type {defaults}
     */
    this.options = $.extend(true, {}, defaults, this.element.data(), options);
    /**
     * @type {*|jQuery}
     */
    this.component = this.options.component;
    this.component = (this.component !== false) ? this.element.find(this.component) : false;
    if (this.component && (this.component.length === 0)) {
      this.component = false;
    }
    /**
     * @type {*|jQuery}
     */
    this.container = (this.options.container === true) ? this.element : this.options.container;
    this.container = (this.container !== false) ? $(this.container) : false;
    /**
     * @type {*|String}
     * @private
     */
    this.currentSlider = null;
    /**
     * @type {{left: number, top: number}}
     * @private
     */
    this.mousePointer = {
      left: 0,
      top: 0
    };

    // Is the element an input? Should we search inside for any input?
    /**
     * @type {*|jQuery}
     */
    this.input = this.element.is('input') ? this.element : (this.options.input ?
      this.element.find(this.options.input) : false);

    if (this.input && (this.input.length === 0)) {
      this.input = false;
    }

    this.color = this.createColor(this.options.color !== false ? this.options.color : this.getValue());

    /**
     * @type {boolean}
     * @private
     */
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
      (this.options.useAlpha || (this.hasColor() && this.color.hasTransparency())) &&
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
        paletteContainer = colorpicker.picker.find('.colorpicker-palette'),
        isAliased = (this.options.useColorPaletteNames === true);

      if (paletteContainer.length > 0) {
        $.each(this.options.colorPalette, function (name, value) {
          let $btn = $('<i />')
            .addClass('colorpicker-palette-color')
            .css('background-color', value)
            .attr('data-name', name)
            .attr('data-value', value)
            .attr('title', `${name}: ${value}`);

          $btn.on('mousedown.colorpicker touchstart.colorpicker', function (event) {
            event.preventDefault();
            colorpicker.setValue(isAliased ? $(this).data('name') : $(this).data('value'));
          });
          paletteContainer.append($btn);
        });
        paletteContainer.show().addClass('colorpicker-visible');
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
      /**
       * (Colorpicker) When the Colorpicker instance has been created and the DOM is ready.
       *
       * @event create
       */
      this.element.trigger({
        type: 'create',
        colorpicker: this,
        color: this.color
      });
    }, this));
  }

  /**
   * Destroys the current instance
   *
   * @fires destroy
   */
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

    /**
     * (Colorpicker) When the instance is destroyed with all events unbound.
     *
     * @event destroy
     */
    this.element.trigger({
      type: 'destroy',
      colorpicker: this,
      color: this.color
    });
  }

  /**
   * Returns true if the current color object is an instance of Color, false otherwise.
   * @returns {boolean}
   */
  hasColor() {
    return this.color instanceof Color;
  }

  get format() {
    if (this.options.format) {
      return this.options.format;
    }

    if (this.hasColor() && this.color.hasTransparency() && this.color.format.match(/^hex/)) {
      return this.options.enableHex8 ? 'hex8' : 'rgba';
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
    return this.color.toString(this.format);
  }

  /**
   * If the widget is not inside a container or inline, rearranges its position relative to its element offset.
   *
   * @returns {boolean} Returns false if the widget is inside a container or inline, true otherwise
   */
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

  /**
   * Shows the colorpicker widget if hidden.
   * If the input is disabled this call will be ignored.
   *
   * @fires showPicker
   * @param {Event} [e]
   */
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

    /**
     * (Colorpicker) When show() is called and the widget can be shown.
     *
     * @event showPicker
     */
    this.element.trigger({
      type: 'showPicker',
      colorpicker: this,
      color: this.color
    });
  }

  /**
   * Hides the colorpicker widget.
   * Hide is prevented when it is triggered by an event whose target element has been clicked/touched.
   *
   * @fires hidePicker
   * @param {Event} [e]
   * @returns {boolean} True if hidden, false if prevented.
   */
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

    /**
     * (Colorpicker) When hide() is called and the widget can be hidden.
     *
     * @event hidePicker
     */
    this.element.trigger({
      type: 'hidePicker',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * If the input element is present, it updates the value with the current color object color string.
   * If value is set, this method fires a "change" event on the input element.
   *
   * @fires change
   */
  updateInput() {
    if (this.input !== false) {
      let val = this.getColorString();

      this.input.prop('value', val);

      /**
       * (Input) Triggered on the input element when a new color is selected.
       *
       * @event change
       */
      this.input.trigger({
        type: 'change',
        colorpicker: this,
        color: this.color,
        value: val
      });
    }
  }

  /**
   * Changes the color adjustment bars using the current color object information.
   */
  updatePicker() {
    if (!this.hasColor()) {
      return;
    }

    let vertical = (this.options.horizontal === false),
      sl = vertical ? this.options.sliders : this.options.slidersHorz;

    let saturationGuide = this.picker.find('.colorpicker-saturation .colorpicker-guide'),
      hueGuide = this.picker.find('.colorpicker-hue .colorpicker-guide'),
      alphaGuide = this.picker.find('.colorpicker-alpha .colorpicker-guide');

    let hsva = this.color.hsvaRatio;

    if (hueGuide.length) {
      hueGuide.css(vertical ? 'top' : 'left', (vertical ? sl.hue.maxTop : sl.hue.maxLeft) * (1 - hsva.h));
    }

    if (alphaGuide.length) {
      alphaGuide.css(vertical ? 'top' : 'left', (vertical ? sl.alpha.maxTop : sl.alpha.maxLeft) * (1 - hsva.a));
    }

    if (saturationGuide.length) {
      saturationGuide.css({
        'top': sl.saturation.maxTop - hsva.v * sl.saturation.maxTop,
        'left': hsva.s * sl.saturation.maxLeft
      });
    }

    this.picker.find('.colorpicker-saturation')
      .css('backgroundColor', this.color.getHueOnlyCopy().toHexString()); // we only need hue

    this.picker.find('.colorpicker-alpha')
      .css('backgroundColor', this.color.toString('hex6')); // we don't need alpha

    this.picker.find('.colorpicker-color, .colorpicker-color div')
      .css('backgroundColor', this.color.toRgbString()); // we need all the channels
  }

  /**
   * If the component element is present, its background color is updated
   */
  updateComponent() {
    if (!this.hasColor()) {
      return;
    }

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

  /**
   * Updated the component color, the input value and the widget if a color is present.
   *
   * If force is true, it is updated anyway.
   *
   * @param {boolean} force
   */
  update(force) {
    if (this.hasColor() && ((this.getValue(false) !== false) || (force === true))) {
      // Update only if the current value (from input or data) is not empty
      this.updateComponent();
      this.updateInput();
      this.updatePicker();
    }
  }

  /**
   * Returns the color string from the input value or the 'data-color' attribute of the input or element.
   * If empty, it returns the defaultValue parameter.
   *
   * @param {String|*} [defaultValue]
   * @returns {String|*}
   */
  getValue(defaultValue = null) {
    defaultValue = (typeof defaultValue === 'undefined') ? this.options.fallbackColor : defaultValue;
    let candidates = [], val = false;

    if (this.hasInput()) {
      candidates.push(this.input.val());
      candidates.push(this.input.data('color'));
    }
    candidates.push(this.element.data('color'));

    candidates.map((item) => {
      if (item && (val === false)) {
        val = item;
      }
    });

    val = ((val === false) ? defaultValue : val);

    if (val instanceof Color) {
      return val.toString(this.format);
    }

    return val;
  }

  /**
   * Sets the color manually
   *
   * @fires changeColor
   * @param {String|Color} val
   */
  setValue(val) {
    this.color = this.createColor(val);
    this.update(true);

    /**
     * (Colorpicker) When the color is set programmatically with setValue().
     *
     * @event changeColor
     */
    this.element.trigger({
      type: 'changeColor',
      colorpicker: this,
      color: this.color,
      value: val
    });
  }

  /**
   * Creates a new color using the widget instance options (fallbackColor, format).
   *
   * @param {*} val
   * @returns {Color}
   */
  createColor(val) {
    val = val ? val : null;
    let fallback = this.options.fallbackColor ? this.options.fallbackColor : (this.hasColor() ? this.color.hsva : null);

    val = this.getPaletteColor(val, val);
    fallback = this.getPaletteColor(fallback, fallback);

    let color = new Color(val, {fallbackColor: fallback, format: this.format});

    if (color.hasTransparency() && !this.options.useAlpha) {
      // alpha is disabled
      return color.getOpaqueCopy();
    }

    return color;
  }

  /**
   * Given a colorName (alias), returns the corresponding color code or defaultValue.
   *
   * @param {String} colorName
   * @param {*} defaultValue
   * @returns {*}
   */
  getPaletteColor(colorName, defaultValue = null) {
    if (!(typeof colorName === 'string') || !this.options.colorPalette) {
      return defaultValue;
    }
    if (this.options.colorPalette.hasOwnProperty(colorName)) {
      return this.options.colorPalette[colorName];
    }
    return defaultValue;
  }

  /**
   * Given a colorValue, returns the corresponding color name (alias) or defaultValue.
   *
   * @param {String} colorValue
   * @param {*} defaultValue
   * @returns {*}
   */
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

  /**
   * Returns true if the widget has an associated input element, false otherwise
   * @returns {boolean}
   */
  hasInput() {
    return (this.input !== false);
  }

  /**
   * Returns true if this instance is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.disabled === true;
  }

  /**
   * Disables the widget and the input if any
   *
   * @fires disable
   * @returns {boolean}
   */
  disable() {
    if (this.hasInput()) {
      this.input.prop('disabled', true);
    }
    this.disabled = true;

    /**
     * (Colorpicker) When the widget has been disabled.
     *
     * @event disable
     */
    this.element.trigger({
      type: 'disable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Enables the widget and the input if any
   *
   * @fires enable
   * @returns {boolean}
   */
  enable() {
    if (this.hasInput()) {
      this.input.prop('disabled', false);
    }
    this.disabled = false;

    /**
     * (Colorpicker) When the widget has been enabled.
     *
     * @event enable
     */
    this.element.trigger({
      type: 'enable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Function triggered when clicking in one of the color adjustment bars
   *
   * @fires mousemove
   * @param {Event} e
   * @returns {boolean}
   */
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

      this.currentSlider.guide = zone.find('.colorpicker-guide')[0].style;
      this.currentSlider.left = e.pageX - offset.left;
      this.currentSlider.top = e.pageY - offset.top;
      this.mousePointer = {
        left: e.pageX,
        top: e.pageY
      };

      /**
       * (window.document) Triggered on mousedown for the document object,
       * so the color adjustment guide is moved to the clicked position.
       *
       * @event mousemove
       */
      $(window.document).on({
        'mousemove.colorpicker': $.proxy(this.mousemove, this),
        'touchmove.colorpicker': $.proxy(this.mousemove, this),
        'mouseup.colorpicker': $.proxy(this.mouseup, this),
        'touchend.colorpicker': $.proxy(this.mouseup, this)
      }).trigger('mousemove');
    }
    return false;
  }

  /**
   * Function triggered when dragging a guide inside one of the color adjustment bars.
   *
   * @fires changeColor
   * @param {Event} e
   * @returns {boolean}
   */
  mousemove(e) {
    if (!this.hasColor()) {
      return null;
    }

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

    /**
     * (Colorpicker) When the color guides have been dragged.
     *
     * @event changeColor
     */
    this.element.trigger({
      type: 'changeColor',
      colorpicker: this,
      color: this.color,
      value: this.getColorString()
    });
    return false;
  }

  /**
   * Function triggered when releasing the click in one of the color adjustment bars.
   *
   * @param {Event} e
   * @returns {boolean}
   */
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

  /**
   * Function triggered when the input has changed, so the colorpicker gets updated.
   *
   * @param {Event} e
   * @returns {boolean}
   */
  change(e) {
    this.keyup(e);
  }

  /**
   * Function triggered after a keyboard key has been released.
   *
   * @fires changeColor
   * @param {Event} e
   * @returns {boolean}
   */
  keyup(e) {
    this.color = this.createColor(this.input.val());
    if (this.getValue(false) !== false) {
      this.updateComponent();
      this.updatePicker();
    }

    /**
     * (Colorpicker) When a keyboard key has been released.
     *
     * @event changeColor
     */
    this.element.trigger({
      type: 'changeColor',
      colorpicker: this,
      color: this.color,
      value: this.input.val()
    });
  }
}

export default Colorpicker;
