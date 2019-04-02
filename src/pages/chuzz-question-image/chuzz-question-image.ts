import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chuzz-question-image',
  templateUrl: 'chuzz-question-image.html',
})
export class ChuzzQuestionImagePage {

  question;
  optionId;
  currentOption;
  activate = false;

  currentONumber;
  optionsCount;
  optionSelected;


  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.question = this.navParams.get('question');
    this.optionId = this.navParams.get('optionId');

    this.optionsCount = this.question.options.length;

    for (var index = 0; index < this.optionsCount; index++) {
      var option = this.question.options[index];
      if (option.id === this.optionId) {
        this.currentOption = option;
      }
    }

    this.currentONumber = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChuzzQuestionImagePage');
  }

  clicked() {
    this.activate = !this.activate;
    this.optionSelected = this.currentOption.id;
  }

  nextPrevQuestion(event) {
    if (event.direction === 2 && this.currentONumber < this.optionsCount) {
      this.currentONumber++;
      this.currentOption = this.question.options[this.currentONumber - 1];
    } else if ((event.direction == 2 && this.currentONumber == this.optionsCount) 
      || event.direction === 4 && this.currentONumber === 1)  {
      // TODO: FALTA ENVIAR APRAMETRO DE IMAGEN SELECIONADA
      this.dismiss();
    } else if (event.direction === 4 && this.currentONumber > 1) {
      this.currentONumber--;
      this.currentOption = this.question.options[this.currentONumber - 1];
    }

    if(this.optionSelected === this.currentOption.id) {
      this.activate = true;
    } else {
      this.activate = false;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.optionSelected);
  }

}
