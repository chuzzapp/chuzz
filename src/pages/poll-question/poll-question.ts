import { Component } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams, ViewController, Events, Platform,
  LoadingController, ModalController, ToastController, MenuController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { PollProvider, MessagesProvider, UserProvider } from '../../providers/providers';

import { ChuzzMessagePage } from '../chuzz-message/chuzz-message';
import { ChuzzQuestionImagePage } from '../chuzz-question-image/chuzz-question-image';
import { UserCertificatePage } from '../user-certificate/user-certificate';
import { BasePage } from '../base-page';
import { TabsPage } from '../tabs/tabs';
import {Observable} from 'rxjs'; // Angular 6 
import { Answer } from '../../models/answer';
import {ItemDetailsPageComment} from '../../pages/item-details-comment/item-details-comment';

import { ADMOB_IOS_UNIT_ID, ADMOB_ANDROID_UNIT_ID, ADMOB_IS_TESTING, ADMOB_IOS_BANNER_ID, ADMOB_ANDROID_BANNER_ID } from '../../utils/constants';

@IonicPage()
@Component({
  selector: 'page-poll-question',
  templateUrl: 'poll-question.html',
})
export class PollQuestionPage extends BasePage {
  loading: any;
  loadingtext: string;
  userId;
  contador_qf;
  poll: any;
  poll_id: any;
  pollQuestions: any;
  pollQuestionsId: any;
  currentQuestion: any;
  numberOfQuestions: number;
  currentQNumber: number;
  choiceSelectedId: string;
  results: any;
  choiceHighlighted: number;
  reset: boolean = false;
  messageConexionTitle = "";
  messageConexionText = "";
  showSync: boolean = false;
  justAnswered: boolean = false;
  contador_ans = 0;
  answers = {};
  withImages = false;
  comment;
  resultWithImage: boolean = false;
  isWelcomePoll: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public appCtrl: App,
    public pollProvider: PollProvider,
    public toastCtrl: ToastController,
    public viewController: ViewController,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    public userProvider: UserProvider,
    public platform: Platform,
    private storage: Storage,
    protected menuCtrl: MenuController,
    private events: Events,
    private admobFree: AdMobFree
  ) {
    super(menuCtrl);
    this.results = [];

    this.translateService.get([
      'LOADING_CONTENT','COMMENT', 'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',]).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];
        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];
        this.comment = values['COMMENT'];
      });

    this.poll = navParams.get('poll');
    this.poll_id = navParams.get('poll');
    this.pollQuestions = navParams.get('questions');
    this.pollQuestionsId = navParams.get('questions');





    this.isWelcomePoll = this.navParams.get('isWelcomePoll');
    console.log("question", this.pollQuestions);
    this.numberOfQuestions = this.pollQuestions.length;

    if (this.poll.is_live) {
      this.currentQNumber = this.pollQuestions.length;
    } else {
      this.currentQNumber = 1;
    }

    this.updateQuestion();
   

    /**
     * 
     *    this.userProvider.getUserSky(this.userId).then((records) => {


      console.log("user by skygear", records);
     
    }, (error) => {
      console.error(error);
    })
     */


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PollQuestionPage');
  }

  ionViewWillLeave() {
    super.ionViewWillLeave();
    this.pollProvider.unwatchPoll(this.poll.id);
    console.log('ionViewWillLeave PollQuestionPage');
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.subscribePubsub();
    console.log('ionViewDidEnter PollQuestionPage');


  }

  onChoiceSelected(choiceId) {
    console.log("VOY A GUARDAR");
    this.choiceSelectedId = choiceId;
  }

  onImageSelected(choiceId) {
    this.onChoiceSelected(choiceId);
  }

  onChoiceDoubleTapped(choiceId) {
    this.choiceSelectedId = choiceId;
    this.submit();

  }

  showBannerAd() {
    if (this.poll.is_live && this.currentQNumber != this.pollQuestions.length) {
      return;
    }

    if (this.platform.is('ios')) {
      this.admobFree.banner.config({
        id: ADMOB_IOS_BANNER_ID,
        isTesting: ADMOB_IS_TESTING,
        autoShow: true,
        overlap: false,
      });
    } else if (this.platform.is('android')) {
      this.admobFree.banner.config({
        id: ADMOB_ANDROID_BANNER_ID,
        isTesting: ADMOB_IS_TESTING,
        autoShow: true,
        overlap: false,
      });
    } else {
      return;
    }

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        console.log('ready');
      })
      .catch((e) => {
        console.log('Admob banner prepare failed');
        console.log(e);
      });

  }

  showInterstitialAd() {
    if (!this.justAnswered) {
      return;
    }

    if (this.platform.is('ios')) {
      this.admobFree.interstitial.config({
        id: ADMOB_IOS_UNIT_ID,
        isTesting: ADMOB_IS_TESTING,
        autoShow: true
      });
    } else if (this.platform.is('android')) {
      this.admobFree.interstitial.config({
        id: ADMOB_ANDROID_UNIT_ID,
        isTesting: ADMOB_IS_TESTING,
        autoShow: true
      });
    } else {
      return;
    }

    this.admobFree.interstitial.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        console.log('ready');
      })
      .catch((e) => {
        console.log('Admob interstitial prepare failed');
        console.log(e);
      });
  }

  dismiss() {
    this.admobFree.banner.remove();
    var number = getRandomInt(1,10);
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    console.log("number is", number)
    if(number == 1){
      this.showInterstitialAd();
    }

    this.viewController.dismiss();
  }

  backToTab() {
    this.admobFree.banner.remove();
    var number = getRandomInt(1,10);
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    console.log("number is", number)
    if(number == 1){
      this.showInterstitialAd();
    }
    this.navCtrl.popToRoot();
  }

  updateChoiceType() {
    console.log("A VER SI TIENE IMAGEN");
    // TODO: Restore display question logic and integrate with API
    for (var index = 0; index < this.currentQuestion.choices.length; index++) {
      var choices = this.currentQuestion.choices[index];

      if (choices.image !== undefined) {
        this.withImages = true;
      } else {
        this.withImages = false;
      }
    }
  }

  previousQuestion() {
    this.currentQNumber--;
    this.updateQuestion();
  }

  nextQuestion() {
    this.currentQNumber++;
    this.updateQuestion();
  }

  submit() {
    this.showLoadingModal()
    this.pollProvider.submitAnswer(this.poll.id, this.currentQuestion.id, this.choiceSelectedId)
      .subscribe((result) => {
        this.loading.dismiss();
        if (result.errors) {
          this.showError(result.errors);
        }
        else {
          if (!result.success) {
            this.showError(this.messageConexionText);
          } else {
            console.log('success!');
            this.currentQuestion.answered = true;
            this.justAnswered = true;
            for (var index = 0; index < this.currentQuestion.choices.length; index++) {
              if (this.currentQuestion.choices[index].id == this.choiceSelectedId) {
                this.currentQuestion.choices[index].is_selected = true;
                this.currentQuestion.choices[index].select_count++;
              }
            }
            this.pollQuestions[this.currentQNumber - 1] = this.currentQuestion;
            this.addFirtsQuestion();
            this.showBannerAd();
          }

        }
      },
        () => {
          this.loading.dismiss();
          this.showError(this.messageConexionText);
        });


  }
  addFirtsQuestion() {
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      this.userProvider.getUserSky(this.userId).then((k) => {
        k.map(f => {
          console.log("contador:", f.first_answer_count);
          this.pollProvider.queryAnswerbyCreated(this.poll_id.id).then((records) => {
            console.log("Answer by poll", records);
            const index1 = records.findIndex(record => record.user_id._id === `user/${this.userId}`);
            if (index1 == 0) {
              f.first_answer_count++;

            }
            console.log("Sera uno si fui el mas rapido", f.first_answer_count)
            this.pollProvider.updateFirstAnwersCount(this.userId, f.first_answer_count);
          }, (error) => {
            console.error(error);
          })
        }
        )
      });
    });
  }

  private updateQuestion() {
    this.choiceSelectedId = undefined;
    this.currentQuestion = this.pollQuestions[this.currentQNumber - 1];
    this.numberOfQuestions = this.pollQuestions.length;
    this.updateChoiceType();
  }

  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  private showLoadingModal() {
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();
  }

  private subscribePubsub() {
    this.pollProvider.watchPoll(this.poll.id, (message) => {
      console.log('get in question page');
      if (message.type == 'live_question_update' || message.type == 'answer_stat_update' || message.type == 'poll_detail_update') {
        this.pollProvider.getPoll(this.poll.id).subscribe((result) => {
          this.poll = result.poll;
          this.pollQuestions = result.questions;
          if (this.poll.is_live && message.type == 'live_question_update') {
            this.currentQNumber = this.pollQuestions.length;
          }
          this.updateQuestion();
          this.events.publish('pollUpdate', result);
        });
      }
    });
  }
  opencomment() {
    //this.nav.push(ItemDetailsPageComment, {fromMenu: true});
    this.navCtrl.push(ItemDetailsPageComment, { poll: this.poll});
   }
}
