import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GroupProvider } from '../../providers/providers';

const VIEW_MODE_SUMMARY = 1;
const VIEW_MODE_SINGLE = 2;

@IonicPage()
@Component({
  selector: 'page-group-chuzz',
  templateUrl: 'group-chuzz.html',
})

export class GroupChuzzPage {

  poll: any;

  //USUARIO QUE ENVIO LA ENCUESTA
  owner: any;
  questions: any = [];

  viewMode: number = VIEW_MODE_SUMMARY;
  answerCount: number = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupProvider: GroupProvider) {
    this.poll = this.navParams.get('poll');

    //BUSCAR DUENO DE ENCUESTA
    this.groupProvider.getPollGroupOwner(this.poll.group_id, this.poll.id)
      .subscribe((owner) => {
        this.owner = owner;

        //BUSCAR PREGUNTAS DE RESPUESTAS Y SUS RESPECTIVAS RESPUESTAS
        this.groupProvider.getGroupPollQuestions(this.poll.group_id, this.poll.id)
          .subscribe((questions) => {
            this.questions = questions;
            this.questions.forEach(question => {
              this.groupProvider.getGroupPollAnswers(this.poll.group_id, this.poll.id, question.id)
              .subscribe((results) => {
                if( results && results.length > 0 && results[0].results && results[0].results.length > 0) {
                  //CONTAR PREGUNTAS CON AL MENOS UNA RESPUESTA 
                  this.answerCount++;
                  question.results = results[0].results;
                } else {
                  question.results = [];
                }
              });
            });
          });
      }, error => {
        //MANEJAR EL ERROR
      });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChuzzPage');
  }

}
