'use strict';

/**
 * Handles everything related to the colorpicker addon
 * @ignore
 */
class AddonHandler {
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
    this.addon = null;
  }

  hasAddon() {
    return !!this.addon;
  }

  bind() {
    /**
     * @type {*|jQuery}
     */
    this.addon = this.colorpicker.options.addon ?
      this.colorpicker.element.find(this.colorpicker.options.addon) : null;

    if (this.addon && (this.addon.length === 0)) {
      // not found
      this.addon = null;
    }
  }

  unbind() {
    if (this.hasAddon()) {
      this.addon.off('.colorpicker');
    }
  }

  /**
   * If the addon element is present, its background color is updated
   */
  update() {
    if (!this.colorpicker.colorHandler.hasColor() || !this.hasAddon()) {
      return;
    }

    let colorStr = this.colorpicker.colorHandler.getColorString();
    let styles = {'background': colorStr};

    let icn = this.addon.find('i').eq(0);

    if (icn.length > 0) {
      icn.css(styles);
    } else {
      this.addon.css(styles);
    }
  }
}

export default AddonHandler;
