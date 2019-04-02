import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { MainPage } from '../../pages/pages';

import { UserProvider } from '../../providers/providers';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  showButtons: boolean = false;

  constructor(
    public navCtrl: NavController, 
    private events: Events,
    private storage: Storage,
    private userProvider: UserProvider,
    private platform: Platform
  ) {
    this.storage.ready().then(() => {
      this.storage.get('TOKEN').then((token) => {
        this.registerNotification();
        let gotoPage;
        if(token) {
          gotoPage = MainPage;
        } else {
          gotoPage = LoginPage;
        }
        this.navCtrl.setRoot(gotoPage).then(() => {
          if (gotoPage === MainPage) {
            this.events.publish('mainPageReady');
          }
        })
      });
    });
  }

  private registerNotification() {
    if (this.platform.is('cordova') === false) {
      return;
    }

    this.storage.ready().then(() => {
      this.storage.get('NOTIFICATION_TOKEN').then((deviceToken) => {
        if (deviceToken) {
          this.userProvider.registerNotification(deviceToken)
            .subscribe(() => {
              console.log(`registered device token: ${deviceToken}`);  
            });
        }
      });
    });
  }

}
