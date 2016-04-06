/*!
 * Bootstrap Colorpicker v2.3.5
 * https://itsjaviaguilar.github.io/bootstrap-colorpicker/
 *
 * Originally written by (c) 2012 Stefan Petre
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 */

(function(factory) {
  "use strict";
  if (typeof exports === 'object') {
    module.exports = factory(window.jQuery);
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (window.jQuery && !window.jQuery.fn.colorpicker) {
    factory(window.jQuery);
  }
}(function($) {
  'use strict';

  /**
   * Color manipulation helper class
   *
   * @param {Object|String} val
   * @param {Object} predefinedColors
   * @constructor
   */
  var Color = function(val, predefinedColors) {
    this.value = {
      h: 0,
      s: 0,
      b: 0,
      a: 1
    };
    this.origFormat = null; // original string format
    if (predefinedColors) {
      $.extend(this.colors, predefinedColors);
    }
    if (val) {
      if (val.toLowerCase !== undefined) {
        // cast to string
        val = val + '';
        this.setColor(val);
      } else if (val.h !== undefined) {
        this.value = val;
      }
    }
  };

  Color.prototype = {
    constructor: Color,
    // 140 predefined colors from the HTML Colors spec
    colors: {
      "aliceblue": "#f0f8ff",
      "antiquewhite": "#faebd7",
      "aqua": "#00ffff",
      "aquamarine": "#7fffd4",
      "azure": "#f0ffff",
      "beige": "#f5f5dc",
      "bisque": "#ffe4c4",
      "black": "#000000",
      "blanchedalmond": "#ffebcd",
      "blue": "#0000ff",
      "blueviolet": "#8a2be2",
      "brown": "#a52a2a",
      "burlywood": "#deb887",
      "cadetblue": "#5f9ea0",
      "chartreuse": "#7fff00",
      "chocolate": "#d2691e",
      "coral": "#ff7f50",
      "cornflowerblue": "#6495ed",
      "cornsilk": "#fff8dc",
      "crimson": "#dc143c",
      "cyan": "#00ffff",
      "darkblue": "#00008b",
      "darkcyan": "#008b8b",
      "darkgoldenrod": "#b8860b",
      "darkgray": "#a9a9a9",
      "darkgreen": "#006400",
      "darkkhaki": "#bdb76b",
      "darkmagenta": "#8b008b",
      "darkolivegreen": "#556b2f",
      "darkorange": "#ff8c00",
      "darkorchid": "#9932cc",
      "darkred": "#8b0000",
      "darksalmon": "#e9967a",
      "darkseagreen": "#8fbc8f",
      "darkslateblue": "#483d8b",
      "darkslategray": "#2f4f4f",
      "darkturquoise": "#00ced1",
      "darkviolet": "#9400d3",
      "deeppink": "#ff1493",
      "deepskyblue": "#00bfff",
      "dimgray": "#696969",
      "dodgerblue": "#1e90ff",
      "firebrick": "#b22222",
      "floralwhite": "#fffaf0",
      "forestgreen": "#228b22",
      "fuchsia": "#ff00ff",
      "gainsboro": "#dcdcdc",
      "ghostwhite": "#f8f8ff",
      "gold": "#ffd700",
      "goldenrod": "#daa520",
      "gray": "#808080",
      "green": "#008000",
      "greenyellow": "#adff2f",
      "honeydew": "#f0fff0",
      "hotpink": "#ff69b4",
      "indianred": "#cd5c5c",
      "indigo": "#4b0082",
      "ivory": "#fffff0",
      "khaki": "#f0e68c",
      "lavender": "#e6e6fa",
      "lavenderblush": "#fff0f5",
      "lawngreen": "#7cfc00",
      "lemonchiffon": "#fffacd",
      "lightblue": "#add8e6",
      "lightcoral": "#f08080",
      "lightcyan": "#e0ffff",
      "lightgoldenrodyellow": "#fafad2",
      "lightgrey": "#d3d3d3",
      "lightgreen": "#90ee90",
      "lightpink": "#ffb6c1",
      "lightsalmon": "#ffa07a",
      "lightseagreen": "#20b2aa",
      "lightskyblue": "#87cefa",
      "lightslategray": "#778899",
      "lightsteelblue": "#b0c4de",
      "lightyellow": "#ffffe0",
      "lime": "#00ff00",
      "limegreen": "#32cd32",
      "linen": "#faf0e6",
      "magenta": "#ff00ff",
      "maroon": "#800000",
      "mediumaquamarine": "#66cdaa",
      "mediumblue": "#0000cd",
      "mediumorchid": "#ba55d3",
      "mediumpurple": "#9370d8",
      "mediumseagreen": "#3cb371",
      "mediumslateblue": "#7b68ee",
      "mediumspringgreen": "#00fa9a",
      "mediumturquoise": "#48d1cc",
      "mediumvioletred": "#c71585",
      "midnightblue": "#191970",
      "mintcream": "#f5fffa",
      "mistyrose": "#ffe4e1",
      "moccasin": "#ffe4b5",
      "navajowhite": "#ffdead",
      "navy": "#000080",
      "oldlace": "#fdf5e6",
      "olive": "#808000",
      "olivedrab": "#6b8e23",
      "orange": "#ffa500",
      "orangered": "#ff4500",
      "orchid": "#da70d6",
      "palegoldenrod": "#eee8aa",
      "palegreen": "#98fb98",
      "paleturquoise": "#afeeee",
      "palevioletred": "#d87093",
      "papayawhip": "#ffefd5",
      "peachpuff": "#ffdab9",
      "peru": "#cd853f",
      "pink": "#ffc0cb",
      "plum": "#dda0dd",
      "powderblue": "#b0e0e6",
      "purple": "#800080",
      "red": "#ff0000",
      "rosybrown": "#bc8f8f",
      "royalblue": "#4169e1",
      "saddlebrown": "#8b4513",
      "salmon": "#fa8072",
      "sandybrown": "#f4a460",
      "seagreen": "#2e8b57",
      "seashell": "#fff5ee",
      "sienna": "#a0522d",
      "silver": "#c0c0c0",
      "skyblue": "#87ceeb",
      "slateblue": "#6a5acd",
      "slategray": "#708090",
      "snow": "#fffafa",
      "springgreen": "#00ff7f",
      "steelblue": "#4682b4",
      "tan": "#d2b48c",
      "teal": "#008080",
      "thistle": "#d8bfd8",
      "tomato": "#ff6347",
      "turquoise": "#40e0d0",
      "violet": "#ee82ee",
      "wheat": "#f5deb3",
      "white": "#ffffff",
      "whitesmoke": "#f5f5f5",
      "yellow": "#ffff00",
      "yellowgreen": "#9acd32",
      "transparent": "transparent"
    },
    _sanitizeNumber: function(val) {
      if (typeof val === 'number') {
        return val;
      }
      if (isNaN(val) || (val === null) || (val === '') || (val === undefined)) {
        return 1;
      }
      if (val === '') {
        return 0;
      }
      if (val.toLowerCase !== undefined) {
        if (val.match(/^\./)) {
          val = "0" + val;
        }
        return Math.ceil(parseFloat(val) * 100) / 100;
      }
      return 1;
    },
    isTransparent: function(strVal) {
      if (!strVal) {
        return false;
      }
      strVal = strVal.toLowerCase().trim();
      return (strVal === 'transparent') || (strVal.match(/#?00000000/)) || (strVal.match(/(rgba|hsla)\(0,0,0,0?\.?0\)/));
    },
    rgbaIsTransparent: function(rgba) {
      return ((rgba.r === 0) && (rgba.g === 0) && (rgba.b === 0) && (rgba.a === 0));
    },
    //parse a string to HSB
    setColor: function(strVal) {
      strVal = strVal.toLowerCase().trim();
      if (strVal) {
        if (this.isTransparent(strVal)) {
          this.value = {
            h: 0,
            s: 0,
            b: 0,
            a: 0
          };
        } else {
          this.value = this.stringToHSB(strVal) || {
            h: 0,
            s: 0,
            b: 0,
            a: 1
          }; // if parser fails, defaults to black
        }
      }
    },
    stringToHSB: function(strVal) {
      strVal = strVal.toLowerCase();
      var alias;
      if (typeof this.colors[strVal] !== 'undefined') {
        strVal = this.colors[strVal];
        alias = 'alias';
      }
      var that = this,
        result = false;
      $.each(this.stringParsers, function(i, parser) {
        var match = parser.re.exec(strVal),
          values = match && parser.parse.apply(that, [match]),
          format = alias || parser.format || 'rgba';
        if (values) {
          if (format.match(/hsla?/)) {
            result = that.RGBtoHSB.apply(that, that.HSLtoRGB.apply(that, values));
          } else {
            result = that.RGBtoHSB.apply(that, values);
          }
          that.origFormat = format;
          return false;
        }
        return true;
      });
      return result;
    },
    setHue: function(h) {
      this.value.h = 1 - h;
    },
    setSaturation: function(s) {
      this.value.s = s;
    },
    setBrightness: function(b) {
      this.value.b = 1 - b;
    },
    setAlpha: function(a) {
      this.value.a = Math.round((parseInt((1 - a) * 100, 10) / 100) * 100) / 100;
    },
    toRGB: function(h, s, b, a) {
      if (!h) {
        h = this.value.h;
        s = this.value.s;
        b = this.value.b;
      }
      h *= 360;
      var R, G, B, X, C;
      h = (h % 360) / 60;
      C = b * s;
      X = C * (1 - Math.abs(h % 2 - 1));
      R = G = B = b - C;

      h = ~~h;
      R += [C, X, 0, 0, X, C][h];
      G += [X, C, C, X, 0, 0][h];
      B += [0, 0, X, C, C, X][h];
      return {
        r: Math.round(R * 255),
        g: Math.round(G * 255),
        b: Math.round(B * 255),
        a: a || this.value.a
      };
    },
    toHex: function(h, s, b, a) {
      var rgb = this.toRGB(h, s, b, a);
      if (this.rgbaIsTransparent(rgb)) {
        return 'transparent';
      }
      return '#' + ((1 << 24) | (parseInt(rgb.r) << 16) | (parseInt(rgb.g) << 8) | parseInt(rgb.b)).toString(16).substr(1);
    },
    toHSL: function(h, s, b, a) {
      h = h || this.value.h;
      s = s || this.value.s;
      b = b || this.value.b;
      a = a || this.value.a;

      var H = h,
        L = (2 - s) * b,
        S = s * b;
      if (L > 0 && L <= 1) {
        S /= L;
      } else {
        S /= 2 - L;
      }
      L /= 2;
      if (S > 1) {
        S = 1;
      }
      return {
        h: isNaN(H) ? 0 : H,
        s: isNaN(S) ? 0 : S,
        l: isNaN(L) ? 0 : L,
        a: isNaN(a) ? 0 : a
      };
    },
    toAlias: function(r, g, b, a) {
      var rgb = this.toHex(r, g, b, a);
      for (var alias in this.colors) {
        if (this.colors[alias] === rgb) {
          return alias;
        }
      }
      return false;
    },
    RGBtoHSB: function(r, g, b, a) {
      r /= 255;
      g /= 255;
      b /= 255;

      var H, S, V, C;
      V = Math.max(r, g, b);
      C = V - Math.min(r, g, b);
      H = (C === 0 ? null :
        V === r ? (g - b) / C :
        V === g ? (b - r) / C + 2 :
        (r - g) / C + 4
      );
      H = ((H + 360) % 6) * 60 / 360;
      S = C === 0 ? 0 : C / V;
      return {
        h: this._sanitizeNumber(H),
        s: S,
        b: V,
        a: this._sanitizeNumber(a)
      };
    },
    HueToRGB: function(p, q, h) {
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
      if ((h * 6) < 1) {
        return p + (q - p) * h * 6;
      } else if ((h * 2) < 1) {
        return q;
      } else if ((h * 3) < 2) {
        return p + (q - p) * ((2 / 3) - h) * 6;
      } else {
        return p;
      }
    },
    HSLtoRGB: function(h, s, l, a) {
      if (s < 0) {
        s = 0;
      }
      var q;
      if (l <= 0.5) {
        q = l * (1 + s);
      } else {
        q = l + s - (l * s);
      }

      var p = 2 * l - q;

      var tr = h + (1 / 3);
      var tg = h;
      var tb = h - (1 / 3);

      var r = Math.round(this.HueToRGB(p, q, tr) * 255);
      var g = Math.round(this.HueToRGB(p, q, tg) * 255);
      var b = Math.round(this.HueToRGB(p, q, tb) * 255);
      return [r, g, b, this._sanitizeNumber(a)];
    },
    toString: function(format) {
      format = format || 'rgba';
      var c = false;
      switch (format) {
        case 'rgb':
          {
            c = this.toRGB();
            if (this.rgbaIsTransparent(c)) {
              return 'transparent';
            }
            return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
          }
          break;
        case 'rgba':
          {
            c = this.toRGB();
            return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
          }
          break;
        case 'hsl':
          {
            c = this.toHSL();
            return 'hsl(' + Math.round(c.h * 360) + ',' + Math.round(c.s * 100) + '%,' + Math.round(c.l * 100) + '%)';
          }
          break;
        case 'hsla':
          {
            c = this.toHSL();
            return 'hsla(' + Math.round(c.h * 360) + ',' + Math.round(c.s * 100) + '%,' + Math.round(c.l * 100) + '%,' + c.a + ')';
          }
          break;
        case 'hex':
          {
            return this.toHex();
          }
          break;
        case 'alias':
          return this.toAlias() || this.toHex();
        default:
          {
            return c;
          }
          break;
      }
    },
    // a set of RE's that can match strings and generate color tuples.
    // from John Resig color plugin
    // https://github.com/jquery/jquery-color/
    stringParsers: [{
      re: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*?\)/,
      format: 'rgb',
      parse: function(execResult) {
        return [
          execResult[1],
          execResult[2],
          execResult[3],
          1
        ];
      }
    }, {
      re: /rgb\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
      format: 'rgb',
      parse: function(execResult) {
        return [
          2.55 * execResult[1],
          2.55 * execResult[2],
          2.55 * execResult[3],
          1
        ];
      }
    }, {
      re: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
      format: 'rgba',
      parse: function(execResult) {
        return [
          execResult[1],
          execResult[2],
          execResult[3],
          execResult[4]
        ];
      }
    }, {
      re: /rgba\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
      format: 'rgba',
      parse: function(execResult) {
        return [
          2.55 * execResult[1],
          2.55 * execResult[2],
          2.55 * execResult[3],
          execResult[4]
        ];
      }
    }, {
      re: /hsl\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
      format: 'hsl',
      parse: function(execResult) {
        return [
          execResult[1] / 360,
          execResult[2] / 100,
          execResult[3] / 100,
          execResult[4]
        ];
      }
    }, {
      re: /hsla\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
      format: 'hsla',
      parse: function(execResult) {
        return [
          execResult[1] / 360,
          execResult[2] / 100,
          execResult[3] / 100,
          execResult[4]
        ];
      }
    }, {
      re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
      format: 'hex',
      parse: function(execResult) {
        return [
          parseInt(execResult[1], 16),
          parseInt(execResult[2], 16),
          parseInt(execResult[3], 16),
          1
        ];
      }
    }, {
      re: /#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
      format: 'hex',
      parse: function(execResult) {
        return [
          parseInt(execResult[1] + execResult[1], 16),
          parseInt(execResult[2] + execResult[2], 16),
          parseInt(execResult[3] + execResult[3], 16),
          1
        ];
      }
    }],
    colorNameToHex: function(name) {
      if (typeof this.colors[name.toLowerCase()] !== 'undefined') {
        return this.colors[name.toLowerCase()];
      }
      return false;
    }
  };

  /*
   * Default plugin options
   */
  var defaults = {
    horizontal: false, // horizontal mode layout ?
    color: null, //forces a color
    defaultColor: null, // default color when there is none specified or set (null = no value or color will be set to the object or the UI)
    format: null, //forces a format
    container: null, // container selector where to add the colorpicker (if it's different from the jQuery element)
    className: null, // class to add to the main colorpicker element
    palette: null,
    previewText: true, // if true, the color code will be added to the color preview box
    guideMode: "vertical", // guide mode. the value must be an object from options.bars excepting 'mode' (e.g. vertical or horizontal)
    guides: {
      // Modes:
      vertical: {
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
      horizontal: {
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
      }
    },
    template: '<div class="colorpicker">' +
      '<div class="colorpicker-saturation"><div class="colorpicker-guide-layer">' +
      '<i class="colorpicker-guide"><b class="colorpicker-guide-shadow"></b></i></div></div>' +
      '<div class="colorpicker-hue"><i class="colorpicker-guide"></i></div>' +
      '<div class="colorpicker-alpha"><div class="colorpicker-guide-layer"><i class="colorpicker-guide"></i></div></div>' +
      '<div class="colorpicker-preview"><div class="colorpicker-preview-inner"></div></div>' +
      '<div class="colorpicker-palette"></div>' +
      '</div>'
  };

  // Helper methods (double underscore):
  var __ = {
    isString: function(val) {
      return (typeof val === 'string') || (val instanceof String);
    },
    isColorObject: function(val) {
      return val && ((typeof val === 'object') && (val.HSLtoRGB !== undefined));
    },
    safeColor: function(val) {
      return !__.isString(val) ? (this.options.defaultColor ? this.options.defaultColor : null) : val;
    },
    safeColorObject: function(val) {
      if (__.isColorObject(val)) {
        return val;
      }
      return new Color(__.safeColor.apply(this, [val]), this.options.palette);
    },
    trigger: function(element, eventName, colorObj, colorStr) {
      return element.trigger({
        type: eventName,
        color: colorObj === undefined ? null : colorObj,
        value: colorStr === undefined ? null : colorStr
      });
    },
    alphaGradientCss: function(color, to) {
      if (!__.isColorObject(color)) {
        return "";
      }
      color = color.toRGB(color.h, color.s, color.b);
      color = [color.r, color.g, color.b].join(',');
      to = to || 'bottom';
      return "linear-gradient(to " + to + ", " + 'rgba(' + color + ',1) 0%, rgba(' + color + ',0) 100%' + "), ";
    }
  };

  /**
   * Colorpicker component class
   *
   * @param {Object|String} element
   * @param {Object} options
   * @constructor
   */
  var Colorpicker = function(element, options) {
    this.element = $(element)
      .addClass('colorpicker-element');
    this.options = $.extend(true, {}, defaults, this.element.data(), options);
    this.container = this.options.container ? $(this.options.container) : this.element;
    this.container.addClass('colorpicker-container');

    // Set color
    this.setColor(this.options.color, false);

    // Setup picker component and add classes
    this.component = $(this.options.template);
    if (this.options.className) {
      this.component.addClass(this.options.className);
    }
    this.component
      .addClass('colorpicker-' + this.options.guideMode + '-mode')
      .find('.colorpicker-saturation, .colorpicker-hue, .colorpicker-alpha').addClass('colorpicker-guide-container');

    // Has alpha bar?
    if (this.component.find('.colorpicker-alpha').length && (this.format === 'rgba' || this.format === 'hsla' || !this.format)) {
      this.component.addClass('colorpicker-with-alpha');
    } else {
      this.component.addClass('colorpicker-without-alpha');
    }

    // Add palette
    if (this.options.palette) {
      this.addPalette(this.options.palette);
    }

    // Bind events
    this.component
      .on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.mousedown, this))
      .appendTo(this.container);

    // Update for the first time
    this.update(null, false);

    $($.proxy(function() {
      __.trigger(this.element, 'colorpicker_create');
    }, this));
  };

  Colorpicker.Color = Color;

  Colorpicker.prototype = {
    currentGuide: null,
    mousePointer: {
      left: 0,
      top: 0
    },
    constructor: Colorpicker,
    destructor: function() {
      this.component.remove();
      this.element.removeData('colorpicker', 'color').off('.colorpicker');
      this.element.removeClass('colorpicker-element');
      this.container.removeClass('colorpicker-container');
      __.trigger(this.element, 'colorpicker_destroy');
    },
    addPalette: function(palette) {
      var $self = this,
        $paletteContainer = this.component.find('.colorpicker-palette');
      if ($paletteContainer.length) {
        $.each(palette, function(name, color) {
          var $btn = $('<i />');
          $btn.addClass('colorpicker-palette-color')
            .css('background-color', color).attr('data-color-alias', name);
          $btn.click(function() {
            $self.color($(this).css('background-color'));
          });
          $paletteContainer.append($btn);
        });
        $paletteContainer.show();
      }
    },
    show: function() {
      this.component
        .addClass('colorpicker-visible')
        .removeClass('colorpicker-hidden');
      __.trigger(this.element, 'colorpicker_show', this.getColor());
    },
    hide: function() {
      this.component
        .addClass('colorpicker-hidden')
        .removeClass('colorpicker-visible');
      __.trigger(this.element, 'colorpicker_hide', this.getColor());
    },
    update: function(color, triggerEvent) {
      color = __.isColorObject(color) ? color :
        (__.isString(color) ? __.safeColorObject.apply(this, [color]) : this.getColor());

      if (!__.isColorObject(color)) {
        // Clear backgrounds and color code
        this.component.find('.colorpicker-saturation, .colorpicker-alpha .colorpicker-guide-layer' +
          ', .colorpicker-preview-inner').attr('style', '');
        this.component.find('.colorpicker-guide').attr('style', '');
        if (this.options.previewText) {
          this.component.find('.colorpicker-preview-inner').text('');
        }
        return false;
      }

      if (this.component.find('.colorpicker-guide-container .colorpicker-guide').length === 0) {
        // there is no guides to update
        return;
      }
      var guideOptions = this.options.guides[this.options.guideMode],
        hueGuide = this.component.find('.colorpicker-hue .colorpicker-guide'),
        alphaGuide = this.component.find('.colorpicker-alpha .colorpicker-guide'),
        saturationGuide = this.component.find('.colorpicker-saturation .colorpicker-guide');

      if (hueGuide.length) {
        if (guideOptions.hue.callTop) {
          hueGuide.css('top', guideOptions.hue.maxTop * (1 - color.value.h));
        }
        if (guideOptions.hue.callLeft) {
          hueGuide.css('left', guideOptions.hue.maxLeft * (1 - color.value.h));
        }
      }
      if (alphaGuide.length) {
        if (guideOptions.alpha.callTop) {
          alphaGuide.css('top', guideOptions.alpha.maxTop * (1 - color.value.a));
        }
        if (guideOptions.alpha.callLeft) {
          alphaGuide.css('left', guideOptions.alpha.maxLeft * (1 - color.value.a));
        }
      }
      if (saturationGuide.length) {
        if (guideOptions.saturation.callTop) {
          saturationGuide.css('top', guideOptions.saturation.maxTop - color.value.b * guideOptions.saturation.maxTop);
        }
        if (guideOptions.saturation.callLeft) {
          saturationGuide.css('left', color.value.s * guideOptions.saturation.maxLeft);
        }
      }

      var colorStr = color.toString(this.format);

      this.component
        .find('.colorpicker-saturation').css('backgroundColor', color.toHex(color.value.h === 0 ? 1 : color.value.h, 1, 1, 1)).end()
        .find('.colorpicker-alpha .colorpicker-guide-layer')
        .css('background', __.alphaGradientCss(color, guideOptions.alpha.callTop ? 'bottom' : 'right')).end()
        .find('.colorpicker-preview-inner').css('backgroundColor', colorStr).text(this.options.previewText ? colorStr : '');

      if (triggerEvent !== false) {
        __.trigger(this.element, 'colorpicker_update', color);
      }

      return true;
    },
    setColor: function(val, triggerEvent) { // set color manually and return the color object
      var color;
      if (!val) {
        // Remove color from JS instance and DOM data, display the default one in the component interface
        this.element.removeData('color');
        if (triggerEvent !== false) {
          __.trigger(this.element, 'colorpicker_change');
        }
        color = this.options.defaultColor ? __.safeColorObject.apply(this, [this.options.defaultColor]) : null;
      } else {
        // Update color in JS instance, DOM data and component interface
        color = __.safeColorObject.apply(this, [val]);
        this.format = (this.options.format !== false ? this.options.format : color.origFormat);
        this.element.data('color', color);
        if (triggerEvent !== false) {
          __.trigger(this.element, 'colorpicker_change', color, color.toString(this.format));
        }
      }
      return color;
    },
    getColor: function() {
      var val = this.element.data('color');
      if (!__.isColorObject(val)) {
        val = this.options.defaultColor ? __.safeColorObject.apply(this, [this.options.defaultColor]) : null;
      }
      return val;
    },
    color: function(newColor, triggerEvent) {
      if (newColor !== undefined) {
        newColor = this.setColor(newColor, triggerEvent);
        this.update(newColor, triggerEvent);
        return newColor;
      }
      return this.getColor();
    },
    mousedown: function(e) {
      if (!$(e.originalEvent.target).is('.colorpicker-guide, .colorpicker-guide-container, .colorpicker-guide-layer')) {
        return;
      }
      if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
        e.pageX = e.originalEvent.touches[0].pageX;
        e.pageY = e.originalEvent.touches[0].pageY;
      }
      e.stopPropagation();
      e.preventDefault();

      var target = $(e.target);

      //detect the bar and set the limits and callbacks
      var zone = target.closest('.colorpicker-guide-container');
      var guideOptions = this.options.guides[this.options.guideMode];
      if (!zone.is('.colorpicker')) {
        if (zone.is('.colorpicker-saturation')) {
          this.currentGuide = $.extend({}, guideOptions.saturation);
        } else if (zone.is('.colorpicker-hue')) {
          this.currentGuide = $.extend({}, guideOptions.hue);
        } else if (zone.is('.colorpicker-alpha')) {
          this.currentGuide = $.extend({}, guideOptions.alpha);
        } else {
          return false;
        }
        var offset = zone.offset();
        //reference to guide's style
        this.currentGuide.element = zone.find('.colorpicker-guide');
        this.currentGuide.style = this.currentGuide.element[0].style;
        this.currentGuide.left = e.pageX - offset.left;
        this.currentGuide.top = e.pageY - offset.top;
        this.mousePointer = {
          left: e.pageX,
          top: e.pageY
        };
        //trigger mousemove to move the guide to the current position
        $(document).on({
          'mousemove.colorpicker': $.proxy(this.mousemove, this),
          'touchmove.colorpicker': $.proxy(this.mousemove, this),
          'mouseup.colorpicker': $.proxy(this.mouseup, this),
          'touchend.colorpicker': $.proxy(this.mouseup, this)
        }).trigger('mousemove');
      }
      return false;
    },
    mousemove: function(e) {
      if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
        e.pageX = e.originalEvent.touches[0].pageX;
        e.pageY = e.originalEvent.touches[0].pageY;
      }
      e.stopPropagation();
      e.preventDefault();
      var left = Math.max(
        0,
        Math.min(
          this.currentGuide.maxLeft,
          this.currentGuide.left + ((e.pageX || this.mousePointer.left) - this.mousePointer.left)
        )
      );
      var top = Math.max(
        0,
        Math.min(
          this.currentGuide.maxTop,
          this.currentGuide.top + ((e.pageY || this.mousePointer.top) - this.mousePointer.top)
        )
      );
      var color = this.getColor();
      if (!__.isColorObject(color)) {
        color = __.safeColorObject.apply(this);
      }
      this.currentGuide.style.left = left + 'px';
      this.currentGuide.style.top = top + 'px';
      if (this.currentGuide.callLeft) {
        color[this.currentGuide.callLeft].call(color, left / this.currentGuide.maxLeft);
      }
      if (this.currentGuide.callTop) {
        color[this.currentGuide.callTop].call(color, top / this.currentGuide.maxTop);
      }
      // Change format dynamically if options.format is not specified, and the moved guide was the alpha one
      if (this.currentGuide.element.hasClass('colorpicker-alpha') && !this.options.format) {
        // Converting from hex / rgb to rgba
        if (color.value.a !== 1) {
          this.format = 'rgba';
          color.origFormat = 'rgba';
        }
        // Converting from rgba to rgb
        else {
          this.format = 'rgb';
          color.origFormat = 'rgb';
        }
      }
      this.color(color);
    },
    mouseup: function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(document).off({
        'mousemove.colorpicker': this.mousemove,
        'touchmove.colorpicker': this.mousemove,
        'mouseup.colorpicker': this.mouseup,
        'touchend.colorpicker': this.mouseup
      });
      return false;
    }
  };

  $.colorpicker = Colorpicker;

  $.fn.colorpicker = function(option) {
    var apiArgs = Array.prototype.slice.call(arguments, 1),
      returnValue = null,
      hasReturnValue = false,
      isSingleElement = (this.length === 1);

    var $jq = this.each(function() {
      var $this = $(this),
        inst = $this.data('colorpicker'),
        options = ((typeof option === 'object') ? option : {});

      if (!inst) {
        inst = new Colorpicker(this, options);
        $this.data('colorpicker', inst);
      }

      if (isSingleElement && (typeof option === 'string')) {
        hasReturnValue = true;
        if ($.isFunction(inst[option])) {
          returnValue = inst[option].apply(inst, apiArgs);
        } else { // its a property ?
          if (apiArgs.length) {
            // set property
            inst[option] = apiArgs[0];
          }
          returnValue = inst[option];
        }
      }
    });
    return hasReturnValue ? returnValue : $jq;
  };

  $.fn.colorpicker.constructor = Colorpicker;

}));
