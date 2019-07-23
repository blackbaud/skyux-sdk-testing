import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  PageObject
} from './page-object';

// this is solely here to test typing.
class ParentComponent {
}

class ChildComponent {
}

describe('PageObject', () => {
  let fixture: any;
  let page: PageObject<ParentComponent>;

  beforeEach(() => {
    fixture = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['querySelector', 'querySelectorAll']),
      debugElement: jasmine.createSpyObj('debugElement', ['query'])
    };
    page = new PageObject<ParentComponent>(fixture as ComponentFixture<ParentComponent>);
  });

  it('should query HTMLElements based on selector', () => {
    const selector: string = 'selector';
    const element: HTMLElement = {} as HTMLElement;
    fixture.nativeElement.querySelector.and.returnValue(element);
    const returnedElement: HTMLElement = page.querySelector(selector);
    expect(returnedElement).toBe(element);
    expect(fixture.nativeElement.querySelector).toHaveBeenCalledWith(selector);
  });

  it('should query all HTMLElements based on selector', () => {
    const selector: string = 'selector';
    const elements: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
    fixture.nativeElement.querySelectorAll.and.returnValue(elements);
    const returnedElements: NodeListOf<HTMLElement> = page.querySelectorAll(selector);
    expect(returnedElements).toBe(elements);
    expect(fixture.nativeElement.querySelectorAll).toHaveBeenCalledWith(selector);
  });

  it('should query components based on type', () => {
    const childComponent = new ChildComponent();
    const debugElement: DebugElement = {componentInstance: childComponent} as DebugElement;
    fixture.debugElement.query.and.returnValue(debugElement);
    const returnedComp: ChildComponent = page.queryDirective(ChildComponent);
    expect(returnedComp).toBe(childComponent);
    expect(fixture.debugElement.query).toHaveBeenCalledWith(jasmine.any(Function));
  });
});
