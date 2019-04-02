import { Component } from '@angular/core';
import {
    NavController, ToastController, Platform, Events, LoadingController, MenuController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { Http } from '@angular/http';
import { ProfileFormPage } from '../profile-form/profile-form';
import { ValidatePage } from '../validate/validate';
import {ValidateNumberPage} from '../validate-number/validate-number'
import { MainPage } from '../pages';
import { UserCertificatePage } from '../user-certificate/user-certificate';

import { User } from '../../providers/user';
import { UserProvider } from '../../providers/providers';
import { BaseInfoProvider } from '../../providers/base-info/base-info';
import { EMAIL_REGEX } from '../../utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { loginOAuthProviderForIonicIAB } from '../../utils/skygear-sso';
import { BasePage } from '../base-page';
import { Device } from '@ionic-native/device';
//import { UserAgent } from '@ionic-native/user-agent';



@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage extends BasePage {

    signupPage = ProfileFormPage;
    email: string = "";
    phone: string = "";
    missingEmailMsg: string = "";
    userNotExistMsg: string = "";
    userExistMsg: string = "";
    invalidInput = false;
    alreadySubmitted: boolean = false;
    loadingForSSO: any;
    gotoPage;
    errorSendingCode;
    errorValidating;
    errorNotCompleteMessage = '';
    codeResentMessage = '';
    isSignup: boolean = false;
    fullCode: string = '';

    devicePlatform;
    
      loadingModal: any;
    
      isSubmitting = false;

    userProfileImage: string = undefined;

    constructor(public navCtrl: NavController,
        public user: User,
        public http: Http,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public userProvider: UserProvider,
        public baseInfoProvider: BaseInfoProvider,
        private statusBar: StatusBar,
        private storage: Storage,
        private platform: Platform,
        private inAppBrowser: InAppBrowser,
        private events: Events,
        private loadingCtrl: LoadingController,
        protected menuCtrl: MenuController,
        //private userAgent: UserAgent,
        private device: Device
   
    ) {
        super(menuCtrl);
        this.translateService.get(['LOGIN_MISSING_EMAIL', 'USER_NOT_EXIST_ERROR','USER_EXIST_ERROR']).subscribe((values) => {
            this.missingEmailMsg = values['LOGIN_MISSING_EMAIL'];
            this.userNotExistMsg = values['USER_NOT_EXIST_ERROR'];
            this.userExistMsg = values['USER_EXIST_ERROR'];
        })
      
            this.gotoPage = MainPage;
            
          
    }

    ionViewDidEnter() {
        this.alreadySubmitted = false;
        this.statusBar.styleDefault(); 
        
      
        
      
    }

    inputValidation() {
        this.invalidInput = !EMAIL_REGEX.test(this.email.toLowerCase()) && this.email.length > 0;
    }

    // Attempt to login in through our User service
    doLoginPhone() {
        if (this.alreadySubmitted) {
            return;
        }
       console.log("esto es lo que recupero",this.phone)
        //Go to ValidatePage
        if (this.phone) {
            
            this.inputValidation()
             if (!this.invalidInput) {
                this.userProvider.checkUserExistsPhone(this.phone.toLowerCase()).subscribe((result) => {
                    this.alreadySubmitted = false;
                    if (result.user_exists) {
                        this.navCtrl.push(ValidateNumberPage, { phone: result.user_exists.phone_number, email: this.email.toLowerCase() });
                        
                    } else {
                        this.errorPopup(this.userNotExistMsg);
                    }
                },
                    (error) => {
                        this.alreadySubmitted = false;
                        this.errorPopup(error);
                    });
                 /** 
                this.alreadySubmitted = true;
               this.userProvider.checkuserphone(this.phone.toLowerCase()).then((notes) => {
                this.alreadySubmitted = false;
                if (notes.length>0) {
                    this.navCtrl.push(ValidatePage, { phone: this.phone.toLowerCase() });  
                } else {
                    this.errorPopup(this.userNotExistMsg);
                }
              }, (error) => {
                console.error(error);
              }); */
                
                
                
            }
        } else {
          
            this.errorPopup(this.missingEmailMsg);
        }
    }
    doLogin(){
        if (this.alreadySubmitted) {
            return;
        }

        //Go to ValidatePage
        if (this.email) {
            this.inputValidation()
            if (!this.invalidInput) {
                this.alreadySubmitted = true;
                this.userProvider.checkUserExists(this.email.toLowerCase()).subscribe((result) => {
                    this.alreadySubmitted = false;
                    if (result.user_exists) {
                        //this.navCtrl.push(ValidatePage, { email: this.email.toLowerCase() });
                        this.doValidate();
                        /*
                        if (result.user_validate){
                            this.navCtrl.push(ValidatePage, {phone: result.user_phone, email: this.email.toLowerCase() });
                        }else{
                            this.navCtrl.push(ValidateNumberPage, {email: this.email.toLowerCase() });
                        }*/
                        
                    } else {
                        this.errorPopup(this.userNotExistMsg);
                    }
                },
                    (error) => {
                        this.alreadySubmitted = false;
                        this.errorPopup(error);
                    });
            }
        } else {
            this.errorPopup(this.missingEmailMsg);
        }
    }
    doValidate() {
        this.isSubmitting = true;
      
        
        this.displayLoading();
        //Validate code
        this.fullCode = "0000"
        //console.log("codigo generado: ", this.codegenerated)
        this.userProvider.skygearAuth(this.email,this.fullCode)
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
      private displayLoading() {
        this.loadingModal = this.loadingCtrl.create({
          content: 'Loading...'
        });
        this.loadingModal.present();
      }
      displayMessage(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000
        });
        toast.present();
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
                this.navCtrl.setRoot(this.gotoPage, { phone: this.phone});
              }
            })
            .catch((error: any) => {
              this.loadingModal.dismiss();
              console.log(error)
            });

        } else {
          this.loadingModal.dismiss();
          this.navCtrl.setRoot(this.gotoPage, { phone: this.phone});
        }
      }
    
    private errorPopup(errorString: string) {
        console.log('errorPopup: ', errorString);
        let toast = this.toastCtrl.create({
            message: errorString,
            duration: 3000
        });
        toast.present();
    }

    doLoginWithInstagram() {
        this.getUserFromSSO('instagram')
            .then((profile) => {
                this.loadingForSSO = this.loadingCtrl.create({ content: 'Loading' });
                this.loadingForSSO.present();

                this.setAccessToken().then(() => {
                    if (profile.is_linked_to_instagram) {
                      this.doUserLogin(MainPage)
                    } else {
                        this.userProvider.api.skygear.auth.getOAuthProviderProfiles()
                            .then((ssoProfile) => {
                                if (ssoProfile.instagram) {
                                    this.baseInfoProvider.getCountryCode().toPromise().then((country_id) => {
                                        this.userProvider.linkWithInstagram(ssoProfile.instagram.data, country_id || 'NONE')
                                            .toPromise().then((profile) => {
                                                this.doUserLogin(UserCertificatePage)
                                            })
                                            .catch(() => { this.loadingForSSO.dismiss(); });
                                    })
                                        .catch(() => { this.loadingForSSO.dismiss(); });
                                }
                            }).catch(() => { this.loadingForSSO.dismiss(); });
                    }
                }).catch(() => { this.loadingForSSO.dismiss(); });
            })
            .catch((e) => {
                console.log('Error in SSO');
                console.log(e);
            });
    }
    doLoginWithFacebook() {
        this.getUserFromSSO('facebook')
            .then((profile) => {
                this.loadingForSSO = this.loadingCtrl.create({ content: 'Loading' });
                this.loadingForSSO.present();

                this.setAccessToken().then(() => {
                    if (profile.is_linked_to_facebook) {
                       this.doUserLogin(MainPage)
                    } else {
                        this.userProvider.api.skygear.auth.getOAuthProviderProfiles()
                            .then((ssoProfile) => {
                                if (ssoProfile.facebook) {
                                    this.baseInfoProvider.getCountryCode().toPromise().then((country_id) => {
                                        let url = `https://graph.facebook.com/${ssoProfile.facebook.id}/picture?width=300&height=300`;
                                        this.http.get(url).subscribe(data => {
                                            console.log("facebook data",ssoProfile.facebook)
                                            ssoProfile.facebook.url= data.url;
                                            let usernameconespacios = ssoProfile.facebook.name;
                                            var username = usernameconespacios.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                            username = username.replace(/\s/g, '');
                                            ssoProfile.facebook.username = username.toLowerCase();
                                            this.userProvider.linkWithFacebook(ssoProfile.facebook, country_id || 'NONE')
                                            .toPromise().then((profile) => {
                                                this.doUserLogin(UserCertificatePage)
                                            })
                                            .catch(() => { this.loadingForSSO.dismiss(); }); 
                                        })
                                    })
                                        .catch(() => { this.loadingForSSO.dismiss(); });
                                }
                            }).catch(() => { this.loadingForSSO.dismiss(); });
                    }
                }).catch(() => { this.loadingForSSO.dismiss(); });
            })
            .catch((e) => {
                console.log('Error in SSO');
                console.log(e);
            });
    }

    doLoginWithTwitter() {
        this.getUserFromSSO('twitter')
            .then((profile) => {
                this.loadingForSSO = this.loadingCtrl.create({ content: 'Loading' });
                this.loadingForSSO.present();

                this.setAccessToken().then(() => {
                    this.doUserLogin(MainPage)
                }).catch(() => { this.loadingForSSO.dismiss(); });
            })
            .catch((e) => {
                console.log('Error in SSO');
                console.log(e);
            });
    }
    doLoginWithGoogle() {
      
            this.getUserFromSSO('google')
            .then((profile) => {
                this.loadingForSSO = this.loadingCtrl.create({ content: 'Loading' });
                this.loadingForSSO.present();
                this.setAccessToken().then(() => {
                    if (profile.is_linked_to_google) {
                       this.doUserLogin(MainPage)
                    } else {
                        this.userProvider.api.skygear.auth.getOAuthProviderProfiles()
                            .then((ssoProfile) => {
                                if (ssoProfile.google) {
                                    this.baseInfoProvider.getCountryCode().toPromise().then((country_id) => {
                                        console.log("data", ssoProfile.google)
                                        let usernameconespacios = ssoProfile.google.name;
                                            var username = usernameconespacios.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                            username = username.replace(/\s/g, '');
                                            ssoProfile.google.username = username.toLowerCase();
                                        this.baseInfoProvider.getCountryCode().toPromise().then((country_id) => {
                                            this.userProvider.linkWithGoogle(ssoProfile.google, country_id || 'NONE')
                                                .toPromise().then((profile) => {
                                                    this.doUserLogin(UserCertificatePage)
                                                })
                                                .catch(() => { this.loadingForSSO.dismiss(); });
                                        })
                                            .catch(() => { this.loadingForSSO.dismiss(); });
                                          
                                          
                                    })
                                        .catch(() => { this.loadingForSSO.dismiss(); });
                                }
                            }).catch(() => { this.loadingForSSO.dismiss(); });
                    }
                }).catch(() => { this.loadingForSSO.dismiss(); });
            })
            .catch((e) => {
                if(e.error.code == 109){
                    this.errorPopup(this.userExistMsg);
                }  
                console.log('Error in SSO');
                console.log(e);
            }); 
        
    }
     

    private getUserFromSSO(provider: string) {
        if (this.platform.is('cordova')) {
            return loginOAuthProviderForIonicIAB(
                this.userProvider.api.skygear,
                this.inAppBrowser,
                provider,
                { callbackUrl: `${this.userProvider.api.url}/sso_complete` },
            );
        } else {
            
            const skygear = this.userProvider.api.skygear;
            return skygear.auth.loginOAuthProviderWithPopup(provider);
        }
    }

    private setAccessToken() {
        const accessToken = this.userProvider.api.skygear.auth.accessToken;
        this.userProvider.updateApiAccessToken(accessToken);
        return this.storage.ready().then(() => {
            return this.storage.set('TOKEN', accessToken);
        });
    }

    private doUserLogin(gotoPage) {
        this.userProvider.getCurrentUser().subscribe((profile) => {
            this.storage.ready().then(() => {
                this.storage.set('USER', profile);
                this.events.publish('userLoggedIn', profile);

                if (this.platform.is('cordova')) {
                    this.storage.get("NOTIFICATION_TOKEN")
                        .then((deviceToken) => {
                            console.log("DEVICE TOKEN",deviceToken)
                            
                            if (deviceToken) {
                                this.userProvider.registerNotification(deviceToken)
                                    .subscribe((update_result) => {
                                        this.loadingForSSO.dismiss();
                                        this.navCtrl.setRoot(gotoPage);
                                    });
                            } else {
                                console.log('device token is empty');
                                this.loadingForSSO.dismiss();
                                this.navCtrl.setRoot(gotoPage);
                            }
                        })
                        .catch((error: any) => {
                            console.log(error);
                            this.loadingForSSO.dismiss();
                        });
                       /* this.loadingForSSO.dismiss();
                        this.navCtrl.setRoot(gotoPage);*/
                } else {
                    this.loadingForSSO.dismiss();
                    this.navCtrl.setRoot(gotoPage);
                }
            }).catch(() => { this.loadingForSSO.dismiss(); });
        })
    }
}
