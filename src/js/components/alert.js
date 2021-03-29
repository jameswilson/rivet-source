/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
import Component from './component';

export default class Alert extends Component {
  static get selector() {
    return '[data-alert]';
  }

  static get methods() {
    return {
      init() {
        console.log('Alert::init()');

        this.closeAttribute = 'data-alert-close';
        this.closeSelector = `[${this.closeAttribute}]`;
        this.closeButton = null;

        Component.bindMethodToDOMElement(this.element, 'dismiss', this.dismiss);
        
        this._handleClick = this._handleClick.bind(this);
      },

      connected() {
        console.log('Alert::connected()');

        this.closeButton = this.element.querySelector(this.closeSelector);
        this.closeButton.addEventListener('click', this._handleClick, false);
      },

      disconnected() {
        console.log('Alert::disconnected()');
        
        this.closeButton.addEventListener('click', this._handleClick, false);
      },

      _handleClick() {
        this.dismiss();
      },
    
      dismiss() {
        const dismissEvent = Component.dispatchCustomEvent(
          'alertDismiss',
          this.element,
          {
            id: this.element.dataset.alert
          }
        );
    
        if (!dismissEvent) return;
    
        this.element.remove();
      }
    }
  }
}