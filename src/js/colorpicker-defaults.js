/*
 * Default plugin options
 */
var defaults = {
  horizontal: false, // horizontal mode layout ?
  color: null, //forces a color
  defaultColor: null, // default color when there is none specified or set (null = no color)
  format: null, //forces a format
  container: null, // container selector where to add the colorpicker (if it's different from the jQuery element)
  className: 'colorpicker-standalone', // class to add to the main colorpicker root element
  aliases: {}, // color aliases: {'danger':'red', 'warning':'#ff00aa'}
  palettes: [], // color palettes (max 11 per row): [ ['#fff', 'rgba(0, 100, 100, .5)', 'gold', 'myAlias'], [ ... second palette], ... ]
  previewText: true, // if true, the color code will be added to the color preview box
  guideMode: "vertical", // guide mode. the value must be an object from options.bars excepting 'mode' (e.g. vertical or horizontal)
  formatter: null, // custom color formatter callback
  guides: {
    // Modes:
    vertical: {
      saturation: {
        callLeft: 'setSaturation',
        callTop: 'setBrightness'
      },
      hue: {
        callLeft: false,
        callTop: 'setHue'
      },
      alpha: {
        callLeft: false,
        callTop: 'setAlpha'
      }
    },
    horizontal: {
      saturation: {
        callLeft: 'setSaturation',
        callTop: 'setBrightness'
      },
      hue: {
        callLeft: 'setHue',
        callTop: false
      },
      alpha: {
        callLeft: 'setAlpha',
        callTop: false
      }
    }
  },
  init: function() {},
  templates: {
    picker: '<div class="colorpicker">' +
      '<div class="colorpicker-saturation">' +
      '  <i class="colorpicker-guide"></i>' +
      '</div>' +
      '<div class="colorpicker-hue">' +
      '  <i class="colorpicker-guide"></i>' +
      '</div>' +
      '<div class="colorpicker-alpha-wrapper">' +
      '  <div class="colorpicker-alpha">' +
      '    <i class="colorpicker-guide"></i>' +
      '  </div>' +
      '</div>' +
      '<div class="colorpicker-addons">' +
      '  <div class="colorpicker-addon colorpicker-preview">' +
      '    <div class="colorpicker-addon-inner"></div>' +
      '  </div>' +
      '  <div class="colorpicker-palettes"></div>' +
      '</div>' +
      '</div>'
  }
};
