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
   * @constructor
   */
  var Color = function(val) {
    this.value = {
      h: 0,
      s: 0,
      b: 0,
      a: 1
    };
    this.parsedFormat = null; // original string format
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
    // Parse a string to Hue-Saturation-Brightness
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
          this.value = this.stringToHSB(strVal);
        }
      }
    },
    stringToHSB: function(strVal) {
      strVal = strVal.toLowerCase();
      var alias = false;
      if (typeof this.colors[strVal] !== 'undefined') {
        strVal = this.colors[strVal];
        alias = true;
      }
      var that = this,
        result = false;
      $.each(this.stringParsers, function(i, parser) {
        var match = parser.re.exec(strVal),
          values = match && parser.parse.apply(that, [match]),
          format = parser.format || '';
        if (values) {
          if (format.match(/hsla?/)) {
            result = that.RGBtoHSB.apply(that, that.HSLtoRGB.apply(that, values));
          } else {
            result = that.RGBtoHSB.apply(that, values);
          }
          that.parsedFormat = alias ? null : (format ? format : null);
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
      if (!this.value) {
        return false;
      }
      format = format || this.parsedFormat || null;
      if (!format && (this.value.h + this.value.s + this.value.b + this.value.a) === 0) {
        return 'transparent';
      }
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
        default:
          {
            return this.toAlias() || this.toHex() || c;
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
    defaultColor: null, // default color when there is none specified or set (null = no color)
    format: null, //forces a format
    container: null, // container selector where to add the colorpicker (if it's different from the jQuery element)
    className: 'colorpicker-standalone', // class to add to the main colorpicker root element
    aliases: {}, // color aliases: {'danger':'red', 'warning':'#ff00aa'}
    palettes: [], // color palettes (max 11 per row): [ ['#fff', 'rgba(0, 100, 100, .5)', 'gold', 'myAlias'], [ ... second palette], ... ]
    previewText: true, // if true, the color code will be added to the color preview box
    guideMode: "vertical", // guide mode. the value must be an object from options.bars excepting 'mode' (e.g. vertical or horizontal)
    formatter: null, // custom color formatter callback
    guides: {
      // Modes:
      vertical: {
        saturation: {
          callLeft: 'setSaturation',
          callTop: 'setBrightness'
        },
        hue: {
          callLeft: false,
          callTop: 'setHue'
        },
        alpha: {
          callLeft: false,
          callTop: 'setAlpha'
        }
      },
      horizontal: {
        saturation: {
          callLeft: 'setSaturation',
          callTop: 'setBrightness'
        },
        hue: {
          callLeft: 'setHue',
          callTop: false
        },
        alpha: {
          callLeft: 'setAlpha',
          callTop: false
        }
      }
    },
    init: function() {},
    templates: {
      picker: '<div class="colorpicker">' +
        '<div class="colorpicker-saturation">' +
        '  <i class="colorpicker-guide"></i>' +
        '</div>' +
        '<div class="colorpicker-hue">' +
        '  <i class="colorpicker-guide"></i>' +
        '</div>' +
        '<div class="colorpicker-alpha-wrapper">' +
        '  <div class="colorpicker-alpha">' +
        '    <i class="colorpicker-guide"></i>' +
        '  </div>' +
        '</div>' +
        '<div class="colorpicker-addons">' +
        '  <div class="colorpicker-addon colorpicker-preview">' +
        '    <div class="colorpicker-addon-inner"></div>' +
        '  </div>' +
        '  <div class="colorpicker-palettes"></div>' +
        '</div>' +
        '</div>'
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

    if (!this.options.color && this.element.is('input, textarea')) {
      this.options.color = this.element.val();
    }

    // Set color
    this.setColor(this.options.color, false);

    // Setup picker component and add classes
    this.component = $(this.options.templates.picker);
    if (this.options.className) {
      this.component.addClass(this.options.className);
    }
    this.component
      .addClass('colorpicker-' + this.options.guideMode + '-mode')
      .find('.colorpicker-guide').parent().addClass('colorpicker-guide-container');

    // Has alpha bar?
    if (this.component.find('.colorpicker-alpha').length &&
      (this.options.format === 'rgba' || this.options.format === 'hsla' || !this.options.format)) {
      this.component.addClass('colorpicker-with-alpha');
    } else {
      // Force a non-alpha format if the alpha bar is not present
      if (!this.options.format) {
        this.options.format = 'rgb';
      } else {
        this.options.format = (this.options.format === 'rgba') ?
          'rgb' : ((this.options.format === 'hsla') ? 'hsl' : this.options.format);
      }
      this.component.addClass('colorpicker-without-alpha');
    }

    // Add palettes
    if ($.isArray(this.options.palettes) && this.options.palettes.length) {
      for (var i in this.options.palettes) {
        this.addPalette(this.options.palettes[i]);
      }
    } else {
      this.options.palettes = [];
      this.component.find('.colorpicker-palettes').hide();
    }

    // Sanitize palettes variable
    if (typeof this.options.palettes !== 'object') {
      this.options.palettes = {};
    }

    // Bind events
    this.component
      .on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.mousedown, this))
      .appendTo(this.container);

    // Custom initialization before the widget is updated and the colorpicker_create event fired
    if (this.options.init && this.options.init.apply) {
      this.options.init.apply(this, [this.element, this.options]);
    }

    // Update for the first time
    this.update(null, false);

    $($.proxy(function() {
      this._trigger(this.element, 'colorpicker_create');
    }, this));
  };

  var previewColorAddonSelector = '.colorpicker-preview .colorpicker-addon-inner';

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
      this._trigger(this.element, 'colorpicker_destroy');
    },
    addPalette: function(paletteColors) {
      var self = this,
        $paletteContainer = this.component.find('.colorpicker-palettes');

      if ($paletteContainer.length) {
        var $palette = $('<div class="colorpicker-addon colorpicker-palette"></div>');
        $.each(paletteColors, function(i, color) {
          var colorName = color;
          if (self.options.aliases[colorName] !== undefined) {
            color = self.options.aliases[colorName];
          }
          var $btn = $('<div class="colorpicker-palette-color"><i /></div>');
          $btn.find('i').css('background-color', color);
          $btn.attr('data-palette-color-id', colorName)
            .attr('data-palette-color', color)
            .attr('title', (color !== colorName) ? (colorName + ': ' + color) : color)
            .on('click.colorpicker touchstart.colorpicker', function() {
              $palette.find('.colorpicker-palette-color').removeClass('colorpicker-palette-color-active');
              $btn.addClass('colorpicker-palette-color-active');
              self.color(color);
            });
          $palette.append($btn);
        });
        $paletteContainer.append($palette);
        $paletteContainer.show();
      }
    },
    show: function() {
      this.component
        .addClass('colorpicker-visible')
        .removeClass('colorpicker-hidden');
      this._trigger(this.element, 'colorpicker_show', this.getColor());
    },
    hide: function() {
      this.component
        .addClass('colorpicker-hidden')
        .removeClass('colorpicker-visible');
      this._trigger(this.element, 'colorpicker_hide', this.getColor());
    },
    reset: function() {
      // Clear backgrounds and color code
      this.component
        .find('.colorpicker-saturation, .colorpicker-alpha, .colorpicker-guide, ' + previewColorAddonSelector)
        .attr('style', '');
      if (this.options.previewText) {
        this.component.find(previewColorAddonSelector).text('');
      }
      // Remove color data
      this.element.removeData('color');
    },
    update: function(color, triggerUpdate) {
      color = this._isColorObject(color) ? color :
        (this._isString(color) ? this._safeColorObject(color) : this.getColor());

      if (!this._isColorObject(color) || !color.value) {
        this.reset();
        return false;
      }

      if (this.component.find('.colorpicker-guide').length === 0) {
        // there is no guides to update
        return;
      }
      var guideOptions = this.options.guides[this.options.guideMode],
        hueGuide = this.component.find('.colorpicker-hue .colorpicker-guide'),
        alphaGuide = this.component.find('.colorpicker-alpha .colorpicker-guide'),
        saturationGuide = this.component.find('.colorpicker-saturation .colorpicker-guide');

      if (hueGuide.length) {
        if (guideOptions.hue.callTop) {
          hueGuide.css('top', hueGuide.parent().height() * (1 - color.value.h));
        }
        if (guideOptions.hue.callLeft) {
          hueGuide.css('left', hueGuide.parent().width() * (1 - color.value.h));
        }
      }
      if (alphaGuide.length) {
        if (guideOptions.alpha.callTop) {
          alphaGuide.css('top', alphaGuide.parent().height() * (1 - color.value.a));
        }
        if (guideOptions.alpha.callLeft) {
          alphaGuide.css('left', alphaGuide.parent().width() * (1 - color.value.a));
        }
      }
      if (saturationGuide.length) {
        if (guideOptions.saturation.callTop) {
          var saturationHeight = saturationGuide.parent().height();
          saturationGuide.css('top', saturationHeight - color.value.b * saturationHeight);
        }
        if (guideOptions.saturation.callLeft) {
          saturationGuide.css('left', color.value.s * saturationGuide.parent().width());
        }
      }

      var colorStr = this._colorString(color);

      // Improve readability of the plugin text (if any)
      if (((color.value.b > 0.6) && (color.value.s < 0.2)) || (color.value.a < 0.5)) {
        this.component.addClass('colorpicker-text-black');
      } else {
        this.component.removeClass('colorpicker-text-black');
      }

      this.component.find('.colorpicker-saturation').css('backgroundColor', color.toHex(color.value.h === 0 ? 1 : color.value.h, 1, 1, 1));

      this.component.find('.colorpicker-alpha')
        .attr('style', "background: " + this._alphaGradient(color, guideOptions.alpha.callTop ? 'bottom' : 'right'));

      this.component.find(previewColorAddonSelector).css('backgroundColor', colorStr)
        .text(this.options.previewText ? colorStr : undefined);

      if (triggerUpdate !== false) {
        this._trigger(this.element, 'colorpicker_update', color);
      }

      return true;
    },
    setColor: function(val, triggerChange) { // set color manually and return the color object
      var color = null;
      if (!val) {
        // Remove color from JS instance and DOM data, display the default one in the component interface
        this.element.removeData('color');
        if (triggerChange !== false) {
          this._trigger(this.element, 'colorpicker_change');
        }
        color = this.options.defaultColor ? this._safeColorObject(this.options.defaultColor) : null;
      } else {
        // Update color in JS instance, DOM data and component interface
        color = this._safeColorObject(val);
        if (typeof color.value !== 'object') {
          this.element.removeData('color');
          // Emit error event if the parser failed, with the previous color and the wrong value
          this._trigger(this.element, 'colorpicker_parse_error', this.element.data('color'), val);
        } else {
          this.element.data('color', color);
          if (triggerChange !== false) {
            this._trigger(this.element, 'colorpicker_change', color, this._colorString(color));
          }
        }
      }
      return color;
    },
    getColor: function() {
      var val = this.element.data('color');
      if (!this._isColorObject(val)) {
        val = this.options.defaultColor ? this._safeColorObject(this.options.defaultColor) : null;
      }
      return val;
    },
    color: function(newColor, triggerEvents) {
      if (newColor !== undefined) {
        newColor = this.setColor(newColor, triggerEvents);
        this.update(newColor, triggerEvents);
        return newColor;
      }
      return this.getColor();
    },
    mousedown: function(e) {
      if (!$(e.originalEvent.target).is('.colorpicker-guide, .colorpicker-guide-container')) {
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
        this.currentGuide.zone = zone;
        this.currentGuide.element = zone.find('.colorpicker-guide');
        this.currentGuide.style = this.currentGuide.element[0].style;
        this.currentGuide.left = e.pageX - offset.left;
        this.currentGuide.top = e.pageY - offset.top;
        this.currentGuide.maxTop = this.currentGuide.callTop ? zone.height() : 0;
        this.currentGuide.maxLeft = this.currentGuide.callLeft ? zone.width() : 0;
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
      if (!this._isColorObject(color)) {
        color = this._safeColorObject();
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
      if (this.currentGuide.zone.hasClass('colorpicker-alpha') && !this.options.format) {
        // Converting e.g. from hex / rgb to rgba
        if (color.value.a !== 1) {
          color.parsedFormat = 'rgba';
        }
        // Converting e.g. from rgba to rgb
        else {
          color.parsedFormat = 'rgb';
        }
      } else if (this.component.hasClass('colorpicker-without-alpha') &&
        (((color.value.h + color.value.s + color.value.b) !== 0) || (color.value.a > 0 && color.value.a < 1))) {
        color.value.a = 1;
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
    },
    _colorString: function(color, format) {
      format = format || (this.options.format ? this.options.format : color.parsedFormat);
      return color.toString(format);
    },
    _isString: function(val) {
      return (typeof val === 'string') || (val instanceof String);
    },
    _isColorObject: function(val) {
      return val && ((typeof val === 'object') && (val.HSLtoRGB !== undefined));
    },
    _safeColor: function(val) {
      return !this._isString(val) ? (this.options.defaultColor ? this.options.defaultColor : null) : val;
    },
    _safeColorObject: function(val) {
      if (this._isColorObject(val)) {
        return val;
      }
      if (this._isString(val) && (this.options.aliases[val] !== undefined)) {
        val = this.options.aliases[val];
      }
      return new Color(this._safeColor(val));
    },
    _trigger: function(element, eventName, colorObj, colorStr) {
      return element.trigger({
        type: eventName,
        color: colorObj === undefined ? null : colorObj,
        value: colorStr === undefined ? null : colorStr
      });
    },
    _alphaGradient: function(color, to) {
      if (!this._isColorObject(color)) {
        return "";
      }
      color = color.toRGB(color.h, color.s, color.b);
      color = [color.r, color.g, color.b].join(',');
      to = to ? to : 'bottom';
      return "linear-gradient(to " + to + ", " + 'rgba(' + color + ',1) 0%, rgba(' + color + ',0) 100%' + ")";
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
