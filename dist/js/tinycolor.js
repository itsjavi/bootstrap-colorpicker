(function() {
    var a = /^[\s,#]+/, b = /\s+$/, c = 0, d = Math, e = d.round, f = d.min, g = d.max, h = d.random;
    var i = function G(a, b) {
        a = a ? a : "";
        b = b || {};
        if (a instanceof G) {
            return a;
        }
        if (!(this instanceof G)) {
            return new G(a, b);
        }
        var d = j(a);
        this._r = d.r, this._g = d.g, this._b = d.b, this._a = d.a, this._roundA = e(100 * this._a) / 100, 
        this._format = b.format || d.format;
        this._gradientType = b.gradientType;
        if (this._r < 1) {
            this._r = e(this._r);
        }
        if (this._g < 1) {
            this._g = e(this._g);
        }
        if (this._b < 1) {
            this._b = e(this._b);
        }
        this._ok = d.ok;
        this._tc_id = c++;
    };
    i.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var a = this.toRgb();
            return (a.r * 299 + a.g * 587 + a.b * 114) / 1e3;
        },
        setAlpha: function(a) {
            this._a = u(a);
            this._roundA = e(100 * this._a) / 100;
            return this;
        },
        toHsv: function() {
            var a = n(this._r, this._g, this._b);
            return {
                h: a.h * 360,
                s: a.s,
                v: a.v,
                a: this._a
            };
        },
        toHsvString: function() {
            var a = n(this._r, this._g, this._b);
            var b = e(a.h * 360), c = e(a.s * 100), d = e(a.v * 100);
            return this._a == 1 ? "hsv(" + b + ", " + c + "%, " + d + "%)" : "hsva(" + b + ", " + c + "%, " + d + "%, " + this._roundA + ")";
        },
        toHsl: function() {
            var a = l(this._r, this._g, this._b);
            return {
                h: a.h * 360,
                s: a.s,
                l: a.l,
                a: this._a
            };
        },
        toHslString: function() {
            var a = l(this._r, this._g, this._b);
            var b = e(a.h * 360), c = e(a.s * 100), d = e(a.l * 100);
            return this._a == 1 ? "hsl(" + b + ", " + c + "%, " + d + "%)" : "hsla(" + b + ", " + c + "%, " + d + "%, " + this._roundA + ")";
        },
        toHex: function(a) {
            return p(this._r, this._g, this._b, a);
        },
        toHexString: function(a) {
            return "#" + this.toHex(a);
        },
        toHex8: function() {
            return q(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return "#" + this.toHex8();
        },
        toRgb: function() {
            return {
                r: e(this._r),
                g: e(this._g),
                b: e(this._b),
                a: this._a
            };
        },
        toRgbString: function() {
            return this._a == 1 ? "rgb(" + e(this._r) + ", " + e(this._g) + ", " + e(this._b) + ")" : "rgba(" + e(this._r) + ", " + e(this._g) + ", " + e(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return {
                r: e(v(this._r, 255) * 100) + "%",
                g: e(v(this._g, 255) * 100) + "%",
                b: e(v(this._b, 255) * 100) + "%",
                a: this._a
            };
        },
        toPercentageRgbString: function() {
            return this._a == 1 ? "rgb(" + e(v(this._r, 255) * 100) + "%, " + e(v(this._g, 255) * 100) + "%, " + e(v(this._b, 255) * 100) + "%)" : "rgba(" + e(v(this._r, 255) * 100) + "%, " + e(v(this._g, 255) * 100) + "%, " + e(v(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }
            if (this._a < 1) {
                return false;
            }
            return s[p(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(a) {
            var b = "#" + q(this._r, this._g, this._b, this._a);
            var c = b;
            var d = this._gradientType ? "GradientType = 1, " : "";
            if (a) {
                var e = i(a);
                c = e.toHex8String();
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + d + "startColorstr=" + b + ",endColorstr=" + c + ")";
        },
        toString: function(a) {
            var b = !!a;
            a = a || this._format;
            var c = false;
            var d = this._a < 1 && this._a >= 0;
            var e = !b && d && (a === "hex" || a === "hex6" || a === "hex3" || a === "name");
            if (e) {
                if (a === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (a === "rgb") {
                c = this.toRgbString();
            }
            if (a === "prgb") {
                c = this.toPercentageRgbString();
            }
            if (a === "hex" || a === "hex6") {
                c = this.toHexString();
            }
            if (a === "hex3") {
                c = this.toHexString(true);
            }
            if (a === "hex8") {
                c = this.toHex8String();
            }
            if (a === "name") {
                c = this.toName();
            }
            if (a === "hsl") {
                c = this.toHslString();
            }
            if (a === "hsv") {
                c = this.toHsvString();
            }
            return c || this.toHexString();
        }
    };
    i.fromRatio = function(a, b) {
        if (typeof a == "object") {
            var c = {};
            for (var d in a) {
                if (a.hasOwnProperty(d)) {
                    if (d === "a") {
                        c[d] = a[d];
                    } else {
                        c[d] = B(a[d]);
                    }
                }
            }
            a = c;
        }
        return i(a, b);
    };
    function j(a) {
        var b = {
            r: 0,
            g: 0,
            b: 0
        };
        var c = 1;
        var d = false;
        var e = false;
        if (typeof a == "string") {
            a = F(a);
        }
        if (typeof a == "object") {
            if (a.hasOwnProperty("r") && a.hasOwnProperty("g") && a.hasOwnProperty("b")) {
                b = k(a.r, a.g, a.b);
                d = true;
                e = String(a.r).substr(-1) === "%" ? "prgb" : "rgb";
            } else if (a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("v")) {
                a.s = B(a.s);
                a.v = B(a.v);
                b = o(a.h, a.s, a.v);
                d = true;
                e = "hsv";
            } else if (a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("l")) {
                a.s = B(a.s);
                a.l = B(a.l);
                b = m(a.h, a.s, a.l);
                d = true;
                e = "hsl";
            }
            if (a.hasOwnProperty("a")) {
                c = a.a;
            }
        }
        c = u(c);
        return {
            ok: d,
            format: a.format || e,
            r: f(255, g(b.r, 0)),
            g: f(255, g(b.g, 0)),
            b: f(255, g(b.b, 0)),
            a: c
        };
    }
    function k(a, b, c) {
        return {
            r: v(a, 255) * 255,
            g: v(b, 255) * 255,
            b: v(c, 255) * 255
        };
    }
    function l(a, b, c) {
        a = v(a, 255);
        b = v(b, 255);
        c = v(c, 255);
        var d = g(a, b, c), e = f(a, b, c);
        var h, i, j = (d + e) / 2;
        if (d == e) {
            h = i = 0;
        } else {
            var k = d - e;
            i = j > .5 ? k / (2 - d - e) : k / (d + e);
            switch (d) {
              case a:
                h = (b - c) / k + (b < c ? 6 : 0);
                break;

              case b:
                h = (c - a) / k + 2;
                break;

              case c:
                h = (a - b) / k + 4;
                break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: i,
            l: j
        };
    }
    function m(a, b, c) {
        var d, e, f;
        a = v(a, 360);
        b = v(b, 100);
        c = v(c, 100);
        function g(a, b, c) {
            if (c < 0) c += 1;
            if (c > 1) c -= 1;
            if (c < 1 / 6) return a + (b - a) * 6 * c;
            if (c < 1 / 2) return b;
            if (c < 2 / 3) return a + (b - a) * (2 / 3 - c) * 6;
            return a;
        }
        if (b === 0) {
            d = e = f = c;
        } else {
            var h = c < .5 ? c * (1 + b) : c + b - c * b;
            var i = 2 * c - h;
            d = g(i, h, a + 1 / 3);
            e = g(i, h, a);
            f = g(i, h, a - 1 / 3);
        }
        return {
            r: d * 255,
            g: e * 255,
            b: f * 255
        };
    }
    function n(a, b, c) {
        a = v(a, 255);
        b = v(b, 255);
        c = v(c, 255);
        var d = g(a, b, c), e = f(a, b, c);
        var h, i, j = d;
        var k = d - e;
        i = d === 0 ? 0 : k / d;
        if (d == e) {
            h = 0;
        } else {
            switch (d) {
              case a:
                h = (b - c) / k + (b < c ? 6 : 0);
                break;

              case b:
                h = (c - a) / k + 2;
                break;

              case c:
                h = (a - b) / k + 4;
                break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: i,
            v: j
        };
    }
    function o(a, b, c) {
        a = v(a, 360) * 6;
        b = v(b, 100);
        c = v(c, 100);
        var e = d.floor(a), f = a - e, g = c * (1 - b), h = c * (1 - f * b), i = c * (1 - (1 - f) * b), j = e % 6, k = [ c, h, g, g, i, c ][j], l = [ i, c, c, h, g, g ][j], m = [ g, g, i, c, c, h ][j];
        return {
            r: k * 255,
            g: l * 255,
            b: m * 255
        };
    }
    function p(a, b, c, d) {
        var f = [ A(e(a).toString(16)), A(e(b).toString(16)), A(e(c).toString(16)) ];
        if (d && f[0].charAt(0) == f[0].charAt(1) && f[1].charAt(0) == f[1].charAt(1) && f[2].charAt(0) == f[2].charAt(1)) {
            return f[0].charAt(0) + f[1].charAt(0) + f[2].charAt(0);
        }
        return f.join("");
    }
    function q(a, b, c, d) {
        var f = [ A(C(d)), A(e(a).toString(16)), A(e(b).toString(16)), A(e(c).toString(16)) ];
        return f.join("");
    }
    i.equals = function(a, b) {
        if (!a || !b) {
            return false;
        }
        return i(a).toRgbString() == i(b).toRgbString();
    };
    i.random = function() {
        return i.fromRatio({
            r: h(),
            g: h(),
            b: h()
        });
    };
    i.desaturate = function(a, b) {
        b = b === 0 ? 0 : b || 10;
        var c = i(a).toHsl();
        c.s -= b / 100;
        c.s = w(c.s);
        return i(c);
    };
    i.saturate = function(a, b) {
        b = b === 0 ? 0 : b || 10;
        var c = i(a).toHsl();
        c.s += b / 100;
        c.s = w(c.s);
        return i(c);
    };
    i.greyscale = function(a) {
        return i.desaturate(a, 100);
    };
    i.lighten = function(a, b) {
        b = b === 0 ? 0 : b || 10;
        var c = i(a).toHsl();
        c.l += b / 100;
        c.l = w(c.l);
        return i(c);
    };
    i.brighten = function(a, b) {
        b = b === 0 ? 0 : b || 10;
        var c = i(a).toRgb();
        c.r = g(0, f(255, c.r - e(255 * -(b / 100))));
        c.g = g(0, f(255, c.g - e(255 * -(b / 100))));
        c.b = g(0, f(255, c.b - e(255 * -(b / 100))));
        return i(c);
    };
    i.darken = function(a, b) {
        b = b === 0 ? 0 : b || 10;
        var c = i(a).toHsl();
        c.l -= b / 100;
        c.l = w(c.l);
        return i(c);
    };
    i.complement = function(a) {
        var b = i(a).toHsl();
        b.h = (b.h + 180) % 360;
        return i(b);
    };
    i.spin = function(a, b) {
        var c = i(a).toHsl();
        var d = (e(c.h) + b) % 360;
        c.h = d < 0 ? 360 + d : d;
        return i(c);
    };
    i.mix = function(a, b, c) {
        c = c === 0 ? 0 : c || 50;
        var d = i(a).toRgb();
        var e = i(b).toRgb();
        var f = c / 100;
        var g = f * 2 - 1;
        var h = e.a - d.a;
        var j;
        if (g * h == -1) {
            j = g;
        } else {
            j = (g + h) / (1 + g * h);
        }
        j = (j + 1) / 2;
        var k = 1 - j;
        var l = {
            r: e.r * j + d.r * k,
            g: e.g * j + d.g * k,
            b: e.b * j + d.b * k,
            a: e.a * f + d.a * (1 - f)
        };
        return i(l);
    };
    i.triad = function(a) {
        var b = i(a).toHsl();
        var c = b.h;
        return [ i(a), i({
            h: (c + 120) % 360,
            s: b.s,
            l: b.l
        }), i({
            h: (c + 240) % 360,
            s: b.s,
            l: b.l
        }) ];
    };
    i.tetrad = function(a) {
        var b = i(a).toHsl();
        var c = b.h;
        return [ i(a), i({
            h: (c + 90) % 360,
            s: b.s,
            l: b.l
        }), i({
            h: (c + 180) % 360,
            s: b.s,
            l: b.l
        }), i({
            h: (c + 270) % 360,
            s: b.s,
            l: b.l
        }) ];
    };
    i.splitcomplement = function(a) {
        var b = i(a).toHsl();
        var c = b.h;
        return [ i(a), i({
            h: (c + 72) % 360,
            s: b.s,
            l: b.l
        }), i({
            h: (c + 216) % 360,
            s: b.s,
            l: b.l
        }) ];
    };
    i.analogous = function(a, b, c) {
        b = b || 6;
        c = c || 30;
        var d = i(a).toHsl();
        var e = 360 / c;
        var f = [ i(a) ];
        for (d.h = (d.h - (e * b >> 1) + 720) % 360; --b; ) {
            d.h = (d.h + e) % 360;
            f.push(i(d));
        }
        return f;
    };
    i.monochromatic = function(a, b) {
        b = b || 6;
        var c = i(a).toHsv();
        var d = c.h, e = c.s, f = c.v;
        var g = [];
        var h = 1 / b;
        while (b--) {
            g.push(i({
                h: d,
                s: e,
                v: f
            }));
            f = (f + h) % 1;
        }
        return g;
    };
    i.readability = function(a, b) {
        var c = i(a);
        var d = i(b);
        var e = c.toRgb();
        var f = d.toRgb();
        var g = c.getBrightness();
        var h = d.getBrightness();
        var j = Math.max(e.r, f.r) - Math.min(e.r, f.r) + Math.max(e.g, f.g) - Math.min(e.g, f.g) + Math.max(e.b, f.b) - Math.min(e.b, f.b);
        return {
            brightness: Math.abs(g - h),
            color: j
        };
    };
    i.readable = function(a, b) {
        var c = i.readability(a, b);
        return c.brightness > 125 && c.color > 500;
    };
    i.mostReadable = function(a, b) {
        var c = null;
        var d = 0;
        var e = false;
        for (var f = 0; f < b.length; f++) {
            var g = i.readability(a, b[f]);
            var h = g.brightness > 125 && g.color > 500;
            var j = 3 * (g.brightness / 125) + g.color / 500;
            if (h && !e || h && e && j > d || !h && !e && j > d) {
                e = h;
                d = j;
                c = i(b[f]);
            }
        }
        return c;
    };
    var r = i.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };
    var s = i.hexNames = t(r);
    function t(a) {
        var b = {};
        for (var c in a) {
            if (a.hasOwnProperty(c)) {
                b[a[c]] = c;
            }
        }
        return b;
    }
    function u(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }
        return a;
    }
    function v(a, b) {
        if (y(a)) {
            a = "100%";
        }
        var c = z(a);
        a = f(b, g(0, parseFloat(a)));
        if (c) {
            a = parseInt(a * b, 10) / 100;
        }
        if (d.abs(a - b) < 1e-6) {
            return 1;
        }
        return a % b / parseFloat(b);
    }
    function w(a) {
        return f(1, g(0, a));
    }
    function x(a) {
        return parseInt(a, 16);
    }
    function y(a) {
        return typeof a == "string" && a.indexOf(".") != -1 && parseFloat(a) === 1;
    }
    function z(a) {
        return typeof a === "string" && a.indexOf("%") != -1;
    }
    function A(a) {
        return a.length == 1 ? "0" + a : "" + a;
    }
    function B(a) {
        if (a <= 1) {
            a = a * 100 + "%";
        }
        return a;
    }
    function C(a) {
        return Math.round(parseFloat(a) * 255).toString(16);
    }
    function D(a) {
        return x(a) / 255;
    }
    var E = function() {
        var a = "[-\\+]?\\d+%?";
        var b = "[-\\+]?\\d*\\.\\d+%?";
        var c = "(?:" + b + ")|(?:" + a + ")";
        var d = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?";
        var e = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?";
        return {
            rgb: new RegExp("rgb" + d),
            rgba: new RegExp("rgba" + e),
            hsl: new RegExp("hsl" + d),
            hsla: new RegExp("hsla" + e),
            hsv: new RegExp("hsv" + d),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    }();
    function F(c) {
        c = c.replace(a, "").replace(b, "").toLowerCase();
        var d = false;
        if (r[c]) {
            c = r[c];
            d = true;
        } else if (c == "transparent") {
            return {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                format: "name"
            };
        }
        var e;
        if (e = E.rgb.exec(c)) {
            return {
                r: e[1],
                g: e[2],
                b: e[3]
            };
        }
        if (e = E.rgba.exec(c)) {
            return {
                r: e[1],
                g: e[2],
                b: e[3],
                a: e[4]
            };
        }
        if (e = E.hsl.exec(c)) {
            return {
                h: e[1],
                s: e[2],
                l: e[3]
            };
        }
        if (e = E.hsla.exec(c)) {
            return {
                h: e[1],
                s: e[2],
                l: e[3],
                a: e[4]
            };
        }
        if (e = E.hsv.exec(c)) {
            return {
                h: e[1],
                s: e[2],
                v: e[3]
            };
        }
        if (e = E.hex8.exec(c)) {
            return {
                a: D(e[1]),
                r: x(e[2]),
                g: x(e[3]),
                b: x(e[4]),
                format: d ? "name" : "hex8"
            };
        }
        if (e = E.hex6.exec(c)) {
            return {
                r: x(e[1]),
                g: x(e[2]),
                b: x(e[3]),
                format: d ? "name" : "hex"
            };
        }
        if (e = E.hex3.exec(c)) {
            return {
                r: x(e[1] + "" + e[1]),
                g: x(e[2] + "" + e[2]),
                b: x(e[3] + "" + e[3]),
                format: d ? "name" : "hex"
            };
        }
        return false;
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = i;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return i;
        });
    } else {
        window.tinycolor = i;
    }
})();