import { Directive } from '@angular/core';

/**
 * Generated class for the AlphanumericOnlyDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[alphanumeric-only]',
  host: { '(input)': 'removeNonAlphanumeric($event.target)' }
})
export class AlphanumericOnlyDirective {

  constructor() {
    console.log('Hello AlphanumericOnlyDirective Directive');
  }

  removeNonAlphanumeric(target: any) {
    target.value = target.value.replace(/\W/g, '');
  }
}
