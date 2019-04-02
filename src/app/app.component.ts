import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirstRunPage } from '../pages/pages';
import { AboutPage } from '../pages/about/about';
import { PollListPage } from '../pages/poll-list/poll-list';

import { TranslateService } from '@ngx-translate/core'
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { UserProvider } from '../providers/providers';
//import { Deeplinks } from '@ionic-native/deeplinks';

import { ENV } from '@environment';

@Component({
  template: '<page-menu>'
})
export class MyApp {
  rootPage = FirstRunPage;
  pushObject: PushObject;
  sender_id: string = ENV.SENDER_ID;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private push: Push,
    private userProvider: UserProvider,
    public alertCtrl: AlertController,
    private events: Events
    , //protected deeplinks: Deeplinks
  
  ) {

    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        return;
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.setupPushNotification();
    });
   
      
    
    

    this.initTranslate();

    this.initCurrentUser();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  setupPushNotification() {
    const options: PushOptions = {
      android: {
        'senderID': this.sender_id,
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    this.pushObject = this.push.init(options);

    this.push.hasPermission().then((result) => {
      if (!result.isEnabled) {
        console.log("Don't have permission for push notification");
      }
    });

    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification');
      if (notification.additionalData.foreground === false) { 
        console.log(notification.additionalData.poll_id);
        this.storage.ready().then(() => {
          this.storage.get('TOKEN').then((token) => {
            if (token) {
              console.log('token ready, send openPollForNotification');
              this.events.publish('openPollForNotification', notification.additionalData.poll_id);
            }
          });
        });
      }
    });

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration.registrationId);
      this.storage.ready().then(() => {
        this.storage.set("NOTIFICATION_TOKEN", registration.registrationId);
      });
    });

    this.pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private initCurrentUser() {
    this.storage.ready().then(() => {
      console.log('Storage ready');

      this.storage.get("TOKEN").then((token) => {
        if (token) {
          this.userProvider.getCurrentUser().toPromise()
            .then((user) => {
              console.log("User loaded");
              this.storage.set("USER", user);
              this.events.publish('userProfileUpdated', user);
            })
            .catch(() => {
              this.storage.clear();
            });
        }
      });
    });
  }

}
