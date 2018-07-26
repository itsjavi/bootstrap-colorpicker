/**
 * Color manipulation class, specific for Bootstrap Colorpicker
 */
import QixColor from 'color';

class HSVAColor {
  constructor(h, s, v, a) {
    this.h = h;
    this.s = s;
    this.v = v;
    this.a = a;
  }
}

/**
 * HSVA color manipulation
 */
class ColorItem {

  /**
   * Returns the HSVAColor class
   *
   * @returns {HSVAColor}
   */
  static get HSVAColor() {
    return HSVAColor;
  }

  /**
   * Applies a method of the QixColor API and returns a new Color object.
   *
   * @param {String} fn QixColor function name
   * @param args
   * @returns {ColorItem|*}
   */
  api(fn, ...args) {
    let newColor = this._color[fn].apply(this._color, args);

    if (!(newColor instanceof QixColor)) {
      return newColor;
    }

    return new ColorItem(newColor, this.format);
  }

  /**
   * Returns the original constructor data
   *
   * @returns {{color: *, format: String}}
   */
  get original() {
    return this._original;
  }

  /**
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data
   * @param {String|null} format Color model to convert to by default
   */
  constructor(color = null, format = null) {
    this.replace(color, format);
  }

  /**
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data
   * @param {String|null} format Color model to convert to by default
   */
  replace(color, format = null) {
    let fallback = null;

    format = ColorItem.sanitizeFormat(format);

    /**
     * @type {{color: *, format: String}}
     * @private
     */
    this._original = {
      color: color,
      format: format,
      valid: true
    };
    /**
     * @type {QixColor}
     * @private
     */
    this._color = ColorItem.parse(color);

    if (this._color === null) {
      this._color = QixColor(fallback);
      this._original.valid = false;
      return;
    }

    /**
     * @type {*|string}
     * @private
     */
    this._format = format ? format :
      (ColorItem.isHex(color) ? 'hex' : this._color.model);
  }

  /**
   * Parses the color returning a Qix Color object or null if cannot be
   * parsed.
   *
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data
   * @returns {QixColor}
   */
  static parse(color) {
    if (color instanceof QixColor) {
      return color;
    }

    if (color instanceof ColorItem) {
      return color._color;
    }

    let format = null;

    if (color instanceof HSVAColor) {
      color = [color.h, color.s, color.v, isNaN(color.a) ? 1 : color.a];
    } else {
      color = ColorItem.sanitizeString(color);
    }

    if (Array.isArray(color)) {
      format = 'hsv';
    }

    try {
      return QixColor(color, format);
    } catch (e) {
      return null;
    }
  }

  static sanitizeString(str) {
    if (!(typeof str === 'string' || str instanceof String)) {
      return str;
    }

    if (str.match(/^[0-9a-f]{2,}$/i)) {
      return `#${str}`;
    }

    if (str.toLowerCase() === 'transparent') {
      return '#FFFFFF00';
    }

    return str;
  }

  static isHex(str) {
    if (!(typeof str === 'string' || str instanceof String)) {
      return false;
    }

    return !!str.match(/^#?[0-9a-f]{2,}$/i);
  }

  static sanitizeFormat(format) {
    // return formats only supported by web browsers
    switch (format) {
      case 'hex':
      case 'hex3':
      case 'hex4':
      case 'hex6':
      case 'hex8':
        return 'hex';
      case 'rgb':
      case 'rgba':
      case 'keyword':
      case 'name':
        return 'rgb';
      case 'hsl':
      case 'hsla':
      case 'hsv':
      case 'hsva':
      case 'hwb':
      case 'hwba':
        return 'hsl';
      default :
        return '';
    }
  }

  isValid() {
    return this._original.valid === true;
  }

  /**
   * @returns int
   */
  get hue() {
    return this._color.hue();
  }

  get saturation() {
    return this._color.saturationv();
  }

  get value() {
    return this._color.value();
  }

  get alpha() {
    let a = this._color.alpha();

    return isNaN(a) ? 1 : a;
  }

  get format() {
    return this._format ? this._format : this._color.model;
  }

  set hue(value) {
    this._color = this._color.hue(value);
  }

  set saturation(value) {
    this._color = this._color.saturationv(value);
  }

  set value(value) {
    this._color = this._color.value(value);
  }

  set alpha(value) {
    // 2 decimals max
    this._color = this._color.alpha(Math.round(value * 100) / 100);
  }

  set format(value) {
    this._format = ColorItem.sanitizeFormat(value);
  }

  /**
   * @param {number} h Ratio from 0.0 to 1.0
   */
  setHueRatio(h) {
    this.hue = ((1 - h) * 360);
  }

  /**
   * @param {number} s Ratio from 0.0 to 1.0
   */
  setSaturationRatio(s) {
    this.saturation = (s * 100);
  }

  /**
   * @param {number} v Ratio from 0.0 to 1.0
   */
  setBrightnessRatio(l) {
    this.value = (1 - l) * 100;
  }

  /**
   * @param {number} a Ratio from 0.0 to 1.0
   */
  setAlphaRatio(a) {
    this.alpha = 1 - a;
  }

  isDesaturated() {
    return this.saturation === 0;
  }

  isTransparent() {
    return this.alpha === 0;
  }

  hasTransparency() {
    return this.hasAlpha() && (this.alpha < 1);
  }

  hasAlpha() {
    return (this.alpha !== false);
  }

  toObject() {
    return new HSVAColor(this.hue, this.saturation, this.value, this.alpha);
  }

  toHsva() {
    return this.toObject();
  }

  toHsvaRatio() {
    return new HSVAColor(
      this.hue / 360,
      this.saturation / 100,
      this.value / 100,
      this.alpha
    );
  }

  toString() {
    return this.string();
  }

  string(format = null) {
    format = ColorItem.sanitizeFormat(format ? format : this.format);

    if (!format) {
      return this._color.round().string();
    }

    if (this._color[format] === undefined) {
      throw new Error(`Unsupported color format: '${format}'`);
    }

    let str = this._color[format]();

    return str.round ? str.round().string() : str;
  }

  equals(color) {
    color = (color instanceof ColorItem) ? color : new ColorItem(color);

    if (!color.isValid() || !this.isValid()) {
      return false;
    }

    return (
      this.hue === color.hue &&
      this.saturation === color.saturation &&
      this.value === color.value &&
      this.alpha === color.alpha
    );
  }

  /**
   * Creates a copy of this instance
   *
   * @returns {ColorItem}
   */
  getClone() {
    return new ColorItem(this._color, this.format);
  }

  /**
   * Creates a copy of this instance, only copying the hue value,
   * and setting the others to its max value.
   *
   * @returns {ColorItem}
   */
  getCloneHueOnly() {
    return new ColorItem([this.hue, 100, 100, 1], this.format);
  }

  /**
   * Creates a copy of this instance setting the alpha to the max.
   *
   * @returns {ColorItem}
   */
  getCloneOpaque() {
    return new ColorItem(this._color.alpha(1), this.format);
  }

  /**
   * Converts the color to a RGB string
   *
   * @returns {String}
   */
  toRgbString() {
    return this.string('rgb');
  }

  /**
   * Converts the color to a Hexadecimal string
   *
   * @returns {String}
   */
  toHexString() {
    return this.string('hex');
  }

  /**
   * Converts the color to a HSL string
   *
   * @returns {String}
   */
  toHslString() {
    return this.string('hsl');
  }

  /**
   * Returns true if the color is dark, false otherwhise.
   * This is useful to decide a text color.
   *
   * @returns {boolean}
   */
  isDark() {
    return this._color.isDark();
  }

  /**
   * Returns true if the color is light, false otherwhise.
   * This is useful to decide a text color.
   *
   * @returns {boolean}
   */
  isLight() {
    return this._color.isLight();
  }

  /**
   * Generates a list of colors using the given hue-based formula or the given array of hue values.
   * Hue formulas can be extended using ColorItem.colorFormulas static property.
   *
   * @param {String|Number[]} formula Examples: 'complementary', 'triad', 'tetrad', 'splitcomplement', [180, 270]
   * @example let colors = color.generate('triad');
   * @example let colors = color.generate([45, 80, 112, 200]);
   * @returns {ColorItem[]}
   */
  generate(formula) {
    let hues = [];

    if (Array.isArray(formula)) {
      hues = formula;
    } else if (!ColorItem.colorFormulas.hasOwnProperty(formula)) {
      throw new Error(`No color formula found with the name '${formula}'.`);
    } else {
      hues = ColorItem.colorFormulas[formula];
    }

    let colors = [], mainColor = this._color, format = this.format;

    hues.forEach(function (hue) {
      let levels = [
        hue ? ((mainColor.hue() + hue) % 360) : mainColor.hue(),
        mainColor.saturationv(),
        mainColor.value(),
        mainColor.alpha()
      ];

      colors.push(new ColorItem(levels, format));
    });

    return colors;
  }
}

/**
 * List of hue-based color formulas used by ColorItem.prototype.generate()
 *
 * @static
 * @type {{complementary: number[], triad: number[], tetrad: number[], splitcomplement: number[]}}
 */
ColorItem.colorFormulas = {
  complementary: [180],
  triad: [0, 120, 240],
  tetrad: [0, 90, 180, 270],
  splitcomplement: [0, 72, 216]
};

export default ColorItem;
