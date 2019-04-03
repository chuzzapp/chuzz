import { Component, ViewChild } from '@angular/core';
import { Nav, Events, Platform, MenuController, IonicApp } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { AboutPage } from '../about/about';
import { TopicsPage } from '../topics/topics';
import { SettingsPage } from '../settings/settings';
import { ProfilePage } from '../profile/profile';
import { PollFormPage } from '../poll-form/poll-form';
import { PollPage } from '../poll/poll';
import { PollListPage} from '../poll-list/poll-list';
import { TutorialPage} from '../tutorial/tutorial';
import {UserRankingPage} from '../user-ranking/user-ranking';

import { FirstRunPage } from '../pages';
import { UserProvider } from '../../providers/providers';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FirstRunPage;
  user: any;
  showCreatePollMenu: Boolean = false;
  showPollDraftListMenu: Boolean = false;
  profilePlaceholderImage = "assets/img/profile_placeholder.png";
  platformweb: Boolean = false;

  constructor(
    private storage: Storage,
    private userProvider: UserProvider, 
    private statusBar: StatusBar,
    private platform: Platform,
    private menuCtrl: MenuController,
    private ionicApp: IonicApp,
    private events: Events) {

    this.storage.ready().then(() => {
      this.storage.get('TOKEN').then((token) => {
        if (token) {
          this.userProvider.getCachedCurrentUser().then((user) => {
            this.updateView(user);
          });
        }  
      });
    });
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.platformweb = true;
    } else  {
      this.platformweb = false;
    }
    this.platform.ready().then(() => {
    
      // WTF: https://issues.apache.org/jira/browse/CB-12277
      this.platform.registerBackButtonAction(() => {
        // Handle modal dismiss including datepicker
        let activePortal = ionicApp._loadingPortal.getActive() ||
           ionicApp._modalPortal.getActive() ||
           ionicApp._toastPortal.getActive() ||
           ionicApp._overlayPortal.getActive();

        if (activePortal) {
           activePortal.dismiss();
        } else if (this.menuCtrl.isOpen()) {
          this.menuCtrl.close();
        } else if(this.nav.canGoBack()){
          this.nav.pop();
        }
      });
    });

    this.events.subscribe('userLoggedIn', (user) => {
      this.updateView(user);
    });
    
    this.events.subscribe('userProfileUpdated', (user) => {
      this.updateView(user);
    });

    this.events.subscribe('openPollForNotification', (pollId) => {
      this.nav.push(PollPage, {id: pollId});
    });

    this.events.subscribe('mainPageReady', () => {
      const checkMenuTimer = setInterval(() => {
        if (this.menuCtrl.get()) {
          this.menuCtrl.enable(true);
          clearInterval(checkMenuTimer);
        }
      }, 500);
    });
  }

  private updateView(user) {
    if (user) {
      if (user.deleted) {
        this.userProvider.unregisterNotification().subscribe(
        () => { console.log('unregisterNotification end') },
        (e) => { console.log(e) });

        this.userProvider.clearUserAndToken(() => {
          this.nav.setRoot(FirstRunPage);
        });
        return;
      }

      this.user = user;
      this.showCreatePollMenu = user.is_admin || user.is_celebrity || user.is_writer;
      this.showPollDraftListMenu = user.is_admin || user.is_writer;
    } else {
      this.user = undefined;
      this.showCreatePollMenu = false;
      this.showPollDraftListMenu = false;
    }
  }

  openAboutPageClicked() {
    this.nav.push(AboutPage, {fromMenu: true});
  }
  openLogros() {
    
    this.nav.push(UserRankingPage, {fromMenu: true});
  }


  openTopicsPageClicked() {
    this.nav.push(TopicsPage, {fromMenu: true});
  }

  openSettingNotificationsPageClicked() {
    this.nav.push(SettingsPage, {fromMenu: true});
  }

  openProfilePageClicked() {
    this.nav.push(ProfilePage, {fromMenu: true});
  }

  openAddPollPageClicked() {
    this.nav.push(PollFormPage, {fromMenu: true});
  }

  openDraftPollListPage() {
    this.nav.push(PollListPage, { category: 'drafts'});
  }
  openTutorial() {
    this.nav.push(TutorialPage);
  }
  menuOpened() {
    this.nav.popToRoot();
  }

  menuClosed() {
  }
}

