import { Component, ViewChild } from '@angular/core';
import {
  IonicPage, NavController, NavParams, Platform, ToastController, LoadingController,
  Events, MenuController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';

import { UserProvider } from '../../providers/providers';

import { MainPage } from '../pages';
import { UserCertificatePage } from '../user-certificate/user-certificate';
import { BasePage } from '../base-page'
import { SocialSharing } from '@ionic-native/social-sharing';
import { SMS } from '@ionic-native/sms';

@IonicPage()
@Component({
  selector: 'page-validate',
  templateUrl: 'validate.html',
})
export class ValidatePage extends BasePage {

  gotoPage;
  errorSendingCode;
  errorValidating;
  errorNotCompleteMessage = '';
  codeResentMessage = '';
  email: string;
  phone: string;
  isSignup: boolean = false;
  user: any = {
    username: undefined,
    country_id: undefined,
    email: undefined,
    birthday: undefined,
    gender: undefined,
    phone_number: undefined,
    display_name: undefined,
  };
  userProfileImage: string = undefined;

  @ViewChild('inputField') inputField;

  code1Val: string = '';
  code2Val: string = '';
  code3Val: string = '';
  code4Val: string = '';

  fullCode: string = '';

  loadingModal: any;

  isSubmitting = false;

  isInputOnFocus = false;
  codegenerated: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    private platform: Platform,
    private storage: Storage,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public toastCtrl: ToastController,
    private statusBar: StatusBar,
    private events: Events,
    private sms: SMS,
    private socialSharing: SocialSharing,
    protected menuCtrl: MenuController
  ) {
    super(menuCtrl);

    this.translateService.get([
      'VALIDATE_ERROR_VALIDATING_MSG', 'VALIDATE_ERROR_SENDING_CODE_MSG', 'VALIDATE_ERROT_NOT_COMPLETE', 'VALIDATE_CODE_SENT'])
      .subscribe((values) => {
        this.errorSendingCode = values['VALIDATE_ERROR_SENDING_CODE_MSG'];
        this.errorValidating = values['VALIDATE_ERROR_VALIDATING_MSG'];
        this.errorNotCompleteMessage = values['VALIDATE_ERROT_NOT_COMPLETE'];
        this.codeResentMessage = values['VALIDATE_CODE_SENT'];
      });

    if (this.navParams.get('user')) {

      this.isSignup = true;
      this.user = this.navParams.get('user');
      this.userProfileImage = this.navParams.get('userProfileImage');
      this.gotoPage = UserCertificatePage;
    } else {
      this.gotoPage = MainPage;

    }


    /**if (this.navParams.get('phone')) {
      var val = Math.floor(1000 + Math.random() * 9000);
      console.log(val);
      
      this.phone = this.navParams.get('phone');
      console.log("tlfn",this.phone)
      
      
      
      var valstring = val.toString();
      this.codegenerated = valstring;
      
      this.userProvider.setemailv(this.codegenerated, this.phone);*/
    if (this.navParams.get('email')) {
      /*
          PARA HACER ENVIO POR SMS
          var val = Math.floor(1000 + Math.random() * 9000);
          console.log(val);
          
         
          
          
          
          var valstring = val.toString();
          this.codegenerated = valstring;
          this.email = this.navParams.get('email');
          this.phone = this.navParams.get('phone');
          console.log("Telf", this.phone)
          console.log("Email", this.email)
          this.userProvider.sendValidationCode(this.email, this.fullCode)
            .subscribe(
            () => {
              var tomensaje = `${this.codegenerated} Ingresa este codigo para iniciar sesión`;
              this.sms.send(this.phone, tomensaje);
    
             },
            (error) => {
              this.displayMessage(this.errorSendingCode);
            }); */
      this.email = this.navParams.get('email');
      this.userProvider.sendValidationCode(this.email)
        .subscribe(
        () => { },
        (error) => {
          this.displayMessage(this.errorSendingCode);
        });
    }

  }

  inputOnFocus(event) {
    this.isInputOnFocus = true;
    console.log('inputOnFocus');
    this.updateActiveElement();
  }

  inputOnBlur(event) {
    this.isInputOnFocus = false;
    console.log('inputOnBlur');
    this.deactivateElements()
  }

  inputCode(event) {
    setTimeout(() => {
      // WTF: An unknown bug causes the view does not update even the binded model does update.
      // Need to update DOM elements with raw JavaScript.
      document.getElementById('code1').innerHTML = this.fullCode[0] || '';
      document.getElementById('code2').innerHTML = this.fullCode[1] || '';
      document.getElementById('code3').innerHTML = this.fullCode[2] || '';
      document.getElementById('code4').innerHTML = this.fullCode[3] || '';
      this.updateActiveElement();
      if (this.fullCode.length == 4 && !this.isSubmitting) {
        this.doValidate();
      }
    }, 50);
  }

  displayMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.statusBar.styleLightContent();
  }

  doValidate() {
    this.isSubmitting = true;

    if (this.fullCode.length < 4) {
      this.displayMessage(this.errorNotCompleteMessage);
      this.isSubmitting = false;
      return
    }

    this.displayLoading();

    this.userProvider.skygearAuth(this.email, this.fullCode)
      .subscribe((result) => {
        this.isSubmitting = false;
        var authResult = result.result
        this.storage.set("TOKEN", authResult.access_token);
        this.userProvider.updateApiAccessToken(authResult.access_token)
        if (this.isSignup) {
          this.updateUserInfoAfterSignup(authResult.user_id)
        } else {
          this.userProvider.getCurrentUser().subscribe((profile) => {
            this.setUserInfoAndRegisterNotification(profile)
            this.events.publish('userLoggedIn', profile);
          });
        }
      },
      () => {
        this.isSubmitting = false;
        this.loadingModal.dismiss();
        this.displayMessage(this.errorValidating);
      });

  }

  sendCodeAgain() {
    // ENVIAR CODIGO DE NUEVO
    this.userProvider.sendValidationCode(this.email)
      .subscribe(
      () => {
        this.displayMessage(this.codeResentMessage);
      },
      (error) => {
        this.displayMessage(error);
      });
  }

  updateUserInfoAfterSignup(userId: string) {
    console.log('updateUserInfoAfterSignup');
    //Submit user information from signup
    this.userProvider.updateUser(this.user).subscribe((update_result) => {
      var profile = update_result.profile;
      console.log('update user end');
      if (this.userProfileImage) {
        this.userProvider.uploadProfileImage(this.userProfileImage, userId).then((record) => {
          console.log('upload profile image end');
          this.userProvider.getCurrentUser().subscribe((profile) => {
            console.log('get current user end');
            this.setUserInfoAndRegisterNotification(profile);
            this.events.publish('userLoggedIn', profile);
          })
        }, (error) => {
          this.loadingModal.dismiss();
          this.displayMessage(error);
        })
      } else {
        this.setUserInfoAndRegisterNotification(profile);
        this.events.publish('userLoggedIn', profile);
      }
    },
      (error) => {
        this.loadingModal.dismiss();
        this.displayMessage(error);
      });
  }

  setUserInfoAndRegisterNotification(userProfile) {
    this.storage.set("USER", userProfile);
    this.registerNotification();
  }

  registerNotification() {
    if (this.platform.is('cordova')) {
      this.storage.get("NOTIFICATION_TOKEN")
        .then((deviceToken) => {
          console.log('get token end');
          this.loadingModal.dismiss();
          if (deviceToken) {
            this.userProvider.registerNotification(deviceToken).subscribe(
              (update_result) => {
                console.log('registerNotification end');

                this.navCtrl.setRoot(this.gotoPage);
              },
              (error) => {
                this.loadingModal.dismiss();
                this.displayMessage(error);
              }
            );
          } else {
            console.log('device token is empty');
            this.navCtrl.setRoot(this.gotoPage, { phone: this.phone });
          }
        })
        .catch((error: any) => {
          this.loadingModal.dismiss();
          console.log(error)
        });
    } else {
      this.loadingModal.dismiss();
      this.navCtrl.setRoot(this.gotoPage, { phone: this.phone });
    }
  }

  private displayLoading() {
    this.loadingModal = this.loadingController.create({
      content: 'Loading...'
    });
    this.loadingModal.present();
  }

  private deactivateElements() {
    let codeInputElements = document.getElementsByClassName('code-input');
    for (let i = 0; i < codeInputElements.length; i++) {
      codeInputElements[i].classList.remove('active');
    }
  }

  private updateActiveElement() {
    this.deactivateElements()
    let codeInputElements = document.getElementsByClassName('code-input');
    var activeElementIndex = 0;
    if (this.fullCode && this.fullCode.length >= 1) {
      activeElementIndex = this.fullCode.length;
    }
    if (activeElementIndex >= codeInputElements.length) {
      activeElementIndex = codeInputElements.length - 1;
    }
    codeInputElements[activeElementIndex].classList.add('active');
  }
}
