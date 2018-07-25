'use strict';

import $ from 'jquery';
import _defaults from './options';

/**
 * Handles everything related to the UI of the colorpicker popup: show, hide, position,...
 */
class PopupHandler {
  /**
   * @param {Colorpicker} colorpicker
   * @param {Window} root
   */
  constructor(colorpicker, root) {
    /**
     * @type {Window}
     */
    this.root = root;
    /**
     * @type {Colorpicker}
     */
    this.colorpicker = colorpicker;
    /**
     * @type {jQuery}
     */
    this.popoverTarget = null;
    /**
     * @type {jQuery}
     */
    this.popoverTip = null;
  }

  /**
   * @private
   * @returns {jQuery|false}
   */
  get input() {
    return this.colorpicker.inputHandler.input;
  }

  /**
   * @private
   * @returns {boolean}
   */
  get hasInput() {
    return this.colorpicker.inputHandler.hasInput();
  }

  /**
   * @private
   * @returns {jQuery|false}
   */
  get addon() {
    return this.colorpicker.component;
  }

  /**
   * @private
   * @returns {boolean}
   */
  get hasAddon() {
    return !!this.colorpicker.component;
  }

  /**
   * Binds the different colorpicker elements to the focus/mouse/touch events so it reacts in order to show or
   * hide the colorpicker popup accordingly. It also adds the proper classes.
   */
  bind() {
    let cp = this.colorpicker;

    if (cp.options.inline) {
      cp.picker.addClass('colorpicker-inline colorpicker-visible');
      return; // no need to bind show/hide events for inline elements
    }

    cp.picker.addClass('colorpicker-popup colorpicker-hidden');

    // there is no input or addon
    if (!this.hasInput && !this.hasAddon) {
      return;
    }

    // prevent closing the colorpicker when clicking on itself or any child element
    this.preventHideOnNestedClick(cp.picker);

    // create Bootstrap 4 popover
    if (cp.options.popover) {
      this.createPopover();
      this.preventHideOnNestedClick(this.popoverTip);
    }

    // bind addon show/hide events
    if (this.hasAddon) {
      // enable focus on addons
      if (!this.addon.attr('tabindex')) {
        this.addon.attr('tabindex', 0);
      }

      this.addon.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.toggle, this)
      });
      this.addon.on({
        'focus.colorpicker': $.proxy(this.show, this)
      });
      this.addon.on({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    // bind input show/hide events
    if (this.hasInput && !this.hasAddon) {
      this.input.on({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
      this.input.on({
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
    if (this.hasInput) {
      this.input.off({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.show, this),
        'focus.colorpicker': $.proxy(this.show, this)
      });
      this.input.off({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    if (this.hasAddon) {
      this.addon.off({
        'mousedown.colorpicker touchstart.colorpicker': $.proxy(this.toggle, this)
      });
      this.addon.off({
        'focus.colorpicker': $.proxy(this.show, this)
      });
      this.addon.off({
        'focusout.colorpicker': $.proxy(this.hide, this)
      });
    }

    if (this.popoverTarget) {
      this.popoverTarget.popover('dispose');
    }

    $(this.root).off('resize.colorpicker', $.proxy(this.reposition, this));
  }

  preventHideOnNestedClick(element) {
    if (!element) {
      return;
    }

    $(element).on('mousedown.colorpicker touchstart.colorpicker', $.proxy(function (e) {
      if (!e.currentTarget) {
        return;
      }
      if (
        $(e.currentTarget).is(this.colorpicker.picker) ||
        $(e.currentTarget).is(this.popoverTip)
      ) {
        e.preventDefault();
      }
    }, this));
  }

  createPopover() {
    let cp = this.colorpicker;

    this.popoverTarget = this.hasAddon ? this.addon : this.input;

    cp.picker.addClass('colorpicker-bs-popover-content');

    this.popoverTarget.popover(
      $.extend(
        true,
        {},
        _defaults.popover,
        cp.options.popover,
        {trigger: 'manual', content: cp.picker, html: true}
      )
    );

    this.popoverTip = $(this.popoverTarget.popover('getTipElement').data('bs.popover').tip);
    this.popoverTip.addClass('colorpicker-bs-popover');

    this.popoverTarget.on('shown.bs.popover', $.proxy(this.fireShow, this));
    this.popoverTarget.on('hidden.bs.popover', $.proxy(this.fireHide, this));
  }

  /**
   * If the widget is not inside a container or inline, rearranges its position relative to its element offset.
   *
   * @param {Event} [e]
   * @private
   */
  reposition(e) {
    if (this.popoverTarget && this.isVisible()) {
      this.popoverTarget.popover('update');
      return;
    }

    if (this.isHidden() || this.popoverTarget) {
      // Don't need to reposition if hidden or the plugin is using the BS4 popover
      return;
    }

    let cp = this.colorpicker;

    cp.lastEvent.alias = 'reposition';
    cp.lastEvent.e = e;

    if (cp.options.inline !== false || cp.options.container) {
      return;
    }

    let type = cp.container &&
    (cp.container[0] !== this.root.document.body) ? 'position' : 'offset';

    let element = cp.component || cp.element;
    let offset = element[type]();

    // align to the right
    offset.left -= cp.picker.outerWidth() - element.outerWidth();

    cp.picker.css({
      top: offset.top + element.outerHeight(),
      left: offset.left
    });
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

    // Prevent showing browser native HTML5 colorpicker
    if (
      (e && (!this.hasInput || this.input.attr('type') === 'color')) &&
      (e.stopPropagation && e.preventDefault)
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    // add visible class before popover is shown
    cp.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');

    if (this.popoverTarget) {
      this.popoverTarget.popover('show');
    } else {
      this.fireShow();
      this.reposition(e);
    }
  }

  fireShow() {
    /**
     * (Colorpicker) When show() is called and the widget can be shown.
     *
     * @event Colorpicker#colorpickerShow
     */
    this.colorpicker.trigger('colorpickerShow');
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

    if (this.popoverTarget) {
      this.popoverTarget.popover('hide');
    } else {
      this.fireHide();
    }
  }

  fireHide() {
    let cp = this.colorpicker;

    // add hidden class after popover is hidden
    cp.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');

    /**
     * (Colorpicker) When hide() is called and the widget can be hidden.
     *
     * @event Colorpicker#colorpickerHide
     */
    cp.trigger('colorpickerHide');
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
