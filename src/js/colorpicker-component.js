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
