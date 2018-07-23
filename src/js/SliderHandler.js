'use strict';

import $ from 'jquery';

/**
 * Class that handles all configured sliders on mouse or touch events.
 */
class SliderHandler {
  /**
   * @param {Document} document
   * @param {Colorpicker} colorpicker
   * @param {Function|null} onMove
   */
  constructor(document, colorpicker, onMove = null) {
    /**
     * @type {Document}
     */
    this.document = document;
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
    /**
     * Latest external event
     *
     * @type {{name: String, e: *}}
     * @private
     */
    this.lastEvent = {
      alias: null,
      e: null
    };
    /**
     * @type {*|String}
     * @private
     */
    this.currentSlider = null;
    /**
     * @type {{left: number, top: number}}
     * @private
     */
    this.mousePointer = {
      left: 0,
      top: 0
    };

    /**
     * @type {Function}
     */
    this.onMove = onMove || function () {
    };
  }

  /**
   * Binds the colorpicker sliders to the mouse/touch events
   */
  bind() {
    let sliders = this.colorpicker.options.horizontal ? this.colorpicker
      .options.slidersHorz : this.colorpicker.options.sliders;
    let sliderClasses = [];

    for (let sliderName in sliders) {
      if (!sliders.hasOwnProperty(sliderName)) {
        continue;
      }

      sliderClasses.push(sliders[sliderName].selector);
    }

    this.colorpicker.picker.find(sliderClasses.join(', '))
      .on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.pressed, this));
  }

  /**
   * Function triggered when clicking in one of the color adjustment bars
   *
   * @private
   * @fires Colorpicker#mousemove
   * @param {Event} e
   */
  pressed(e) {
    this.lastEvent.alias = 'pressed';
    this.lastEvent.e = e;

    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }
    e.stopPropagation();
    e.preventDefault();

    let target = $(e.target);

    // detect the slider and set the limits and callbacks
    let zone = target.closest('div');
    let sliders = this.colorpicker.options.horizontal ? this.colorpicker
      .options.slidersHorz : this.colorpicker.options.sliders;

    if (zone.is('.colorpicker')) {
      return;
    }

    this.currentSlider = null;

    for (let sliderName in sliders) {
      if (!sliders.hasOwnProperty(sliderName)) {
        continue;
      }

      let slider = sliders[sliderName];

      if (zone.is(slider.selector)) {
        this.currentSlider = $.extend({}, slider);
        break;
      } else if (slider.childSelector !== undefined && zone.is(slider.childSelector)) {
        this.currentSlider = $.extend({}, slider);
        zone = zone.parent(); // zone.parents(slider.selector).first() ?
        break;
      }
    }

    let guide = zone.find('.colorpicker-guide').get(0);

    if (this.currentSlider === null || guide === null) {
      return;
    }

    let offset = zone.offset();

    // reference to guide's style
    this.currentSlider.guideStyle = guide.style;
    this.currentSlider.left = e.pageX - offset.left;
    this.currentSlider.top = e.pageY - offset.top;
    this.mousePointer = {
      left: e.pageX,
      top: e.pageY
    };

    /**
     * (window.document) Triggered on mousedown for the document object,
     * so the color adjustment guide is moved to the clicked position.
     *
     * @event Colorpicker#mousemove
     */
    $(this.document).on({
      'mousemove.colorpicker': $.proxy(this.moved, this),
      'touchmove.colorpicker': $.proxy(this.moved, this),
      'mouseup.colorpicker': $.proxy(this.released, this),
      'touchend.colorpicker': $.proxy(this.released, this)
    }).trigger('mousemove');
  }

  /**
   * Function triggered when dragging a guide inside one of the color adjustment bars.
   *
   * @private
   * @param {Event} e
   */
  moved(e) {
    this.lastEvent.alias = 'moved';
    this.lastEvent.e = e;

    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }

    e.stopPropagation();
    e.preventDefault();

    let left = Math.max(
      0,
      Math.min(
        this.currentSlider.maxLeft,
        this.currentSlider.left + ((e.pageX || this.mousePointer.left) - this.mousePointer.left)
      )
    );

    let top = Math.max(
      0,
      Math.min(
        this.currentSlider.maxTop,
        this.currentSlider.top + ((e.pageY || this.mousePointer.top) - this.mousePointer.top)
      )
    );

    this.onMove(this.currentSlider, top, left);
  }

  /**
   * Function triggered when releasing the click in one of the color adjustment bars.
   *
   * @private
   * @param {Event} e
   */
  released(e) {
    this.lastEvent.alias = 'released';
    this.lastEvent.e = e;

    e.stopPropagation();
    e.preventDefault();

    $(this.document).off({
      'mousemove.colorpicker': this.moved,
      'touchmove.colorpicker': this.moved,
      'mouseup.colorpicker': this.released,
      'touchend.colorpicker': this.released
    });
  }
}

export default SliderHandler;
