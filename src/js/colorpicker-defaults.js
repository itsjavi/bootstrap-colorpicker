/*
 * Default plugin options
 */
var defaults = {
  horizontal: false, // horizontal mode layout ?
  color: null, //forces a color
  defaultColor: null, // default color when there is none specified or set (null = no value or color will be set to the object or the UI)
  format: null, //forces a format
  container: null, // container selector where to add the colorpicker (if it's different from the jQuery element)
  className: null, // class to add to the main colorpicker element
  palette: null,
  previewText: true, // if true, the color code will be added to the color preview box
  guideMode: "vertical", // guide mode. the value must be an object from options.bars excepting 'mode' (e.g. vertical or horizontal)
  guides: {
    // Modes:
    vertical: {
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
    horizontal: {
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
    }
  },
  template: '<div class="colorpicker">' +
    '<div class="colorpicker-saturation"><i class="colorpicker-guide"><b class="colorpicker-guide-shadow"></b></i></div>' +
    '<div class="colorpicker-hue"><i class="colorpicker-guide"></i></div>' +
    '<div class="colorpicker-alpha"><i class="colorpicker-guide"></i></div>' +
    '<div class="colorpicker-preview-container"><div class="colorpicker-preview"></div></div>' +
    '<div class="colorpicker-palette"></div>' +
    '</div>'
};
