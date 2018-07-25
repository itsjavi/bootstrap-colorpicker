'use strict';

import Color from './Color';
import Extension from './Extension';
import defaults from './options';
import bundledExtensions from 'extensions';
import $ from 'jquery';
import SliderHandler from './SliderHandler';
import PopupHandler from './PopupHandler';
import InputHandler from './InputHandler';
import ColorHandler from './ColorHandler';

let colorPickerIdCounter = 0;
let root = (typeof self !== 'undefined' ? self : this); // window

// This function is called every time a slider guide is moved
// The scope of "this" is the SliderHandler object
let onSliderGuideMove = function (handler, top, left) {
  if (!handler.currentSlider) {
    return;
  }

  let slider = handler.currentSlider, cp = handler.colorpicker, ch = cp.colorHandler;

  // Create a color object
  let color = !ch.hasColor() ? ch.getFallbackColor() : ch.color.getCopy();

  // Adjust the guide position
  slider.guideStyle.left = left + 'px';
  slider.guideStyle.top = top + 'px';

  // Adjust the color
  if (slider.callLeft) {
    color[slider.callLeft].call(color, left / slider.maxLeft);
  }
  if (slider.callTop) {
    color[slider.callTop].call(color, top / slider.maxTop);
  }

  // Set the new color
  cp.setValue(color);
};

/**
 * Colorpicker widget class
 */
class Colorpicker {
  /**
   * Color class
   *
   * @static
   * @type {Color}
   */
  static get Color() {
    return Color;
  }

  /**
   * Extension class
   *
   * @static
   * @type {Extension}
   */
  static get Extension() {
    return Extension;
  }

  /**
   * Internal color object
   *
   * @type {Color|null}
   */
  get color() {
    return this.colorHandler.color;
  }

  /**
   * Color format
   *
   * @type {String|null}
   */
  get format() {
    return this.colorHandler.format;
  }

  /**
   * @fires Colorpicker#colorpickerCreate
   * @param {Object|String} element
   * @param {Object} options
   * @constructor
   */
  constructor(element, options) {
    colorPickerIdCounter += 1;
    /**
     * The colorpicker instance number
     * @type {number}
     */
    this.id = colorPickerIdCounter;

    /**
     * Latest colorpicker event
     *
     * @type {{name: String, e: *}}
     */
    this.lastEvent = {
      alias: null,
      e: null
    };

    /**
     * The element that the colorpicker is bound to
     *
     * @type {*|jQuery}
     */
    this.element = $(element)
      .addClass('colorpicker-element')
      .attr('data-colorpicker-id', this.id);

    /**
     * @type {defaults}
     */
    this.options = $.extend(true, {}, defaults, options, this.element.data());

    /**
     * @type {boolean}
     * @private
     */
    this.disabled = false;

    /**
     * Extensions added to this instance
     *
     * @type {Extension[]}
     */
    this.extensions = [];

    // TODO: refactor into TriggerHandler
    /**
     * @type {*|jQuery}
     */
    this.component = (this.options.component !== false) ? this.element.find(this.options.component) : false;
    if (this.component && (this.component.length === 0)) {
      // not found
      this.component = false;
    }

    /**
     * The element where the
     * @type {*|jQuery}
     */
    this.container = (this.options.container === true) ? this.element : this.options.container;
    this.container = (this.container !== false) ? $(this.container) : false;

    /**
     * @type {InputHandler}
     */
    this.inputHandler = new InputHandler(this, root);
    /**
     * @type {ColorHandler}
     */
    this.colorHandler = new ColorHandler(this);
    /**
     * @type {SliderHandler}
     */
    this.sliderHandler = new SliderHandler(this, root, onSliderGuideMove);
    /**
     * @type {PopupHandler}
     */
    this.popupHandler = new PopupHandler(this, root);

    this.init();

    // Emit a create event
    $($.proxy(function () {
      /**
       * (Colorpicker) When the Colorpicker instance has been created and the DOM is ready.
       *
       * @event Colorpicker#colorpickerCreate
       */
      this.element.trigger({
        type: 'colorpickerCreate',
        colorpicker: this,
        color: this.color
      });
    }, this));
  }

  init() {
    // Init input
    this.inputHandler.bind();

    // Init extensions (before initializing the color)
    this._initExtensions();

    // Init color
    this.colorHandler.bind();

    // Init picker
    this._initPickerElement(); // TODO: refactor into PickerHandler

    // Init sliders and popup
    this.sliderHandler.bind();
    this.popupHandler.bind();

    // Inject into the DOM (this may make it visible)
    this._injectPickerElement();

    // Update widget, force if color is set manually in the options
    this.update(this.options.color !== false);
  }

  _initExtensions() {
    if (!Array.isArray(this.options.extensions)) {
      this.options.extensions = [];
    }

    if (this.options.debug) {
      this.options.extensions.push({name: 'debugger'});
    }

    // Register and instantiate extensions
    this.options.extensions.forEach((ext) => {
      this.registerExtension(bundledExtensions[ext.name.toLowerCase()], ext.options || {});
    });
  }

  _initPickerElement() {
    /**
     * @type {jQuery|HTMLElement}
     */
    let picker = this.picker = $(this.options.template);

    if (this.options.customClass) {
      picker.addClass(this.options.customClass);
    }

    if (this.options.horizontal) {
      picker.addClass('colorpicker-horizontal');
    }

    if (this._supportsAlphaBar()) {
      this.options.useAlpha = true;
      picker.addClass('colorpicker-with-alpha');
    } else {
      this.options.useAlpha = false;
    }
  }

  _supportsAlphaBar() {
    return (
      (this.options.useAlpha || (this.colorHandler.hasColor() && this.color.hasTransparency())) &&
      (this.options.useAlpha !== false) &&
      (!this.options.format || (this.options.format && !this.options.format.match(/^hex([36])?$/i)))
    );
  }

  _injectPickerElement() {
    // Inject the colorpicker element into the DOM
    let pickerParent = this.container ? this.container :
      (this.options.popover ? null : root.document.body);

    if (pickerParent) {
      this.picker.appendTo(pickerParent);
    }
  }

  /**
   * Colorpicker bundled extension classes
   *
   * @static
   * @type {{Extension}}
   */
  static getBundledExtensions() {
    return bundledExtensions;
  }

  /**
   * Creates and registers the given extension
   *
   * @param {Extension} ExtensionClass The extension class to instantiate
   * @param {Object} [config] Extension configuration
   * @returns {Extension}
   */
  registerExtension(ExtensionClass, config = {}) {
    let ext = new ExtensionClass(this, config);

    this.extensions.push(ext);
    return ext;
  }

  /**
   * Destroys the current instance
   *
   * @fires Colorpicker#colorpickerDestroy
   */
  destroy() {
    let color = this.color;

    this.sliderHandler.unbind();
    this.inputHandler.unbind();
    this.popupHandler.unbind();
    this.colorHandler.unbind();

    this.element
      .removeClass('colorpicker-element')
      .removeData('colorpicker', 'color')
      .off('.colorpicker');

    if (this.component !== false) {
      this.component.off('.colorpicker');
    }

    this.picker.remove();

    /**
     * (Colorpicker) When the instance is destroyed with all events unbound.
     *
     * @event Colorpicker#colorpickerDestroy
     */
    this.element.trigger({
      type: 'colorpickerDestroy',
      colorpicker: this,
      color: color
    });
  }

  /**
   * Shows the colorpicker widget if hidden.
   * If the colorpicker is disabled this call will be ignored.
   *
   * @fires Colorpicker#colorpickerShow
   * @param {Event} [e]
   */
  show(e) {
    this.popupHandler.show(e);
  }

  /**
   * Hides the colorpicker widget.
   * Hide is prevented when it is triggered by an event whose target element has been clicked/touched.
   *
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  hide(e) {
    this.popupHandler.hide(e);
  }

  /**
   * Toggles the colorpicker between visible or hidden
   *
   * @fires Colorpicker#colorpickerShow
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  toggle(e) {
    this.popupHandler.toggle(e);
  }

  /**
   * Returns the current color value as string
   *
   * @param {String|*} [defaultValue]
   * @returns {String|*}
   */
  getValue(defaultValue = null) {
    let val = this.colorHandler.color;

    val = (val instanceof Color) ? val : defaultValue;

    if (val instanceof Color) {
      return val.toString(this.format);
    }

    return val;
  }

  /**
   * Sets the color manually
   *
   * @fires Colorpicker#colorpickerChange
   * @param {String|Color} val
   */
  setValue(val) {
    let ch = this.colorHandler;

    if (
      (ch.hasColor() && ch.color.equals(val)) ||
      (!ch.hasColor() && !val)
    ) {
      // same color or still empty
      return;
    }

    let color = val ? ch.createColor(val) : null;

    // force update if color is changed to empty
    let forceUpdate = ch.hasColor() && !color;

    ch.color = color;

    /**
     * (Colorpicker) When the color is set programmatically with setValue().
     *
     * @event Colorpicker#colorpickerChange
     */
    this.element.trigger({
      type: 'colorpickerChange',
      colorpicker: this,
      color: ch.color,
      value: val
    });

    // force update if color has changed to empty
    this.update(forceUpdate);
  }

  /**
   * Updates the component color, the input value and the widget if a color is present.
   *
   * If force is true, it is updated anyway.
   *
   * @fires Colorpicker#colorpickerUpdate
   * @param {boolean} [force]
   */
  update(force = false) {
    if (!(this.colorHandler.hasColor() || (force === true))) {
      // no need to update
      return;
    }

    this.inputHandler.update();
    this._updateComponent();
    this._updatePicker();

    /**
     * (Colorpicker) Fired when the widget is updated.
     *
     * @event Colorpicker#colorpickerUpdate
     */
    this.element.trigger({
      type: 'colorpickerUpdate',
      colorpicker: this,
      color: this.color
    });
  }

  /**
   * Changes the color adjustment bars using the current color object information.
   * @private
   */
  _updatePicker() {
    if (!this.colorHandler.hasColor()) {
      return;
    }

    let vertical = (this.options.horizontal === false),
      sl = vertical ? this.options.sliders : this.options.slidersHorz;

    let saturationGuide = this.picker.find('.colorpicker-saturation .colorpicker-guide'),
      hueGuide = this.picker.find('.colorpicker-hue .colorpicker-guide'),
      alphaGuide = this.picker.find('.colorpicker-alpha .colorpicker-guide');

    let hsva = this.color.hsvaRatio;

    if (hueGuide.length) {
      hueGuide.css(vertical ? 'top' : 'left', (vertical ? sl.hue.maxTop : sl.hue.maxLeft) * (1 - hsva.h));
    }

    if (alphaGuide.length) {
      alphaGuide.css(vertical ? 'top' : 'left', (vertical ? sl.alpha.maxTop : sl.alpha.maxLeft) * (1 - hsva.a));
    }

    if (saturationGuide.length) {
      saturationGuide.css({
        'top': sl.saturation.maxTop - hsva.v * sl.saturation.maxTop,
        'left': hsva.s * sl.saturation.maxLeft
      });
    }

    this.picker.find('.colorpicker-saturation')
      .css('backgroundColor', this.color.getHueOnlyCopy().toHexString()); // we only need hue

    let hex6Color = this.color.toString('hex6');
    let alphaBg = '';

    if (this.options.horizontal) {
      alphaBg = `linear-gradient(to right, ${hex6Color} 0%, transparent 100%)`;
    } else {
      alphaBg = `linear-gradient(to bottom, ${hex6Color} 0%, transparent 100%)`;
    }

    this.picker.find('.colorpicker-alpha-color').css('background', alphaBg);
  }

  /**
   * If the component element is present, its background color is updated
   * @private
   */
  _updateComponent() {
    if (!this.colorHandler.hasColor() || (this.component === false)) {
      return;
    }

    let colorStr = this.colorHandler.getColorString();
    let styles = {'background': colorStr};

    let icn = this.component.find('i').eq(0);

    if (icn.length > 0) {
      icn.css(styles);
    } else {
      this.component.css(styles);
    }
  }

  /**
   * Resolves a color to its real representation, in case is not in a standard format (e.g. a custom color alias).
   * It also loops through all the extensions to delegate the conversion.
   *
   * @param {String|*} color
   * @returns {String|*|null}
   */
  resolveColor(color) {
    let extResolvedColor = false;

    $.each(this.extensions, function (name, ext) {
      if (extResolvedColor !== false) {
        // skip if resolved
        return;
      }
      extResolvedColor = ext.resolveColor(color);
    });

    return extResolvedColor ? extResolvedColor : color;
  }

  /**
   * Enables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerEnable
   * @returns {boolean}
   */
  enable() {
    this.inputHandler.enable();
    this.disabled = false;

    /**
     * (Colorpicker) When the widget has been enabled.
     *
     * @event Colorpicker#colorpickerEnable
     */
    this.element.trigger({
      type: 'colorpickerEnable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Disables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerDisable
   * @returns {boolean}
   */
  disable() {
    this.inputHandler.disable();
    this.disabled = true;

    /**
     * (Colorpicker) When the widget has been disabled.
     *
     * @event Colorpicker#colorpickerDisable
     */
    this.element.trigger({
      type: 'colorpickerDisable',
      colorpicker: this,
      color: this.color
    });
    return true;
  }

  /**
   * Returns true if this instance is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.disabled === true;
  }
}

export default Colorpicker;
