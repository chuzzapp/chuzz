import { Component } from '@angular/core';
import { 
  NavController, NavParams, ToastController, AlertController, Platform, ActionSheetController, 
  Events, MenuController, ModalController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { StatusBar } from '@ionic-native/status-bar';

import { UserProvider, BaseInfoProvider } from '../../providers/providers';

import { ValidatePage } from '../../pages/validate/validate';
import { MainPage } from '../pages';
import { TopicsPage } from '../../pages/topics/topics';
import { ImagePage } from '../image-page';
import { Storage } from '@ionic/storage';
import { EMAIL_REGEX } from '../../utils/constants';
import { scrollToSelectedItem } from '../../utils/select-helper';

@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html'
})
export class ProfileFormPage extends ImagePage {

  emailDisabled: boolean;
  title: string;
  monthShortNames;
  defaultImage = "assets/img/empty_image.png";
  userProfileImage: string = undefined;
  user: any = {
    username: undefined,
    country_id: undefined,
    email: undefined,
    birthday: undefined,
    gender: undefined,
    phone_number: undefined,
    display_name: undefined,
    is_linked_to_instagram: false,
    is_linked_to_facebook: false,
    is_linked_to_google: false,
    is_declared_adult: false
  };

  originalUsername: string;

  countries;
  messageSystems;
  requiredFieldsMsg = 'Please input all the * fields.';
  errorFormMsg;
  error;
  canceltext;
  cameraText;
  libraryText;
  imageFromTitle;
  invalidUserEmail: boolean = false;
  alreadySubmitted: boolean = false;
  invalidBirthday: boolean = false;

  isForUpdate: boolean = false;

  thirteenYearsBefore = new Date(new Date().setFullYear(new Date().getFullYear() - 13));

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public userProvider: UserProvider,
    public translateService: TranslateService,
    public baseInfoProvider: BaseInfoProvider,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public crop: Crop,
    private storage: Storage,
    private statusBar: StatusBar,
    private events: Events,
    protected menuCtrl: MenuController,
    protected modalCtrl: ModalController
  ) {

    super(toastCtrl, alertCtrl, translateService, platform, actionSheetCtrl, camera, imagePicker, crop, menuCtrl, modalCtrl, navParams);

    let titleTranslationKey = 'SIGNUP_TITLE';
    
    this.emailDisabled = !!this.user.email;

   
      
  

    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user');
      console.log("USUARIO", this.user)
      this.defaultImage = this.user.image || this.defaultImage;
      this.originalUsername = this.user.username;
      this.isForUpdate = true;
      titleTranslationKey = 'MENU_ITEM_TEXT_PROFILE';
    } else {
      this.isForUpdate = false;
      this.baseInfoProvider.getCountryCode().subscribe(country_id => {
        this.user.country_id = country_id;
      });
    }

    this.translateService.get([
      'MENU_ITEM_TEXT_PROFILE', 
      'PROFILE_FORM_EMPTY_FIELD_MSG', 
      'GENERAL_ERRROR_TEXT',
      titleTranslationKey,
    ]).subscribe(values => {
        this.errorFormMsg = values['PROFILE_FORM_EMPTY_FIELD_MSG'];
        this.error = values['GENERAL_ERRROR_TEXT'];
        this.title = values[titleTranslationKey];
      });

    this.baseInfoProvider.getCountriesLocally().subscribe(countries => this.countries = countries);

  }

  ionViewDidEnter() {
    this.alreadySubmitted = false;
    this.statusBar.styleLightContent();
  }

  emailValidation() {
    if (this.user && this.user.email) {
      this.invalidUserEmail = !EMAIL_REGEX.test(this.user.email.toLowerCase()) && this.user.email.length > 0;
    }
  }

  private getUserInfoToValidate() {
    if (this.isForUpdate) {
      let fieldsToValidate = { is_update: true };
      if (this.user.username !== this.originalUsername) {
        fieldsToValidate['username'] = this.user.username;
      }
      return fieldsToValidate;
    } else {
      return {
        email: this.user.email,
        username: this.user.username,
        display_name: this.user.display_name
      };
    } 
  }

  private submitProcess() {
    let valid = true;
    let requiredFields = ['display_name', 'username'];

    /*if (this.user.is_linked_to_instagram === false && this.user.is_linked_to_facebook === false && this.user.is_linked_to_google === false) {
      */
     if (this.user.is_linked_to_instagram === false){
     requiredFields.push('email');
    }

    console.log("USER = ", this.user);
    for (let index in requiredFields) {
      if (!this.user[requiredFields[index]]) {
        valid = false;
        let toast = this.toastCtrl.create({
          message: this.requiredFieldsMsg,
          duration: 3000
        });
        toast.present();
        break;
      }
    }

    if (valid) {
      this.emailValidation()
      if (this.invalidUserEmail) {
        this.alreadySubmitted = false;
        return;
      }

      if (this.invalidBirthday) {
        this.alreadySubmitted = false;
        return;
      }

      let userInfoToValidate = this.getUserInfoToValidate();

      if (!this.isForUpdate || Object.keys(userInfoToValidate).length > 0) {
        this.userProvider.validateSignupInfo(this.getUserInfoToValidate()).subscribe((result) => {
          this.alreadySubmitted = false;
          if (result.valid) {
            if (!this.isForUpdate) {
              var user = this.user;
              user.email = user.email.toLowerCase();
              this.navCtrl.push(ValidatePage, { email: user.email, user: user, userProfileImage: this.userProfileImage });
            } else {
              this.updateUserInfo();
            }
          } else {
            let toast = this.toastCtrl.create({
              message: result.errors,
              duration: 3000
            });
            toast.present();
          }
        });
      } else {
        this.updateUserInfo();
      }
    } else {
      this.alreadySubmitted = false;
    }
  }

  private onProfileUpdated(profile) {
    this.storage.set('USER', profile);
    this.events.publish('userProfileUpdated', profile);
  }

  updateUserInfo() {
    const userToUpdate = { ...this.user };
    if (this.user.is_linked_to_instagram ) {
      userToUpdate.email = '';
    }
    /*else if(this.user.is_linked_to_facebook){
      userToUpdate.email = '';
    }else if(this.user.is_linked_to_google){
      userToUpdate.email = '';
    }*/

    this.userProvider.updateUser(userToUpdate).subscribe((update_result) => {
      var profile = update_result.profile
      this.storage.ready().then(() => {
        if (this.userProfileImage) {
          this.userProvider.uploadProfileImage(this.userProfileImage, profile.id)
            .then((record) => {
              this.userProvider.getCurrentUser().subscribe((profile) => {
                this.onProfileUpdated(profile);
              })
            })
            .catch(() => {
              this.onProfileUpdated(profile);
            });
        } else {
          this.onProfileUpdated(profile);
        }
      });

      if (this.isForUpdate) {
        this.navCtrl.pop();
      } else {
        this.navCtrl.setRoot(MainPage);
      }
    },
      () => {
        this.alreadySubmitted = false;
        let alert = this.alertCtrl.create({
          subTitle: this.error,
          buttons: ['OK']
        });
        alert.present();
      });
  }

  submitClicked() {
    if (!this.alreadySubmitted) {
      this.alreadySubmitted = true;
      this.submitProcess();
    }
  }

  birthdayOnChange() {
    if (new Date(this.user.birthday) > this.thirteenYearsBefore) {
      this.invalidBirthday = true;
    } else {
      this.invalidBirthday = false;
    }
    console.log(this.user.birthday);
  }

  protected setImage(image: any): void {
    setTimeout(() => {
      this.userProfileImage = image;
    }, 0);
  }

  onCountrySelectClicked(select) {
    scrollToSelectedItem(select);
  }
}

