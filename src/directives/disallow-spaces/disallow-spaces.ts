import { Directive } from '@angular/core';

/**
 * Generated class for the DisallowSpacesDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[disallow-spaces]',
  host: { '(input)': 'removeSpaces($event.target)' }
})
export class DisallowSpacesDirective {

  constructor() {
    console.log('Hello DisallowSpacesDirective Directive');
  }

  removeSpaces(target: any) {
    if (target.value.indexOf(' ') > -1) {
      target.value = target.value.replace(/ /g, '');
    }
  }
}
