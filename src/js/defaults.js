'use strict';
/**
 * @module
 */

/**
 * Colorpicker default options
 */
export default {
  /**
   * Horizontal mode layout.
   *
   * If true, the hue and alpha channel bars will be rendered horizontally, above the saturation selector.
   *
   * @type {boolean}
   * @default false
   */
  horizontal: false,
  inline: false, // forces to show the colorpicker as an inline element
  color: false, // forces a color
  format: false, // forces a format
  input: 'input', // children input selector
  container: false, // container selector
  component: '.add-on, .input-group-addon', // children component selector
  fallbackColor: false, // fallback color value. null = latest valid color.
  useHashPrefix: true, // put a '#' (number sign) before hex strings
  useAlpha: true, // null = auto, false = always hide, true = always show
  useNames: true, // if true, the web named colors will be used when chosen
  enableHex8: true, // if true the hex8 format will be used whenever there is an alpha channel, otherwise rgba
  sliders: {
    saturation: {
      maxLeft: 100,
      maxTop: 100,
      callLeft: 'setSaturationRatio',
      callTop: 'setBrightnessRatio'
    },
    hue: {
      maxLeft: 0,
      maxTop: 100,
      callLeft: false,
      callTop: 'setHueRatio'
    },
    alpha: {
      maxLeft: 0,
      maxTop: 100,
      callLeft: false,
      callTop: 'setAlphaRatio'
    }
  },
  slidersHorz: {
    saturation: {
      maxLeft: 100,
      maxTop: 100,
      callLeft: 'setSaturationRatio',
      callTop: 'setBrightnessRatio'
    },
    hue: {
      maxLeft: 100,
      maxTop: 0,
      callLeft: 'setHueRatio',
      callTop: false
    },
    alpha: {
      maxLeft: 100,
      maxTop: 0,
      callLeft: 'setAlphaRatio',
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
