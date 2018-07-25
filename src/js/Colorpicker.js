'use strict';

import Color from './Color';
import Extension from './Extension';
import defaults from './options';
import bundledExtensions from 'extensions';
import $ from 'jquery';
import SliderHandler from './SliderHandler';
import PopupHandler from './PopupHandler';
import InputHandler from './InputHandler';

let colorPickerIdCounter = 0;
let root = (typeof self !== 'undefined' ? self : this); // window

// This function is called every time a slider guide is moved
// The scope of "this" is the SliderHandler object
let onSliderGuideMove = function (handler, top, left) {
  if (!handler.currentSlider) {
    return;
  }

  let slider = handler.currentSlider, cp = handler.colorpicker;

  // Create a color object
  let color = !cp.hasColor() ? cp
    .createColor(cp.fallbackColor) : cp.color.getCopy();

  // Adjust the guide position
  slider.guideStyle.left = left + 'px';
  slider.guideStyle.top = top + 'px';

  // Adjust the color
  if (slider.callLeft) {
    color[slider.callLeft].call(color, left / slider.maxLeft);
  }
  if (slider.callTop) {
    color[slider.callTop].call(color, top / slider.maxTop);
  }

  // Set the new color
  cp.setValue(color);
};

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
   * Extension class
   *
   * @static
   * @type {Extension}
   */
  static get Extension() {
    return Extension;
  }

  /**
   * Internal color getter
   *
   * @type {Color|null}
   */
  get color() {
    return this.element.data('color');
  }

  /**
   * Internal color setter
   *
   * @ignore
   * @param {Color|null} value
   */
  set color(value) {
    this.element.data('color', value);
  }

  /**
   * @fires Colorpicker#colorpickerCreate
   * @param {Object|String} element
   * @param {Object} options
   * @constructor
   */
  constructor(element, options) {
    colorPickerIdCounter += 1;
    /**
     * The colorpicker instance number
     * @type {number}
     */
    this.id = colorPickerIdCounter;

    /**
     * Latest colorpicker event
     *
     * @type {{name: String, e: *}}
     */
    this.lastEvent = {
      alias: null,
      e: null
    };

    /**
     * The element that the colorpicker is bound to
     *
     * @type {*|jQuery}
     */
    this.element = $(element)
      .addClass('colorpicker-element')
      .attr('data-colorpicker-id', this.id);

    /**
     * @type {boolean}
     * @private
     */
    this.disabled = false;

    /**
     * @type {defaults}
     */
    this.options = $.extend(true, {}, defaults, options, this.element.data());

    /**
     * Extensions added to this instance
     *
     * @type {Extension[]}
     */
    this.extensions = [];

    // TODO: refactor into component handler
    /**
     * @type {*|jQuery}
     */
    this.component = (this.options.component !== false) ? this.element.find(this.options.component) : false;
    if (this.component && (this.component.length === 0)) {
      // not found
      this.component = false;
    }

    /**
     * The element where the
     * @type {*|jQuery}
     */
    this.container = (this.options.container === true) ? this.element : this.options.container;
    this.container = (this.container !== false) ? $(this.container) : false;

    /**
     * @type {InputHandler}
     */
    this.inputHandler = new InputHandler(this, root);
    /**
     * @type {SliderHandler}
     */
    this.sliderHandler = new SliderHandler(this, root, onSliderGuideMove);
    /**
     * @type {PopupHandler}
     */
    this.popupHandler = new PopupHandler(this, root);

    // Init extensions
    this._initExtensions();

    // Init color and format
    this._initColor();

    // Init picker
    this._initPickerElement();

    // Init handlers
    this.sliderHandler.bind();
    this.popupHandler.bind();
    this.inputHandler.bind();

    // Inject into the DOM (this may make it visible)
    this._injectPickerElement();

    // Update and force if there is a color option
    this.update(this.options.color !== false);

    // Emit colorpickerCreate event
    $($.proxy(function () {
      /**
       * (Colorpicker) When the Colorpicker instance has been created and the DOM is ready.
       *
       * @event Colorpicker#colorpickerCreate
       */
      this.element.trigger({
        type: 'colorpickerCreate',
        colorpicker: this,
        color: this.color
      });
    }, this));
  }

  _initExtensions() {
    if (!Array.isArray(this.options.extensions)) {
      this.options.extensions = [];
    }

    if (this.options.debug) {
      this.options.extensions.push({name: 'debugger'});
    }

    // Register and instantiate extensions
    this.options.extensions.forEach((ext) => {
      this.registerExtension(bundledExtensions[ext.name.toLowerCase()], ext.options || {});
    });
  }

  _initColor() {
    let colorValue = this.options.color !== false ? this.options.color : this.getValue();

    this.color = colorValue ? this.createColor(colorValue) : false;

    if (this.options.format === 'auto') {
      // If format is false, use the first parsed one from now on
      this.options.format = this.color.format;
    }
  }

  _initPickerElement() {
    let picker = this.picker = $(this.options.template);

    if (this.options.customClass) {
      picker.addClass(this.options.customClass);
    }

    if (this.options.horizontal) {
      picker.addClass('colorpicker-horizontal');
    }

    if (
      (this.options.useAlpha || (this.hasColor() && this.color.hasTransparency())) &&
      (this.options.useAlpha !== false)
    ) {
      this.options.useAlpha = true;
      picker.addClass('colorpicker-with-alpha');
    }
  }

  _injectPickerElement() {
    // Inject the colorpicker element into the DOM
    let pickerParent = this.container ? this.container :
      (this.options.popover ? null : root.document.body);

    if (pickerParent) {
      this.picker.appendTo(pickerParent);
    }
  }

  /**
   * Colorpicker bundled extension classes
   *
   * @static
   * @type {{Extension}}
   */
  static getBundledExtensions() {
    return bundledExtensions;
  }

  /**
   * Creates and registers the given extension
   *
   * @param {Extension} ExtensionClass The extension class to instantiate
   * @param {Object} [config] Extension configuration
   * @returns {Extension}
   */
  registerExtension(ExtensionClass, config = {}) {
    let ext = new ExtensionClass(this, config);

    this.extensions.push(ext);
    return ext;
  }

  /**
   * Destroys the current instance
   *
   * @fires Colorpicker#colorpickerDestroy
   */
  destroy() {
    this.sliderHandler.unbind();
    this.inputHandler.unbind();
    this.popupHandler.unbind();
    this.element.removeData('colorpicker', 'color').off('.colorpicker');
    if (this.component !== false) {
      this.component.off('.colorpicker');
    }
    this.element.removeClass('colorpicker-element');
    this.picker.remove();

    /**
     * (Colorpicker) When the instance is destroyed with all events unbound.
     *
     * @event Colorpicker#colorpickerDestroy
     */
    this.element.trigger({
      type: 'colorpickerDestroy',
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

  /**
   * @returns {*|String|Color}
   */
  get fallbackColor() {
    return this.options.fallbackColor ? this.options.fallbackColor : (this.hasColor() ? this.color : '#000');
  }

  /**
   * @returns {String|null}
   */
  get format() {
    if (this.options.format) {
      return this.options.format;
    }

    if (this.hasColor() && this.color.hasTransparency() && this.color.format.match(/^hex/)) {
      return this.options.enableHexAlpha ? 'hex8' : (this.isAlphaEnabled() ? 'rgba' : 'hex');
    }

    if (this.hasColor()) {
      return this.color.format;
    }

    return null;
  }

  /**
   * Shows the colorpicker widget if hidden.
   * If the colorpicker is disabled this call will be ignored.
   *
   * @fires Colorpicker#colorpickerShow
   * @param {Event} [e]
   */
  show(e) {
    this.popupHandler.show(e);
  }

  /**
   * Hides the colorpicker widget.
   * Hide is prevented when it is triggered by an event whose target element has been clicked/touched.
   *
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  hide(e) {
    this.popupHandler.hide(e);
  }

  /**
   * Toggles the colorpicker between visible or hidden
   *
   * @fires Colorpicker#colorpickerShow
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  toggle(e) {
    this.popupHandler.toggle(e);
  }

  /**
   * Returns the color string from the input value or the 'data-color' attribute of the input or element.
   * If empty, it returns the defaultValue parameter.
   *
   * @param {String|*} [defaultValue]
   * @returns {String|*}
   */
  getValue(defaultValue = null) {
    let candidates = [], val = false;

    if (this.inputHandler.hasInput()) {
      candidates.push(this.inputHandler.getValue());
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
   * @fires Colorpicker#colorpickerChange
   * @param {String|Color} val
   */
  setValue(val) {
    if (this.hasColor() && this.color.equals(val)) {
      // equal color object
      return;
    }

    let color = val ? this.createColor(val) : null;

    if (!this.hasColor() && !color) {
      // color was empty and the new one too
      return;
    }

    // force update if color is changed to empty
    let forceUpdate = this.hasColor() && !color;

    this.color = color;

    /**
     * (Colorpicker) When the color is set programmatically with setValue().
     *
     * @event Colorpicker#colorpickerChange
     */
    this.element.trigger({
      type: 'colorpickerChange',
      colorpicker: this,
      color: this.color,
      value: val
    });

    // force update if color has changed to empty
    this.update(forceUpdate);
  }

  /**
   * Updates the component color, the input value and the widget if a color is present.
   *
   * If force is true, it is updated anyway.
   *
   * @fires Colorpicker#colorpickerUpdate
   * @param {boolean} [force]
   */
  update(force = false) {
    let canUpdate = (this.hasColor() && ((this.getValue(false) !== false)));

    if (!canUpdate && (force !== true)) {
      return;
    }

    this.inputHandler.update();
    this._updateComponent();
    this._updatePicker();

    /**
     * (Colorpicker) Fired when the widget is updated.
     *
     * @event Colorpicker#colorpickerUpdate
     */
    this.element.trigger({
      type: 'colorpickerUpdate',
      colorpicker: this,
      color: this.color
    });
  }

  /**
   * Changes the color adjustment bars using the current color object information.
   * @private
   */
  _updatePicker() {
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

    let hex6Color = this.color.toString('hex6');
    let alphaBg = '';

    if (this.options.horizontal) {
      alphaBg = `linear-gradient(to right, ${hex6Color} 0%, transparent 100%)`;
    } else {
      alphaBg = `linear-gradient(to bottom, ${hex6Color} 0%, transparent 100%)`;
    }

    this.picker.find('.colorpicker-alpha-color').css('background', alphaBg);
  }

  /**
   * If the component element is present, its background color is updated
   * @private
   */
  _updateComponent() {
    if (!this.hasColor() || (this.component === false)) {
      return;
    }

    let colorStr = this.getSafeColorString();
    let styles = {'background': colorStr};

    let icn = this.component.find('i').eq(0);

    if (icn.length > 0) {
      icn.css(styles);
    } else {
      this.component.css(styles);
    }
  }

  /**
   * Creates a new color using the widget instance options (fallbackColor, format).
   *
   * @fires Colorpicker#colorpickerInvalid
   * @param {*} val
   * @param {boolean} useFallback
   * @returns {Color}
   */
  createColor(val, useFallback = true) {
    let color = new Color(this.resolveColor(val), {format: this.format});

    if (!color.isValid()) {
      let invalidColor = color, fallback;

      if (useFallback) {
        fallback = ((this.fallbackColor instanceof Color) && this.fallbackColor.isValid()) ?
          this.fallbackColor : this.resolveColor(this.fallbackColor);

        color = new Color(fallback, {format: this.format});

        if (!color.isValid() && useFallback) {
          throw new Error('The fallback color is invalid.');
        }
      }

      color.previous = invalidColor;

      /**
       * (Colorpicker) Fired when the color is invalid and the fallback color is going to be used.
       *
       * @event Colorpicker#colorpickerInvalid
       */
      this.element.trigger({
        type: 'colorpickerInvalid',
        colorpicker: this,
        color: color,
        value: val
      });
    }

    if (!this.isAlphaEnabled() && color.hasTransparency()) {
      // Alpha is disabled
      color.setAlpha(1);
    }

    if (!this.hasColor()) {
      // No previous color, so no need to compare
      return color;
    }

    let hsva = color.hsvaRatio;
    let prevHsva = this.color.hsvaRatio;

    if (
      hsva.s === 0 &&
      hsva.h === 0 &&
      prevHsva.h !== 0
    ) {
      // Hue was set to 0 because saturation was 0, use previous hue, since it was not meant to change...
      color.setHueRatio(prevHsva.h);
    }

    if (!this.isAlphaEnabled() && color.hasTransparency()) {
      // Alpha is disabled
      color.setAlpha(1);
    }

    return color;
  }

  /**
   * Checks if there is a color object, that it is valid and it is not a fallback
   * @returns {boolean}
   */
  isInvalidColor() {
    return !this.hasColor() || !this.color.isValid() || !!this.color.previous;
  }

  /**
   * Returns true if the useAlpha option is exactly true, false otherwise
   * @returns {boolean}
   */
  isAlphaEnabled() {
    return this.options.useAlpha === true;
  }

  /**
   * Returns the internal color formatted as string.
   * If there is no color, an empty string is returned.
   *
   * @returns {String}
   */
  getSafeColorString() {
    if (!this.hasColor()) {
      return '';
    }
    return this.color.toString(this.format);
  }

  /**
   * Resolves a color to its real representation, in case is not in a standard format (e.g. a custom color alias).
   * It also loops through all the extensions to delegate the conversion.
   *
   * @param {String|*} color
   * @returns {String|*|null}
   */
  resolveColor(color) {
    let extResolvedColor = false;

    $.each(this.extensions, function (name, ext) {
      if (extResolvedColor !== false) {
        // skip if resolved
        return;
      }
      extResolvedColor = ext.resolveColor(color);
    });

    return extResolvedColor ? extResolvedColor : color;
  }

  /**
   * Enables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerEnable
   * @returns {boolean}
   */
  enable() {
    this.inputHandler.enable();
    this.disabled = false;

    /**
     * (Colorpicker) When the widget has been enabled.
     *
     * @event Colorpicker#colorpickerEnable
     */
    this.element.trigger({
      type: 'colorpickerEnable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Disables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerDisable
   * @returns {boolean}
   */
  disable() {
    this.inputHandler.disable();
    this.disabled = true;

    /**
     * (Colorpicker) When the widget has been disabled.
     *
     * @event Colorpicker#colorpickerDisable
     */
    this.element.trigger({
      type: 'colorpickerDisable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Returns true if this instance is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.disabled === true;
  }
}

export default Colorpicker;
