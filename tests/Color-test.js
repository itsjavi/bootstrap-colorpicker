// 'use strict';

import ColorItem from '../src/js/ColorItem';
import test from 'ava';

let dataset = [
  // hex
  ['#5367ce', '#5367CE', 'hex'],
  ['#5367ce55', '#5367CE', 'hex'],
  ['invalid', '#000000', 'hex'],
  ['rgb(83, 103, 206)', '#5367CE', 'hex'],
  // rgb
  ['#5367ce', 'rgb(83, 103, 206)', 'rgb'],
  ['#5367ce55', 'rgba(83, 103, 206, 0.33)', 'rgb'],
  ['invalid', 'rgb(0, 0, 0)', 'rgb'],
  ['rgb(83, 103, 206)', 'rgb(83, 103, 206)', 'rgb']
];

dataset.forEach(function (data, i) {
  let value = data[0], expectedValue = data[1], format = data[2];

  test(`ColorItem.string #${i} expects ${expectedValue}`, t => {
    t.is((new ColorItem(value)).string(format), expectedValue);
  });
});
