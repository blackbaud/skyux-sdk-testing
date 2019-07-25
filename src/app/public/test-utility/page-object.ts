import {
  Type
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

export class PageObject<C> {
  public constructor(protected fixture: ComponentFixture<C>) {
  }

  public queryDirective<T>(type: Type<T>): T {
    return this.fixture.debugElement.query(By.directive(type)).componentInstance;
  }

  public querySelector<T extends HTMLElement>(selector: string): T {
    return this.fixture.nativeElement.querySelector(selector);
  }

  public querySelectorAll<T extends HTMLElement>(selector: string): NodeListOf<T> {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}
