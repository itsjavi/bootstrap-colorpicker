'use strict';

import Extension from 'Extension';
import $ from 'jquery';

/**
 * Debugger extension class
 * @alias DebuggerExtension
 * @ignore
 */
class Debugger extends Extension {
  constructor(colorpicker, options = {}) {
    super(colorpicker, options);

    /**
     * @type {number}
     */
    this.eventCounter = 0;
    if (this.colorpicker.inputHandler.hasInput()) {
      this.colorpicker.inputHandler.input.on('change.colorpicker-ext', $.proxy(this.onChangeInput, this));
    }
  }

  /**
   * @fires DebuggerExtension#colorpickerDebug
   * @param {string} eventName
   * @param {*} args
   */
  log(eventName, ...args) {
    this.eventCounter += 1;

    let logMessage = `#${this.eventCounter}: Colorpicker#${this.colorpicker.id} [${eventName}]`;

    console.debug(logMessage, ...args);

    /**
     * Whenever the debugger logs an event, this other event is emitted.
     *
     * @event DebuggerExtension#colorpickerDebug
     * @type {object} The event object
     * @property {Colorpicker} colorpicker The Colorpicker instance
     * @property {ColorItem} color The color instance
     * @property {{debugger: DebuggerExtension, eventName: String, logArgs: Array, logMessage: String}} debug
     *  The debug info
     */
    this.colorpicker.element.trigger({
      type: 'colorpickerDebug',
      colorpicker: this.colorpicker,
      color: this.color,
      value: null,
      debug: {
        debugger: this,
        eventName: eventName,
        logArgs: args,
        logMessage: logMessage
      }
    });
  }

  resolveColor(color, realColor = true) {
    this.log('resolveColor()', color, realColor);
    return false;
  }

  onCreate(event) {
    this.log('colorpickerCreate');
    return super.onCreate(event);
  }

  onDestroy(event) {
    this.log('colorpickerDestroy');
    this.eventCounter = 0;

    if (this.colorpicker.inputHandler.hasInput()) {
      this.colorpicker.inputHandler.input.off('.colorpicker-ext');
    }

    return super.onDestroy(event);
  }

  onUpdate(event) {
    this.log('colorpickerUpdate');
  }

  /**
   * @listens Colorpicker#change
   * @param {Event} event
   */
  onChangeInput(event) {
    this.log('input:change.colorpicker', event.value, event.color);
  }

  onChange(event) {
    this.log('colorpickerChange', event.value, event.color);
  }

  onInvalid(event) {
    this.log('colorpickerInvalid', event.value, event.color);
  }

  onHide(event) {
    this.log('colorpickerHide');
    this.eventCounter = 0;
  }

  onShow(event) {
    this.log('colorpickerShow');
  }

  onDisable(event) {
    this.log('colorpickerDisable');
  }

  onEnable(event) {
    this.log('colorpickerEnable');
  }
}

export default Debugger;
