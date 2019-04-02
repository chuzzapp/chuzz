import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  templateUrl: 'item-details-form.html'
})
export class ItemDetailsPageForm {

  page: any;
 
  params: any = {};

  constructor(public navCtrl: NavController, navParams: NavParams) {

    this.params.data = {
      "yourName": "Your Name",
      "title": "Title",
      "description": "Enter a description",
      "button": " Write Comment"
    }
    this.params.events = {
      "onSubmit": function(item: any) {
         console.log("onSubmit");
      }
 };
  

  }
}
