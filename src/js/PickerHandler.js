'use strict';

import $ from 'jquery';

/**
 * Handles everything related to the colorpicker UI
 * @ignore
 */
class PickerHandler {
  /**
   * @param {Colorpicker} colorpicker
   */
  constructor(colorpicker) {
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
    /**
     * @type {jQuery}
     */
    this.picker = null;
  }

  get options() {
    return this.colorpicker.options;
  }

  get color() {
    return this.colorpicker.colorHandler.color;
  }

  bind() {
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

  attach() {
    // Inject the colorpicker element into the DOM
    let pickerParent = this.colorpicker.container ? this.colorpicker.container : null;

    if (pickerParent) {
      this.picker.appendTo(pickerParent);
    }
  }

  unbind() {
    this.picker.remove();
  }

  _supportsAlphaBar() {
    return (
      (this.options.useAlpha || (this.colorpicker.colorHandler.hasColor() && this.color.hasTransparency())) &&
      (this.options.useAlpha !== false) &&
      (!this.options.format || (this.options.format && !this.options.format.match(/^hex([36])?$/i)))
    );
  }

  /**
   * Changes the color adjustment bars using the current color object information.
   */
  update() {
    if (!this.colorpicker.colorHandler.hasColor()) {
      return;
    }

    let vertical = (this.options.horizontal !== true),
      slider = vertical ? this.options.sliders : this.options.slidersHorz;

    let saturationGuide = this.picker.find('.colorpicker-saturation .colorpicker-guide'),
      hueGuide = this.picker.find('.colorpicker-hue .colorpicker-guide'),
      alphaGuide = this.picker.find('.colorpicker-alpha .colorpicker-guide');

    let hsva = this.color.toHsvaRatio();

    // Set guides position
    if (hueGuide.length) {
      hueGuide.css(vertical ? 'top' : 'left', (vertical ? slider.hue.maxTop : slider.hue.maxLeft) * (1 - hsva.h));
    }
    if (alphaGuide.length) {
      alphaGuide.css(vertical ? 'top' : 'left', (vertical ? slider.alpha.maxTop : slider.alpha.maxLeft) * (1 - hsva.a));
    }
    if (saturationGuide.length) {
      saturationGuide.css({
        'top': slider.saturation.maxTop - hsva.v * slider.saturation.maxTop,
        'left': hsva.s * slider.saturation.maxLeft
      });
    }

    // Set saturation hue background
    this.picker.find('.colorpicker-saturation')
      .css('backgroundColor', this.color.getCloneHueOnly().toHexString()); // we only need hue

    // Set alpha color gradient
    let hexColor = this.color.toHexString();

    let alphaBg = '';

    if (this.options.horizontal) {
      alphaBg = `linear-gradient(to right, ${hexColor} 0%, transparent 100%)`;
    } else {
      alphaBg = `linear-gradient(to bottom, ${hexColor} 0%, transparent 100%)`;
    }

    this.picker.find('.colorpicker-alpha-color').css('background', alphaBg);
  }
}

export default PickerHandler;
