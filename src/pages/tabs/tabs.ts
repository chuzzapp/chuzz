import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { NotificationProvider } from '../../providers/providers';
import { UserProvider } from '../../providers/providers';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
// import { Tab4Root } from '../pages';
import { Tab5Root } from '../pages';
import { Tab7Root } from '../pages';

import { LIVE_TAB } from '../../utils/constants';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  // tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;
  tab7Root: any = Tab7Root;
  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  // tab4Title = " ";
  tab5Title = " ";
  tab7Title = " ";

  live = "live";
  hot = "hot";
  celebrities = "celebrities";
  notifications = "notifications";
  // answered = "answered";
  tabIndex: number = 0;

  notificationsCount: string = "";
  notificationObj: any;
  messageNotificationCount = 0;
  @ViewChild('mainTabs') tabRef: Tabs;

  tab: any;

  userId;
  phone: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    public notificationProvider: NotificationProvider,
    private storage: Storage,
    private statusBar: StatusBar,
    private userProvider: UserProvider
  ) {
    this.statusBar.styleLightContent();    

    this.tab = this.navParams.get('tab');
    if (this.tab) {
      if (this.tab === 'group') {
        this.tabIndex = 3;
      }
    }

  

  }

  resetNotifications() {
    this.notificationProvider.resetNotificationForUSer(this.userId);
    this.notificationsCount = "";
  }

  private getNotificationCount() {
    this.notificationProvider.getNotificationCountForUSer(this.userId)
      .subscribe(resp => {
        this.notificationObj = resp;
        if (this.notificationObj) {
          this.notificationsCount = this.notificationObj.count
          if (this.notificationsCount == "0") {
            this.notificationsCount = "";
          }
        }
      });
  }

  ionViewDidLoad() {
    if (this.navParams.get('phone')) {
       this.phone = this.navParams.get('phone');
      console.log("SE PASO EL TLFN Y ES", this.phone);
      this.userProvider.getCachedCurrentUser().then((user) => {
        this.userId = user.id;
        this.userProvider.actuserphone(this.userId, this.phone);
      });
    }
    this.translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE', 'TAB4_TITLE', 'TAB5_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
      // this.tab4Title = values['TAB4_TITLE'];
      this.tab5Title = values['TAB5_TITLE'];

      this.userProvider.getCachedCurrentUser().then((user) => {
        this.userId = user.id;
        // this.getNotificationCount()
      });
    });
  }

}

