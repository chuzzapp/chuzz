import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ValidatePage } from '../validate/validate';
import { PHONE_REGEX } from '../../utils/constants';
/**
 * Generated class for the ValidateNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-validate-number',
  templateUrl: 'validate-number.html',
})
export class ValidateNumberPage {
  email: string;
  phone: string;
  invalidInput: boolean = false;
  alreadySubmitted: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.alreadySubmitted = false;
    console.log('ionViewDidLoad ValidateNumberPage');

    this.email = this.navParams.get('email')
    this.phone = this.navParams.get('phone')
    console.log("email", this.email)
    console.log("phone", this.phone)
    
  }
  inputValidation() {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/;
    if(this.phone.match(phoneno))
          {
        console.log("Es valido con codigo")
        
        return this.invalidInput= false;
          }
        else
          {
          console.log("No Es valido con codigo")
          //alert("message");
          return this.invalidInput= true;
          }
    }
  doLogin() {
    if (this.alreadySubmitted) {
      return;
  }
    this.inputValidation()
    if (!this.invalidInput) {

      this.alreadySubmitted = true;
      this.navCtrl.push(ValidatePage, { email: this.email.toLowerCase(), phone: this.phone });
     

    } else {

     console.log("error",Error);
    }


  }

}
