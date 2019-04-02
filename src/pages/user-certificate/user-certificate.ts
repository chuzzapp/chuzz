import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers/providers';

import { TopicsPage } from '../topics/topics';
import { BasePage } from '../base-page';

@IonicPage()
@Component({
  selector: 'page-user-certificate',
  templateUrl: 'user-certificate.html',
})
export class UserCertificatePage extends BasePage {

  user;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage,
    private userProvider: UserProvider,
    private statusBar: StatusBar,
    protected menuCtrl: MenuController
  ) {
    super(menuCtrl);
    this.statusBar.styleDefault();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCertificatePage');
    this.userProvider.getCurrentUser().subscribe(user => this.user = user);
  }

  jump() {
    this.navCtrl.setRoot(TopicsPage);
  }

  share() {
    console.log("Not define function");
  }

}
