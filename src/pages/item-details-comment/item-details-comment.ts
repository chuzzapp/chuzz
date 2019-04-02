import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ItemDetailsPageForm} from '../../pages/item-details-form/item-details-form';
//import { IService } from '../../providers/services/IService';

@IonicPage()
@Component({
  templateUrl: 'item-details-comment.html'
})
export class ItemDetailsPageComment {

  page: any;
  //service: IService;

  params: any = {};

  constructor(public navCtrl: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
   /* this.page = navParams.get('page');
    this.service = navParams.get('service');
    if (this.service) {
      this.params = this.service.prepareParams(this.page, navCtrl);
      this.params.data = this.service.load(this.page);
    } else {
      navCtrl.setRoot("HomePage");
    }		*/
    
    this.params.data = {
      "headerTitle": "Commnets Basic",
      "allComments": "2121 Comments",
      "items": [
          {
              "id": 1,
              "image": "assets/img/extras/users/img_1.jpg",
              "title": "Erica Romaguera",
              "time": "18 August 2018 at 12:20pm",
              "description": "If you could have any kind of pet, what would you choose?"
          },
          {
              "id": 2,
              "image": "assets/img/extras/users/img_2.jpg",
              "title": "Caleigh Jerde",
              "time": "18 August 2018 at 8:13pm",
              "description": "If you could learn any language, what would you choose?"
          },
          {
              "id": 3,
              "image": "assets/img/extras/users/img_3.jpg",
              "title": "Lucas Schultz",
              "time": "18 August 2018 at 5:22pm",
              "description": "Life is about making an impact, not making an income."
          },
          {
              "id": 4,
              "image": "assets/img/extras/users/img_4.jpg",
              "title": "Carole Marvin",
              "time": "18 August 2018 at 7:36am",
              "description": "I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel"
          },
          {
              "id": 5,
              "image": "assets/img/extras/users/img_5.jpg",
              "title": "Doriana Feeney",
              "time": "18 August 2018 at 5:28am",
              "description": "Definiteness of purpose is the starting point of all achievement."
          },
          {
              "id": 6,
              "image": "assets/img/extras/users/img_6.jpg",
              "title": "Nia Gutkowski",
              "time": "18 August 2018 at 11:27pm",
              "description": "Life is what happens to you while you’re busy making other plans"
          }
      ]    
    };

    this.params.events = {
      "onItemClick": function(item: any) {
         console.log("onItemClick");
      }
 };



  }

  openform(){
    this.navCtrl.push(ItemDetailsPageForm);
  }
}
