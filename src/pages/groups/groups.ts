import { Component, group } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams, LoadingController,
  MenuController,
  AlertController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { GroupProvider, MessagesProvider, UserProvider } from '../../providers/providers';

import { GroupDetailPage } from '../group-detail/group-detail';
import { AddGroupPage } from '../add-group/add-group';

import { MasonryLayoutPage } from '../layout/masonry-layout';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig  } from '@ionic-native/admob-free';



@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage extends MasonryLayoutPage {

  groups: any[];
  loading: any;
  listSize: number = 0;
  emptyScreenImage: string;
  emptyScreenTitle: string = "";
  emptyScreenText: string = "";
  emptyScreenLoadingTitle: string = "";
  emptyScreenLoadingText: string = "";
  emptyScreenTitleAux: string = "";
  emptyScreenTextAux: string = "";
  deletingMessage: string = "";
  deleteMessage:string = "";
  titleDeleteGroup:string = "";
  cancelText:string = "";
  deleteText:string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  GroupPlaceholderImage = "assets/img/emptys_screens/ic_no_friends.png";

  userId;

  metadata : any;
  records : any;
  users: any;
  get isMainPage() {
    return true;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupProvider: GroupProvider,
    public appCtrl: App,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    private storage: Storage,
    private userProvider: UserProvider,
    protected menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private admobFree: AdMobFree
  ) {

    super(menuCtrl);

    let loadingtext = "";
    /* Temporarily disable group features */
    this.translateService.get([
      'LOADING_CONTENT', 'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_GROUPS_TITLE', 'EMPTY_SCREEN_GROUPS_TEXT',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT','DELETE_MESSAGE', 'DELETING_MESSAGE', 'TITLE_DELETE_GROUP','CANCEL','DELETE']).subscribe(values => {
        loadingtext = values['LOADING_CONTENT'];

        this.loading = this.loadingController.create({
          content: loadingtext
        });
        this.loading.present();

        this.emptyScreenLoadingTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
        this.emptyScreenLoadingText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];
        this.emptyScreenTitleAux = values['EMPTY_SCREEN_GROUPS_TITLE'];
        this.emptyScreenTextAux = values['EMPTY_SCREEN_GROUPS_TEXT'];
        this.deleteMessage = values['DELETE_MESSAGE'];
        this.deletingMessage = values['DELETING_MESSAGE'];
        this.titleDeleteGroup = values['TITLE_DELETE_GROUP'];
        this.deleteText = values['DELETE'];
        this.cancelText = values['CANCEL'];
        this.cambiaTituloPantallaVacia(true);

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];
      });
    

    this.emptyScreenImage = 'assets/img/emptys_screens/ic_no_friends.png';

  }

  private cambiaTituloPantallaVacia(loading: boolean = false) {
    if (loading) {
      this.emptyScreenTitle = this.emptyScreenLoadingTitle;
      this.emptyScreenText = this.emptyScreenLoadingText;
    } else {
      this.emptyScreenTitle = this.emptyScreenTitleAux;
      this.emptyScreenText = this.emptyScreenTextAux;
    }
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    /* Temporarily disable group features */
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      console.log("user", user)
      this.getUserGroups(() => { this.loading.dismiss(); });
    });
  }
  
  private getUserGroups(callback: Function) {
    this.groupProvider.getUserGroups(this.userId).subscribe(groups => {
      this.groups = groups.data;
      console.log("grupo data", groups.data)
      if (this.groups) {
        this.listSize = this.groups.length;
      } else {
        this.listSize = 0;
        this.cambiaTituloPantallaVacia();
      }
      if (callback) {
        callback();
      }
      this.masonrisar('.grid-group', '.grid-group-item');
      this.addAdminToGroups()
    },
      error => {
        if (!this.groups || this.groups.length === 0) {
          this.listSize = 0;
          this.cambiaTituloPantallaVacia();
        }
        if (callback) {
          callback();
        }
       //this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
      });
  }

  addAdminToGroups(){
    for(let group of this.groups){
      this.groupProvider.getGroupMembers(group.id).subscribe((members = []) => {
        group.isUserAdmin = members.find(member => this.userId === member.user_id && member.is_administrator) ? true : false
      })
    }
  }

  openGroupPage(group) {
    this.appCtrl.getRootNav().setRoot(GroupDetailPage, { group: group });
  }

  addGroup() {
    this.appCtrl.getRootNav().setRoot(AddGroupPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
    
    this.userProvider.getMetadata()
      .subscribe((metadata) => {
        this.metadata = metadata; 
      });
     
  }

  doRefresh(refresner) {
    this.cambiaTituloPantallaVacia(true);
    this.getUserGroups(() => { refresner.complete(); });
  }

  toggleNotification(group) {
    this.groupProvider.togglenotificationForGroup(group.id, this.userId)
      .subscribe(group => {
        for (var index = 0; index < this.groups.length; index++) {
          var c = this.groups[index];
          if (c.id == group.id) {
            this.groups[index] = group;
            break;
          }
        }
      });
  }

  toggleStar(group) {
    this.groupProvider.toggleStarGroup(group.id, this.userId)
      .subscribe(group => {
        for (var index = 0; index < this.groups.length; index++) {
          var c = this.groups[index];
          if (c.id == group.id) {
            this.groups[index] = group;
            break;
          }
        }
      });
  }

  onInterestedButtonClicked() {
    const payload = {
      ...this.metadata,
      is_interested_in_group: true,
    };

    this.userProvider.updateMetadata(payload)
      .subscribe((metadata) => {
        this.metadata = metadata;
      });
  }

  onGroupDeleteClick(group){

    const prompt = this.alertCtrl.create({
      title: this.titleDeleteGroup,
      message: this.deleteMessage+group.name,
      buttons: [
        {
          text: this.cancelText,
          handler: data => {
          }
        },
        {
          text: this.deleteText,
          handler: data => {
            this.onDeleteGroup(group)
          }
        }
      ]
    })
    prompt.present()
  }

  onDeleteGroup(group){
    //remove group
    const loader = this.loadingController.create({
      content: this.deletingMessage,
    });
    loader.present();
    this.groupProvider.deleteGroup(group.id).toPromise().then(() => {
      this.groups = this.groups.filter(g => g.id !== group.id)
      loader.dismiss()
    }).catch(error => {
      console.log("Error deleting group", error)
      loader.dismiss()
    })

  }
  showbanner(){
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: '/6499/example/banner',
      isTesting: false,
      autoShow: true
     };
     this.admobFree.banner.config(bannerConfig);
     
     this.admobFree.banner.prepare()
       .then(() => {
         // banner Ad is ready
         // if we set autoShow to false, then we will need to call the show method here
       })
       .catch(e => console.log(e));

  }
  launchInterstitial() {
    
           let interstitialConfig: AdMobFreeInterstitialConfig = {
               isTesting: false, // Remove in production
               autoShow: true,
               id: '/6499/example/interstitial'
           };
    
           this.admobFree.interstitial.config(interstitialConfig);
    
           this.admobFree.interstitial.prepare().then(() => {
               // success
           });
    
       }

}
