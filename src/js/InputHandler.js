'use strict';

import $ from 'jquery';
import ColorItem from './ColorItem';

/**
 * Handles everything related to the colorpicker input
 * @ignore
 */
class InputHandler {
  /**
   * @param {Colorpicker} colorpicker
   */
  constructor(colorpicker) {
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
    /**
     * @type {jQuery|false}
     */
    this.input = this.colorpicker.element.is('input') ? this.colorpicker.element : (this.colorpicker.options.input ?
      this.colorpicker.element.find(this.colorpicker.options.input) : false);

    if (this.input && (this.input.length === 0)) {
      this.input = false;
    }

    this._initValue();
  }

  bind() {
    if (!this.hasInput()) {
      return;
    }
    this.input.on({
      'keyup.colorpicker': $.proxy(this.onkeyup, this)
    });
    this.input.on({
      'change.colorpicker': $.proxy(this.onchange, this)
    });
  }

  unbind() {
    if (!this.hasInput()) {
      return;
    }
    this.input.off('.colorpicker');
  }

  _initValue() {
    if (!this.hasInput()) {
      return;
    }

    let val = '';

    [
      // candidates:
      this.input.val(),
      this.input.data('color'),
      this.input.attr('data-color')
    ].map((item) => {
      if (item && (val === '')) {
        val = item;
      }
    });

    if (val instanceof ColorItem) {
      val = this.getFormattedColor(val.string(this.colorpicker.format));
    } else if (!(typeof val === 'string' || val instanceof String)) {
      val = '';
    }

    this.input.prop('value', val);
  }

  /**
   * Returns the color string from the input value.
   * If there is no input the return value is false.
   *
   * @returns {String|boolean}
   */
  getValue() {
    if (!this.hasInput()) {
      return false;
    }

    return this.input.val();
  }

  /**
   * If the input element is present, it updates the value with the current color object color string.
   * If the value is changed, this method fires a "change" event on the input element.
   *
   * @param {String} val
   *
   * @fires Colorpicker#change
   */
  setValue(val) {
    if (!this.hasInput()) {
      return;
    }

    let inputVal = this.input.prop('value');

    val = val ? val : '';

    if (val === (inputVal ? inputVal : '')) {
      // No need to set value or trigger any event if nothing changed
      return;
    }

    this.input.prop('value', val);

    /**
     * (Input) Triggered on the input element when a new color is selected.
     *
     * @event Colorpicker#change
     */
    this.input.trigger({
      type: 'change',
      colorpicker: this.colorpicker,
      color: this.colorpicker.color,
      value: val
    });
  }

  /**
   * Returns the formatted color string, with the formatting options applied
   * (e.g. useHashPrefix)
   *
   * @param {String|null} val
   *
   * @returns {String}
   */
  getFormattedColor(val = null) {
    val = val ? val : this.colorpicker.colorHandler.getColorString();

    if (!val) {
      return '';
    }

    val = this.colorpicker.colorHandler.resolveColorDelegate(val, false);

    if (this.colorpicker.options.useHashPrefix === false) {
      val = val.replace(/^#/g, '');
    }

    return val;
  }

  /**
   * Returns true if the widget has an associated input element, false otherwise
   * @returns {boolean}
   */
  hasInput() {
    return (this.input !== false);
  }

  /**
   * Returns true if the input exists and is disabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.hasInput() && !this.isDisabled();
  }

  /**
   * Returns true if the input exists and is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.hasInput() && (this.input.prop('disabled') === true);
  }

  /**
   * Disables the input if any
   *
   * @fires Colorpicker#colorpickerDisable
   * @returns {boolean}
   */
  disable() {
    if (this.hasInput()) {
      this.input.prop('disabled', true);
    }
  }

  /**
   * Enables the input if any
   *
   * @fires Colorpicker#colorpickerEnable
   * @returns {boolean}
   */
  enable() {
    if (this.hasInput()) {
      this.input.prop('disabled', false);
    }
  }

  /**
   * Calls setValue with the current internal color value
   *
   * @fires Colorpicker#change
   */
  update() {
    if (!this.hasInput()) {
      return;
    }

    if (
      (this.colorpicker.options.autoInputFallback === false) &&
      this.colorpicker.colorHandler.isInvalidColor()
    ) {
      // prevent update if color is invalid, autoInputFallback is disabled and the last event is keyup.
      return;
    }

    this.setValue(this.getFormattedColor());
  }

  /**
   * Function triggered when the input has changed, so the colorpicker gets updated.
   *
   * @private
   * @param {Event} e
   * @returns {boolean}
   */
  onchange(e) {
    this.colorpicker.lastEvent.alias = 'input.change';
    this.colorpicker.lastEvent.e = e;

    let val = this.getValue();

    if (val !== e.value) {
      this.colorpicker.setValue(val);
    }
  }

  /**
   * Function triggered after a keyboard key has been released.
   *
   * @private
   * @param {Event} e
   * @returns {boolean}
   */
  onkeyup(e) {
    this.colorpicker.lastEvent.alias = 'input.keyup';
    this.colorpicker.lastEvent.e = e;

    let val = this.getValue();

    if (val !== e.value) {
      this.colorpicker.setValue(val);
    }
  }
}

export default InputHandler;
