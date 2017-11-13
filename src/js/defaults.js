'use strict';

export default {
  horizontal: false, // horizontal mode layout ?
  inline: false, // forces to show the colorpicker as an inline element
  color: false, // forces a color
  format: false, // forces a format
  input: 'input', // children input selector
  container: false, // container selector
  component: '.add-on, .input-group-addon', // children component selector
  fallbackColor: false, // fallback color value. null = latest valid color.
  useHashPrefix: true, // put a '#' (number sign) before hex strings
  useAlpha: true, // null = auto, false = always hide, true = always show
  enableHex8: true, // if true the hex8 format will be used whenever there is an alpha channel, otherwise rgba
  sliders: {
    saturation: {
      maxLeft: 100,
      maxTop: 100,
      callLeft: 'setSaturation',
      callTop: 'setBrightness'
    },
    hue: {
      maxLeft: 0,
      maxTop: 100,
      callLeft: false,
      callTop: 'setHue'
    },
    alpha: {
      maxLeft: 0,
      maxTop: 100,
      callLeft: false,
      callTop: 'setAlpha'
    }
  },
  slidersHorz: {
    saturation: {
      maxLeft: 100,
      maxTop: 100,
      callLeft: 'setSaturation',
      callTop: 'setBrightness'
    },
    hue: {
      maxLeft: 100,
      maxTop: 0,
      callLeft: 'setHue',
      callTop: false
    },
    alpha: {
      maxLeft: 100,
      maxTop: 0,
      callLeft: 'setAlpha',
      callTop: false
    }
  },
  template: `<div class="colorpicker dropdown-menu">
    <div class="colorpicker-saturation"><i><b></b></i></div>
    <div class="colorpicker-hue"><i></i></div>
    <div class="colorpicker-alpha"><i></i></div>
    <div class="colorpicker-color"><div /></div>
    <div class="colorpicker-palette"></div>
  </div>`,
  align: 'right',
  customClass: null, // custom class added to the colorpicker element
  colorPalette: null // custom color aliases
};
