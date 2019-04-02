import { Component } from '@angular/core';

/**
 * Generated class for the AddQuestionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'add-question',
  templateUrl: 'add-question.html'
})
export class AddQuestionComponent {

  text: string;

  constructor() {
    console.log('Hello AddQuestionComponent Component');
    this.text = 'Hello World';
  }

}
