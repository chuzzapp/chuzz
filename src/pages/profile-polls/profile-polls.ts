import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { PollQuestionPage } from '../poll-question/poll-question';

@IonicPage()
@Component({
  selector: 'page-profile-polls',
  templateUrl: 'profile-polls.html',
})
export class ProfilePollsPage {

  polls: any;
  sort: number = 1;
  user: any;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
    this.user = this.navParams.get('user');

    if (this.navParams.get('answered')) {
      this.title = 'PROFILE_MY_ANSWERS';
      this.userProvider.getUserPolls(this.user.id).subscribe(
        (polls) => {
          this.polls = polls;
          console.log(this.polls);
          this.polls.sort(this.sortByCreatedAtReverse);
        }
      );
    } else {
      this.title = 'PROFILE_MY_LIKES';
      this.userProvider.getUserLikePolls(this.user.id).subscribe(
        (polls) => {
          this.polls = polls;
          this.polls.sort(this.sortByCreatedAtReverse);
        }
      );
    }


  }

  private sortByAlphabetically(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  private sortByCreatedAt(a, b) {
    var aD = new Date(a.created_at);
    var bD = new Date(b.created_at);
    if (aD.getTime() < bD.getTime())
      return -1;
    if (aD.getTime() > bD.getTime())
      return 1;
    return 0;
  }

  private sortByAnsweredAt(a, b) {
    var aD = new Date(a.aswered_at);
    var bD = new Date(b.aswered_at);
    if (aD.getTime() < bD.getTime())
      return -1;
    if (aD.getTime() > bD.getTime())
      return 1;
    return 0;
  }

  private sortByAlphabeticallyReverse(a, b) {
    if (b.name < a.name)
      return -1;
    if (b.name > a.name)
      return 1;
    return 0;
  }

  private sortByCreatedAtReverse(a, b) {
    var aD = new Date(b.created_at);
    var bD = new Date(a.created_at);
    if (aD.getTime() < bD.getTime())
      return -1;
    if (aD.getTime() > bD.getTime())
      return 1;
    return 0;
  }

  private sortByAnsweredAtReverse(a, b) {
    var aD = new Date(b.aswered_at);
    var bD = new Date(a.aswered_at);
    if (aD.getTime() < bD.getTime())
      return -1;
    if (aD.getTime() > bD.getTime())
      return 1;
    return 0;
  }

  sortBy(event) {
    switch (event) {
      case '1':
        this.polls.sort(this.sortByCreatedAtReverse);
        break;
      case '2':
        this.polls.sort(this.sortByCreatedAt);
        break;
      case '3':
        this.polls.sort(this.sortByAnsweredAtReverse);
        break;
      case '4':
        this.polls.sort(this.sortByAnsweredAt);
        break;
      case '5':
        this.polls.sort(this.sortByAlphabetically);
        break;
      case '6':
        this.polls.sort(this.sortByAlphabeticallyReverse);
        break;
    
      default:
        break;
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePollsPage');
  }

  openPoll(poll) {
    this.navCtrl.push(PollQuestionPage, { chuzzId: poll.id, user: this.user });
  }

}
