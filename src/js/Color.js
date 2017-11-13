'use strict';

import tinycolor from 'tinycolor2';

let fallbackFallbackColor = '#000000';

export default class Color {
  /**
   * @returns {tinycolor}
   */
  static get TinyColor() {
    return tinycolor;
  }

  /**
   * @param {*} color
   * @param {{[fallbackColor], [format]}} [options]
   * @constructor
   */
  constructor(color, options = {fallbackColor: fallbackFallbackColor, format: null}) {
    /**
     * @type {*}
     */
    this.originalColor = color;

    /**
     * @type {{[fallbackColor], [format]}}
     */
    this.options = options;

    /**
     * @type {tinycolor}
     */
    this._api = null;

    /**
     * @type {{h, s, v, a}}
     */
    this._hsva = null;

    this.update(color);
  }

  update(color) {
    /**
     * @type {tinycolor}
     */
    this._api = tinycolor(color, {format: this.format});

    if (!this.isValid()) {
      // given color is invalid
      this._api = tinycolor(this.options.fallbackColor, {format: this.format ? this.format : 'rgba'});

      if (!this.isValid()) {
        // fallback color is invalid
        this._api = tinycolor(fallbackFallbackColor, {format: this.format ? this.format : 'rgba'});
      }
    }

    this._hsva = this._api.toHsv();
  }

  /**
   * @returns {Color}
   */
  getCopy() {
    return new Color(
      {h: this.h * 360, s: this.s * 100, v: this.v * 100, a: this.a},
      {format: this.format, fallbackColor: this.options.fallbackColor}
    );
  }

  /**
   * @returns {Color}
   */
  getHueOnlyCopy() {
    return new Color(
      {h: this.h * 360, s: 100, v: 100, a: this.a},
      {format: this.format, fallbackColor: this.options.fallbackColor}
    );
  }

  /**
   * @returns {Color}
   */
  getOpaqueCopy() {
    return new Color(
      {h: this.h * 360, s: this.s * 100, v: this.v * 100, a: 1},
      {format: this.format, fallbackColor: this.options.fallbackColor}
    );
  }

  get h() {
    return this._hsva.h / 360;
  }

  set h(val) {
    let oldVal = this._hsva.h;

    this._hsva.h = val;

    if (oldVal !== val) {
      this.update(this._hsva);
    }
  }

  get s() {
    return this._hsva.s;
  }

  set s(val) {
    let oldVal = this._hsva.s;

    this._hsva.s = val;

    if (oldVal !== val) {
      this.update(this._hsva);
    }
  }

  get v() {
    return this._hsva.v;
  }

  set v(val) {
    let oldVal = this._hsva.v;

    this._hsva.v = val;

    if (oldVal !== val) {
      this.update(this._hsva);
    }
  }

  get a() {
    return this._hsva.a;
  }

  set a(val) {
    let oldVal = this._hsva.a;

    this._hsva.a = val;

    if (oldVal !== val) {
      this.update(this._hsva);
    }
  }

  setHue(h) {
    this.h = (1 - h) * 360;
  }

  setSaturation(s) {
    this.s = s;
  }

  setBrightness(b) {
    this.v = 1 - b;
  }

  setAlpha(a) {
    this.a = 1 - a;
  }

  /**
   * @returns {String} One of "rgb", "prgb", "hex"/"hex6", "hex3", "hex8", "hsl", "hsv"/"hsb", "name"
   */
  get format() {
    return this.options.format ? this.options.format : (this._api ? this._api.getFormat() : null);
  }

  /**
   * @returns {boolean}
   */
  hasAlpha() {
    return this.a !== 1;
  }

  isFallback() {
    return this.originalColor !== this._api.getOriginalInput();
  }

  /**
   * @returns {boolean}
   */
  isValid() {
    return this._api.isValid();
  }

  toHexString() {
    return this.toString('hex6');
  }

  toRgbString() {
    return this.toString('rgb');
  }

  toHslString() {
    return this.toString('hsl');
  }

  toHsvString() {
    return this.toString('hsv');
  }

  /**
   * @param {string|null} [format] One of "rgb", "prgb", "hex"/"hex6", "hex3", "hex8", "hsl", "hsv"/"hsb", "name"
   * @returns {String}
   */
  toString(format = null) {
    format = (format ? format : this.format).replace(/a$/g, '').toLowerCase();

    // let color = this.hasChanged() ? this.getCopy() : this;
    let colorStr = this._api.toString(format);
    let original = this._api.getOriginalInput();

    if (original === 'transparent') {
      return 'transparent';
    }

    if (tinycolor.names.hasOwnProperty(original)) {
      return original;
    }

    return colorStr;
  }
}
