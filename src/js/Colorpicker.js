'use strict';

import Color from './Color';
import Extension from './Extension';
import defaults from './options';
import bundledExtensions from 'extensions';
import $ from 'jquery';
import SliderHandler from './SliderHandler';
import PopupHandler from './PopupHandler';

let colorPickerIdCounter = 0;
let root = (typeof self !== 'undefined' ? self : this); // window
let onSliderGuideMove = function (slider, top, left) {
  slider.guideStyle.left = left + 'px';
  slider.guideStyle.top = top + 'px';

  let color = !this.colorpicker.hasColor() ? this.colorpicker
    .createColor(this.colorpicker.fallbackColor) : this.colorpicker.color.getCopy();

  if (slider.callLeft) {
    color[slider.callLeft].call(color, left / slider.maxLeft);
  }

  if (slider.callTop) {
    color[slider.callTop].call(color, top / slider.maxTop);
  }

  this.colorpicker.setValue(color);
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
   * Colorpicker bundled extension classes
   *
   * @static
   * @type {{Extension}}
   */
  static get bundledExtensions() {
    return bundledExtensions;
  }

  /**
   * color getter
   *
   * @type {Color|null}
   */
  get color() {
    return this.element.data('color');
  }

  /**
   * color setter
   *
   * @ignore
   * @param {Color|null} value
   */
  set color(value) {
    this.element.data('color', value);
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
     * Latest external event
     *
     * @type {{name: String, e: *}}
     */
    this.lastEvent = {
      alias: null,
      e: null
    };

    /**
     * @type {*|jQuery}
     */
    this.element = $(element).addClass('colorpicker-element');
    this.element.attr('data-colorpicker-id', this.id);

    /**
     * @type {defaults}
     */
    this.options = $.extend(true, {}, defaults, options, this.element.data());

    /**
     * @type {Extension[]}
     */
    this.extensions = [];

    if (!Array.isArray(this.options.extensions)) {
      this.options.extensions = [];
    }

    /**
     * @type {*|jQuery}
     */
    this.component = (this.options.component !== false) ? this.element.find(this.options.component) : false;
    if (this.component && (this.component.length === 0)) {
      // not found
      this.component = false;
    }

    /**
     * @type {*|jQuery}
     */
    this.container = (this.options.container === true) ? this.element : this.options.container;
    this.container = (this.container !== false) ? $(this.container) : false;

    // Is the element an input? Should we search inside for any input?
    /**
     * @type {*|jQuery}
     */
    this.input = this.element.is('input') ? this.element : (this.options.input ?
      this.element.find(this.options.input) : false);

    if (this.input && (this.input.length === 0)) {
      this.input = false;
    }

    if (this.options.debug) {
      this.options.extensions.push({name: 'debugger'});
    }

    // Register extensions
    this.options.extensions.forEach((ext) => {
      this.addExtension(ext.name, bundledExtensions[ext.name.toLowerCase()], ext.options || {});
    });

    let colorValue = this.options.color !== false ? this.options.color : this.getValue();

    this.color = colorValue ? this.createColor(colorValue) : false;

    if (this.options.format === 'auto') {
      // If format is false, use the first parsed one from now on
      this.options.format = this.color.format;
    }

    /**
     * @type {boolean}
     * @private
     */
    this.disabled = false;

    // Setup picker
    let $picker = this.picker = $(this.options.template);

    if (this.options.customClass) {
      $picker.addClass(this.options.customClass);
    }

    if (this.options.horizontal) {
      $picker.addClass('colorpicker-horizontal');
    }

    if (
      (this.options.useAlpha || (this.hasColor() && this.color.hasTransparency())) &&
      (this.options.useAlpha !== false)
    ) {
      this.options.useAlpha = true;
      $picker.addClass('colorpicker-with-alpha');
    }

    /**
     * @type {SliderHandler}
     */
    this.slidersHandler = new SliderHandler(root, this, onSliderGuideMove);
    this.slidersHandler.bind();

    /**
     * @type {PopupHandler}
     */
    this.popupHandler = new PopupHandler(root, this);
    this.popupHandler.bind();

    $picker.appendTo(this.container ? this.container : $('body'));

    // TODO: refactor the following to InputHandler (and) AddOnHandler classes
    // Bind other events
    if (this.hasInput()) {
      this.input.on({
        'keyup.colorpicker': $.proxy(this._keyup, this)
      });
      this.input.on({
        'change.colorpicker': $.proxy(this._change, this)
      });
    }

    // Update if there is a color option
    this.update(this.options.color !== false);

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

  /**
   * Creates and registers the given extension
   *
   * @param {String|Extension} extensionName
   * @param {Extension} ExtensionClass
   * @param {Object} [config]
   * @returns {Extension}
   */
  addExtension(extensionName, ExtensionClass, config = {}) {
    let ext = (extensionName instanceof Extension) ? extensionName : new ExtensionClass(this, config);

    this.extensions.push(ext);
    return ext;
  }

  /**
   * Destroys the current instance
   *
   * @fires Colorpicker#colorpickerDestroy
   */
  destroy() {
    this.slidersHandler.unbind();
    this.popupHandler.unbind();
    this.picker.remove();
    this.element.removeData('colorpicker', 'color').off('.colorpicker');
    if (this.hasInput()) {
      this.input.off('.colorpicker');
    }
    if (this.component !== false) {
      this.component.off('.colorpicker');
    }
    this.element.removeClass('colorpicker-element');

    /**
     * (Colorpicker) When the instance is destroyed with all events unbound.
     *
     * @event Colorpicker#colorpickerDestroy
     */
    this.element.trigger({
      type: 'colorpickerDestroy',
      colorpicker: this,
      color: this.color
    });
  }

  /**
   * Returns true if the current color object is an instance of Color, false otherwise.
   * @returns {boolean}
   */
  hasColor() {
    return this.color instanceof Color;
  }

  /**
   * @returns {*|String|Color}
   */
  get fallbackColor() {
    return this.options.fallbackColor ? this.options.fallbackColor : (this.hasColor() ? this.color : '#000');
  }

  get format() {
    if (this.options.format) {
      return this.options.format;
    }

    if (this.hasColor() && this.color.hasTransparency() && this.color.format.match(/^hex/)) {
      return this.options.enableHex8 ? 'hex8' : (this.isAlphaEnabled() ? 'rgba' : 'hex');
    }

    if (this.hasColor()) {
      return this.color.format;
    }

    return null;
  }

  /**
   * Formatted color string, with the formatting options applied
   * (e.g. useHashPrefix)
   * @returns {String}
   */
  toInputColorString() {
    let str = this.toCssColorString();

    if (!str) {
      return str;
    }

    if (this.options.useHashPrefix === false) {
      str = str.replace(/^#/g, '');
    }

    return this._resolveColor(str);
  }

  /**
   * Formatted color string, suitable for CSS
   * @returns {String}
   */
  toCssColorString() {
    if (!this.hasColor()) {
      return '';
    }
    return this.color.toString(this.format);
  }

  /**
   * Shows the colorpicker widget if hidden.
   * If the input is disabled this call will be ignored.
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
   * Returns true if the colorpicker element has the colorpicker-visible class and not the colorpicker-hidden one.
   * False otherwise.
   *
   * @returns {boolean}
   */
  isVisible() {
    return this.popupHandler.isVisible();
  }

  /**
   * Returns true if the colorpicker element has the colorpicker-hidden class and not the colorpicker-visible one.
   * False otherwise.
   *
   * @returns {boolean}
   */
  isHidden() {
    return this.popupHandler.isHidden();
  }

  /**
   * If the input element is present, it updates the value with the current color object color string.
   * If value is set, this method fires a "change" event on the input element.
   *
   * @fires Colorpicker#change
   * @private
   */
  _updateInput() {
    if (!this.hasInput()) {
      return;
    }
    let val = this.toInputColorString();

    if (val === this.input.prop('value')) {
      // No need to set value or trigger any event if nothing changed
      return;
    }

    this.input.prop('value', val ? val : '');

    /**
     * (Input) Triggered on the input element when a new color is selected.
     *
     * @event Colorpicker#change
     */
    this.input.trigger({
      type: 'change',
      colorpicker: this,
      color: this.color,
      value: val
    });
  }

  /**
   * Changes the color adjustment bars using the current color object information.
   * @private
   */
  _updatePicker() {
    if (!this.hasColor()) {
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
    if (!this.hasColor() || (this.component === false)) {
      return;
    }

    let colorStr = this.toCssColorString();
    let styles = {'background': colorStr};

    let icn = this.component.find('i').eq(0);

    if (icn.length > 0) {
      icn.css(styles);
    } else {
      this.component.css(styles);
    }
  }

  /**
   * @private
   * @returns {boolean}
   */
  _shouldUpdate() {
    return (this.hasColor() && ((this.getValue(false) !== false)));
  }

  /**
   * Updated the component color, the input value and the widget if a color is present.
   *
   * If force is true, it is updated anyway.
   *
   * @fires Colorpicker#colorpickerUpdate
   * @param {boolean} [force]
   */
  update(force = false) {
    if (!(this._shouldUpdate() || (force === true))) {
      return;
    }
    // Update only if the current value (from input or data) is not empty
    this._updateComponent();

    // Do not update input when autoInputFallback is disabled and last event is keyup.
    let preventInputUpdate = (
      (this.options.autoInputFallback !== true) &&
      (
        // this.isInvalidColor() ||  // prevent also on invalid color (on create, leaves invalid colors)
        (this.lastEvent.alias === 'keyup')
      )
    );

    if (!preventInputUpdate) {
      this._updateInput();
    }

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
   * Returns the color string from the input value or the 'data-color' attribute of the input or element.
   * If empty, it returns the defaultValue parameter.
   *
   * @param {String|*} [defaultValue]
   * @returns {String|*}
   */
  getValue(defaultValue = null) {
    defaultValue = (typeof defaultValue === 'undefined') ? this.fallbackColor : defaultValue;
    let candidates = [], val = false;

    if (this.hasInput()) {
      candidates.push(this.input.val());
      candidates.push(this.input.data('color'));
    }
    candidates.push(this.element.data('color'));

    candidates.map((item) => {
      if (item && (val === false)) {
        val = item;
      }
    });

    val = ((val === false) ? defaultValue : val);

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
    if (this.hasColor() && this.color.equals(val)) {
      // equal color object
      return;
    }

    let color = val ? this.createColor(val) : false;

    if (!this.hasColor() && !color) {
      // color was empty and the new one too
      return;
    }

    // force update if color is changed to empty
    let shouldForceUpdate = this.hasColor() && !color;

    this.color = color;

    /**
     * (Colorpicker) When the color is set programmatically with setValue().
     *
     * @event Colorpicker#colorpickerChange
     */
    this.element.trigger({
      type: 'colorpickerChange',
      colorpicker: this,
      color: this.color,
      value: val
    });

    // force update if color has changed to empty
    this.update(shouldForceUpdate);
  }

  /**
   * Creates a new color using the widget instance options (fallbackColor, format).
   *
   * @fires Colorpicker#colorpickerInvalid
   * @param {*} val
   * @param {boolean} useFallback
   * @returns {Color}
   */
  createColor(val, useFallback = true) {
    let color = new Color(this._resolveColor(val), {format: this.format});

    if (!color.isValid()) {
      let invalidColor = color, fallback;

      if (useFallback) {
        fallback = ((this.fallbackColor instanceof Color) && this.fallbackColor.isValid()) ?
          this.fallbackColor : this._resolveColor(this.fallbackColor);

        color = new Color(fallback, {format: this.format});

        if (!color.isValid() && useFallback) {
          throw new Error('The fallback color is invalid.');
        }
      }

      color.previous = invalidColor;

      /**
       * (Colorpicker) Fired when the color is invalid and the fallback color is going to be used.
       *
       * @event Colorpicker#colorpickerInvalid
       */
      this.element.trigger({
        type: 'colorpickerInvalid',
        colorpicker: this,
        color: color,
        value: val
      });
    }

    if (!this.isAlphaEnabled() && color.hasTransparency()) {
      // Alpha is disabled
      color.setAlpha(1);
    }

    if (!this.hasColor()) {
      // No previous color, so no need to compare
      return color;
    }

    let hsva = color.hsvaRatio;
    let prevHsva = this.color.hsvaRatio;

    if (
      hsva.s === 0 &&
      hsva.h === 0 &&
      prevHsva.h !== 0
    ) {
      // Hue was set to 0 because saturation was 0, use previous hue, since it was not meant to change...
      color.setHueRatio(prevHsva.h);
    }

    if (!this.isAlphaEnabled() && color.hasTransparency()) {
      // Alpha is disabled
      color.setAlpha(1);
    }

    return color;
  }

  /**
   * Checks if there is a color object, that it is valid and it is not a fallback
   * @returns {boolean}
   */
  isInvalidColor() {
    return !this.hasColor() || !this.color.isValid() || !!this.color.previous;
  }

  /**
   * Returns true if the useAlpha option is exactly true, false otherwise
   * @returns {boolean}
   */
  isAlphaEnabled() {
    return this.options.useAlpha === true;
  }

  /**
   * Resolves a color, in case is not in a standard format (e.g. a custom color alias)
   *
   * @private
   * @param {String|*} color
   * @returns {String|*|null}
   */
  _resolveColor(color) {
    let extResolvedColor = false;

    $.each(this.extensions, function (name, ext) {
      if (extResolvedColor !== false) {
        // skip if resolved
        return;
      }
      extResolvedColor = ext.resolveColor(color);
    });

    if (extResolvedColor !== false) {
      color = extResolvedColor;
    }

    return color;
  }

  /**
   * Returns true if the widget has an associated input element, false otherwise
   * @returns {boolean}
   */
  hasInput() {
    return (this.input !== false);
  }

  /**
   * Returns true if this instance is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.disabled === true;
  }

  /**
   * Disables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerDisable
   * @returns {boolean}
   */
  disable() {
    if (this.hasInput()) {
      this.input.prop('disabled', true);
    }
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
   * Enables the widget and the input if any
   *
   * @fires Colorpicker#colorpickerEnable
   * @returns {boolean}
   */
  enable() {
    if (this.hasInput()) {
      this.input.prop('disabled', false);
    }
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
   * Function triggered when the input has changed, so the colorpicker gets updated.
   *
   * @private
   * @param {Event} e
   * @returns {boolean}
   */
  _change(e) {
    this.lastEvent.alias = 'change';
    this.lastEvent.e = e;

    let val = this.input.val();

    if (val !== this.toInputColorString()) {
      this.setValue(val);
    }
  }

  /**
   * Function triggered after a keyboard key has been released.
   *
   * @private
   * @param {Event} e
   * @returns {boolean}
   */
  _keyup(e) {
    this.lastEvent.alias = 'keyup';
    this.lastEvent.e = e;

    let val = this.input.val();

    if (val !== this.toInputColorString()) {
      this.setValue(val);
    }
  }
}

export default Colorpicker;
