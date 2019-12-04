'use strict';

import $ from 'jquery';

/**
 * Class that handles all configured sliders on mouse or touch events.
 * @ignore
 */
class SliderHandler {
  /**
   * @param {Colorpicker} colorpicker
   */
  constructor(colorpicker) {
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
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
    this.onMove = $.proxy(this.defaultOnMove, this);
  }

  /**
   * This function is called every time a slider guide is moved
   * The scope of "this" is the SliderHandler object.
   *
   * @param {int} top
   * @param {int} left
   */
  defaultOnMove(top, left) {
    if (!this.currentSlider) {
      return;
    }

    let slider = this.currentSlider, cp = this.colorpicker, ch = cp.colorHandler;

    // Create a color object
    let color = !ch.hasColor() ? ch.getFallbackColor() : ch.color.getClone();

    // Adjust the guide position
    slider.guideStyle.left = left + 'px';
    slider.guideStyle.top = top + 'px';

    // Adjust the color
    if (slider.callLeft) {
      color[slider.callLeft](left / slider.maxLeft);
    }
    if (slider.callTop) {
      color[slider.callTop](top / slider.maxTop);
    }

    // Set the new color
    cp.setValue(color);
    cp.popupHandler.focus();
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
   * Unbinds any event bound by this handler
   */
  unbind() {
    $(this.colorpicker.picker).off({
      'mousemove.colorpicker': $.proxy(this.moved, this),
      'touchmove.colorpicker': $.proxy(this.moved, this),
      'mouseup.colorpicker': $.proxy(this.released, this),
      'touchend.colorpicker': $.proxy(this.released, this)
    });
  }

  /**
   * Function triggered when clicking in one of the color adjustment bars
   *
   * @private
   * @fires Colorpicker#mousemove
   * @param {Event} e
   */
  pressed(e) {
    if (this.colorpicker.isDisabled()) {
      return;
    }
    this.colorpicker.lastEvent.alias = 'pressed';
    this.colorpicker.lastEvent.e = e;

    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }
    // e.stopPropagation();
    // e.preventDefault();

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
        this.currentSlider = $.extend({}, slider, {name: sliderName});
        break;
      } else if (slider.childSelector !== undefined && zone.is(slider.childSelector)) {
        this.currentSlider = $.extend({}, slider, {name: sliderName});
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

    // TODO: fix moving outside the picker makes the guides to keep moving. The event needs to be bound to the window.
    /**
     * (window.document) Triggered on mousedown for the document object,
     * so the color adjustment guide is moved to the clicked position.
     *
     * @event Colorpicker#mousemove
     */
    $(this.colorpicker.picker).on({
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
    this.colorpicker.lastEvent.alias = 'moved';
    this.colorpicker.lastEvent.e = e;

    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
      e.pageX = e.originalEvent.touches[0].pageX;
      e.pageY = e.originalEvent.touches[0].pageY;
    }

    // e.stopPropagation();
    e.preventDefault(); // prevents scrolling on mobile

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

    this.onMove(top, left);
  }

  /**
   * Function triggered when releasing the click in one of the color adjustment bars.
   *
   * @private
   * @param {Event} e
   */
  released(e) {
    this.colorpicker.lastEvent.alias = 'released';
    this.colorpicker.lastEvent.e = e;

    // e.stopPropagation();
    // e.preventDefault();

    $(this.colorpicker.picker).off({
      'mousemove.colorpicker': this.moved,
      'touchmove.colorpicker': this.moved,
      'mouseup.colorpicker': this.released,
      'touchend.colorpicker': this.released
    });
  }
}

export default SliderHandler;
