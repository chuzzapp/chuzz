import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Injectable()
export class MessagesProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello MessagesProvider Provider');
  }

  public createMessageAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
