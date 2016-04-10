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
  update: function(color, triggerEvent) {
    color = this._isColorObject(color) ? color :
      (this._isString(color) ? this._safeColorObject(color) : this.getColor());

    var previewColorAddonSelector = '.colorpicker-preview .colorpicker-addon-inner';

    if (!this._isColorObject(color)) {
      // Clear backgrounds and color code
      this.component
        .find('.colorpicker-saturation, .colorpicker-alpha, .colorpicker-guide, ' + previewColorAddonSelector)
        .attr('style', '');
      if (this.options.previewText) {
        this.component.find(previewColorAddonSelector).text('');
      }
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

    if (triggerEvent !== false) {
      this._trigger(this.element, 'colorpicker_update', color);
    }

    return true;
  },
  setColor: function(val, triggerEvent) { // set color manually and return the color object
    var color = null;
    if (!val) {
      // Remove color from JS instance and DOM data, display the default one in the component interface
      this.element.removeData('color');
      if (triggerEvent !== false) {
        this._trigger(this.element, 'colorpicker_change');
      }
      color = this.options.defaultColor ? this._safeColorObject(this.options.defaultColor) : null;
    } else {
      // Update color in JS instance, DOM data and component interface
      color = this._safeColorObject(val);
      this.element.data('color', color);
      if (triggerEvent !== false) {
        this._trigger(this.element, 'colorpicker_change', color, this._colorString(color));
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
  color: function(newColor, triggerEvent) {
    if (newColor !== undefined) {
      newColor = this.setColor(newColor, triggerEvent);
      this.update(newColor, triggerEvent);
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
