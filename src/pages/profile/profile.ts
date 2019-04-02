import { Component } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams,
  ViewController, LoadingController,
  ToastController, MenuController, Events, Platform, ModalController,
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { UserProvider, PollProvider, MessagesProvider } from '../../providers/providers';

import { ProfilePollsPage } from '../profile-polls/profile-polls';
import { TabsPage } from '../tabs/tabs';
import { ProfileFormPage } from '../profile-form/profile-form';
import { PollPage } from '../poll/poll';
import { PollListPage } from '../poll-list/poll-list';
import { FirstRunPage } from '../pages';
import { UserRankingPage } from '../user-ranking/user-ranking';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { MasonryLayoutPage } from '../layout/masonry-layout';
import { SOCIAL_SHARE_OPTIONS } from '../../utils/constants';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SelectSearchableComponent } from 'ionic-select-searchable';
declare var SMS: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends MasonryLayoutPage {

  user = {
    id: 0,
    username: "",
    display_name: "",
    thumbnail: "",
    country: "",
    email: "",
    gender: "",
    phone_number: "",
    birthdate: "",
    sex_preference: "",
    answers_count: 0,
    groups_count: 0,
    favorites_count: 0,
    group_id: 1,
    image: "",
    group_admin: false,
    polls_count: 0,
    followers_count: 0,
    following_count: 0
  }
  extUserId;
  userId;
  actualUserId;
  idCreator;
  celebrity: boolean = false;

  listaContactos:any[]=[];
  avatar:string="./assets/icon/avatar.png";
 
  loading: any;
  loadingtext = "";
  messages: any = [];
  findcoupon: any = [];
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  empyScreenLoadingTitle: string = "";
  empyScreenLoadingText: string = "";
  empyScreenTitleAux: string = "";
  empyScreenTextAux: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  followSuccessMsg = "";
  linkedFacebook: boolean;
  chuzz: any;
  listSize: number = 0;
  gridAux: string = "";
  
  following: boolean = false;
  followText = "";
  followingText = "";
  followBottontext = "";
  profilePlaceholderImage = "assets/img/profile_placeholder.png";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public appCtrl: App,
    private viewCtrl: ViewController,
    private userProvider: UserProvider,
    public loadingController: LoadingController,
    public pollProvider: PollProvider,
    public msgsProvider: MessagesProvider,
    public translateService: TranslateService,
    public toastCtrl: ToastController,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    protected menuCtrl: MenuController,
    private events: Events,
    private socialSharing: SocialSharing,
    private contacts:Contacts, 
    private modalCtrl:ModalController
  ) {
    super(menuCtrl, navParams, navCtrl);
    this.gridAux = "profile";

    this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";

    this.translateService.get([
      'LOADING_CONTENT', 'EMPTY_SCREEN_EVENTS_TITLE', 'EMPTY_SCREEN_EVENTS_TEXT',
      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT', 'PROFILE_FOLLOW_SUCCESS_MSG',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT',
      'PROFILE_FOLLOW_BOTTON', 'PROFILE_FOLLOWING_BOTTON']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];
        this.loading = this.loadingController.create({
          content: this.loadingtext
        });
        this.loading.present();

        this.empyScreenLoadingTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
        this.empyScreenLoadingText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];
        this.empyScreenTitleAux = values['EMPTY_SCREEN_EVENTS_TITLE'];
        this.empyScreenTextAux = values['EMPTY_SCREEN_EVENTS_TEXT'];

        this.cambiaTituloPantallaVacia(true);

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

        this.followSuccessMsg = values['PROFILE_FOLLOW_SUCCESS_MSG'];

        this.followText = values['PROFILE_FOLLOW_BOTTON'];
        this.followingText = values['PROFILE_FOLLOWING_BOTTON'];

        this.followBottontext = this.followText;
         });
    
    let contador = 2;
    /**
     *  this.userProvider.getReferenceFound('id-kl3q9').then(record => {
      console.log("reference",record)
      record.map(r =>{
        console.log("id del reference", r._id)
        console.log("id del que creo",r.createdBy)
      })
    });
    this.userProvider.getCachedCurrentUser().then((u) => {
      this.actualUserId = u.id;
      console.log("user id actual", this.actualUserId)
    });
     */
  
    console.log("ID USUARIO = ", this.navParams.get('extUser'));
    if (this.navParams.get('extUser')) {
      this.extUserId = this.navParams.get('extUser');

      this.userProvider.getUser(this.extUserId).subscribe(user => {
        if (user.deleted) {
          this.doLogout();
          return;
        }
        this.user = user;
        if (user.is_celebrity) {
          this.celebrity = true;
          this.user.polls_count = this.changeBigNumber(this.user.polls_count);
          this.user.followers_count = this.changeBigNumber(this.user.followers_count);
          this.user.following_count = this.changeBigNumber(this.user.following_count);
        }
      });
    } else {
      this.extUserId = undefined;
      this.userProvider.getCurrentUser().subscribe((user) => {
        this.user = user;
      });
    }

    this.events.subscribe('userProfileUpdated', (user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ionViewDidEnter() {
    /*
    if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
      if (this.platform.is('android')) {
        this.checkPermission();
      }
     
    }*/
    super.ionViewDidEnter();
    this.getChuzz(0, () => this.loading.dismiss());
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

  private changeBigNumber(number) {
    if (number + 0 > 1000) {
      let numStr = number.toString();
      return numStr.slice(0, 1) + '.' + numStr.slice(1, 2) + 'K';
    } else {
      return number;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  openAnsweredPollListPage() {
    this.navCtrl.push(PollListPage, { category: 'answered', userId: this.user.id });
  }

  openCreatedPollListPage() {
    this.navCtrl.push(PollListPage, { category: 'created', userId: this.user.id });
  }

  profilePolls() {
    this.navCtrl.push(ProfilePollsPage, { user: this.user, answered: true });
  }

  openGroupPage() {
    this.navCtrl.setRoot(TabsPage, { tab: 'group' });
  }

  openLikes() {
    this.navCtrl.push(ProfilePollsPage, { user: this.user, likes: true });
  }
  openLogros() {

    this.navCtrl.setRoot(UserRankingPage);
  }

  edit() {
    this.navCtrl.push(ProfileFormPage, { user: { ...this.user } });
  }


  private getChuzz(last: number = 0, callback: Function) {
    let newparams = { from_id: this.user.id };
    if (last > 0) {
      newparams["last"] = last;
    }
    this.pollProvider.query(newparams)
      .subscribe(chuzz => {
        if (chuzz && chuzz.length > 0) {
          if (last > 0) {
            this.chuzz = this.chuzz.concat(chuzz);
          } else {
            this.chuzz = chuzz;
          }
          this.listSize = this.chuzz.length;
        } else {
          this.listSize = 0;
          this.cambiaTituloPantallaVacia();
        }
        if (callback) {
          callback();
        }
        this.masonrisar('.grid-' + this.gridAux, '.grid-' + this.gridAux + '-item');
      },
        error => {
          if (!this.chuzz || this.chuzz.length === 0) {
            this.listSize = 0;
            this.cambiaTituloPantallaVacia();
          }

          this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
          if (callback) {
            callback();
          }
        });
  }

  openChuzz(poll) {
    this.appCtrl.getRootNav().setRoot(PollPage, { poll: poll });
  }

  doRefresh(refresner) {
    this.cambiaTituloPantallaVacia(true);
    this.getChuzz(0, () => refresner.complete());
  }

  doInfinite(infiniteScroll) {
    let lastId = this.chuzz[this.chuzz.length - 1].id;
    this.getChuzz(lastId, () => infiniteScroll.complete());
  }

  public timeSince(dateStr) {
    let date = new Date(dateStr);
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + "mon";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }

  followCelebrity() {
    if (!this.following) {
      this.userProvider.getCachedCurrentUser().then(user => {
        this.userProvider.follow(user.id, this.extUserId).subscribe(() => {
          let toast = this.toastCtrl.create({
            message: this.followSuccessMsg + " " + this.user.display_name,
            duration: 3000
          });
          toast.present();
          this.followBottontext = this.followingText;
          this.following = true;
        });
      });
    }
  }

  toGenderLabel(value) {
    if (value) {
      return `GENDER_${value.toUpperCase()}`;
    } else {
      return "";
    }
  }

  doLogout() {
    this.userProvider.unregisterNotification().subscribe(
      () => { console.log('unregisterNotification end') },
      (e) => { console.log(e) });

    this.userProvider.clearUserAndToken(() => {
      this.events.publish('userProfileUpdated', undefined);
      this.navCtrl.setRoot(FirstRunPage);
    });
  }

  shareButtonClicked() {
    this.socialSharing.shareWithOptions(SOCIAL_SHARE_OPTIONS);
  }
  /*
     checkPermission() {
    this.androidPermissions.checkPermission
      (this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {

          //if permission granted
          this.ReadSMSList();
        },
        err => {

          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.READ_SMS).
            then(success => {
              this.ReadSMSList();
            },
              err => {
                //alert("cancelled")
                console.log("cancelled")
              });
        });

    this.androidPermissions.requestPermissions
      ([this.androidPermissions.PERMISSION.READ_SMS]);

  }*/
   
/*
  ReadSMSList() {

    this.platform.ready().then((readySource) => {

      let filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom: 0, // start from index 0
        maxCount: 20, // count of SMS to return each time
      };

      if (SMS) SMS.listSMS(filter, (ListSms) => {
        this.messages = ListSms;
        var result = ListSms.map(a => a.body);
        var StringCompare = 'id-';
        var arrayLength = result.length;
        for (var i = 0; i < arrayLength; i++) {
          console.log(result[i]);
          var firstString = result[i].substr(0, 8);
          var secondString = firstString.substr(0, 3);

          //alert(secondString)
          if (secondString === StringCompare) {
            //alert(firstString)
            this.userProvider.getReferenceFound(firstString).then(record => {
              console.log("reference", record)
              record.map(r => {
                console.log("Este es el id del coupon encontrado en el mensaje", r._id)
                //alert(r._id)
                console.log("Este es al usuario que se le sumará uno", r.createdBy)
                this.idCreator = r.createdBy;
                //alert(r.createdBy)
                this.userProvider.getCachedCurrentUser().then((u) => {
                  this.actualUserId = u.id;
                  //alert(this.actualUserId)
                  this.userProvider.actReferenceFound(u.id, r._id);
                 
                });
                this.userProvider.getUserSky(this.idCreator).then((k) => {

                  k.map(f => {
                   


                    f.referred_users_count++;

                    this.userProvider.actReferenceCount(this.idCreator, f.referred_users_count);
                    alert(f.referred_users_count)
                  }

                  )

                });
              })


            }
            )
          } else {
            // alert("You dont have a coupont yet");
          }
          //Do something
        }
      },

        Error => {
          //alert(JSON.stringify(Error))
          console.log(JSON.stringify(Error))
        });

    });
  }*/
}
