'use strict';

import $ from 'jquery';

/**
 * Handles everything related to the UI of the colorpicker popup: show, hide, position,...
 */
class PopupHandler {
  /**
   * @param {Window} root
   * @param {Colorpicker} colorpicker
   */
  constructor(root, colorpicker) {
    /**
     * @type {Window}
     */
    this.root = root;
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
  }

  /**
   * Binds the different colorpicker elements to the focus/mouse/touch events so it reacts in order to show or
   * hide the colorpicker popup accordingly. It also adds the proper classes.
   */
  bind() {
    let cp = this.colorpicker;

    if (cp.options.inline) {
      cp.picker.addClass('colorpicker-inline colorpicker-no-arrow colorpicker-visible');
    } else {
      cp.picker.addClass('colorpicker-hidden');
    }

    if (cp.options.align === 'right') {
      cp.picker.addClass('colorpicker-right');
    }

    // Prevent closing the colorpicker when clicking on itself
    cp.picker.on('mousedown.colorpicker touchstart.colorpicker', $.proxy(function (e) {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, this));

    if (cp.options.inline === false) {
      cp.element.on({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    if (cp.component !== false) {
      cp.component.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this)
      });
    } else {
      cp.element.on({
        'focus.colorpicker': $.proxy(this.show, this)
      });
    }

    if ((cp.hasInput() === false) && (cp.component === false) && !cp.element.has('.colorpicker')) {
      cp.element.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this)
      });
    }

    // for HTML5 input[type='color']
    if (cp.hasInput() && (cp.component !== false) && (cp.input.attr('type') === 'color')) {
      cp.input.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
    }
  }

  /**
   * If the widget is not inside a container or inline, rearranges its position relative to its element offset.
   *
   * @param {Event} [e]
   * @private
   * @returns {boolean} Returns false if the widget is inside a container or inline, true otherwise
   */
  reposition(e) {
    let cp = this.colorpicker;

    cp.lastEvent.alias = 'reposition';
    cp.lastEvent.e = e;

    if (cp.options.inline !== false || cp.options.container) {
      return false;
    }
    let type = cp.container &&
    (cp.container[0] !== this.root.document.body) ? 'position' : 'offset';

    let element = cp.component || cp.element;
    let offset = element[type]();

    if (cp.options.align === 'right') {
      offset.left -= cp.picker.outerWidth() - element.outerWidth();
    }
    cp.picker.css({
      top: offset.top + element.outerHeight(),
      left: offset.left
    });
    return true;
  }

  /**
   * Shows the colorpicker widget if hidden.
   * If the input is disabled this call will be ignored.
   *
   * @fires Colorpicker#colorpickerShow
   * @param {Event} [e]
   * @returns {boolean} True if was hidden and afterwards visible, false if nothing happened.
   */
  show(e) {
    let cp = this.colorpicker;

    cp.lastEvent.alias = 'show';
    cp.lastEvent.e = e;

    if (this.isVisible() || cp.isDisabled()) {
      // Don't show the widget if it's already visible or it is disabled
      return false;
    }
    cp.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');

    this.reposition(e);
    $(this.root).on('resize.colorpicker', $.proxy(this.reposition, this));

    if (e && (!cp.hasInput() || cp.input.attr('type') === 'color')) {
      if (e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    if ((cp.component || !cp.input) && (cp.options.inline === false)) {
      // hide colorpicker when clicking outside
      $(this.root.document).on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.hide, this)
      });
    }

    /**
     * (Colorpicker) When show() is called and the widget can be shown.
     *
     * @event Colorpicker#colorpickerShow
     */
    cp.element.trigger({
      type: 'colorpickerShow',
      colorpicker: cp,
      color: cp.color
    });

    return true;
  }

  /**
   * Hides the colorpicker widget.
   * Hide is prevented when it is triggered by an event whose target element has been clicked/touched.
   *
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   * @returns {boolean} True if was visible and afterwards hidden, false if nothing happened.
   */
  hide(e) {
    let cp = this.colorpicker;

    cp.lastEvent.alias = 'hide';
    cp.lastEvent.e = e;

    if (this.isHidden()) {
      // Do not trigger if already hidden
      return false;
    }
    if ((typeof e !== 'undefined') && e.target) {
      // Prevent hide if triggered by an event and an element inside the colorpicker has been clicked/touched
      if (
        $(e.currentTarget).parents('.colorpicker').length > 0 ||
        $(e.target).parents('.colorpicker').length > 0
      ) {
        return false;
      }
    }
    cp.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');

    $(this.root).off('resize.colorpicker', this.reposition);
    $(this.root.document).off({
      'mousedown.colorpicker touchstart.colorpicker': this.hide
    });

    /**
     * (Colorpicker) When hide() is called and the widget can be hidden.
     *
     * @event Colorpicker#colorpickerHide
     */
    cp.element.trigger({
      type: 'colorpickerHide',
      colorpicker: cp,
      color: cp.color
    });
    return true;
  }

  /**
   * Returns true if the colorpicker element has the colorpicker-visible class and not the colorpicker-hidden one.
   * False otherwise.
   *
   * @returns {boolean}
   */
  isVisible() {
    return this.colorpicker.picker.hasClass('colorpicker-visible') &&
      !this.colorpicker.picker.hasClass('colorpicker-hidden');
  }

  /**
   * Returns true if the colorpicker element has the colorpicker-hidden class and not the colorpicker-visible one.
   * False otherwise.
   *
   * @returns {boolean}
   */
  isHidden() {
    return this.colorpicker.picker.hasClass('colorpicker-hidden') &&
      !this.colorpicker.picker.hasClass('colorpicker-visible');
  }
}

export default PopupHandler;
