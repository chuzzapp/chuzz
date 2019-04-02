import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-chuzz-message',
  templateUrl: 'chuzz-message.html',
})
export class ChuzzMessagePage {

  message: string;
  tab: string;
  page: any;
  extra: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    public appCtrl: App,
    private admobFree: AdMobFree,
    public platform: Platform) {

    let message = navParams.get('message');
    this.tab = this.navParams.get('tab');
    this.page = this.navParams.get('page');
    if (this.page) {
      this.extra = this.navParams.get('extra');
    }

    this.translateService.get([message]).subscribe(values => {
      this.message = values[message];
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChuzzMessagePage');
  }

  ionViewWillLeave() {
    //VERIFICA QUE ESTA CORRIENDO EN UN DISPOSITIVO REAL
    /*if (this.platform.is('cordova')) {
      const bannerConfig: AdMobFreeInterstitialConfig = {
        isTesting: true,
        autoShow: true
      };
      this.admobFree.interstitial.config(bannerConfig);
      this.admobFree.interstitial.prepare()
        .then(() => {
          //
        });
    }*/
  }

  dismiss() {
    let params;
    if (this.page) {
      params = { };
      Object.assign(params, this.extra);
      this.appCtrl.getRootNav().setRoot(this.page, params);
    } else {
      if (!this.tab) {
        this.tab = 'live';
      }
      params = { tab: this.tab };
      this.appCtrl.getRootNav().setRoot(TabsPage, params);
    }
  }

}
