'use strict';

import $ from 'jquery';

/**
 * Colorpicker extension class.
 */
class Extension {
  /**
   * @param {Colorpicker} colorpicker
   * @param {Object} options
   */
  constructor(colorpicker, options = {}) {
    /**
     * The colorpicker instance
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
    /**
     * Extension options
     *
     * @type {Object}
     */
    this.options = options;

    if (!(this.colorpicker.element && this.colorpicker.element.length)) {
      throw new Error('Extension: this.colorpicker.element is not valid');
    }

    this.colorpicker.element.on('colorpickerCreate.colorpicker-ext', $.proxy(this.onCreate, this));
    this.colorpicker.element.on('colorpickerDestroy.colorpicker-ext', $.proxy(this.onDestroy, this));
    this.colorpicker.element.on('colorpickerUpdate.colorpicker-ext', $.proxy(this.onUpdate, this));
    this.colorpicker.element.on('colorpickerChange.colorpicker-ext', $.proxy(this.onChange, this));
    this.colorpicker.element.on('colorpickerInvalid.colorpicker-ext', $.proxy(this.onInvalid, this));
    this.colorpicker.element.on('colorpickerShow.colorpicker-ext', $.proxy(this.onShow, this));
    this.colorpicker.element.on('colorpickerHide.colorpicker-ext', $.proxy(this.onHide, this));
    this.colorpicker.element.on('colorpickerEnable.colorpicker-ext', $.proxy(this.onEnable, this));
    this.colorpicker.element.on('colorpickerDisable.colorpicker-ext', $.proxy(this.onDisable, this));
  }

  /**
   * Function called every time a new color needs to be created.
   * Return false to skip this resolver and continue with other extensions' ones
   * or return anything else to consider the color resolved.
   *
   * @param {ColorItem|String|*} color
   * @param {boolean} realColor if true, the color should resolve into a real (not named) color code
   * @return {ColorItem|String|*}
   */
  resolveColor(color, realColor = true) {
    return false;
  }

  /**
   * Method called after the colorpicker is created
   *
   * @listens Colorpicker#colorpickerCreate
   * @param {Event} event
   */
  onCreate(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker is destroyed
   *
   * @listens Colorpicker#colorpickerDestroy
   * @param {Event} event
   */
  onDestroy(event) {
    this.colorpicker.element.off('.colorpicker-ext');
  }

  /**
   * Method called after the colorpicker is updated
   *
   * @listens Colorpicker#colorpickerUpdate
   * @param {Event} event
   */
  onUpdate(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker color is changed
   *
   * @listens Colorpicker#colorpickerChange
   * @param {Event} event
   */
  onChange(event) {
    // to be extended
  }

  /**
   * Method called when the colorpicker color is invalid
   *
   * @listens Colorpicker#colorpickerInvalid
   * @param {Event} event
   */
  onInvalid(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker is hidden
   *
   * @listens Colorpicker#colorpickerHide
   * @param {Event} event
   */
  onHide(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker is shown
   *
   * @listens Colorpicker#colorpickerShow
   * @param {Event} event
   */
  onShow(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker is disabled
   *
   * @listens Colorpicker#colorpickerDisable
   * @param {Event} event
   */
  onDisable(event) {
    // to be extended
  }

  /**
   * Method called after the colorpicker is enabled
   *
   * @listens Colorpicker#colorpickerEnable
   * @param {Event} event
   */
  onEnable(event) {
    // to be extended
  }
}

export default Extension;
