import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CelebrityListPage } from '../celebrity-list/celebrity-list';
import { SOCIAL_SHARE_OPTIONS } from '../../utils/constants';
import { UserProvider } from '../../providers/providers';
import {ReferredPage} from '../referred/referred';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-chuzz-header',
  templateUrl: 'chuzz-header.html',
})
export class ChuzzHeaderPage {

  @Input('showSearchButton') showSearchButton: boolean = false;
  @Input('showShareButton') showShareButton: boolean = false;
  @Input('showAddButton') showAddButton?: boolean = false;

  @Output() added = new EventEmitter<boolean>();
  userId;
  SOCIAL_SHARE_OPTIONS;
  username: String;
  str;
  SHARE_MSG_PART1;
  SHARE_MSG_PART2;
  SHARE_MSG_PART3;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    public translateService: TranslateService,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing) {
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
    console.log('ionViewDidLoad ChuzzHeaderPage');
    
  }

  addItem() {
    this.navCtrl.push(CelebrityListPage);
  }

  shareButtonClicked() {
    this.socialSharing.shareWithOptions(this.SOCIAL_SHARE_OPTIONS);
  }
 /**
     * 
  uniqueName() {
      this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      console.log("actual user", this.userId)
      var uniqueId = function () {
        return 'id-' + Math.random().toString(36).substr(2, 5);
      };
      var d = new Date();
      console.log(d.toJSON());
      console.log("Name generado", uniqueId())
      var name = uniqueId();

      this.userProvider.setRefererCoupon(name);
      var tomensaje = `${name} download the app `;
      console.log("mensaje a compartir : ", tomensaje)
      //this.socialSharing.shareVia('sms', mensaje,null,null,'http://chuzzapp.com');
      //this.socialSharing.canShareVia('sms', mensaje, null,null,'http://chuzzapp.com');
      //this.socialSharing.shareWithOptions(SOCIAL_SHARE_OPTIONS);
      

    });
     
    var uniqueId = function () {
      return 'id-' + Math.random().toString(36).substr(2, 5);
    };
    var name = uniqueId();
    var tomensaje = `${name} download the app http://chuzzapp.com`;
    this.userProvider.setRefererCoupon(name);
    this.socialSharing.shareViaSMS(tomensaje,null)
    .then(function(result) {
      //this.userProvider.setRefererCoupon(name);
    }, function(err) {
      console.log('error', err)
    });
  }
  smsShare(mensaje) {
    this.socialSharing.canShareVia('sms', mensaje, null, null, 'http://chuzzapp.com');
  }


  addButton() {
    this.added.emit(true);
  }
  presentProfileModal() {
    let profileModal = this.modalCtrl.create(ReferredPage, { userId: 8675309 });
    profileModal.present();
  }
  presentModal() {
    const modal = this.modalCtrl.create(ReferredPage);
    modal.present();
  }
  */
}


