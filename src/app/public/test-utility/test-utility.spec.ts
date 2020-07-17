//#region imports

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  NgModule
} from '@angular/core';

import {
  SkyOverlayInstance,
  SkyOverlayModule,
  SkyOverlayService
} from '@skyux/core';

import {
  SkyAppTestUtility
} from './test-utility';

//#endregion

//#region test components

@Component({
  selector: 'test-parent-cmp',
  template: `
<test-cmp
  [attr.data-sky-id]="'my-id'"
>
  My component.
</test-cmp>
`
})
class TestParentComponent { }

@Component({
  selector: 'test-cmp',
  template: `<ng-content></ng-content>`
})
class TestComponent { }

@Component({
  selector: 'test-overlay-internal-cmp',
  template: `
    <div id="my-modal-content">
      foobar
    </div>
    <ul>
      <li class="my-item">foo</li>
      <li class="my-item">bar</li>
      <li class="my-item">baz</li>
    </ul>
  `
})
class TestOverlayInternalComponent { }

@Component({
  selector: 'test-overlay-cmp',
  template: `
  <button
    class="sky-btn sky-btn-primary sky-margin-inline-default"
    type="button"
    (click)="launchOverlay()"
  >
    Launch overlay
  </button>
`
})
class TestOverlayComponent {

  public overlays: SkyOverlayInstance;

  constructor(
    public overlayService: SkyOverlayService
  ) { }

  public launchOverlay(): void {
    const overlayInstance = this.overlayService.create({});

    const componentInstance = overlayInstance.attachComponent(
      TestOverlayInternalComponent
    );

    this.overlays = overlayInstance;
  }
}

@NgModule({
  declarations: [
    TestOverlayComponent,
    TestOverlayInternalComponent
  ],
  entryComponents: [
    TestOverlayInternalComponent
  ]
})
class OverlayTestModule {}

//#endregion

describe('Test utility', () => {
  let bgEl: HTMLDivElement;
  let textEl: HTMLSpanElement;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = '';

    bgEl = document.createElement('div');
    textEl = document.createElement('span');
    inputEl = document.createElement('input');
    inputEl.type = 'text';

    document.body.appendChild(bgEl);
    document.body.appendChild(textEl);
    document.body.appendChild(inputEl);
  });

  afterEach(() => {
    document.body.removeChild(bgEl);
    document.body.removeChild(textEl);
    document.body.removeChild(inputEl);
  });

  it('should use keyboard event values', fakeAsync(() => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('keydown', (event: any) => {
      listenerCalled = true;
      expect(event.key).toBe('tab');
      expect(event.altKey).toBeTruthy();
      expect(event.ctrlKey).toBeTruthy();
      expect(event.metaKey).toBeTruthy();
      expect(event.shiftKey).toBeTruthy();
    });

    SkyAppTestUtility.fireDomEvent(elem, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true
      }
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));

  it('should use custom event values', fakeAsync(() => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('focusin', (event: any) => {
      listenerCalled = true;
      expect(event.relatedTarget).toBe(elem);
    });

    SkyAppTestUtility.fireDomEvent(elem, 'focusin', {
      customEventInit: {
        relatedTarget: elem
      }
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));

  it('should determine if an element is visible', () => {
    expect(SkyAppTestUtility.isVisible(textEl)).toBe(true);

    textEl.style.display = 'none';

    expect(SkyAppTestUtility.isVisible(textEl)).toBe(false);

    expect(SkyAppTestUtility.isVisible(undefined)).toBeUndefined();
  });

  it('should retrieve an element\'s inner text', () => {
    expect(SkyAppTestUtility.getText(textEl)).toBe('');

    textEl.innerText = '    test   ';

    expect(SkyAppTestUtility.getText(textEl)).toBe('test');

    expect(SkyAppTestUtility.getText(undefined)).toBeUndefined();
  });

  it('should retrieve an element\'s background URL', () => {
    let imageUrl: string;

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBeUndefined();

    bgEl.style.backgroundImage = 'url("https://example.com/bg/")';

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(
      new DebugElement(bgEl, document.body, undefined)
    );

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(undefined);

    expect(imageUrl).toBeUndefined();
  });

  it('should set the value of an input', () => {
    expect(inputEl.value).toEqual('');
    SkyAppTestUtility.setInputValue(inputEl, 'foobar');
    expect(inputEl.value).toEqual('foobar');
  });

  describe('getDebugElementByTestId', function () {
    let fixture: ComponentFixture<TestParentComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          TestParentComponent
        ]
      });
      fixture = TestBed.createComponent(TestParentComponent);
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should get the debug element of a component', () => {
      fixture.detectChanges();

      const debugElement = SkyAppTestUtility.getDebugElementByTestId(
        fixture,
        'my-id',
        'test-cmp'
      );

      expect(debugElement).toBeDefined();
    });

    it('should throw if ID not found', () => {
      const testId = 'invalid-id';

      fixture.detectChanges();

      expect(() => {
        SkyAppTestUtility.getDebugElementByTestId(
          fixture,
          testId,
          'test-cmp'
        );
      }).toThrowError(`No element was found with a \`data-sky-id\` value of "${testId}".`);
    });

    it('should throw if selector invalid', () => {
      const testId = 'my-id';
      const selector = 'invalid-selector';

      fixture.detectChanges();

      expect(() => {
        SkyAppTestUtility.getDebugElementByTestId(
          fixture,
          testId,
          selector
        );
      }).toThrowError(
        `The element with the test ID "${testId}" is not a component of type ${selector}."`
      );
    });
  });

  describe('overlay selector', function () {
    let fixture: ComponentFixture<TestOverlayComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyOverlayModule,
          OverlayTestModule
        ]
      });
      fixture = TestBed.createComponent(TestOverlayComponent);
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should get a descendant of the overlay when calling overlayQuerySelector()', () => {
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();

      const el = SkyAppTestUtility.overlayQuerySelector('#my-modal-content');

      expect(el).not.toBeNull();
      expect(SkyAppTestUtility.getText(el)).toEqual('foobar');
    });

    it('should return null when overlayQuerySelector() is not found', () => {
      const el = SkyAppTestUtility.overlayQuerySelector('#foobar');

      expect(el).toBeNull();
    });

    it('should throw error when the overlayQuerySelector argument starts with .sky- or sky-', async() => {
      expect(() => {
        SkyAppTestUtility.overlayQuerySelector('.sky-dropdown');
      }).toThrow();

      expect(() => {
        SkyAppTestUtility.overlayQuerySelector('sky-dropdown');
      }).toThrow();
    });

    it('should get all descendants of the overlay when calling overlayQuerySelectorAll()', () => {
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();

      const el = SkyAppTestUtility.overlayQuerySelectorAll('.my-item');

      expect(el).not.toBeNull();
      expect(el.length).toEqual(3);
      expect(SkyAppTestUtility.getText(el[0])).toEqual('foo');
      expect(SkyAppTestUtility.getText(el[1])).toEqual('bar');
      expect(SkyAppTestUtility.getText(el[2])).toEqual('baz');
    });

    it('should return null when overlayQuerySelectorAll() is not found', () => {
      const el = SkyAppTestUtility.overlayQuerySelectorAll('.not-found-item');

      expect(el).toBeNull();
    });

    it('should throw error when the overlayQuerySelectorAll argument starts with .sky- or sky-', async() => {
      expect(() => {
        SkyAppTestUtility.overlayQuerySelectorAll('.sky-dropdown-item');
      }).toThrow();

      expect(() => {
        SkyAppTestUtility.overlayQuerySelectorAll('sky-dropdown-item');
      }).toThrow();
    });
  });

});
