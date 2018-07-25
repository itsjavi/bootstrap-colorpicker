'use strict';

import Color from './Color';
import $ from 'jquery';

/**
 * Handles everything related to the colorpicker color
 */
class ColorHandler {
  /**
   * @returns {*|String|Color}
   */
  get fallback() {
    return this.colorpicker.options.fallbackColor ?
      this.colorpicker.options.fallbackColor : (this.hasColor() ? this.color : '#000');
  }

  /**
   * @returns {String|null}
   */
  get format() {
    if (this.colorpicker.options.format) {
      return this.colorpicker.options.format;
    }

    if (this.hasColor() && this.color.hasTransparency() && this.color.format.match(/^hex/)) {
      return this.isAlphaEnabled() ? (this.colorpicker.options.enableHexAlpha ? 'hex8' : 'rgba') : 'hex';
    }

    if (this.hasColor()) {
      return this.color.format;
    }

    return null;
  }

  /**
   * Internal color getter
   *
   * @type {Color|null}
   */
  get color() {
    return this.colorpicker.element.data('color');
  }

  /**
   * Internal color setter
   *
   * @ignore
   * @param {Color|null} value
   */
  set color(value) {
    this.colorpicker.element.data('color', value);

    if ((value instanceof Color) && (this.colorpicker.options.format === 'auto')) {
      // If format is 'auto', use the first parsed one from now on
      this.colorpicker.options.format = this.color.format;
    }
  }

  /**
   * @param {Colorpicker} colorpicker
   */
  constructor(colorpicker) {
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
  }

  bind() {
    // if the color option is set
    if (this.colorpicker.options.color) {
      this.color = this.createColor(this.colorpicker.options.color);
      return;
    }

    // if element[color] is empty and the input has a value
    if (!this.color && !!this.colorpicker.inputHandler.getValue()) {
      this.color = this.createColor(this.colorpicker.inputHandler.getValue());
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

    return this.color.toString(this.format);
  }

  /**
   * Sets the color value
   *
   * @param {String|Color} val
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
   * @returns {Color}
   */
  createColor(val, fallbackOnInvalid = true) {
    let color = new Color(this.resolveColorDelegate(val), {format: this.format});

    if (!color.isValid()) {
      if (fallbackOnInvalid) {
        let invalidColor = color;

        color = this.getFallbackColor();
        color.previous = invalidColor;
      }

      /**
       * (Colorpicker) Fired when the color is invalid and the fallback color is going to be used.
       *
       * @event Colorpicker#colorpickerInvalid
       */
      this.colorpicker.element.trigger({
        type: 'colorpickerInvalid',
        colorpicker: this.colorpicker,
        color: color,
        value: val
      });
    }

    if (!this.isAlphaEnabled()) {
      // Alpha is disabled
      color.setAlpha(1);
    }

    return color;
  }

  /**
   * Preserves the hue of the given color if the previous one
   * was identical, but without saturation.
   *
   * @param {Color} color
   * @param {Color} prevColor
   * @returns {Color}
   */
  preserveHue(color, prevColor) {
    if (!this.hasColor()) {
      // No previous color, so no need to compare
      return color;
    }

    let hsva = color.hsvaRatio;
    let prevHsva = prevColor.hsvaRatio;

    // Hue was set to 0 because saturation was 0,
    // use previous hue to preserve it
    if (
      hsva.s === 0 &&
      hsva.h === 0 &&
      prevHsva.h !== 0
    ) {
      color.setHueRatio(prevHsva.h);
    }

    return color;
  }

  getFallbackColor() {
    if (this.fallback === this.color) {
      return this.color;
    }

    let fallback = this.resolveColorDelegate(this.fallback);
    let color = new Color(fallback, {format: this.format});

    if (!color.isValid()) {
      throw new Error('The fallback color is invalid.');
    }

    return color;
  }

  /**
   * Delegates the color resolution to the colorpicker extensions.
   *
   * @param {String|*} color
   * @returns {Color|String|*|null}
   */
  resolveColorDelegate(color) {
    let extResolvedColor = false;

    $.each(this.colorpicker.extensions, function (name, ext) {
      if (extResolvedColor !== false) {
        // skip if resolved
        return;
      }
      extResolvedColor = ext.resolveColor(color);
    });

    return extResolvedColor ? extResolvedColor : color;
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
    return (this.colorpicker.options.useAlpha !== false);
  }

  /**
   * Returns true if the current color object is an instance of Color, false otherwise.
   * @returns {boolean}
   */
  hasColor() {
    return this.color instanceof Color;
  }
}

export default ColorHandler;
