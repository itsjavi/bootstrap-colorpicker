'use strict';

import $ from 'jquery';
import ColorItem from './ColorItem';

/**
 * Handles everything related to the colorpicker color
 * @ignore
 */
class ColorHandler {
  /**
   * @param {Colorpicker} colorpicker
   */
  constructor(colorpicker) {
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
  }

  /**
   * @returns {*|String|ColorItem}
   */
  get fallback() {
    return this.colorpicker.options.fallbackColor ?
      this.colorpicker.options.fallbackColor : (this.hasColor() ? this.color : null);
  }

  /**
   * @returns {String|null}
   */
  get format() {
    if (this.colorpicker.options.format) {
      return this.colorpicker.options.format;
    }

    if (this.hasColor() && this.color.hasTransparency() && this.color.format.match(/^hex/)) {
      return this.isAlphaEnabled() ? 'rgba' : 'hex';
    }

    if (this.hasColor()) {
      return this.color.format;
    }

    return 'rgb';
  }

  /**
   * Internal color getter
   *
   * @type {ColorItem|null}
   */
  get color() {
    return this.colorpicker.element.data('color');
  }

  /**
   * Internal color setter
   *
   * @ignore
   * @param {ColorItem|null} value
   */
  set color(value) {
    this.colorpicker.element.data('color', value);

    if ((value instanceof ColorItem) && (this.colorpicker.options.format === 'auto')) {
      // If format is 'auto', use the first parsed one from now on
      this.colorpicker.options.format = this.color.format;
    }
  }

  bind() {
    // if the color option is set
    if (this.colorpicker.options.color) {
      this.color = this.createColor(this.colorpicker.options.color);
      return;
    }

    // if element[color] is empty and the input has a value
    if (!this.color && !!this.colorpicker.inputHandler.getValue()) {
      this.color = this.createColor(
        this.colorpicker.inputHandler.getValue(), this.colorpicker.options.autoInputFallback
      );
    }
  }

  unbind() {
    this.colorpicker.element.removeData('color');
  }

  /**
   * Returns the color string from the input value or the 'data-color' attribute of the input or element.
   * If empty, it returns the defaultValue parameter.
   *
   * @returns {String|*}
   */
  getColorString() {
    if (!this.hasColor()) {
      return '';
    }

    return this.color.string(this.format);
  }

  /**
   * Sets the color value
   *
   * @param {String|ColorItem} val
   */
  setColorString(val) {
    let color = val ? this.createColor(val) : null;

    this.color = color ? color : null;
  }

  /**
   * Creates a new color using the widget instance options (fallbackColor, format).
   *
   * @fires Colorpicker#colorpickerInvalid
   * @param {*} val
   * @param {boolean} fallbackOnInvalid
   * @param {boolean} autoHexInputFallback
   * @returns {ColorItem}
   */
  createColor(val, fallbackOnInvalid = true, autoHexInputFallback = false) {
    let disableHexInputFallback = !fallbackOnInvalid && !autoHexInputFallback;

    let color = new ColorItem(this.resolveColorDelegate(val), this.format, disableHexInputFallback);

    if (!color.isValid()) {
      if (fallbackOnInvalid) {
        color = this.getFallbackColor();
      }

      /**
       * (Colorpicker) Fired when the color is invalid and the fallback color is going to be used.
       *
       * @event Colorpicker#colorpickerInvalid
       */
      this.colorpicker.trigger('colorpickerInvalid', color, val);
    }

    if (!this.isAlphaEnabled()) {
      // Alpha is disabled
      color.alpha = 1;
    }

    return color;
  }

  getFallbackColor() {
    if (this.fallback && (this.fallback === this.color)) {
      return this.color;
    }

    let fallback = this.resolveColorDelegate(this.fallback);

    let color = new ColorItem(fallback, this.format);

    if (!color.isValid()) {
      console.warn('The fallback color is invalid. Falling back to the previous color or black if any.');
      return this.color ? this.color : new ColorItem('#000000', this.format);
    }

    return color;
  }

  /**
   * @returns {ColorItem}
   */
  assureColor() {
    if (!this.hasColor()) {
      this.color = this.getFallbackColor();
    }

    return this.color;
  }

  /**
   * Delegates the color resolution to the colorpicker extensions.
   *
   * @param {String|*} color
   * @param {boolean} realColor if true, the color should resolve into a real (not named) color code
   * @returns {ColorItem|String|*|null}
   */
  resolveColorDelegate(color, realColor = true) {
    let extResolvedColor = false;

    $.each(this.colorpicker.extensions, function (name, ext) {
      if (extResolvedColor !== false) {
        // skip if resolved
        return;
      }
      extResolvedColor = ext.resolveColor(color, realColor);
    });

    return extResolvedColor ? extResolvedColor : color;
  }

  /**
   * Checks if there is a color object, that it is valid and it is not a fallback
   * @returns {boolean}
   */
  isInvalidColor() {
    return !this.hasColor() || !this.color.isValid();
  }

  /**
   * Returns true if the useAlpha option is exactly true, false otherwise
   * @returns {boolean}
   */
  isAlphaEnabled() {
    return (this.colorpicker.options.useAlpha !== false);
  }

  /**
   * Returns true if the current color object is an instance of Color, false otherwise.
   * @returns {boolean}
   */
  hasColor() {
    return this.color instanceof ColorItem;
  }
}

export default ColorHandler;
