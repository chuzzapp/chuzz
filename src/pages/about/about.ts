import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { TermsPage } from '../terms/terms'
import { PrivacyPage } from '../privacy/privacy'
import { BasePage} from '../base-page'
//import { SOCIAL_SHARE_OPTIONS } from '../../utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { UserProvider } from '../../providers/providers';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: 'something-else',
  segment: 'some-other-path'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage extends BasePage {

  currentAppVersion: string = '1.5.3';
  SOCIAL_SHARE_OPTIONS;
  SHARE_MSG_PART1;
  SHARE_MSG_PART2;
  SHARE_MSG_PART3;
  username: String;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    public translateService: TranslateService,
    protected menuCtrl: MenuController,
    private socialSharing: SocialSharing
  ) {
    super(menuCtrl, navParams, navCtrl);
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.translateService.get(['SHARE_MSG_PART1', 'SHARE_MSG_PART2','SHARE_MSG_PART3']).subscribe((values) => {
        this.SHARE_MSG_PART1 = values['SHARE_MSG_PART1'];
        this.SHARE_MSG_PART2 = values['SHARE_MSG_PART2'];
        this.SHARE_MSG_PART3 = values['SHARE_MSG_PART3'];
    })

      

      this.username = user.username;
      console.log("user", user)
      this.SOCIAL_SHARE_OPTIONS = {
        
        message: `${this.SHARE_MSG_PART1}. \n ${this.SHARE_MSG_PART2} ${this.username} \n ${this.SHARE_MSG_PART3}`,
        subject: 'Chuzz',
        files: ['', ''],
        url: 'http://chuzzapp.com',
        chooserTitle: 'Get the app'
    };
    });


    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  openPageTerms() {
    this.navCtrl.push(TermsPage);
  }

  openPagePrivacy() {
    this.navCtrl.push(PrivacyPage);
  }

  shareButtonClicked() {
    this.socialSharing.shareWithOptions(this.SOCIAL_SHARE_OPTIONS);
  }

}
