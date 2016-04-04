"use strict";
$(function() {
  // Code for docs demos
  function createColorpickers() {
    // Api demo
    var bodyStyle = $('body')[0].style;
    $('#demo_apidemo').colorpicker({
      color: bodyStyle.backgroundColor
    }).on('changeColor', function(ev) {
      bodyStyle.backgroundColor = ev.color.toHex();
    });

    // Horizontal mode
    $('#demo_forceformat').colorpicker({
      format: 'rgba', // force this format
      horizontal: true
    });

    $('.demo-auto').colorpicker();

    $('#demo_selectors').colorpicker({
      colorSelectors: {
        'default': '#777777',
        'primary': '#337ab7',
        'success': '#5cb85c',
        'info': '#5bc0de',
        'warning': '#f0ad4e',
        'danger': '#d9534f'
      }
    });

    $('.demo-with-options').colorpicker({
      color: '#00AABB',
      format: 'hex'
    });

    $('#demo_size').colorpicker({
      customClass: 'colorpicker-2x',
      sliders: {
        saturation: {
          maxLeft: 200,
          maxTop: 200
        },
        hue: {
          maxTop: 200
        },
        alpha: {
          maxTop: 200
        }
      }
    });

    // Disabled / enabled triggers
    $(".disable-button").click(function(e) {
      e.preventDefault();
      $("#demo_endis").colorpicker('disable');
    });

    $(".enable-button").click(function(e) {
      e.preventDefault();
      $("#demo_endis").colorpicker('enable');
    });
  }

  createColorpickers();

  // Create / destroy instances
  $('.demo-destroy').click(function(e) {
    e.preventDefault();
    $('.demo').colorpicker('destroy');
    $(".disable-button, .enable-button").off('click');
  });

  $('.demo-create').click(function(e) {
    e.preventDefault();
    createColorpickers();
  });
});
