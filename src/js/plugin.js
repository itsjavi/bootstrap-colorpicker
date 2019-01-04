'use strict';

import Colorpicker from './Colorpicker';
import $ from 'jquery';

let plugin = 'colorpicker';

$[plugin] = Colorpicker;

// Colorpicker jQuery Plugin API
$.fn[plugin] = function (option) {
  let fnArgs = Array.prototype.slice.call(arguments, 1),
    isSingleElement = (this.length === 1),
    returnValue = null;

  let $elements = this.each(function () {
    let $this = $(this),
      inst = $this.data(plugin),
      options = ((typeof option === 'object') ? option : {});

    // Create instance if does not exist
    if (!inst) {
      inst = new Colorpicker(this, options);
      $this.data(plugin, inst);
    }

    if (!isSingleElement) {
      return;
    }

    returnValue = $this;

    if (typeof option === 'string') {
      if (option === 'colorpicker') {
        // Return colorpicker instance: e.g. .colorpicker('colorpicker')
        returnValue = inst;
      } else if ($.isFunction(inst[option])) {
        // Return method call return value: e.g. .colorpicker('isEnabled')
        returnValue = inst[option].apply(inst, fnArgs);
      } else {
        // Return property value: e.g. .colorpicker('element')
        returnValue = inst[option];
      }
    }
  });

  return isSingleElement ? returnValue : $elements;
};

$.fn[plugin].constructor = Colorpicker;
