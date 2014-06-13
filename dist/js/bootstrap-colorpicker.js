(function(a) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], a);
    } else if (window.jQuery && !window.jQuery.fn.colorpicker) {
        a(window.jQuery);
    }
})(function(a) {
    "use strict";
    var b = {
        placement: "auto",
        container: false,
        animation: true,
        value: false,
        vertical: false,
        inline: false,
        format: false,
        input: "input",
        component: false,
        large: false,
        palettes: [],
        paletteAdjustment: 9,
        updatePalettes: true,
        okButton: false,
        cancelButton: false,
        template: '<div class="colorpicker">' + '<div class="colorpicker-map">' + '<div class="colorpicker-color"></div>' + '<div class="colorpicker-lightness"></div>' + '<div class="colorpicker-saturation"></div>' + "<i><b></b></i></div>" + '<div class="colorpicker-bar"><div class="colorpicker-hue"><i></i></div></div>' + '<div class="colorpicker-bar"><div class="colorpicker-alpha"><i></i></div></div>' + '<div class="colorpicker-palettes"></div>' + "</div>",
        paletteTemplate: '<div class="colorpicker-bar colorpicker-bar-horizontal colorpicker-palette">' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + "</div>",
        popoverTemplate: '<div class="popover colorpicker-popover"><div class="arrow"></div><div class="popover-content"></div></div>'
    };
    var c = function(a, b) {
        return "background-image: -moz-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -o-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, {color1}), color-stop(1, {color2})); background-image: -webkit-linear-gradient(top, {color1} 0%, {color2} 100%); background: -ms-linear-gradient(top,  {color1} 0%,{color2} 100%); background: linear-gradient(top,  {color1} 0%,{color2} 100%);".replace(/\{color1\}/g, a).replace(/\{color2\}/g, b);
    };
    var d = function(c, d) {
        this.element = a(c).addClass("colorpicker-element");
        this.options = a.extend({}, b, this.element.data(), d);
        this.component = this.options.component;
        this.component = this.component !== false ? this.element.find(this.component) : false;
        if (this.component != false && this.component.length === 0) {
            this.component = false;
        }
        this.container = this.options.container === true ? this.element : this.options.container;
        this.container = this.container !== false ? a(this.container) : false;
        this.input = this.element.is("input") ? this.element : this.options.input ? this.element.find(this.options.input) : false;
        if (this.input != false && this.input.length === 0) {
            this.input = false;
        }
        this._createPicker();
        this.setColor(this.getValue());
        this.options.format = this.options.format === false ? this.color._format : this.options.format;
        this.element.popover({
            placement: this.options.placement,
            container: this.container,
            animation: this.options.animation,
            template: this.options.popoverTemplate,
            content: this.picker.element,
            html: true,
            trigger: "manual"
        }).on("focus", function() {
            a(this).popover("show");
        }).on("blur", function() {});
        this._setPalettes(this.options.palettes);
        var e = this;
        console.log(this);
    };
    var e = function(a) {
        this.color = a;
    };
    e.prototype = {
        constructor: e,
        clone: function() {
            return a.extend(true, {}, this.color);
        },
        fn: function(a, b) {
            var c = this.clone();
            c[a](b);
            return c;
        }
    };
    d.prototype = {
        constructor: d,
        _error: function(a) {
            throw "Bootstrap Colorpicker Exception: " + a;
        },
        _tc: function(a, b) {
            return new e(this.color).fn(a, b);
        },
        _setPalettes: function(b) {
            var c = this;
            if (!a.isArray(b)) {
                return false;
            }
            this.picker.palettes.element.html("");
            a(b).each(function(b, d) {
                var e = a(c.options.paletteTemplate);
                var f = 0;
                if (a.isArray(d)) {
                    a(d).each(function(a, b) {
                        f = c._fillPalette(e, b, f);
                    });
                } else {
                    f = c._fillPalette(e, d, f);
                }
                c.picker.palettes.element.append(e);
            });
            this.picker.palettes.element.find(".colorpicker-palette-color").on("click", function() {
                var b = a(this).find("i");
                if (b.length > 0) {
                    c.setColor(b.css("backgroundColor"));
                }
            });
        },
        _setPaletteColor: function(b, c, d, e) {
            e = e || false;
            var f = c.find(".colorpicker-palette-color:eq(" + d + ")");
            if (f.length > 0) {
                e = e ? e : b;
                f.html(a("<i></i>").attr("title", e).css("backgroundColor", b));
            }
            return f;
        },
        _fillPalette: function(b, c, d) {
            var e = this;
            var f = d || 0;
            d = f;
            switch (c) {
              case "current":
                {
                    var g = e.color.toString(e.options.format);
                    e._setPaletteColor(g, b, d, g + " current");
                    f++;
                }
                break;

              case "triad":
                {
                    a(tinycolor.triad(e.color)).each(function(a, c) {
                        if (a == 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " triad");
                        f++;
                    });
                }
                break;

              case "tetrad":
                {
                    a(tinycolor.tetrad(e.color)).each(function(a, c) {
                        if (a == 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " tetrad");
                        f++;
                    });
                }
                break;

              case "complementary":
                {
                    a(tinycolor.splitcomplement(e.color)).each(function(a, c) {
                        if (a == 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " complementary");
                        f++;
                    });
                }
                break;

              case "monochromatic":
                {
                    a(tinycolor.monochromatic(e.color, 12)).each(function(a, c) {
                        if (a == 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " monochromatic");
                        f++;
                    });
                }
                break;

              case "analogous":
                {
                    a(tinycolor.analogous(e.color, 12)).each(function(a, c) {
                        if (a == 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " analogous");
                        f++;
                    });
                }
                break;

              case "lighten":
              case "darken":
              case "saturate":
              case "desaturate":
              case "brighten":
                {
                    for (var h = 0; h < 11; h++) {
                        var i = e.options.paletteAdjustment * (h + 1);
                        var g = tinycolor[c](e.color, i).toString(e.options.format);
                        e._setPaletteColor(g, b, h + d, g + " " + c + " " + i + "%");
                        f++;
                    }
                }
                break;

              case "lightness":
                {
                    var j = [];
                    for (var h = 0; h < 6; h++) {
                        var i = e.options.paletteAdjustment * (h + 1);
                        j.push(tinycolor["darken"](e.color, i).toString(e.options.format));
                    }
                    j = j.reverse();
                    for (var h = 6; h >= 0; h--) {
                        var k = 100 - e.options.paletteAdjustment * (h + 1);
                        e._setPaletteColor(j[h], b, h + d, j[h] + " darken " + k + "%");
                        f++;
                    }
                    d += 6;
                    for (var h = 0; h < 5; h++) {
                        var i = e.options.paletteAdjustment * (h + 1);
                        var g = tinycolor["lighten"](e.color, i).toString(e.options.format);
                        e._setPaletteColor(g, b, h + d, g + " lighten " + i + "%");
                        f++;
                    }
                }
                break;

              case "mixed":
                {
                    var l = [ "lighten", "darken", "saturate", "desaturate", "brighten", "greyscale" ];
                    var m = 0;
                    a(l).each(function(a, c) {
                        var g = tinycolor[c](e.color, e.options.paletteAdjustment * 2).toString(e.options.format);
                        e._setPaletteColor(g, b, m + d, g + " " + c);
                        m++;
                        f++;
                        if (c != "greyscale") {
                            var g = tinycolor[c](e.color, e.options.paletteAdjustment * 4).toString(e.options.format);
                            e._setPaletteColor(g, b, m + d, g + " " + c);
                            m++;
                            f++;
                        }
                    });
                }
                break;

              default:
                {
                    if (a.isArray(c)) {
                        a(c).each(function(a, c) {
                            e._setPaletteColor(tinycolor(c).toString(e.options.format), b, a + d, c);
                            f++;
                        });
                    } else {
                        e._setPaletteColor(tinycolor(c).toString(e.options.format), b, d, c);
                        f++;
                    }
                }
                break;
            }
            return f;
        },
        _createPicker: function(b) {
            b = b || {};
            var c = a(this.options.template);
            var d = c.find(".colorpicker-map:first"), e = c.find(".colorpicker-color:first"), f = c.find(".colorpicker-hue:first"), g = c.find(".colorpicker-saturation:first"), h = c.find(".colorpicker-lightness:first"), i = c.find(".colorpicker-alpha:first"), j = c.find(".colorpicker-palettes:first");
            this.picker = {
                element: c,
                map: {
                    element: d,
                    width: d.width(),
                    height: d.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                },
                color: {
                    element: e,
                    width: e.width(),
                    height: e.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                },
                hue: {
                    element: f,
                    width: f.width(),
                    height: f.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: f.width() != f.height()
                },
                saturation: {
                    element: g,
                    width: g.width(),
                    height: g.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: g.width() != g.height()
                },
                lightness: {
                    element: h,
                    width: h.width(),
                    height: h.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: h.width() != h.height()
                },
                alpha: {
                    element: i,
                    width: i.width(),
                    height: i.height(),
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: i.width() != i.height()
                },
                palettes: {
                    element: j,
                    width: j.width(),
                    height: 0,
                    maxTop: 0,
                    maxLeft: 0,
                    callTop: false,
                    callLeft: false,
                    isBar: false
                }
            };
            this.picker = a.extend(true, this.picker, {
                hue: {
                    maxTop: this.options.vertical && this.picker.hue.isBar ? 0 : this.picker.hue.height,
                    maxLeft: !this.options.vertical && this.picker.hue.isBar ? 0 : this.picker.hue.width,
                    callTop: this.picker.hue.isBar ? "setHue" : "setBrightness",
                    callLeft: this.picker.hue.isBar ? false : "setHue"
                },
                saturation: {
                    maxTop: this.options.vertical && this.picker.saturation.isBar ? 0 : this.picker.saturation.height,
                    maxLeft: !this.options.vertical && this.picker.saturation.isBar ? 0 : this.picker.saturation.width,
                    callTop: this.picker.hue.isBar ? "setSaturation" : "setBrightness",
                    callLeft: this.picker.hue.isBar ? false : "setBrightness"
                },
                lightness: {
                    maxTop: this.options.vertical && this.picker.lightness.isBar ? 0 : this.picker.lightness.height,
                    maxLeft: !this.options.vertical && this.picker.lightness.isBar ? 0 : this.picker.lightness.width,
                    callTop: false,
                    callLeft: false
                },
                alpha: {
                    maxTop: this.options.vertical && this.picker.alpha.isBar ? 0 : this.picker.alpha.height,
                    maxLeft: !this.options.vertical && this.picker.alpha.isBar ? 0 : this.picker.alpha.width,
                    callTop: this.picker.hue.isBar ? "setAlpha" : false,
                    callLeft: this.picker.hue.isBar ? false : "setAlpha"
                }
            }, b);
            if (this.options.large) {
                this.picker.element.addClass("colorpicker-2x");
                this.options.popoverTemplate = this.options.popoverTemplate.replace("colorpicker-popover", "colorpicker-popover colorpicker-popover-2x");
            }
        },
        api: function() {
            return this;
        },
        updateColor: function() {
            if (this.color.isValid()) {
                this.picker.color.element.css("backgroundColor", this.color.toString("hex"));
                this.picker.alpha.element.attr("style", c(this.color.toRgbString(), this._tc("setAlpha", 0).toRgbString()));
                if (this.options.updatePalettes) {
                    this._setPalettes(this.options.palettes);
                }
            } else {
                this._error("Invalid color : " + this.color);
            }
        },
        updatePicker: function() {},
        updateValue: function(a) {
            a = a || this.color.toString(this.format);
            if (this.input !== false) {
                this.input.prop("value", a);
            }
            if (this.element !== false) {
                this.element.data("color", a);
            }
            return a;
        },
        updateComponent: function(a) {
            a = a || this.color.toString(this.format);
            if (this.component !== false) {
                var b = this.component.find("i").eq(0);
                if (b.length > 0) {
                    b.css({
                        backgroundColor: a
                    });
                } else {
                    this.component.css({
                        backgroundColor: a
                    });
                }
            }
        },
        setColor: function(a) {
            this.color = tinycolor(a);
            this.updateColor();
            this.element.data("color", this.color.toString(this.options.format)).trigger({
                type: "colorChange",
                color: this.color,
                value: a
            });
        },
        getColor: function() {
            return this.color.toString(this.format);
        },
        setValue: function(a) {
            this.setColor(a);
            a = this.getColor();
            if (this.getValue(false) !== false || force === true) {
                this.updateInput(a);
                this.updateData(a);
            }
            this.updatePicker();
            this.element.data("color", this.color.toString(this.options.format)).trigger({
                type: "colorChange",
                color: this.color,
                value: a
            });
        },
        getValue: function(a) {
            a = a || "";
            var b = a;
            if (this.hasInput()) {
                b = this.input.val();
            } else {
                b = this.element.data("color");
            }
            if (b === undefined || b === "" || b === null) {
                b = a;
            }
            return b;
        },
        hasInput: function() {
            return this.input !== false;
        },
        isDisabled: function() {
            if (this.hasInput()) {
                return this.input.prop("disabled") === true;
            }
            return false;
        },
        disable: function() {
            if (this.hasInput()) {
                this.input.prop("disabled", true);
                return true;
            }
            return false;
        },
        enable: function() {
            if (this.hasInput()) {
                this.input.prop("disabled", false);
                return true;
            }
            return false;
        }
    };
    a.colorpicker = d;
    a.fn.colorpicker = function(b) {
        var c = arguments;
        return this.each(function() {
            var e = a(this), f = e.data("colorpicker"), g = typeof b === "object" ? b : {};
            if (!f && typeof b !== "string") {
                e.data("colorpicker", new d(this, g));
            } else if (typeof b === "string") {
                f[b].apply(f, Array.prototype.slice.call(c, 1));
            }
        });
    };
});