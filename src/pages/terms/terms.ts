import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { Item } from '../../models/item';

import { TermsProvider } from '../../providers/terms/terms';
import { BasePage} from '../base-page'

/**
 * Generated class for the TermsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage extends BasePage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    protected menuCtrl: MenuController
  ) {
    super(menuCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
