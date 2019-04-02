import { Component } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams,
  AlertController, ToastController, LoadingController,
  Platform, ActionSheetController, reorderArray,
  MenuController, Events, IonicApp, ModalController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

import { TranslateService } from '@ngx-translate/core';

import { Storage } from '@ionic/storage';

import { GroupProvider, PollProvider, BaseInfoProvider, TopicsProvider } from '../../providers/providers';

import { ImagePage } from '../image-page';
import { MainPage } from '../pages';
import { PollPage } from '../poll/poll';
import { scrollToSelectedItem } from '../../utils/select-helper';
import { internationalCountryList, internationalCountryListMapper, getListIdByCountryList } from '../../utils/countries';


@IonicPage()
@Component({
  selector: 'page-poll-form',
  templateUrl: 'poll-form.html',
})
export class PollFormPage extends ImagePage {

  currentGroup: any;

  pollObject: {
    id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    is_live: Boolean;
    country_ids: string[];
    topic_ids: string[];
    image: string;
    promoted: Boolean;
    deleted: Boolean;
    is_adult_only: Boolean;
    delete_image: boolean;
  };
  questions: {
    id: string;
    title: string;
    type: string;
    ordering: number;
    choices: {
      id: string;
      content: string;
      image_data: string;
      image: string;
      delete_image: boolean;
      ordering: number;
    }[];
  }[];
  pollImage: string = undefined;
  pollCountry: string = '';

  addOptionTitle: string;
  addOptionText: string;
  removeQuestionTitle: string;
  removeQuestionText: string;
  confirmText: string;
  cancelText: string;
  titleText: string;
  loading: any;
  loadingtext: string;
  errorSavingPollText: string;

  errorEmptyRequiredFieldMsg: string = 'Please input all the * fields.';
  errorTitleMsg: string = '';
  errorQuestionsMsg: string = '';
  errorQuestionTextMsg: string = '';
  errorOptionsMsg: string = '';
  errorOptionsTextMsg: string = '';
  errorTimeMsg: string = '';
  errorStartTimeMsg: string = '';
  currentQuestionIndex: number;
  currentOptionIndex: number;

  internationalCountryList = internationalCountryList;

  selectingCoverImage: Boolean = false;

  userIsAdmin: Boolean = false;
  displayCountrySelection: Boolean = false;
  isUpdate: Boolean = false;
  firstEdit: Boolean = true;

  countryList = [];
  topicList = [];

  maxDate = this.toLocalHTMLDate(new Date(new Date().setFullYear(new Date().getFullYear() + 5)));
  minDate = this.toLocalHTMLDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  starTimeDefaultValue = this.toLocalHTMLDate(new Date());
  endTimeDefaultValue = this.toLocalHTMLDate(new Date(new Date().setDate(new Date().getDate() + 3)));

  protected imageWidth: number = 900;
  protected imageHeight: number = 506;

  unregisterBackButtonAction: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public toastCtrl: ToastController,
    public groupProvider: GroupProvider,
    public pollProvider: PollProvider,
    public loadingController: LoadingController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public baseInfoProvider: BaseInfoProvider,
    public topicsProvider: TopicsProvider,
    public crop: Crop,
    private storage: Storage,
    protected menuCtrl: MenuController,
    protected modalCtrl: ModalController,
    private events: Events,
    private ionicApp: IonicApp,
  ) {

    super(toastCtrl, alertCtrl, translateService, platform, actionSheetCtrl, 
      camera, imagePicker, crop, menuCtrl, modalCtrl, navParams, navCtrl);

    this.cameraOptions.cameraDirection = 0;

    if (this.navParams.get('poll')) {
      this.pollObject = this.processPollObjectDateToDisplay(this.navParams.get('poll'));
      this.isUpdate = true;
      if (this.pollObject.country_ids.length == 0) {
        // WTF: ionic cannot recognize value 'undefined' maps to the display name 'International'
        this.pollCountry = 'International';
      } else {
        if (this.pollObject.country_ids.length == 1) {
          this.pollCountry = this.pollObject.country_ids[0];
        } else {
          this.pollCountry = getListIdByCountryList(this.pollObject.country_ids);
        }
      }
    } else {
      this.pollObject = {
        id: undefined,
        name: undefined,
        description: undefined,
        start_time: this.starTimeDefaultValue,
        end_time: this.endTimeDefaultValue,
        is_live: false,
        // WTF: ionic cannot recognize value 'undefined' maps to the display name 'International'
        country_ids: [],
        topic_ids: [],
        image: undefined,
        promoted: false,
        deleted:false,
        delete_image: false,
        is_adult_only: false,
      };
      this.pollCountry = 'International';
    }

    if (this.navParams.get('questions')) {
      this.questions = this.navParams.get('questions').map(x => {
        return {
          ...x,
          choices: x.choices.map(y => ({...y}))
        }
      });
    } else {
      this.questions = [];
    }

    this.currentGroup = this.navParams.get('group');

    this.translateService.get(['NEW_POLL_FORM_ADD_OPTION', 'NEW_POLL_FORM_ADD_OPTION_MESSAGE',
      'CANCEL', 'CONFIRM', 'ADD_POLL_OPTION_TITLE', 'LOADING_CONTENT', 'GENERAL_ERRROR_TEXT',
      'NEW_POLL_FROM_MSG_ER_REQ_FIELD', 'NEW_POLL_FORM_MSG_ER_TITLE', 'NEW_POLL_FORM_MSG_ER_QUESTIONS',
      'NEW_POLL_FORM_MSG_ER_TEXT_QUESTION', 'NEW_POLL_FORM_MSG_ER_OPTIONS',
      'NEW_POLL_FORM_REMOVE_QUESTION', 'NEW_POLL_FORM_REMOVE_QUESTION_MESSAGE', 'POLL_FORM_MSG_ER_START_TIME',
      'NEW_POLL_FORM_MSG_ER_TEXT_OPTION', 'POLL_FORM_MSG_ER_TIME', 'NEW_POLL_FORM_MSG_ER_TEXT_MAX_OPTION']).subscribe(values => {

        this.addOptionTitle = values['NEW_POLL_FORM_ADD_OPTION'];
        this.addOptionText = values['NEW_POLL_FORM_ADD_OPTION_MESSAGE'];
        this.cancelText = values['CANCEL'];
        this.confirmText = values['CONFIRM'];
        this.titleText = values['ADD_POLL_OPTION_TITLE'];
        this.removeQuestionTitle = values['NEW_POLL_FORM_REMOVE_QUESTION'];
        this.removeQuestionText = values['NEW_POLL_FORM_REMOVE_QUESTION_MESSAGE'];

        this.loadingtext = values['LOADING_CONTENT'];

        this.errorSavingPollText = values['GENERAL_ERRROR_TEXT'];

        this.errorEmptyRequiredFieldMsg = values['NEW_POLL_FROM_MSG_ER_REQ_FIELD'];
        this.errorTitleMsg = values['NEW_POLL_FORM_MSG_ER_TITLE'];
        this.errorQuestionsMsg = values['NEW_POLL_FORM_MSG_ER_QUESTIONS'];
        this.errorQuestionTextMsg = values['NEW_POLL_FORM_MSG_ER_TEXT_QUESTION'];
        this.errorOptionsMsg = values['NEW_POLL_FORM_MSG_ER_OPTIONS'];
        this.errorOptionsTextMsg = values['NEW_POLL_FORM_MSG_ER_TEXT_OPTION'];
        this.errorStartTimeMsg = values['POLL_FORM_MSG_ER_START_TIME'];
        this.errorTimeMsg = values['POLL_FORM_MSG_ER_TIME'];
      });
    
    this.baseInfoProvider.getCountriesLocally().subscribe((countryList) => {
      this.countryList = countryList;

      this.storage.get('USER').then((user) => {
        console.log(user)
        if (!this.isUpdate) {
          this.pollObject.country_ids = [user.country_id];
        }
        if (user.is_admin) {
          // Admin can select all countries, and international.
          this.userIsAdmin = true;
          this.displayCountrySelection = true;
          this.updateTopicList(!this.isUpdate);
        } else if (user.is_celebrity) {
          if (!user.celebrity.country_id) {
            // International celebrity (celebrity with no country_id) can only select the user's country or international
            this.displayCountrySelection = true;
          }
          // Local celebrity (celebrity with country_id) cannot select specific country.
          // Will automatically assign user's country_id to the poll.
          if (!user.country_id) {
            this.baseInfoProvider.getCountryCode().subscribe(country_id => {
              if (!this.isUpdate) {
                this.pollCountry = country_id;
                this.updateTopicList(!this.isUpdate);
              }
              this.countryList = this.countryList.filter((country) => {
                return country.id == country_id || country.id == undefined;
              });
            });
          } else {
            this.updateTopicList(!this.isUpdate);
            this.countryList = this.countryList.filter((country) => {
              return country.id == user.country_id || country.id == undefined;
            });
          }
        }
      });

    });

    this.platform.ready().then(() => {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        // Handle modal dismiss including datepicker
        let activePortal = ionicApp._loadingPortal.getActive() ||
           ionicApp._modalPortal.getActive() ||
           ionicApp._toastPortal.getActive() ||
           ionicApp._overlayPortal.getActive();

        if (activePortal) {
           activePortal.dismiss();
        }
      });
    });
  }

  updateTopicList(clearSelectedTopics:Boolean=true) {
    var country_ids = this.pollObject.country_ids;
    if (country_ids[0] == 'International') {
      country_ids = [];
    }
    if (clearSelectedTopics) {
      this.pollObject.topic_ids = [];
    }
    this.topicsProvider.query({ 'country_ids': country_ids }).subscribe(topicList => this.topicList = topicList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PollFormPage');
  }

  ionViewWillEnter() {
    this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    super.ionViewWillLeave(); 
    this.navCtrl.swipeBackEnabled = true;
    this.unregisterBackButtonAction();
  }

  dismiss() {
    this.appCtrl.getRootNav().setRoot(PollFormPage, { group: this.currentGroup });
  }

  addQuestion() {
    this.questions.push({ id: undefined, title: '', choices: [], ordering: undefined, type: 'selection'});
  }

  removeQuestion(questionIndex: number) {
    let prompt = this.alertCtrl.create({
      title: this.removeQuestionTitle,
      message: this.removeQuestionText,
      buttons: [
        {
          text: this.cancelText,
        },
        {
          text: this.confirmText,
          handler: data => {
            this.questions.splice(questionIndex, 1);
          }
        }
      ]
    });
    prompt.present();
  }

  addQuestionOption(questionIndex: number) {
    let prompt = this.alertCtrl.create({
      title: this.addOptionTitle,
      message: this.addOptionText,
      inputs: [
        {
          name: this.titleText,
          placeholder: this.titleText,
          checked: true
        },
      ],
      buttons: [
        {
          text: this.cancelText,
        },
        {
          text: this.confirmText,
          handler: data => {
            let content = data[Object.keys(data)[0]];
            if (content) {
              let optionObject = { id: undefined, content: data[Object.keys(data)[0]], image_data: undefined, delete_image: false, ordering: undefined, image: undefined }
              this.questions[questionIndex].choices.push(optionObject);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  removeQuestionOption(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].choices.splice(optionIndex, 1);
  }

  submitPollClicked() {
    let message = this.getRequiredFieldErrorMsg();

    if (new Date(this.pollObject.start_time) < new Date(new Date(this.minDate).setHours(0,0,0,0)) && !this.isUpdate) {
      message += this.errorStartTimeMsg + '\n';
    }

    if (new Date(this.pollObject.start_time) > new Date(this.pollObject.end_time)) {
      message += this.errorTimeMsg + '\n';
    }

    //VERIFICAR QUE TODAS LAS PREGUTNAS TENGAN TEXTO
    if (!this.questions || 0 === this.questions.length) {
      message += this.errorQuestionsMsg + '\n';
    } else {
      for (var index = 0; index < this.questions.length; index++) {
        var question = this.questions[index];
        if (!question.title || 0 === question.title.length) {
          message += this.errorQuestionTextMsg + '\n';
          break;
        }
      }

      //VERIFICAR QUE TODAS LSA PREGUTNAS TENGAS OPCIONES CON TEXTO
      for (var index = 0; index < this.questions.length; index++) {
        var question = this.questions[index];
        if (!question.choices || 2 > question.choices.length) {
          message += this.errorOptionsMsg + '\n';
          break;
        }
      }

      let valid = true;
      for (var index = 0; index < this.questions.length; index++) {
        var question = this.questions[index];
        if (question.choices && question.choices.length > 0) {
          for (var y = 0; y < question.choices.length; y++) {
            var option = question.choices[y];
            if (!option || 0 === option.content.length) {
              message += this.errorOptionsTextMsg + '\n';
              valid = false;
              break;
            }
          }
        }
        if (!valid) {
          break;
        }
      }
    }

    if (0 === message.length) {
      this.createOrUpdatePoll()
    } else {
      this.showError(message + ": 1");
    }

  }

  private createOrUpdatePoll() {
    var pollObject = this.processPollObjectDateToISO(this.pollObject);
    if(this.currentGroup) {
      pollObject.group_id = this.currentGroup.id;
    }
    console.log(pollObject);
    var questions = this.questions.map(x => {
        return {
          ...x,
          choices: x.choices.map(y => ({...y}))
        }
      });
    var choiceImages: {
      questionIndex: number;
      choiceIndex: number;
      image: string;
    }[] = [];
    for (var index = 0; index < questions.length; index++) {
      // Update question ordering according to array index
      questions[index].ordering = index + 1;
      for (var choiceIndex = 0; choiceIndex < questions[index].choices.length; choiceIndex++) {
        // Update option ordering according to array index
        questions[index].choices[choiceIndex].ordering = choiceIndex + 1;
        if (questions[index].choices[choiceIndex].image_data) {
          // Store option images to another array
          var image = questions[index].choices[choiceIndex].image_data
          choiceImages.push({
            questionIndex: index,
            choiceIndex: choiceIndex,
            image: image
          });
          delete questions[index].choices[choiceIndex].image_data;
        }
      }
    }

    this.showLoading()
    this.pollProvider.createOrUpdatePoll(pollObject, questions, this.isUpdate)
      .subscribe((result) => {
        console.log('poll updated');
        if (result.errors) {
          this.loading.dismiss();
          this.showError(result.errors + ": 2");
        }
        else {
          console.log('result: ', result);
          this.pollObject = this.processPollObjectDateToDisplay(result.poll);
          this.questions = result.questions;
          if (choiceImages.length > 0 || this.pollImage) {
            this.uploadPollAndChoiceImages(choiceImages, result.poll, result.questions);
          } else {
            this.loading.dismiss();
            this.shouldSkipNextMenuOpen = true;
            if (this.isUpdate) {
              this.pollProvider.getPoll(this.pollObject.id).subscribe((result) => {
                this.events.publish('pollUpdate', result);
              });
              this.navCtrl.pop();
            } else {
              this.navCtrl.pop();
              this.navCtrl.push(PollPage, { poll: this.pollObject });
            }
          }
        }
      },
      () => {
        this.loading.dismiss();
        this.showError(this.errorSavingPollText + ": 3");
      }
    )
  }

  reorderItems(indexes, questionIndex) {
    this.questions[questionIndex].choices = reorderArray(
      this.questions[questionIndex].choices, indexes);
  }

  protected setImage(image: any): void {
    if (this.selectingCoverImage) {
      this.pollImage = image;
      this.selectingCoverImage = false;
    } else {
      this.questions[this.currentQuestionIndex].choices[this.currentOptionIndex].image_data = image;
    }
  }

  imageForOption(questionIndex, optionIndex) {
    this.currentQuestionIndex = questionIndex;
    this.currentOptionIndex = optionIndex;
    this.imageFrom();
  }

  addPollImageClicked() {
    this.selectingCoverImage = true;
    this.imageFrom();
  }

  removeImageForOption(questionIndex, optionIndex) {
    this.questions[questionIndex].choices[optionIndex].delete_image = true;
    this.questions[questionIndex].choices[optionIndex].image_data = undefined;
    this.questions[questionIndex].choices[optionIndex].image = undefined;
  }

  removePollImageClicked() {
    this.pollObject.image = undefined;
    this.pollImage = undefined;
    this.pollObject.delete_image = true;
  }

  removeSelectedTopics() {
    this.pollObject.topic_ids = [];
  }

  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  private getRequiredFieldErrorMsg(): string {
    if (!this.pollObject.name || 0 === this.pollObject.name.length
      || !this.pollObject.start_time || 0 === this.pollObject.start_time.length
      || !this.pollObject.end_time || 0 === this.pollObject.end_time.length) {
      return this.errorEmptyRequiredFieldMsg + '\n';
    } else {
      return '';
    }
  }

  private uploadPollAndChoiceImages(choiceImages: any[], createdPoll: any, createdQuestions: any[]) {
    let sortedQuestions = this.sortQuestionAndChoiceByOrdering(createdQuestions);
    var choiceIdImagePairs: {
      choiceId: string;
      image: string;
    }[] = [];
    for (var index = 0; index < choiceImages.length; index++) {
      var optionImageInfo = choiceImages[index];
      var questionIndex = optionImageInfo.questionIndex;
      var choiceIndex = optionImageInfo.choiceIndex;
      choiceIdImagePairs.push({
        choiceId: sortedQuestions[questionIndex].choices[choiceIndex].id,
        image: optionImageInfo.image
      });
    }
    this.pollProvider.uploadPollImages(this.pollImage, createdPoll.id, choiceIdImagePairs).then((result) => {
      this.loading.dismiss();
      if (this.pollObject.is_live) {
        this.pollProvider.publishPollEvent(this.pollObject.id, 'live_question_update')
      }
      this.shouldSkipNextMenuOpen = true;
      if (this.isUpdate) {
        this.pollProvider.getPoll(this.pollObject.id).subscribe((result) => {
          this.events.publish('pollUpdate', result);
        });
        this.navCtrl.pop();
      } else {
        this.navCtrl.pop();
        this.navCtrl.push(PollPage, { poll: this.pollObject });
      }
    }, (error) => {
      this.loading.dismiss();
      this.showError(this.errorSavingPollText + ": 4");
    });
  }

  private sortQuestionAndChoiceByOrdering(questions: any[]) {
    for(let index = 0; index < questions.length; index++) {
      questions[index].choices = this.sortByOrdering(questions[index].choices);
    }
    return this.sortByOrdering(questions);
  }

  private sortByOrdering(list: any[]) {
    return list.sort((a, b) => { return a.ordering - b.ordering });
  }

  private showLoading() {
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();
  }

  countrySelectDidChange() {
    if (this.pollCountry == 'International') {
      this.pollObject.country_ids = [];
    } else if (this.pollCountry.includes('International')) {
      this.pollObject.country_ids = internationalCountryListMapper[this.pollCountry] || [];
    } else {
      this.pollObject.country_ids = [this.pollCountry];
    }
    this.updateTopicList(true);
  }
  
  onCountrySelectClicked(select) {
    scrollToSelectedItem(select);
  }

  pollTitleOnBlur(event) {
    if (this.firstEdit && !this.isUpdate) {
      if (this.questions.length == 0) {
        this.questions.push(
          { id: undefined, title: this.pollObject.name, choices: [], ordering: undefined, type: 'selection'}
        );
      } else {
        this.questions[0].title = this.pollObject.name;
      }
    }
  }

  questionTitleOnBlur(event) {
    this.firstEdit = false;
  }

  private processPollObjectDateToISO(poll: any): any {
    var newPollObject = Object.assign({}, poll);
    newPollObject.start_time = new Date(new Date(poll.start_time).setHours(0,0,0,0)).toISOString();
    newPollObject.end_time = new Date(new Date(poll.end_time).setHours(0,0,0,0)).toISOString();
    return newPollObject;
  }

  private processPollObjectDateToDisplay(poll: any): any {
    var newPollObject = Object.assign({}, poll);
    newPollObject.start_time = this.toLocalHTMLDate(new Date(poll.start_time));
    newPollObject.end_time = this.toLocalHTMLDate(new Date(poll.end_time));
    return newPollObject;
  }

  private toLocalHTMLDate(date) {
    var dateString = date.getDate().toString();
    dateString = dateString.length > 1 ? dateString : '0' + dateString;
    var monthString = (date.getMonth() + 1).toString();
    monthString = monthString.length > 1 ? monthString : '0' + monthString;
    return date.getFullYear() + '-' + monthString + '-' + dateString;
  }
}
