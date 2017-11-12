'use strict';

import Color from './Color';
import Colorpicker from './Colorpicker';
import $ from 'jquery';

$.colorpicker = Colorpicker;
$.colorpicker.Color = Color;

$.fn.colorpicker = function (option) {
  let apiArgs = Array.prototype.slice.call(arguments, 1),
    isSingleElement = (this.length === 1),
    returnValue = null;

  let $jq = this.each(function () {
    let $this = $(this),
      inst = $this.data('colorpicker'),
      options = ((typeof option === 'object') ? option : {});

    if (!inst) {
      inst = new Colorpicker(this, options);
      $this.data('colorpicker', inst);
    }

    if (typeof option === 'string') {
      if ($.isFunction(inst[option])) {
        returnValue = inst[option].apply(inst, apiArgs);
      } else { // its a property ?
        if (apiArgs.length) {
          // set property
          inst[option] = apiArgs[0];
        }
        returnValue = inst[option];
      }
    } else {
      returnValue = $this;
    }
  });

  return isSingleElement ? returnValue : $jq;
};

$.fn.colorpicker.constructor = Colorpicker;
