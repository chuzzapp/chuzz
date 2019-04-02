import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { MasonryLayout } from '../../pages/layout/masonry-layout';


@Component({
  selector: 'poll-group',
  templateUrl: 'poll-group.html'
})
export class PollGroupComponent extends MasonryLayout {

  totalAnswers: number = 0
  withImages: boolean = false;

  @Input('choices') choices: any[];
  @Input('results') results: any;
  @Input('reset') reset: boolean = false;
  @Input('choiceHighlighted') choiceHighlighted: number;
  @Input('group') group: boolean = false;
  @Input('single') single: boolean = false;
  @Input('result_with_image') resultWithImage: boolean = false;

  @Output('onChoiceSelected') notify: EventEmitter<number> = new EventEmitter<number>();
  @Output('onImageSelected') notifyImage: EventEmitter<number> = new EventEmitter<number>();
  @Output('onChoiceDoubleTapped') notifySubmit: EventEmitter<number> = new EventEmitter<number>();
  
  @Input('choice-selected') choiceSelectedId: any;

  @Input('answered') answered;

  @Input('show_result') showResult: boolean = false;

  @Input('in_question_page') inQuestionPage: boolean = false;


  constructor() {
    super();
    console.log('choices: ', this.choices);
    console.log('Hello PollGroupComponent Component');
  }

  onChoiceSelected(choiceId) {
    this.choiceSelectedId = choiceId;
    this.notify.emit(this.choiceSelectedId);
  }

  onImageSelected(choiceId) {
    console.log("SELECION IMAGEN EN POLL GROUP");
    this.notifyImage.emit(choiceId);
  }

  onChoiceDoubleTapped(choiceId) {
    this.choiceSelectedId = choiceId;
    this.notifySubmit.emit(this.choiceSelectedId);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalAnswers = 0;
    this.withImages = false;
    this.resultWithImage = false;
    for(let choice of this.choices) {
      this.totalAnswers += choice.select_count;
      if (choice.image) {
        this.withImages = true;
        this.resultWithImage = true && this.showResult;
      }
    }
    if (this.reset) {
      this.choiceSelectedId = undefined;
    }
  }

}
