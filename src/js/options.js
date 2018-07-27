'use strict';
/**
 * @module
 */

// adjust these values accordingly to the sass vars
let sassVars = {
  'bar_size_short': 16,
  'base_margin': 6,
  'columns': 6
};

let sliderSize = (sassVars.bar_size_short * sassVars.columns) + (sassVars.base_margin * (sassVars.columns - 1));

/**
 * Colorpicker default options
 */
export default {
  /**
   * Custom class to be added to the `.colorpicker-element` element
   *
   * @type {String|null}
   * @default null
   */
  customClass: null,
  /**
   * Sets a initial color, ignoring the one from the element/input value or the data-color attribute.
   *
   * @type {(String|ColorItem|boolean)}
   * @default false
   */
  color: false,
  /**
   * Fallback color to use when the given color is invalid.
   * If false, the latest valid color will be used as a fallback.
   *
   * @type {String|ColorItem|boolean}
   * @default false
   */
  fallbackColor: false,
  /**
   * Forces an specific color format. If 'auto', it will be automatically detected the first time only,
   * but if null it will be always recalculated.
   *
   * Note that the ending 'a' of the format meaning "alpha" has currently no effect, meaning that rgb is the same as
   * rgba excepting if the alpha channel is disabled (see useAlpha).
   *
   * @type {('rgb'|'hex'|'hsl'|'auto'|null)}
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
   * Forces to show the colorpicker as an inline element.
   *
   * Note that if there is no container specified, the inline element
   * will be added to the body, so you may want to set the container option.
   *
   * @type {boolean}
   * @default false
   */
  inline: false,
  /**
   * Container where the colorpicker is appended to in the DOM.
   *
   * If is a string (CSS selector), the colorpicker will be placed inside this container.
   * If true, the `.colorpicker-element` element itself will be used as the container.
   * If false, the document body is used as the container, unless it is a popover (in this case it is appended to the
   * popover body instead).
   *
   * @type {String|boolean}
   * @default false
   */
  container: false,
  /**
   * Bootstrap Popover options.
   * The trigger, content and html options are always ignored.
   *
   * @type {boolean}
   * @default Object
   */
  popover: {
    animation: true,
    placement: 'bottom',
    fallbackPlacement: 'flip'
  },
  /**
   * If true, loads the 'debugger' extension automatically, which logs the events in the console
   * @type {boolean}
   * @default false
   */
  debug: false,
  /**
   * Child CSS selector for the colorpicker input.
   *
   * @type {String}
   * @default 'input'
   */
  input: 'input',
  /**
   * Child CSS selector for the colorpicker addon.
   * If it exists, the child <i> element background will be changed on color change.
   *
   * @type {String}
   * @default '.colorpicker-trigger, .colorpicker-input-addon'
   */
  addon: '.colorpicker-input-addon',
  /**
   * If true, the input content will be replaced always with a valid color,
   * if false, the invalid color will be left in the input,
   *   while the internal color object will still resolve into a valid one.
   *
   * @type {boolean}
   * @default true
   */
  autoInputFallback: true,
  /**
   * If true a hash will be prepended to hexadecimal colors.
   * If false, the hash will be removed.
   * This only affects the input values in hexadecimal format.
   *
   * @type {boolean}
   * @default true
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
   * Colorpicker widget template
   * @type {String}
   * @example
   * <!-- This is the default template: -->
   * <div class="colorpicker">
   *   <div class="colorpicker-saturation"><i class="colorpicker-guide"></i></div>
   *   <div class="colorpicker-hue"><i class="colorpicker-guide"></i></div>
   *   <div class="colorpicker-alpha">
   *     <div class="colorpicker-alpha-color"></div>
   *     <i class="colorpicker-guide"></i>
   *   </div>
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
   * Colorpicker comes with many bundled extensions: debugger, palette, preview and swatches (a superset of palette).
   *
   * @type {Object[]}
   * @example
   *   extensions: [
   *     {
   *       name: 'swatches'
   *       options: {
   *         colors: {
   *           'primary': '#337ab7',
   *           'success': '#5cb85c',
   *           'info': '#5bc0de',
   *           'warning': '#f0ad4e',
   *           'danger': '#d9534f'
   *         },
   *         namesAsValues: true
   *       }
   *     }
   *   ]
   */
  extensions: [
    {
      name: 'preview',
      options: {
        showText: true
      }
    }
  ],
  /**
   * Vertical sliders configuration
   * @type {Object}
   */
  sliders: {
    saturation: {
      selector: '.colorpicker-saturation',
      maxLeft: sliderSize,
      maxTop: sliderSize,
      callLeft: 'setSaturationRatio',
      callTop: 'setValueRatio'
    },
    hue: {
      selector: '.colorpicker-hue',
      maxLeft: 0,
      maxTop: sliderSize,
      callLeft: false,
      callTop: 'setHueRatio'
    },
    alpha: {
      selector: '.colorpicker-alpha',
      childSelector: '.colorpicker-alpha-color',
      maxLeft: 0,
      maxTop: sliderSize,
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
      maxLeft: sliderSize,
      maxTop: sliderSize,
      callLeft: 'setSaturationRatio',
      callTop: 'setValueRatio'
    },
    hue: {
      selector: '.colorpicker-hue',
      maxLeft: sliderSize,
      maxTop: 0,
      callLeft: 'setHueRatio',
      callTop: false
    },
    alpha: {
      selector: '.colorpicker-alpha',
      childSelector: '.colorpicker-alpha-color',
      maxLeft: sliderSize,
      maxTop: 0,
      callLeft: 'setAlphaRatio',
      callTop: false
    }
  }
};
