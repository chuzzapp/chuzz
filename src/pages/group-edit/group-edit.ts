import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ModalController,
  ToastController, LoadingController, App, AlertController,
  Platform, ActionSheetController, MenuController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

import { GroupProvider } from '../../providers/providers';

import { AddGroupMemberPage } from '../add-group-member/add-group-member';
import { ChuzzMessagePage } from '../chuzz-message/chuzz-message';
import { TabsPage } from '../tabs/tabs';
import { ImagePage } from '../image-page';



@IonicPage()
@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html',
})
export class GroupEditPage extends ImagePage {

  groupObject;
  loadingtext: string;
  loading: any;

  errorTitleMsg = '';
  errorEmptyGroup = '';
  errorSavingGroupText = ''
  imageChenged: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    protected modalCtrl: ModalController,
    public appCtrl: App,
    public translateService: TranslateService,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    private groupProvider: GroupProvider,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public alertCtrl: AlertController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public crop: Crop,
    protected menuCtrl: MenuController
  ) {

    super(toastCtrl, alertCtrl, translateService, platform, actionSheetCtrl, camera, imagePicker, crop, menuCtrl, modalCtrl);

    this.obj = this.groupObject;

    this.translateService.get(['LOADING_CONTENT', 'NEW_POLL_FORM_MSG_ER_TITLE',
      'NEW_GROUP_FORM_MSG_ER_EMPTY_GROUP', 'GENERAL_ERRROR_TEXT']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];

        this.errorTitleMsg = values['NEW_POLL_FORM_MSG_ER_TITLE'];
        this.errorEmptyGroup = values['NEW_GROUP_FORM_MSG_ER_EMPTY_GROUP'];
        this.errorSavingGroupText = values['GENERAL_ERRROR_TEXT'];
      });

    this.groupObject = this.navParams.get('group');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGroupPage');
  }


  addMember() {
    let addMemberModal = this.modalCtrl.create(AddGroupMemberPage, { members: this.groupObject.members });
    addMemberModal.onDidDismiss(data => {
      if (data) {
        this.groupObject.members = data
      }
    });
    addMemberModal.present();
  }

  removeMember(memberIndex) {
    this.groupObject.members.splice(memberIndex, 1);
  }

  dismiss() {
    //this.navCtrl.setRoot(TabsPage, { tab: 'group' });
  }

  saveGroup() {
    let message = '';
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();

    //VALIDAR NOMBRE DE GRUPO
    if (!this.groupObject.name || 0 === this.groupObject.name.length) {
      message = this.errorTitleMsg;
    }

    //VALIDAR QUE EL GRUPO AL MENOS TENGA UN MIEMBRO
    // if (!this.groupObject.members || 0 === this.groupObject.members.length) {
    //   message += this.errorEmptyGroup;
    // }

    //LLAMAR API
    if (0 === message.length) {

      this.groupProvider.editGroup(this.groupObject.id, this.groupObject.name)
        .then(() => {
          if (this.groupObject.image && this.imageChenged) {
            console.log("this.groupObject.id: " + this.groupObject.id);
            this.groupProvider.uploadGroupImage(this.groupObject.image, this.groupObject.id)
              .then(() => {
                console.log('Image group upload');
                this.loading.dismiss();
                //this.navCtrl.setRoot(TabsPage, { tab: 'group' });
                this.navCtrl.pop();
                //this.appCtrl.getRootNav().setRoot(ChuzzMessagePage, { message: 'CHUZZ_MESSAGE_GROUP_SAVE', tab: 'group' });
              })
              .catch(() => {
                console.log('Error: Image group upload');
                this.loading.dismiss();
                let toast = this.toastCtrl.create({
                  message: this.errorSavingGroupText,
                  duration: 3000
                });
                toast.present();
              });
          }
          else {
            this.loading.dismiss();
            //this.navCtrl.setRoot(TabsPage, { tab: 'group' });
            this.navCtrl.pop();
            //this.appCtrl.getRootNav().setRoot(ChuzzMessagePage, { message: 'CHUZZ_MESSAGE_GROUP_SAVE', tab: 'group' });
          }
        },
        () => {
          this.loading.dismiss();
          console.log('ERROR');
          let toast = this.toastCtrl.create({
            message: this.errorSavingGroupText,
            duration: 3000
          });
          toast.present();
        })
    } else {
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }
  }

  protected setImage(image: any): void {
    this.groupObject.image = image;
    this.imageChenged = true;
  }

}
