import { Component, ElementRef, ViewChild } from '@angular/core';
import { 
  IonicPage, NavController, NavParams, LoadingController,
  MenuController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { AlertController } from 'ionic-angular';

import { TopicsProvider } from  '../../providers/providers';
import { UserProvider } from '../../providers/providers';
import { IonicImageLoader } from 'ionic-image-loader';

import { Item } from '../../models/item';

import { MainPage } from '../../pages/pages';
import { BasePage } from '../base-page';


@IonicPage()
@Component({
  selector: 'page-topics',
  templateUrl: 'topics.html',
})
export class TopicsPage extends BasePage {
  defaultImage = "assets/img/extras/img_noticias.jpg"
  assetsUrl = this.topicsProvider.api.url + "/assets/";
  firtslogin: boolean = false;
  welcomeAlertTitle = " ";
  welcomeAlertText = " ";
  topics: {name: string, id: string, image_id: string}[] = [];
  topicsSelected: {name: string, id: string, image_id: string}[] = [];
  @ViewChild('confirmButton') confirmButton:ElementRef;
  loading: any;
  emptyScreenImage: string;
  empyScreenTitle: string  = "";
  empyScreenText: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  errorText = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public translateService: TranslateService,
    public loadingController: LoadingController,
    public topicsProvider: TopicsProvider,
    private userProvider: UserProvider,
    private statusBar: StatusBar,
    private storage: Storage,
    protected menuCtrl: MenuController
  ) {
    super(menuCtrl, navParams, navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopicsPage');

    this.emptyScreenImage = "assets/img/logos/img-logo-secondary.png";

    let loadingtext = "";
    this.translateService.get([
      'TOPICS_WELCOME_ALERT_TITLE', 'TOPICS_WELCOME_ALERT_TEXTt', 'LOADING_CONTENT',
      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT', 'GENERAL_ERRROR_TEXT',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT']).subscribe(values => {
      console.log('Loaded values', values);

      this.loading = this.loadingController.create({
        content: values['LOADING_CONTENT']
      });

      this.errorText = values['GENERAL_ERRROR_TEXT'];


      this.empyScreenTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
      this.empyScreenText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];

      this.welcomeAlertTitle = values['TOPICS_WELCOME_ALERT_TITLE'];
      this.welcomeAlertText = values['TOPICS_WELCOME_ALERT_TEXTt'];

      this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
      this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

      this.userProvider.getCachedCurrentUser().then((user) => {
        this.topicsProvider.query({ 'country_ids': [user.country_id] }).subscribe(topics => {
          this.topics = topics;

          if (this.topics) {
            this.topicsProvider.currentFollow().subscribe(topicsSelected => {
                this.topicsSelected = topicsSelected;
                
                if (this.topicsSelected.length == 0) {
                  this.topicsSelected = this.topics; 
                  this.firtslogin = true;
                  console.log('topicsSelected: ', topicsSelected);
                  this.showAlert(this.welcomeAlertTitle, this.welcomeAlertText);
                }
               /* console.log('topicsSelected: ', topicsSelected);
                if (!this.topicsSelected || this.topicsSelected.length == 0) {
                  this.showAlert(this.welcomeAlertTitle, this.welcomeAlertText);
                }*/
            }, () => {
              this.empyScreenTitle = this.errorText;
              this.showAlert(this.messageConexionTitle, this.messageConexionText);
            });


          }
        }, () => {
          this.empyScreenTitle = this.errorText;
          this.showAlert(this.messageConexionTitle, this.messageConexionText);
        });
      });

    });

  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.statusBar.styleLightContent();
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  toggleTopicSelection(topicClick: any, topicCard) {
    let pos = this.indexOfTopicSelected(topicClick);

    if (pos == -1) {
      console.log('push');
      this.topicsSelected.push(topicClick);
    } else {
      if (this.firtslogin == true) {
       //do nothing
      } else {
          console.log('splice');
          this.topicsSelected.splice(pos, 1);
      }
    }
  }

  indexOfTopicSelected(topic: any): number {
    return this.topicsSelected.map(x => x.id).indexOf(topic.id);
  }

  confirmTopics() {
    var selectedTopicIds = this.topicsSelected.map(topic => topic['id']);
    this.topicsProvider.follow(selectedTopicIds).subscribe((result) => {
      this.storage.set("SELECTED_TOPICS", result);
      this.navCtrl.setRoot(MainPage);
    },
      (error) => {
        let alert = this.alertCtrl.create({
          subTitle: error,
          buttons: ['OK']
        });
        alert.present();
      });
  }
  confirmTopicsa(listopic:any) {
    var selectedTopicIds2 = this.topics.map(topic => topic['id']);
    this.topicsProvider.follow(selectedTopicIds2).subscribe((result) => {
      this.storage.set("SELECTED_TOPICS", result);
    },
      (error) => {
        console.log(error)
        /*let alert = this.alertCtrl.create({
          subTitle: error,
          buttons: ['OK']
        });*/
        //alert.present();
      });
  }
}
