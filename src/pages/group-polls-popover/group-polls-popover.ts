import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { GroupChuzzPage } from '../group-chuzz/group-chuzz';
import { PollPage } from '../poll/poll';


@IonicPage()
@Component({
  selector: 'page-group-polls-popover',
  templateUrl: 'group-polls-popover.html',
})
export class GroupPollsPopoverPage {

  poll: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public app: App) {
    this.poll = this.navParams.get('poll');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPollsPopoverPage');
  }

  view() {
    this.viewCtrl.dismiss().then(() => this.app.getRootNav().push(GroupChuzzPage, { poll: this.poll }));
  }

  answer() {
    this.viewCtrl.dismiss().then(() => this.app.getRootNav().push(PollPage, { chuzz: this.poll }));
  }

  delete() {
    //BORRAR
  }

}
