import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
declare var Hammer;

import { ColorGenerator } from '../../directives/text-avatar/color-generator';
import { IonicImageLoader } from 'ionic-image-loader';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  selector: 'poll-choice',
  templateUrl: 'poll-choice.html'
})
export class PollChoiceComponent  {

  @Input('totalAnswers') totalAnswers: number
  @Input('choice') choice: any;
  @Input('result') result: any;
  @Input('selected') selected: boolean = false;
  @Input('chuzzColor') chuzzColor: any;
  @Output('onChoiceSelected') notify: EventEmitter<number> = new EventEmitter<number>();
  @Output('onImageSelected') notifyImage: EventEmitter<number> = new EventEmitter<number>();
  @Output('onChoiceDoubleTapped') notifySubmit: EventEmitter<number> = new EventEmitter<number>();
  @Input('group') group: boolean = false;
  @Input('single') single: boolean = true;
  @Input('answered') answered;
  @Input('with_images') withImages: boolean = false;
  @Input('result_with_image') resultWithImage: boolean = false;
  @Input('show_result') showResult: boolean = false;
  @Input('in_question_page') inQuestionPage: boolean = false;

  percentage: number = 0;

  choiceImage: string = 'assets/img/logos/img-isotype-main.png';
  choiceImagePlacholder: string = "assets/img/option_card.png";

  constructor(private colorGenerator: ColorGenerator, private imageLoaderConfig: ImageLoaderConfig ) {
    console.log('Hello PollChoiceComponent Component');
    
  }

  clicked() {
    console.log('clicked');
    if (!this.answered && !this.showResult) {
      this.notify.emit(this.choice.id);
    }
  }

  selectImage() {
    console.log("SELECION IMAGEN EN POLL CHOICE");
    if (!this.answered) {
      this.notifyImage.emit(this.choice.id);
    }
  }

  ngOnChanges() {
    if (this.totalAnswers > 0) {
      this.percentage = Math.round(this.choice.select_count / this.totalAnswers * 100);
    }
    if (this.group) {
      this.chuzzColor = this.colorGenerator.getColor(this.choice.content);
    }
  }

  doubleTapped($event) {
    if (!this.answered && !this.showResult) {
      this.notifySubmit.emit(this.choice.id);
    }
  }

}
