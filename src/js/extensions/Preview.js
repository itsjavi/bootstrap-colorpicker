'use strict';

import Extension from 'Extension';
import $ from 'jquery';

/**
 * Color preview extension
 * @ignore
 */
class Preview extends Extension {
  constructor(colorpicker, options = {}) {
    super(colorpicker, $.extend(true, {},
      {
        template: '<div class="colorpicker-bar colorpicker-preview"><div /></div>',
        showText: true,
        format: colorpicker.format
      },
      options
    ));

    this.element = $(this.options.template);
    this.elementInner = this.element.find('div');
  }

  onCreate(event) {
    super.onCreate(event);
    this.colorpicker.picker.append(this.element);
  }

  onUpdate(event) {
    super.onUpdate(event);

    if (!event.color) {
      this.elementInner
        .css('backgroundColor', null)
        .css('color', null)
        .html('');
      return;
    }

    this.elementInner
      .css('backgroundColor', event.color.toRgbString());

    if (this.options.showText) {
      this.elementInner
        .html(event.color.string(this.options.format || this.colorpicker.format));

      if (event.color.isDark() && (event.color.alpha > 0.5)) {
        this.elementInner.css('color', 'white');
      } else {
        this.elementInner.css('color', 'black');
      }
    }
  }
}

export default Preview;
