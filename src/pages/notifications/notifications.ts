import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { NotificationProvider, MessagesProvider, TimeUtilsProvider } from '../../providers/providers';

import { PollPage } from '../poll/poll';
import { GroupDetailPage } from '../group-detail/group-detail';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications: any[];

  loading: any;
  listSize: number = 0;
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  empyScreenLoadingTitle: string = "";
  empyScreenLoadingText: string = "";
  empyScreenTitleAux: string = "";
  empyScreenTextAux: string = "";
  messageConexionTitle = "";
  messageConexionText = "";

  userId;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public notificationProvider: NotificationProvider,
    public appCtrl: App,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    private storage: Storage,
    private timeUtils: TimeUtilsProvider,
    private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');

    let loadingtext = "";
    this.translateService.get([
      'LOADING_CONTENT', 'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_NOTIFICATIONS_TITLE', 'EMPTY_SCREEN_NOTIFICATIONS_TEXT',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT']).subscribe(values => {
        loadingtext = values['LOADING_CONTENT'];

        this.loading = this.loadingController.create({
          content: loadingtext
        });
        this.loading.present();

        this.empyScreenLoadingTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
        this.empyScreenLoadingText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];
        this.empyScreenTitleAux = values['EMPTY_SCREEN_GROUPS_TITLE'];
        this.empyScreenTextAux = values['EMPTY_SCREEN_GROUPS_TEXT'];

        this.cambiaTituloPantallaVacia(true);

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];
      });

    this.emptyScreenImage = 'assets/img/emptys_screens/ic_no_notifications.png';
  }

  getUserNotifications(callback: Function) {
    this.notificationProvider.getNotificationsForUSer(this.userId).subscribe(notifications => {
      this.notifications = notifications;
      if (this.notifications) {
        this.listSize = this.notifications.length;
      } else {
        this.listSize = 0;
        this.cambiaTituloPantallaVacia();
      }
      if (callback) {
        callback();
      }
    },
      error => {
        console.log(error);
        if (!this.notifications || this.notifications.length === 0) {
          this.listSize = 0;
          this.cambiaTituloPantallaVacia();
        }
        if (callback) {
          callback();
        }
        this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
      });
  }

  ionViewDidEnter() {
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      this.getUserNotifications(() => { this.loading.dismiss(); });
    });
  }

  private cambiaTituloPantallaVacia(loading: boolean = false) {
    if (loading) {
      this.empyScreenTitle = this.empyScreenLoadingTitle;
      this.empyScreenText = this.empyScreenLoadingText;
    } else {
      this.empyScreenTitle = this.empyScreenTitleAux;
      this.empyScreenText = this.empyScreenTextAux;
    }
  }

  doRefresh(refresner) {
    this.cambiaTituloPantallaVacia(true);
    this.getUserNotifications(() => { refresner.complete(); });
  }

  openNotification(notification) {
    let toOpen;
    let parameter;
    switch (notification.type) {
      case "poll":
        toOpen = PollPage;
        parameter = "id";
        break;
      case "group":
        toOpen = GroupDetailPage;
        parameter = "id";
        break;
      case "profile":
        toOpen = ProfilePage;
        parameter = "extUser";
        break;
      default:
        break;
    }

    let object = {};
    object[parameter] = notification.id;

    if (notification.type == "poll") {
      this.appCtrl.getRootNav().setRoot(toOpen, object);
    } else {
      this.navCtrl.push(toOpen, object);
    }
  }

}
