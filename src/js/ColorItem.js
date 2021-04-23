/**
 * Color manipulation class, specific for Bootstrap Colorpicker
 */
import QixColor from 'color';

/**
 * HSVA color data class, containing the hue, saturation, value and alpha
 * information.
 */
class HSVAColor {
  /**
   * @param {number|int} h
   * @param {number|int} s
   * @param {number|int} v
   * @param {number|int} a
   */
  constructor(h, s, v, a) {
    this.h = isNaN(h) ? 0 : h;
    this.s = isNaN(s) ? 0 : s;
    this.v = isNaN(v) ? 0 : v;
    this.a = isNaN(h) ? 1 : a;
  }

  toString() {
    return `${this.h}, ${this.s}%, ${this.v}%, ${this.a}`;
  }
}

/**
 * HSVA color manipulation
 */
class ColorItem {

  /**
   * Returns the HSVAColor class
   *
   * @static
   * @example let colorData = new ColorItem.HSVAColor(360, 100, 100, 1);
   * @returns {HSVAColor}
   */
  static get HSVAColor() {
    return HSVAColor;
  }

  /**
   * Applies a method of the QixColor API and returns a new Color object or
   * the return value of the method call.
   *
   * If no argument is provided, the internal QixColor object is returned.
   *
   * @param {String} fn QixColor function name
   * @param args QixColor function arguments
   * @example let darkerColor = color.api('darken', 0.25);
   * @example let luminosity = color.api('luminosity');
   * @example color = color.api('negate');
   * @example let qColor = color.api().negate();
   * @returns {ColorItem|QixColor|*}
   */
  api(fn, ...args) {
    if (arguments.length === 0) {
      return this._color;
    }

    let result = this._color[fn].apply(this._color, args);

    if (!(result instanceof QixColor)) {
      // return result of the method call
      return result;
    }

    return new ColorItem(result, this.format);
  }

  /**
   * Returns the original ColorItem constructor data,
   * plus a 'valid' flag to know if it's valid or not.
   *
   * @returns {{color: *, format: String, valid: boolean}}
   */
  get original() {
    return this._original;
  }

  /**
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data
   * @param {String|null} format Color model to convert to by default. Supported: 'rgb', 'hsl', 'hex'.
   * @param {boolean} disableHexInputFallback Disable fixing hex3 format
   */
  constructor(color = null, format = null, disableHexInputFallback = false) {
    this.replace(color, format, disableHexInputFallback);
  }

  /**
   * Replaces the internal QixColor object with a new one.
   * This also replaces the internal original color data.
   *
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data to be parsed (if needed)
   * @param {String|null} format Color model to convert to by default. Supported: 'rgb', 'hsl', 'hex'.
   * @param {boolean} disableHexInputFallback Disable fixing hex3 format
   * @example color.replace('rgb(255,0,0)', 'hsl');
   * @example color.replace(hsvaColorData);
   */
  replace(color, format = null, disableHexInputFallback = false) {
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
    this._color = ColorItem.parse(color, disableHexInputFallback);

    if (this._color === null) {
      this._color = QixColor();
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
   * @param {boolean} disableHexInputFallback Disable fixing hex3 format
   * @example let qColor = ColorItem.parse('rgb(255,0,0)');
   * @static
   * @returns {QixColor|null}
   */
  static parse(color, disableHexInputFallback = false) {
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

    if (color === null) {
      return null;
    }

    if (Array.isArray(color)) {
      format = 'hsv';
    }

    if (ColorItem.isHex(color) && (color.length !== 6 && color.length !== 7) && disableHexInputFallback) {
      return null;
    }

    try {
      return QixColor(color, format);
    } catch (e) {
      return null;
    }
  }

  /**
   * Sanitizes a color string, adding missing hash to hexadecimal colors
   * and converting 'transparent' to a color code.
   *
   * @param {String|*} str Color string
   * @example let colorStr = ColorItem.sanitizeString('ffaa00');
   * @static
   * @returns {String|*}
   */
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

  /**
   * Detects if a value is a string and a color in hexadecimal format (in any variant).
   *
   * @param {String} str
   * @example ColorItem.isHex('rgba(0,0,0)'); // false
   * @example ColorItem.isHex('ffaa00'); // true
   * @example ColorItem.isHex('#ffaa00'); // true
   * @static
   * @returns {boolean}
   */
  static isHex(str) {
    if (!(typeof str === 'string' || str instanceof String)) {
      return false;
    }

    return !!str.match(/^#?[0-9a-f]{2,}$/i);
  }

  /**
   * Sanitizes a color format to one supported by web browsers.
   * Returns an empty string of the format can't be recognised.
   *
   * @param {String|*} format
   * @example ColorItem.sanitizeFormat('rgba'); // 'rgb'
   * @example ColorItem.isHex('hex8'); // 'hex'
   * @example ColorItem.isHex('invalid'); // ''
   * @static
   * @returns {String} 'rgb', 'hsl', 'hex' or ''.
   */
  static sanitizeFormat(format) {
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
      case 'hwb': // HWB this is supported by Qix Color, but not by browsers
      case 'hwba':
        return 'hsl';
      default :
        return '';
    }
  }

  /**
   * Returns true if the color is valid, false if not.
   *
   * @returns {boolean}
   */
  isValid() {
    return this._original.valid === true;
  }

  /**
   * Hue value from 0 to 360
   *
   * @returns {int}
   */
  get hue() {
    return this._color.hue();
  }

  /**
   * Saturation value from 0 to 100
   *
   * @returns {int}
   */
  get saturation() {
    return this._color.saturationv();
  }

  /**
   * Value channel value from 0 to 100
   *
   * @returns {int}
   */
  get value() {
    return this._color.value();
  }

  /**
   * Alpha value from 0.0 to 1.0
   *
   * @returns {number}
   */
  get alpha() {
    let a = this._color.alpha();

    return isNaN(a) ? 1 : a;
  }

  /**
   * Default color format to convert to when calling toString() or string()
   *
   * @returns {String} 'rgb', 'hsl', 'hex' or ''
   */
  get format() {
    return this._format ? this._format : this._color.model;
  }

  /**
   * Sets the hue value
   *
   * @param {int} value Integer from 0 to 360
   */
  set hue(value) {
    this._color = this._color.hue(value);
  }

  /**
   * Sets the hue ratio, where 1.0 is 0, 0.5 is 180 and 0.0 is 360.
   *
   * @ignore
   * @param {number} h Ratio from 1.0 to 0.0
   */
  setHueRatio(h) {
    this.hue = ((1 - h) * 360);
  }

  /**
   * Sets the saturation value
   *
   * @param {int} value Integer from 0 to 100
   */
  set saturation(value) {
    this._color = this._color.saturationv(value);
  }

  /**
   * Sets the saturation ratio, where 1.0 is 100 and 0.0 is 0.
   *
   * @ignore
   * @param {number} s Ratio from 0.0 to 1.0
   */
  setSaturationRatio(s) {
    this.saturation = (s * 100);
  }

  /**
   * Sets the 'value' channel value
   *
   * @param {int} value Integer from 0 to 100
   */
  set value(value) {
    this._color = this._color.value(value);
  }

  /**
   * Sets the value ratio, where 1.0 is 0 and 0.0 is 100.
   *
   * @ignore
   * @param {number} v Ratio from 1.0 to 0.0
   */
  setValueRatio(v) {
    this.value = ((1 - v) * 100);
  }

  /**
   * Sets the alpha value. It will be rounded to 2 decimals.
   *
   * @param {int} value Float from 0.0 to 1.0
   */
  set alpha(value) {
    // 2 decimals max
    this._color = this._color.alpha(Math.round(value * 100) / 100);
  }

  /**
   * Sets the alpha ratio, where 1.0 is 0.0 and 0.0 is 1.0.
   *
   * @ignore
   * @param {number} a Ratio from 1.0 to 0.0
   */
  setAlphaRatio(a) {
    this.alpha = 1 - a;
  }

  /**
   * Sets the default color format
   *
   * @param {String} value Supported: 'rgb', 'hsl', 'hex'
   */
  set format(value) {
    this._format = ColorItem.sanitizeFormat(value);
  }

  /**
   * Returns true if the saturation value is zero, false otherwise
   *
   * @returns {boolean}
   */
  isDesaturated() {
    return this.saturation === 0;
  }

  /**
   * Returns true if the alpha value is zero, false otherwise
   *
   * @returns {boolean}
   */
  isTransparent() {
    return this.alpha === 0;
  }

  /**
   * Returns true if the alpha value is numeric and less than 1, false otherwise
   *
   * @returns {boolean}
   */
  hasTransparency() {
    return this.hasAlpha() && (this.alpha < 1);
  }

  /**
   * Returns true if the alpha value is numeric, false otherwise
   *
   * @returns {boolean}
   */
  hasAlpha() {
    return !isNaN(this.alpha);
  }

  /**
   * Returns a new HSVAColor object, based on the current color
   *
   * @returns {HSVAColor}
   */
  toObject() {
    return new HSVAColor(this.hue, this.saturation, this.value, this.alpha);
  }

  /**
   * Alias of toObject()
   *
   * @returns {HSVAColor}
   */
  toHsva() {
    return this.toObject();
  }

  /**
   * Returns a new HSVAColor object with the ratio values (from 0.0 to 1.0),
   * based on the current color.
   *
   * @ignore
   * @returns {HSVAColor}
   */
  toHsvaRatio() {
    return new HSVAColor(
      this.hue / 360,
      this.saturation / 100,
      this.value / 100,
      this.alpha
    );
  }

  /**
   * Converts the current color to its string representation,
   * using the internal format of this instance.
   *
   * @returns {String}
   */
  toString() {
    return this.string();
  }

  /**
   * Converts the current color to its string representation,
   * using the given format.
   *
   * @param {String|null} format Format to convert to. If empty or null, the internal format will be used.
   * @returns {String}
   */
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

  /**
   * Returns true if the given color values equals this one, false otherwise.
   * The format is not compared.
   * If any of the colors is invalid, the result will be false.
   *
   * @param {ColorItem|HSVAColor|QixColor|String|*|null} color Color data
   *
   * @returns {boolean}
   */
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

export {
  HSVAColor,
  ColorItem
};
