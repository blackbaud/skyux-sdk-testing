import {
  Type
} from '@angular/core';

import {
  SkyAppTestUtilityDomEventOptions
} from './test-utility-dom-event-options';

export class SkyAppTestUtility {
  public static fireDomEvent(
    element: EventTarget,
    eventName: string,
    options?: SkyAppTestUtilityDomEventOptions
  ): void {
    const defaults = {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {}
    };

    const settings = Object.assign({}, defaults, options);

    // Apply keyboard event options.
    const event = Object.assign(
      document.createEvent('CustomEvent'),
      settings.keyboardEventInit,
      settings.customEventInit
    );

    event.initEvent(eventName, settings.bubbles, settings.cancelable);
    element.dispatchEvent(event);
  }

  public static fullSpyOnClass<T>(type: Type<T>): jasmine.SpyObj<T> {
    return jasmine.createSpyObj(type.name, Object.keys(type.prototype));
  }
}
