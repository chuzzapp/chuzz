import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPageForm } from '../../pages/item-details-form/item-details-form';
//import { IService } from '../../providers/services/IService';
import { CommentsProvider } from '../../providers/comments/comments';

@IonicPage()
@Component({
  templateUrl: 'item-details-comment.html'
})
export class ItemDetailsPageComment {

  page: any;
  //service: IService;
  dataProvider: any = {};
  params: any = {};
  pollID

  constructor(public navCtrl: NavController, navParams: NavParams, public commentProvider: CommentsProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    /* this.page = navParams.get('page');
     this.service = navParams.get('service');
     if (this.service) {
       this.params = this.service.prepareParams(this.page, navCtrl);
       this.params.data = this.service.load(this.page);
     } else {
       navCtrl.setRoot("HomePage");
     }		*/
    //this.params.data = this.commentProvider.getCommentlistTest();
    this.pollID = navParams.get('poll');

    this.commentProvider.getCommentListBypoll(this.pollID.id).subscribe(result => {
     this.params.data = result.comment
    }, error => {

      console.log("error", error)

    });
    this.params.events = {
      "onItemClick": function (item: any) {
        console.log("onItemClick");
      }
    };








  }

  openform() {
    this.navCtrl.push(ItemDetailsPageForm);
  }
}
