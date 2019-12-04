'use strict';

import Extension from './Extension';
import defaults from './options';
import coreExtensions from 'extensions';
import $ from 'jquery';
import SliderHandler from './SliderHandler';
import PopupHandler from './PopupHandler';
import InputHandler from './InputHandler';
import ColorHandler from './ColorHandler';
import PickerHandler from './PickerHandler';
import AddonHandler from './AddonHandler';
import ColorItem from './ColorItem';

let colorPickerIdCounter = 0;

let root = (typeof self !== 'undefined' ? self : this); // window

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
    return ColorItem;
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
   * Internal color format
   *
   * @type {String|null}
   */
  get format() {
    return this.colorHandler.format;
  }

  /**
   * Getter of the picker element
   *
   * @returns {jQuery|HTMLElement}
   */
  get picker() {
    return this.pickerHandler.picker;
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

    /**
     * The element where the
     * @type {*|jQuery}
     */
    this.container = (
      this.options.container === true ||
      (this.options.container !== true && this.options.inline === true)
    ) ? this.element : this.options.container;

    this.container = (this.container !== false) ? $(this.container) : false;

    /**
     * @type {InputHandler}
     */
    this.inputHandler = new InputHandler(this);
    /**
     * @type {ColorHandler}
     */
    this.colorHandler = new ColorHandler(this);
    /**
     * @type {SliderHandler}
     */
    this.sliderHandler = new SliderHandler(this);
    /**
     * @type {PopupHandler}
     */
    this.popupHandler = new PopupHandler(this, root);
    /**
     * @type {PickerHandler}
     */
    this.pickerHandler = new PickerHandler(this);
    /**
     * @type {AddonHandler}
     */
    this.addonHandler = new AddonHandler(this);

    this.init();

    // Emit a create event
    $($.proxy(function () {
      /**
       * (Colorpicker) When the Colorpicker instance has been created and the DOM is ready.
       *
       * @event Colorpicker#colorpickerCreate
       */
      this.trigger('colorpickerCreate');
    }, this));
  }

  /**
   * Initializes the plugin
   * @private
   */
  init() {
    // Init addon
    this.addonHandler.bind();

    // Init input
    this.inputHandler.bind();

    // Init extensions (before initializing the color)
    this.initExtensions();

    // Init color
    this.colorHandler.bind();

    // Init picker
    this.pickerHandler.bind();

    // Init sliders and popup
    this.sliderHandler.bind();
    this.popupHandler.bind();

    // Inject into the DOM (this may make it visible)
    this.pickerHandler.attach();

    // Update all components
    this.update();

    if (this.inputHandler.isDisabled()) {
      this.disable();
    }
  }

  /**
   * Initializes the plugin extensions
   * @private
   */
  initExtensions() {
    if (!Array.isArray(this.options.extensions)) {
      this.options.extensions = [];
    }

    if (this.options.debug) {
      this.options.extensions.push({name: 'debugger'});
    }

    // Register and instantiate extensions
    this.options.extensions.forEach((ext) => {
      this.registerExtension(Colorpicker.extensions[ext.name.toLowerCase()], ext.options || {});
    });
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
    this.addonHandler.unbind();
    this.pickerHandler.unbind();

    this.element
      .removeClass('colorpicker-element')
      .removeData('colorpicker', 'color')
      .off('.colorpicker');

    /**
     * (Colorpicker) When the instance is destroyed with all events unbound.
     *
     * @event Colorpicker#colorpickerDestroy
     */
    this.trigger('colorpickerDestroy', color);
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
   *
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  hide(e) {
    this.popupHandler.hide(e);
  }

  /**
   * Toggles the colorpicker between visible and hidden.
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

    val = (val instanceof ColorItem) ? val : defaultValue;

    if (val instanceof ColorItem) {
      return val.string(this.format);
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
    if (this.isDisabled()) {
      return;
    }
    let ch = this.colorHandler;

    if (
      (ch.hasColor() && !!val && ch.color.equals(val)) ||
      (!ch.hasColor() && !val)
    ) {
      // same color or still empty
      return;
    }

    ch.color = val ? ch.createColor(val, this.options.autoInputFallback) : null;

    /**
     * (Colorpicker) When the color is set programmatically with setValue().
     *
     * @event Colorpicker#colorpickerChange
     */
    this.trigger('colorpickerChange', ch.color, val);

    // force update if color has changed to empty
    this.update();
  }

  /**
   * Updates the UI and the input color according to the internal color.
   *
   * @fires Colorpicker#colorpickerUpdate
   */
  update() {
    if (this.colorHandler.hasColor()) {
      this.inputHandler.update();
    } else {
      this.colorHandler.assureColor();
    }

    this.addonHandler.update();
    this.pickerHandler.update();

    /**
     * (Colorpicker) Fired when the widget is updated.
     *
     * @event Colorpicker#colorpickerUpdate
     */
    this.trigger('colorpickerUpdate');
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
    this.picker.removeClass('colorpicker-disabled');

    /**
     * (Colorpicker) When the widget has been enabled.
     *
     * @event Colorpicker#colorpickerEnable
     */
    this.trigger('colorpickerEnable');
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
    this.picker.addClass('colorpicker-disabled');

    /**
     * (Colorpicker) When the widget has been disabled.
     *
     * @event Colorpicker#colorpickerDisable
     */
    this.trigger('colorpickerDisable');
    return true;
  }

  /**
   * Returns true if this instance is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return !this.isDisabled();
  }

  /**
   * Returns true if this instance is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.disabled === true;
  }

  /**
   * Triggers a Colorpicker event.
   *
   * @param eventName
   * @param color
   * @param value
   */
  trigger(eventName, color = null, value = null) {
    this.element.trigger({
      type: eventName,
      colorpicker: this,
      color: color ? color : this.color,
      value: value ? value : this.getValue()
    });
  }
}

/**
 * Colorpicker extension classes, indexed by extension name
 *
 * @static
 * @type {Object} a map between the extension name and its class
 */
Colorpicker.extensions = coreExtensions;

export default Colorpicker;
