'use strict';

import Color from '../src/js/Color';
import test from 'ava';

test("should return HEX color with hash", t => {
  let color = new Color('aabbcc');
  t.is(color.toHex(true), '#aabbcc');
});

test("should return HEX color without hash", t => {
  let color = new Color('aabbcc');
  t.is(color.toHex(), 'aabbcc');
});
