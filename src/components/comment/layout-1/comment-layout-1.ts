import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { IonicPage, ToastController, NavController, Events, Content, FabButton, ItemSliding } from 'ionic-angular';
import { PusherServiceProvider } from '../../../providers/pusher-service/pusher-service';
import { TranslateService } from '@ngx-translate/core/src/translate.service'
import { CommentsProvider } from '../../../providers/comments/comments';
import { UserProvider } from '../../../providers/user/user';
import { timeSince } from '../../../utils/date';
import { ItemDetailsPageComment } from '../../../pages/item-details-comment/item-details-comment';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

class Comment {
  description: string;
  id: string;
  user_id: string;
}

@IonicPage()
@Component({
  selector: 'comment-layout-1',
  templateUrl: 'comment.html'
})
export class CommentLayout1  {
  @Input() data: any;
  @Input() events: any;
  @Input() poll: any;
  @ViewChild(Content) content: Content;

  @ViewChild(FabButton) fabButton: FabButton;


  comments = [];
  pollinfo: any;
  message: string;
  currentUser: any;
  comment;
  commentsend;
  userDefaultProfileImage = "assets/img/profile_placeholder.png";


  CommentOnObject: Comment;
  timeSince = timeSince;
  errorText = '';
  url: string = 'http://localhost:4000/message'
  rating = {
    bad: 0,
    good: 0,
  }

  constructor(private pusher: PusherServiceProvider, public evento: Events, public userProvider: UserProvider,
    private zone: NgZone, public navCtrl: NavController, public translateService: TranslateService, private commentProvider: CommentsProvider, public toastCtrl: ToastController,   private admobFree: AdMobFree ) {

    this.translateService.get(['LOADING_CONTENT','COMMENT_SEND','COMMENT',

      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
    ]).subscribe(values => {


      this.errorText = values['GENERAL_ERRROR_TEXT'];
      this.comment = values['COMMENT'];
      this.commentsend = values['COMMENT_SEND'];


    });
    this.admobFree.banner.remove();
    this.evento.subscribe('updateScreen', () => {
      this.zone.run(() => {
        this.commentProvider.getCommentListBypoll(this.pollinfo.id).subscribe(result => {
          this.data = result.comment
          console.log("data comment", this.data)
        }, error => {

          console.log("error", error)

        });
      });
    });
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.currentUser = user.id;
      console.log("userarioactual", this.currentUser)

    });
  }
  ngOnInit() {
    console.log("dataaa", this.data)
    this.comments = this.data
    this.pollinfo = this.poll;
    console.log("info poll", this.pollinfo)

  }
  onEvent(event: string, item: any, e: any) {
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  sendComment() {
    this.CommentOnObject = {
      description: this.message,
      id: this.pollinfo.id,
      user_id: this.currentUser,
    }


    this.commentProvider.createComment(this.CommentOnObject).subscribe((result) => {
      this.evento.publish('updateScreen');
      this.message = '';

    }, () => {
      this.showError(this.errorText);
    });



    console.log("mensaje", this.message)

  }

  ionViewDidLoad() {
    console.log("dataaaaaaaa", this.data)

  }

  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  refreshPageComment(pollId) {
    //this.nav.push(ItemDetailsPageComment, {fromMenu: true});
    this.navCtrl.push(ItemDetailsPageComment, { poll: pollId });
  }
  undo = (slidingItem: ItemSliding) => {
    slidingItem.close();
  }

  delete(item) {
    let index = this.data.indexOf(item);
    if (index > -1) {
      this.commentProvider.deleteComment(item.id);
      this.data.splice(index, 1);
    }
  }




}
