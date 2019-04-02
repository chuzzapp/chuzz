import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PollProvider } from '../../providers/providers';

import { PollQuestionPage } from '../poll-question/poll-question';

@IonicPage()
@Component({
  selector: 'page-user-welcome',
  templateUrl: 'user-welcome.html',
})
export class UserWelcomePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private pollProvider: PollProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserWelcomePage');
  }

  continue() {
    this.pollProvider.getWelcomeChuzzId().subscribe(welcome => {
      this.navCtrl.setRoot(PollQuestionPage, { chuzzId : welcome.welcome_id, isWelcomePoll: true });
    });
  }

}
