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
        palettes: [],
        paletteAdjustment: 9,
        baseWidth: 128,
        baseBarWidth: 16,
        baseHeight: 128,
        large: false,
        updatePalettes: true,
        okButton: false,
        cancelButton: false,
        currentComparer: false,
        tooltip: false,
        templates: {
            picker: '<div class="colorpicker">' + '<div class="colorpicker-map">' + '<div class="colorpicker-color"></div>' + '<div class="colorpicker-brightness"></div>' + '<div class="colorpicker-saturation"><i><b></b></i></div>' + "</div>" + '<div class="colorpicker-bar"><div class="colorpicker-hue"><i></i></div></div>' + '<div class="colorpicker-bar"><div class="colorpicker-alpha"><i></i></div></div>' + '<div class="colorpicker-palettes"></div>' + "</div>",
            palette: '<div class="colorpicker-bar colorpicker-bar-horizontal colorpicker-palette">' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + '<div class="colorpicker-palette-color"></div>' + "</div>",
            popover: '<div class="popover colorpicker-popover"><div class="arrow"></div><div class="popover-content"></div></div>'
        }
    };
    var c = function(a, b) {
        return "background-image: -moz-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -o-linear-gradient(top, {color1} 0%, {color2} 100%); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, {color1}), color-stop(1, {color2})); background-image: -webkit-linear-gradient(top, {color1} 0%, {color2} 100%); background: -ms-linear-gradient(top,  {color1} 0%,{color2} 100%); background: linear-gradient(top,  {color1} 0%,{color2} 100%);".replace(/\{color1\}/g, a).replace(/\{color2\}/g, b);
    };
    var d = function(c, d) {
        this.element = a(c).addClass("colorpicker-element");
        this.options = a.extend({}, b, this.element.data(), d);
        this.options.baseWidth = this.options.large ? this.options.baseWidth * 2 : this.options.baseWidth;
        this.options.baseBarWidth = this.options.large ? this.options.baseBarWidth * 2 : this.options.baseBarWidth;
        this.options.baseHeight = this.options.large ? this.options.baseHeight * 2 : this.options.baseHeight;
        this.component = this.options.component;
        this.component = this.component !== false ? this.element.find(this.component) : false;
        if (this.component !== false && this.component.length === 0) {
            this.component = false;
        }
        this.container = this.options.container === true ? this.element : this.options.container;
        this.container = this.container !== false ? a(this.container) : false;
        this.input = this.element.is("input") ? this.element : this.options.input ? this.element.find(this.options.input) : false;
        if (this.input !== false && this.input.length === 0) {
            this.input = false;
        }
        this._createPicker();
        this.color = tinycolor(this.getValue());
        this.options.format = this.options.format === false ? this.color._format : this.options.format;
        this._bindMouseEvents();
        this._createPopover();
        this._setPalettes(this.options.palettes);
        if (this.hasInput()) {
            this.input.on("keyup", a.proxy(function(b) {
                if (a.inArray(b.keyCode, [ 38, 40, 37, 39, 16, 17, 18, 9, 8, 91, 93, 20, 46, 186, 190, 46, 78, 188, 44, 86 ]) === -1) {
                    this.update();
                }
            }, this));
        }
        this._trigger("colorpickerCreate");
        this.element.data("colorpicker", this);
        a(a.proxy(function() {
            this.picker.element.trigger("mousedown");
            this.update();
        }, this));
    };
    d.prototype = {
        constructor: d,
        options: {},
        _mousePointer: {
            top: 0,
            left: 0
        },
        _trigger: function(b, c) {
            this.element.trigger(a.extend({
                type: b,
                colorpicker: this
            }, c));
        },
        _error: function(a) {
            throw "Bootstrap Colorpicker Exception: " + a;
        },
        _hsvaFromGuides: function() {
            var a = {
                h: parseInt(this.picker.hue.element.find("i").css("top"), 10),
                s: parseInt(this.picker.saturation.element.find("i").css("left"), 10),
                v: parseInt(this.picker.saturation.element.find("i").css("top"), 10),
                a: parseInt(this.picker.alpha.element.find("i").css("top"), 10)
            };
            for (var b in a) {
                if (isNaN(a[b]) || a[b] < 0) {
                    a[b] = 0;
                    console.error("isNaN or neg for: " + b);
                }
                if (b === "h") {
                    a[b] = parseInt(a[b] * 360 / this.options.baseWidth, 10);
                } else {
                    a[b] = parseInt(a[b] * 100 / this.options.baseWidth, 10);
                    if (b === "v") {
                        a[b] = 100 - a[b];
                        if (a[b] < 0) {
                            a[b] = a[b] * -1;
                        }
                    }
                }
                if (b === "h" && a[b] > 360) {
                    a[b] = 360;
                } else if (b !== "h" && a[b] > 100) {
                    a[b] = 100;
                }
                if (b === "a") {
                    a[b] = a[b] / 100;
                }
            }
            return a;
        },
        _hsvaFromValue: function(a) {
            var b = tinycolor(a).toHsv();
            if (b["a"] === undefined) {
                b.a = 1;
            }
            return b;
        },
        _mousedown: function(b) {
            b.stopPropagation();
            b.preventDefault();
            var c = a(b.target);
            var d = c.closest("div");
            if (!d.is(".colorpicker")) {
                if (d.is(".colorpicker-saturation")) {
                    this.currentSlider = a.extend({}, this.picker.saturation);
                } else if (d.is(".colorpicker-hue")) {
                    this.currentSlider = a.extend({}, this.picker.hue);
                } else if (d.is(".colorpicker-alpha")) {
                    this.currentSlider = a.extend({}, this.picker.alpha);
                } else {
                    return false;
                }
                var e = d.offset();
                this.currentSlider.guide = d.find("i");
                this.currentSlider.left = b.pageX - e.left;
                this.currentSlider.top = b.pageY - e.top;
                this._mousePointer = {
                    left: b.pageX,
                    top: b.pageY
                };
                a(document).on({
                    "mousemove.colorpicker": a.proxy(this._mousemove, this),
                    "mouseup.colorpicker": a.proxy(this._mouseup, this)
                }).trigger("mousemove");
            }
            return false;
        },
        _mousemove: function(a) {
            a.stopPropagation();
            a.preventDefault();
            var b = Math.max(0, Math.min(this.currentSlider.maxLeft, this.currentSlider.left + ((a.pageX || this._mousePointer.left) - this._mousePointer.left)));
            var c = Math.max(0, Math.min(this.currentSlider.maxTop, this.currentSlider.top) + ((a.pageY || this._mousePointer.top) - this._mousePointer.top));
            if (c >= this.currentSlider.maxTop) {
                c = this.currentSlider.maxTop;
            }
            if (b >= this.currentSlider.maxLeft) {
                b = this.currentSlider.maxLeft;
            }
            this.currentSlider.guide.css("left", b + "px");
            this.currentSlider.guide.css("top", c + "px");
            this._trigger("colorpickerMove", {
                hsla: this._updateColorFromGuidelines()
            });
            return false;
        },
        _mouseup: function(b) {
            b.stopPropagation();
            b.preventDefault();
            a(document).off({
                "mousemove.colorpicker": this._mousemove,
                "mouseup.colorpicker": this._mouseup
            });
            return false;
        },
        _bindMouseEvents: function() {
            this.picker.element.on("mousedown.colorpicker", a.proxy(this._mousedown, this));
            if (this.options.inline === false) {
                a(window.document).on("click.colorpicker", a.proxy(function(b) {
                    var c = a(b.target);
                    if ((!c.hasClass("colorpicker-element") || c.hasClass("colorpicker-element") && !c.is(this.element)) && c.parents(".colorpicker-popover").length === 0) {
                        this.hide();
                    }
                    b.stopPropagation();
                    b.preventDefault();
                    return false;
                }, this));
            }
        },
        _setPalettes: function(b) {
            var c = this;
            if (!a.isArray(b)) {
                return false;
            }
            this.picker.palettes.element.html("");
            a(b).each(function(b, d) {
                var e = a(c.options.templates.palette);
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
            this.picker.palettes.element.find(".colorpicker-palette-color").on("click", function(b) {
                var d = a(this).find("i");
                if (d.length > 0) {
                    c.update(d.css("backgroundColor"));
                }
                b.stopPropagation();
                b.preventDefault();
                return false;
            });
        },
        _setPaletteColor: function(b, c, d, e, f) {
            e = e || false;
            f = f || "custom";
            var g = c.find(".colorpicker-palette-color:eq(" + d + ")");
            if (g.length > 0) {
                e = e ? e : b;
                g.html(a('<i class="colorpicker-palette-' + f + '" data-colorpicker-palette-color="' + b + '"></i>').attr("title", e).css("backgroundColor", b));
            }
            return g;
        },
        _fillPalette: function(b, c, d) {
            var e = this;
            var f = d || 0;
            d = f;
            switch (c) {
              case "current":
                {
                    var g = e.color.toString(e.options.format);
                    e._setPaletteColor(g, b, d, g + " current", "current");
                    f++;
                }
                break;

              case "previous":
                {
                    if (e.previousColor) {
                        var g = e.previousColor.toString(e.options.format);
                        e._setPaletteColor(g, b, d, g + " previous", "previous");
                        f++;
                    }
                }
                break;

              case "triad":
                {
                    a(tinycolor.triad(e.color)).each(function(a, c) {
                        if (a === 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " triad", "triad");
                        f++;
                    });
                }
                break;

              case "tetrad":
                {
                    a(tinycolor.tetrad(e.color)).each(function(a, c) {
                        if (a === 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " tetrad", "tetrad");
                        f++;
                    });
                }
                break;

              case "complementary":
                {
                    a(tinycolor.splitcomplement(e.color)).each(function(a, c) {
                        if (a === 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " complementary", "complementary");
                        f++;
                    });
                }
                break;

              case "monochromatic":
                {
                    a(tinycolor.monochromatic(e.color, 12)).each(function(a, c) {
                        if (a === 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " monochromatic", "monochromatic");
                        f++;
                    });
                }
                break;

              case "analogous":
                {
                    a(tinycolor.analogous(e.color, 12)).each(function(a, c) {
                        if (a === 0) {
                            d--;
                            return;
                        }
                        c = c.toString(e.options.format);
                        e._setPaletteColor(c, b, a + d, c + " analogous", "analogous");
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
                        e._setPaletteColor(g, b, h + d, g + " " + c + " " + i + "%", c);
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
                        e._setPaletteColor(j[h], b, h + d, j[h] + " darken " + k + "%", "darken");
                        f++;
                    }
                    d += 6;
                    for (var h = 0; h < 5; h++) {
                        var i = e.options.paletteAdjustment * (h + 1);
                        var g = tinycolor["lighten"](e.color, i).toString(e.options.format);
                        e._setPaletteColor(g, b, h + d, g + " lighten " + i + "%", "lighten");
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
                        e._setPaletteColor(g, b, m + d, g + " " + c, c);
                        m++;
                        f++;
                        if (c !== "greyscale") {
                            var g = tinycolor[c](e.color, e.options.paletteAdjustment * 4).toString(e.options.format);
                            e._setPaletteColor(g, b, m + d, g + " " + c, c);
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
        _createPopover: function() {
            var b = this;
            this.element.popover({
                placement: this.options.placement,
                container: this.container,
                animation: this.options.animation,
                template: this.options.templates.popover,
                content: this.picker.element,
                html: true,
                trigger: "manual"
            }).on("focus", function() {
                a(this).popover("show");
            }).on("show.bs.popover", function() {
                b.update();
            });
        },
        _createPicker: function(b) {
            b = b || {};
            var c = a(this.options.templates.picker);
            c.find(".colorpicker-map i").css({
                top: this.options.baseHeight + 2 + "px",
                left: 2 + "px"
            });
            c.find(".colorpicker-bar i").css({
                top: this.options.baseHeight / 2 + 2 + "px",
                left: "0px"
            });
            this.picker = {
                element: c,
                map: {
                    element: c.find(".colorpicker-map:first"),
                    width: this.options.baseWidth,
                    height: this.options.baseHeight,
                    maxTop: 0,
                    maxLeft: 0
                },
                color: {
                    element: c.find(".colorpicker-color:first"),
                    width: this.options.baseWidth,
                    height: this.options.baseHeight,
                    maxTop: 0,
                    maxLeft: 0
                },
                hue: {
                    element: c.find(".colorpicker-hue:first"),
                    width: this.options.baseBarWidth,
                    height: this.options.baseHeight,
                    maxTop: this.options.baseHeight,
                    maxLeft: 0
                },
                saturation: {
                    element: c.find(".colorpicker-saturation:first"),
                    width: this.options.baseWidth,
                    height: this.options.baseHeight,
                    maxTop: this.options.baseHeight,
                    maxLeft: this.options.baseWidth
                },
                brightness: {
                    element: c.find(".colorpicker-brightness:first"),
                    width: this.options.baseWidth,
                    height: this.options.baseHeight,
                    maxTop: this.options.baseHeight,
                    maxLeft: this.options.baseWidth
                },
                alpha: {
                    element: c.find(".colorpicker-alpha:first"),
                    width: this.options.baseBarWidth,
                    height: this.options.baseHeight,
                    maxTop: this.options.baseHeight,
                    maxLeft: 0
                },
                palettes: {
                    element: c.find(".colorpicker-palettes:first"),
                    width: this.options.baseWidth,
                    height: 0,
                    maxTop: 0,
                    maxLeft: 0
                }
            };
            this.picker = a.extend(true, this.picker, b);
            if (this.options.large === true) {
                this.picker.element.addClass("colorpicker-2x");
                this.options.templates.popover = this.options.templates.popover.replace("colorpicker-popover", "colorpicker-popover colorpicker-popover-2x");
            } else {
                this.picker.element.removeClass("colorpicker-2x");
                this.options.templates.popover = this.options.templates.popover.replace("colorpicker-popover-2x", "");
            }
        },
        _updateComponents: function() {
            var a = this._hsvaFromValue(this.color);
            a.s = 100;
            a.v = 1;
            a.a = 1;
            this.picker.color.element.css("backgroundColor", tinycolor(a).toString("hex"));
            this.picker.alpha.element.css("backgroundColor", this.color.toRgbString());
            if (this.options.updatePalettes) {
                this._setPalettes(this.options.palettes);
            }
            if (this.component !== false) {
                var b = this.component.find("i").eq(0);
                if (b.length > 0) {
                    b.css({
                        backgroundColor: this.getColor()
                    });
                } else {
                    this.component.css({
                        backgroundColor: this.getColor()
                    });
                }
            }
        },
        _updateGuides: function() {
            var a = this._hsvaFromValue(this.color);
            console.info(a);
            var b = {
                h: parseInt(a.h * this.picker.hue.height / 360, 10),
                s: parseInt(a.s * 100 / this.picker.saturation.height, 10),
                v: parseInt(a.v * 100 / this.picker.brightness.width, 10),
                a: parseInt(a.a * 100 * this.picker.alpha.height / 100, 10)
            };
            this.picker.hue.element.find("i").css("top", b.h + "px");
            this.picker.saturation.element.find("i").css({
                top: b.s + "px",
                left: b.v + "px"
            });
            this.picker.alpha.element.find("i").css("top", b.a + "px");
            console.log(b);
            return b;
        },
        _updateColorFromGuidelines: function() {
            var a = this._hsvaFromGuides();
            this.update(a, false);
            return a;
        },
        setColor: function(a) {
            this.color = tinycolor(a);
            if (this.color.isValid()) {
                this._updateComponents();
                this.previousColor = tinycolor(this.color.toString());
            } else {
                console.warn("Invalid color: ");
                console.log(a);
                return false;
            }
            this._trigger("colorpickerChange", {
                value: a
            });
            return this.color;
        },
        getColor: function() {
            return this.color.toString(this.options.format);
        },
        setValue: function(a) {
            a = this.setColor(a);
            if (a !== false) {
                if (this.hasInput()) {
                    this.input.val(this.getColor());
                } else {
                    this.element.data("color", this.getColor());
                }
            }
            return a;
        },
        getValue: function(a) {
            a = a || "";
            var b = a;
            if (this.hasInput()) {
                b = this.input.val();
            } else {
                b = this.element.data("color");
            }
            if (b === undefined || b === "" || b === null || b === false) {
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
        show: function() {
            this.element.popover("show");
        },
        hide: function() {
            this.element.popover("hide");
        },
        update: function(a, b) {
            b = b !== false ? true : false;
            a = a ? a : this.getValue(this.color);
            this._trigger("colorpickerUpdating");
            this.setValue(a);
            if (b) {
                this._updateGuides();
            }
            this.picker.element.hide().show();
            this._trigger("colorpickerUpdated");
            return a;
        },
        destroy: function() {
            this.picker.remove();
            this.element.removeData("colorpicker").removeData("color").off(".colorpicker");
            this.element.popover("destroy");
            if (this.input !== false) {
                this.input.off(".colorpicker");
            }
            if (this.component !== false) {
                this.component.off(".colorpicker");
            }
            this.element.removeClass("colorpicker-element");
            this._trigger("colorpickerDestroy");
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