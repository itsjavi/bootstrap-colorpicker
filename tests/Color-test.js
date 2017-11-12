//'use strict';

import Color from '../src/js/Color';
import test from 'ava';

let runColorTest = function(title, data, fn, fnArgs = [], ctorArgs = []) {
  test(title, t => {
    for (let colorInput in data) {
      if (!data.hasOwnProperty(colorInput)) continue;
      let expectedColorOutput = data[colorInput];

      // Lower case input
      let color = new Color(colorInput, ...ctorArgs);
      t.is(color[fn].call(color, fnArgs), expectedColorOutput);

      // Upper case input
      color = new Color(colorInput.toUpperCase(), ...ctorArgs);
      t.is(color[fn].call(color, fnArgs), expectedColorOutput);

      // Input without hash
      color = new Color(colorInput.replace(/^#/g, ''), ...ctorArgs);
      t.is(color[fn].call(color, fnArgs), expectedColorOutput);

      // Input without hash, uppercase
      color = new Color(colorInput.replace(/^#/g, '').toUpperCase(), ...ctorArgs);
      t.is(color[fn].call(color, fnArgs), expectedColorOutput);
    }
  });
};

let tests = {
  "toHex": {
    "#5367ce": "#5367ce",
    "#aabbcc": "#aabbcc"
  },
  "toHex__noHash": {
    "#5367ce": "5367ce",
    "#aabbcc": "aabbcc"
  }
};

runColorTest("should return HEX color with hash", tests.toHex, 'toHex', [true]);
runColorTest("should return HEX color without hash", tests.toHex__noHash, 'toHex', [false]);
