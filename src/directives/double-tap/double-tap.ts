import {Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
declare var Hammer;

/**
 * Generated class for the DoubleTapDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[doubletap]' // Attribute selector
})
export class DoubleTapDirective implements OnInit, OnDestroy {

  el: HTMLElement;
  pressGesture: Gesture;
  @Output() doubletap: EventEmitter<any> = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.pressGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Tap, {taps: 2}]
      ]
    });
    this.pressGesture.listen();
    this.pressGesture.on('tap', e => {
      this.doubletap.emit(e);
    })
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }

}
