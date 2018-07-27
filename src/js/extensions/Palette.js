'use strict';

import Extension from 'Extension';
import $ from 'jquery';

let defaults = {
  /**
   * Key-value pairs defining a color alias and its CSS color representation.
   *
   * They can also be just an array of values. In that case, no special names are used, only the real colors.
   *
   * @type {Object|Array}
   * @default null
   * @example
   *  {
   *   'black': '#000000',
   *   'white': '#ffffff',
   *   'red': '#FF0000',
   *   'default': '#777777',
   *   'primary': '#337ab7',
   *   'success': '#5cb85c',
   *   'info': '#5bc0de',
   *   'warning': '#f0ad4e',
   *   'danger': '#d9534f'
   *  }
   *
   * @example ['#f0ad4e', '#337ab7', '#5cb85c']
   */
  colors: null,
  /**
   * If true, when a color swatch is selected the name (alias) will be used as input value,
   * otherwise the swatch real color value will be used.
   *
   * @type {boolean}
   * @default true
   */
  namesAsValues: true
};

/**
 * Palette extension
 * @ignore
 */
class Palette extends Extension {

  /**
   * @returns {Object|Array}
   */
  get colors() {
    return this.options.colors;
  }

  constructor(colorpicker, options = {}) {
    super(colorpicker, $.extend(true, {}, defaults, options));

    if ((!Array.isArray(this.options.colors)) && (typeof this.options.colors !== 'object')) {
      this.options.colors = null;
    }
  }

  /**
   * @returns {int}
   */
  getLength() {
    if (!this.options.colors) {
      return 0;
    }

    if (Array.isArray(this.options.colors)) {
      return this.options.colors.length;
    }

    if (typeof this.options.colors === 'object') {
      return Object.keys(this.options.colors).length;
    }

    return 0;
  }

  resolveColor(color, realColor = true) {
    if (this.getLength() <= 0) {
      return false;
    }

    // Array of colors
    if (Array.isArray(this.options.colors)) {
      if (this.options.colors.indexOf(color) >= 0) {
        return color;
      }
      if (this.options.colors.indexOf(color.toUpperCase()) >= 0) {
        return color.toUpperCase();
      }
      if (this.options.colors.indexOf(color.toLowerCase()) >= 0) {
        return color.toLowerCase();
      }
      return false;
    }

    if (typeof this.options.colors !== 'object') {
      return false;
    }

    // Map of objects
    if (!this.options.namesAsValues || realColor) {
      return this.getValue(color, false);
    }
    return this.getName(color, this.getName('#' + color));
  }

  /**
   * Given a color value, returns the corresponding color name or defaultValue.
   *
   * @param {String} value
   * @param {*} defaultValue
   * @returns {*}
   */
  getName(value, defaultValue = false) {
    if (!(typeof value === 'string') || !this.options.colors) {
      return defaultValue;
    }
    for (let name in this.options.colors) {
      if (!this.options.colors.hasOwnProperty(name)) {
        continue;
      }
      if (this.options.colors[name].toLowerCase() === value.toLowerCase()) {
        return name;
      }
    }
    return defaultValue;
  }

  /**
   * Given a color name, returns the corresponding color value or defaultValue.
   *
   * @param {String} name
   * @param {*} defaultValue
   * @returns {*}
   */
  getValue(name, defaultValue = false) {
    if (!(typeof name === 'string') || !this.options.colors) {
      return defaultValue;
    }
    if (this.options.colors.hasOwnProperty(name)) {
      return this.options.colors[name];
    }
    return defaultValue;
  }
}

export default Palette;
