import { Component} from '@angular/core';
import { 
  IonicPage, NavController, NavParams, ViewController, ActionSheetController,
  MenuController, Events, ToastController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { PollProvider, UserProvider } from '../../providers/providers';

import { PollQuestionPage } from '../poll-question/poll-question';
import { PollFormPage } from '../poll-form/poll-form';
import { TabsPage } from '../tabs/tabs';
import { BasePage } from '../base-page';
import {ItemDetailsPageComment} from '../../pages/item-details-comment/item-details-comment';



@IonicPage()
@Component({
  selector: 'page-poll',
  templateUrl: 'poll.html',
})


export class PollPage extends BasePage {

  currentPoll: any = {
    user: null,
    name: '',
    description: '',
  };
  questions: any;
  answerCount: number;
  displayViews: string = '0';
  displayAnswers: string = '0';
  displayLikes: string = '0';
  pollDefaultImage = "assets/img/poll_card.png";
  userDefaultProfileImage = "assets/img/profile_placeholder.png";
  pollEnded: boolean = false;
  showAnswerButton: boolean = false;
  isEditable: boolean = false;
  allAnswered: boolean = false;

  moreText = '';
  editPollText = '';
  errorText = '';
  params;
  tab1;
  tab2;


  

  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public pollProvider: PollProvider,
    private userProvider: UserProvider,
    public translateService: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public viewController: ViewController,
    protected menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private events: Events
  ) {
    super(menuCtrl);

    this.translateService.get(['MORE', 'EDIT_POLL_TITLE', 'GENERAL_ERRROR_TEXT']).subscribe(values => {
      this.editPollText = values['EDIT_POLL_TITLE'];
      this.moreText = values['MORE'];
      this.errorText = values['GENERAL_ERRROR_TEXT'];
    });

    
    var pollId = ""

    if (navParams.get('poll')) {
      this.currentPoll = navParams.get('poll');
      pollId = this.currentPoll.id;
      this.updateViews(this.currentPoll, []);
    } else if (navParams.get('id')) {
      pollId = navParams.get('id');
    }

    this.pollProvider.getPoll(pollId).subscribe((result) => {
      this.updateViews(result.poll, result.questions);
      this.pollProvider.viewPoll(pollId).subscribe((result) => {
        if (result.should_increment) {
          this.currentPoll.views = this.currentPoll.views + 1;
          this.changingNumbers()
          if (navParams.get('poll')) {
            navParams.get('poll').views = navParams.get('poll').views + 1;
          }
        }
      });
    },
    () => {
      this.showError(this.errorText);
    });

    this.events.subscribe('pollUpdate', (result) => {
      console.log('pollUpdate');
      this.updateViews(result.poll, result.questions);
    });
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.subscribePubsub();
    console.log('ionViewDidEnter PollPage',this.currentPoll);
  }

  ionViewWillLeave() {
    super.ionViewWillLeave();
    this.events.publish('dismissFromPollPage', '');
    this.pollProvider.unwatchPoll(this.currentPoll.id);
    console.log('ionViewWillLeave PollPage');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave PollPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PollPage');
  }

  private changingNumbers() {
    this.displayViews = this.changeBigNumber(this.currentPoll.views);
    this.displayAnswers = this.changeBigNumber(this.currentPoll.answers);
    this.displayLikes = this.changeBigNumber(this.currentPoll.likes);
  }


  private changeBigNumber(number): string {
    if (number + 0 > 1000) {
      let numStr = number.toString();
      return numStr.slice(0,1) + '.' + numStr.slice(1,2) + 'K';
    } else {
      return String(number);
    }
  }

  private updateViews(poll, questions) {
    this.currentPoll = poll;
    this.questions = questions;
    this.showAnswerButton = true;
    this.changingNumbers();
    let currentTime = new Date().getTime();
    let endDate = new Date(this.currentPoll.end_time);
    // Poll ends at 23:59 of the end date
    let endTime = endDate.setDate(endDate.getDate() + 1) - 60000;
    if (this.currentPoll.is_active && endTime >= currentTime) {
      this.pollEnded = false;
      var allAnswered = true;
      for(let question of questions) {
        allAnswered = allAnswered && question.answered;
      }
      this.allAnswered = allAnswered;
    } else {
      this.pollEnded = true;
    }
    this.userProvider.getCachedCurrentUser().then((user) => {
      if (user) {
        let isOwner = (user.id == this.currentPoll.user.id);
        let isWriterOrCelebrity = user.is_celebrity || user.is_writer;
        this.isEditable = (isOwner && isWriterOrCelebrity) || user.is_admin;
      }
    });
  }

  private subscribePubsub() {
    this.pollProvider.watchPoll(this.currentPoll.id, (message) => {
      if (message.type == 'poll_detail_update' || message.type == 'live_question_update') {
        this.pollProvider.getPoll(this.currentPoll.id).subscribe((result) => {
          this.updateViews(result.poll, result.questions);
        });
      }
    });
  }

  dismiss() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(TabsPage, { tab: 'live' });
    }
  }

  answerPoll() {
    this.navCtrl.push(PollQuestionPage, { poll: this.currentPoll, questions: this.questions });
  }

  moreButtonClicked() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.moreText,
      buttons: [
        {
          text: this.editPollText,
          handler: () => { this.navCtrl.push(PollFormPage, { poll: this.currentPoll, questions: this.questions }) }
        }/*,
        {
          text: "Chuzz-on.",
          handler: () => { this.navCtrl.push(PollFormPage, { poll: this.currentPoll, questions: this.questions }) }
          

        }*/
      ]
    });
    actionSheet.present();
  }

  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  opencomment(pollId) {
    //this.nav.push(ItemDetailsPageComment, {fromMenu: true});
    this.navCtrl.push(ItemDetailsPageComment, { poll: pollId});
   }
}
