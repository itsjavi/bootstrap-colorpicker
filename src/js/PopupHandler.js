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
    let addon = cp.component;

    if (cp.options.align === 'right') {
      cp.picker.addClass('colorpicker-right');
    }

    if (cp.options.inline) {
      cp.picker.addClass('colorpicker-inline colorpicker-visible');
      return; // no need to bind show/hide events for inline elements
    }

    cp.picker.addClass('colorpicker-popup colorpicker-hidden');

    // prevent closing the colorpicker when clicking on itself or any child element
    cp.picker.on('mousedown.colorpicker touchstart.colorpicker', $.proxy(function (e) {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, this));

    // there is no input or addon
    if (!cp.hasInput() && !addon) {
      return;
    }

    // bind addon show/hide events
    if (addon) {
      // enable focus on addons
      if (!addon.attr('tabindex')) {
        addon.attr('tabindex', 0);
      }

      addon.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.toggle, this)
      });
      addon.on({
        'focus.colorpicker': $.proxy(this.show, this)
      });
      addon.on({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    // bind input show/hide events
    if (cp.hasInput() && !addon) {
      cp.input.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
      cp.input.on({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    // reposition popup on window resize
    $(this.root).on('resize.colorpicker', $.proxy(this.reposition, this));
  }

  /**
   * Unbinds any event bound by this handler
   */
  unbind() {
    let cp = this.colorpicker;
    let addon = cp.component;

    if (cp.hasInput()) {
      cp.input.off({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
      cp.input.off({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    if (addon) {
      addon.off({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.toggle, this)
      });
      addon.off({
        'focus.colorpicker': $.proxy(this.show, this)
      });
      addon.off({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    $(this.root).off('resize.colorpicker', $.proxy(this.reposition, this));
  }

  /**
   * If the widget is not inside a container or inline, rearranges its position relative to its element offset.
   *
   * @param {Event} [e]
   * @private
   * @returns {boolean} Returns false if the widget is inside a container or inline, true otherwise
   */
  reposition(e) {
    if (this.isHidden()) {
      // Don't need to reposition if hidden
      return false;
    }

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
   * Toggles the colorpicker between visible or hidden
   *
   * @fires Colorpicker#colorpickerShow
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  toggle(e) {
    if (this.isVisible()) {
      this.hide(e);
    } else {
      this.show(e);
    }
  }

  /**
   * Shows the colorpicker widget if hidden.
   * If the input is disabled this call will be ignored.
   *
   * @fires Colorpicker#colorpickerShow
   * @param {Event} [e]
   */
  show(e) {
    if (this.isVisible() || this.colorpicker.isDisabled()) {
      // Don't show the widget if it's already visible or it is disabled
      return;
    }

    let cp = this.colorpicker;

    cp.lastEvent.alias = 'show';
    cp.lastEvent.e = e;

    cp.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');

    // Prevent showing browser native HTML5 colorpicker
    if (
      (e && (!cp.hasInput() || cp.input.attr('type') === 'color')) &&
      (e.stopPropagation && e.preventDefault)
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.reposition(e);

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
  }

  /**
   * Hides the colorpicker widget.
   * Hide is prevented when it is triggered by an event whose target element has been clicked/touched.
   *
   * @fires Colorpicker#colorpickerHide
   * @param {Event} [e]
   */
  hide(e) {
    if (this.isHidden()) {
      // Do not trigger if already hidden
      return;
    }

    let cp = this.colorpicker;

    cp.lastEvent.alias = 'hide';
    cp.lastEvent.e = e;

    // Prevent hide if triggered by an event and an element inside the colorpicker has been clicked/touched
    if (
      ((typeof e !== 'undefined') && e.target) &&
      (
        $(e.currentTarget).parents('.colorpicker').length > 0 ||
        $(e.target).parents('.colorpicker').length > 0
      )
    ) {
      return;
    }

    cp.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');

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
