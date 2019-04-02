import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers/providers';
import { BasePage } from '../base-page';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage extends BasePage {
  pageTitle: string = 'SETTINGS_TITLE';

  settings;
  userId: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public userProvider: UserProvider,
    protected menuCtrl: MenuController
  ) {
    super(menuCtrl, navParams, navCtrl);
    this.userProvider.getNotificationSettings().subscribe(settings => {
      this.settings = settings;
    });
  }

  onSettingChanged() {
    this.userProvider.updateNotificationSettings(this.settings).subscribe(settings => {
      this.settings = settings;
    });
  }
}
