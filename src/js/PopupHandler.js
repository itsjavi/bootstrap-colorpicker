'use strict';

import $ from 'jquery';
import _defaults from './options';

/**
 * Handles everything related to the UI of the colorpicker popup: show, hide, position,...
 * @ignore
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

    /**
     * If true, the latest click was inside the popover
     * @type {boolean}
     */
    this.clicking = false;
    /**
     * @type {boolean}
     */
    this.hidding = false;
    /**
     * @type {boolean}
     */
    this.showing = false;
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
    return this.colorpicker.addonHandler.addon;
  }

  /**
   * @private
   * @returns {boolean}
   */
  get hasAddon() {
    return this.colorpicker.addonHandler.hasAddon();
  }

  /**
   * @private
   * @returns {boolean}
   */
  get isPopover() {
    return !this.colorpicker.options.inline && !!this.popoverTip;
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

    // create Bootstrap 4 popover
    if (cp.options.popover) {
      this.createPopover();
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
    $(this.root.document).off('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.hide, this));
    $(this.root.document).off('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.onClickingInside, this));
  }

  isClickingInside(e) {
    if (!e) {
      return false;
    }

    return (
      this.isOrIsInside(this.popoverTip, e.currentTarget) ||
      this.isOrIsInside(this.popoverTip, e.target) ||
      this.isOrIsInside(this.colorpicker.picker, e.currentTarget) ||
      this.isOrIsInside(this.colorpicker.picker, e.target)
    );
  }

  isOrIsInside(container, element) {
    if (!container || !element) {
      return false;
    }

    element = $(element);

    return (
      element.is(container) ||
      container.find(element).length > 0
    );
  }

  onClickingInside(e) {
    this.clicking = this.isClickingInside(e);
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

    /* Bootstrap 5 added an official method to get the popover instance */
    /* global bootstrap */
    const useGetInstance = window.bootstrap &&
      window.bootstrap.Popover &&
      window.bootstrap.Popover.getInstance;

    this.popoverTip = useGetInstance ?
      $(bootstrap.Popover.getInstance(this.popoverTarget[0]).getTipElement()) :
      $(this.popoverTarget.popover('getTipElement').data('bs.popover').tip);

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
    }
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
   *
   * @fires Colorpicker#colorpickerShow
   * @param {Event} [e]
   */
  show(e) {
    if (this.isVisible() || this.showing || this.hidding) {
      return;
    }

    this.showing = true;
    this.hidding = false;
    this.clicking = false;

    let cp = this.colorpicker;

    cp.lastEvent.alias = 'show';
    cp.lastEvent.e = e;

    // Prevent showing browser native HTML5 colorpicker
    if (
      (e && (!this.hasInput || this.input.attr('type') === 'color')) &&
      (e && e.preventDefault)
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    // If it's a popover, add event to the document to hide the picker when clicking outside of it
    if (this.isPopover) {
      $(this.root).on('resize.colorpicker', $.proxy(this.reposition, this));
    }

    // add visible class before popover is shown
    cp.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');

    if (this.popoverTarget) {
      this.popoverTarget.popover('show');
    } else {
      this.fireShow();
    }
  }

  fireShow() {
    this.hidding = false;
    this.showing = false;

    if (this.isPopover) {
      // Add event to hide on outside click
      $(this.root.document).on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.hide, this));
      $(this.root.document).on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.onClickingInside, this));
    }

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
    if (this.isHidden() || this.showing || this.hidding) {
      return;
    }

    let cp = this.colorpicker, clicking = (this.clicking || this.isClickingInside(e));

    this.hidding = true;
    this.showing = false;
    this.clicking = false;

    cp.lastEvent.alias = 'hide';
    cp.lastEvent.e = e;

    // TODO: fix having to click twice outside when losing focus and last 2 clicks where inside the colorpicker

    // Prevent hide if triggered by an event and an element inside the colorpicker has been clicked/touched
    if (clicking) {
      this.hidding = false;
      return;
    }

    if (this.popoverTarget) {
      this.popoverTarget.popover('hide');
    } else {
      this.fireHide();
    }
  }

  fireHide() {
    this.hidding = false;
    this.showing = false;

    let cp = this.colorpicker;

    // add hidden class after popover is hidden
    cp.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');

    // Unbind window and document events, since there is no need to keep them while the popup is hidden
    $(this.root).off('resize.colorpicker', $.proxy(this.reposition, this));
    $(this.root.document).off('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.hide, this));
    $(this.root.document).off('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.onClickingInside, this));

    /**
     * (Colorpicker) When hide() is called and the widget can be hidden.
     *
     * @event Colorpicker#colorpickerHide
     */
    cp.trigger('colorpickerHide');
  }

  focus() {
    if (this.hasAddon) {
      return this.addon.focus();
    }
    if (this.hasInput) {
      return this.input.focus();
    }
    return false;
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
