'use strict';

import Palette from './Palette';
import $ from 'jquery';

let defaults = {
  barTemplate: `<div class="colorpicker-bar colorpicker-swatches">
                    <div class="colorpicker-swatches--inner"></div>
                </div>`,
  swatchTemplate: '<i class="colorpicker-swatch"><i class="colorpicker-swatch--inner"></i></i>'
};

/**
 * Color swatches extension
 * @ignore
 */
class Swatches extends Palette {
  constructor(colorpicker, options = {}) {
    super(colorpicker, $.extend(true, {}, defaults, options));
    this.element = null;
  }

  isEnabled() {
    return this.getLength() > 0;
  }

  onCreate(event) {
    super.onCreate(event);

    if (!this.isEnabled()) {
      return;
    }

    this.element = $(this.options.barTemplate);
    this.load();
    this.colorpicker.picker.append(this.element);
  }

  load() {
    let colorpicker = this.colorpicker,
      swatchContainer = this.element.find('.colorpicker-swatches--inner'),
      isAliased = (this.options.namesAsValues === true) && !Array.isArray(this.colors);

    swatchContainer.empty();

    $.each(this.colors, (name, value) => {
      let $swatch = $(this.options.swatchTemplate)
        .attr('data-name', name)
        .attr('data-value', value)
        .attr('title', isAliased ? `${name}: ${value}` : value)
        .on('mousedown.colorpicker touchstart.colorpicker',
          function (e) {
            let $sw = $(this);

            // e.preventDefault();

            colorpicker.setValue(isAliased ? $sw.attr('data-name') : $sw.attr('data-value'));
          }
        );

      $swatch.find('.colorpicker-swatch--inner')
        .css('background-color', value);

      swatchContainer.append($swatch);
    });

    swatchContainer.append($('<i class="colorpicker-clear"></i>'));
  }
}

export default Swatches;
