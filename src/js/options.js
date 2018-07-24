'use strict';
/**
 * @module
 */

/**
 * Colorpicker default options
 */
export default {
  /**
   * If true, loads the Debugger extension automatically into the current instance
   * @type {boolean}
   * @default false
   */
  debug: false,
  /**
   * Sets a initial color, ignoring the one from the element/input value or the data-color attribute.
   *
   * @type {(String|Color|boolean)}
   * @default false
   */
  color: false,
  /**
   * Forces an specific color format. If 'auto', it will be automatically detected the first time only,
   * but if null it will be always recalculated.
   *
   * Note that the ending 'a' of the format meaning "alpha" has currently no effect, meaning that rgb is the same as
   * rgba excepting if the alpha channel is disabled (see useAlpha).
   *
   * @type {('rgb'|'rgba'|'prgb'|'prgba'|'hex'|'hex3'|'hex6'|'hex8'|'hsl'|'hsla'|'hsv'|'hsva'|'name'|boolean)}
   * @default null
   */
  format: null,
  /**
   * Horizontal mode layout.
   *
   * If true, the hue and alpha channel bars will be rendered horizontally, above the saturation selector.
   *
   * @type {boolean}
   * @default false
   */
  horizontal: false,
  /**
   * Forces to show the colorpicker as an inline element
   *
   * @type {boolean}
   * @default false
   */
  inline: false,
  /**
   * Bootstrap Popover options. If false, the built-in popover will be used.
   * The trigger, content and html options are always ignored.
   *
   * @type {boolean|false}
   * @default Object
   */
  popover: {
    animation: true,
    placement: 'bottom',
    fallbackPlacement: 'flip'
  },
  /**
   * Child input CSS selector
   *
   * @type {String}
   * @default 'input'
   */
  input: 'input',
  /**
   * Colorpicker container CSS selector.
   * If is a string (CSS selector), the colorpicker will be placed inside this container.
   * If true, the `.colorpicker-element` element itself will be used as the container.
   * If false or null, the document body is used as the container.
   *
   * @type {String|boolean}
   * @default false
   */
  container: false, // container selector
  /**
   * Child color component CSS selector.
   * If it exists, the child <i> element background will be changed on color change.
   *
   * @type {String|boolean}
   * @default '.colorpicker-input-addon'
   */
  component: '.colorpicker-input-addon',
  /**
   * Fallback color to use when the given color is invalid.
   * If false, the latest valid color will be used as a fallback.
   *
   * @type {String|Color|boolean}
   * @default false
   */
  fallbackColor: false,
  /**
   * If true, the input content will be replaced always with a valid color,
   * if false, the invalid color will be left in the input,
   *   while the internal color object will still resolve into a valid one.
   *
   * @type {boolean}
   * @default false
   */
  autoInputFallback: false,
  /**
   * If true a hash will be prepended to hexadecimal colors.
   * If false, the hash will be removed.
   * This only affects the input values in hexadecimal format.
   *
   * @type {boolean}
   * @default false
   */
  useHashPrefix: true,
  /**
   * If true, the alpha channel bar will be displayed no matter what.
   *
   * If false, it will be always hidden and alpha channel will be disabled also programmatically, meaning that
   * the selected or typed color will be always opaque.
   *
   * If null, the alpha channel will be automatically disabled/enabled depending if the initial color format supports
   * alpha or not.
   *
   * @type {boolean}
   * @default true
   */
  useAlpha: true,
  /**
   * This only applies when the color format is hexadecimal.
   * If true, the alpha channel will be allowed for hexadecimal formatted colors, making them having 4 or 8 chars
   * (RGBA or RRGGBBAA). This format is not yet supported in IE/Edge browsers, so it is disabled by default.
   * If false, rgba will be used whenever there is an alpha change different than 1 and the color format is
   * automatic.
   *
   * @see https://caniuse.com/#feat=css-rrggbbaa
   *
   * @type {boolean}
   * @default true
   */
  enableHexAlpha: false,
  /**
   * Vertical sliders configuration
   * @type {Object}
   */
  sliders: {
    saturation: {
      selector: '.colorpicker-saturation',
      maxLeft: 115,
      maxTop: 115,
      callLeft: 'setSaturationRatio',
      callTop: 'setBrightnessRatio'
    },
    hue: {
      selector: '.colorpicker-hue',
      maxLeft: 0,
      maxTop: 115,
      callLeft: false,
      callTop: 'setHueRatio'
    },
    alpha: {
      selector: '.colorpicker-alpha',
      childSelector: '.colorpicker-alpha-color',
      maxLeft: 0,
      maxTop: 115,
      callLeft: false,
      callTop: 'setAlphaRatio'
    }
  },
  /**
   * Horizontal sliders configuration
   * @type {Object}
   */
  slidersHorz: {
    saturation: {
      selector: '.colorpicker-saturation',
      maxLeft: 115,
      maxTop: 115,
      callLeft: 'setSaturationRatio',
      callTop: 'setBrightnessRatio'
    },
    hue: {
      selector: '.colorpicker-hue',
      maxLeft: 115,
      maxTop: 0,
      callLeft: 'setHueRatio',
      callTop: false
    },
    alpha: {
      selector: '.colorpicker-alpha',
      childSelector: '.colorpicker-alpha-color',
      maxLeft: 115,
      maxTop: 0,
      callLeft: 'setAlphaRatio',
      callTop: false
    }
  },
  /**
   * Custom class to be added to the colorpicker element
   *
   * @type {String}
   */
  customClass: null,
  /**
   * Colorpicker widget template
   * @type {String}
   * @example
   * <!-- This is the default template: -->
   * <div class="colorpicker">
   *   <div class="colorpicker-saturation"><i class="colorpicker-guide"><i></i></i></div>
   *   <div class="colorpicker-hue"><i class="colorpicker-guide"></i></div>
   *   <div class="colorpicker-alpha"><i class="colorpicker-guide"></i></div>
   *   <div class="colorpicker-color"><div /></div>
   * </div>
   */
  template: `<div class="colorpicker">
      <div class="colorpicker-saturation"><i class="colorpicker-guide"></i></div>
      <div class="colorpicker-hue"><i class="colorpicker-guide"></i></div>
      <div class="colorpicker-alpha">
          <div class="colorpicker-alpha-color"></div>
          <i class="colorpicker-guide"></i>
      </div>
    </div>`,
  /**
   *
   * Associative object with the extension class name and its config.
   * Colorpicker comes with many bundled extensions: debugger, palette, preview and swatches (a superset of Palette).
   *
   * @type {Object}
   * @example
   *   extensions: [
   *     {
   *       name: 'swatches'
   *       colors: {
   *         'primary': '#337ab7',
   *         'success': '#5cb85c',
   *         'info': '#5bc0de',
   *         'warning': '#f0ad4e',
   *         'danger': '#d9534f'
   *       },
   *       namesAsValues: true
   *     }
   *   ]
   */
  extensions: [
    {
      name: 'preview',
      options: {
        showText: false
      }
    }
  ]
};
