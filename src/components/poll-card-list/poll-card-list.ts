import { NgModule, CUSTOM_ELEMENTS_SCHEMA,ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { timeSince } from '../../utils/date';
import {
  App, IonicPage, NavController, NavParams, LoadingController, PopoverController,
  MenuController, ToastController,Nav,
  AlertController
} from 'ionic-angular';

import { PollPage } from '../../pages/poll/poll';
import { PollListPage } from '../../pages/poll-list/poll-list';
import { MainPage } from '../../pages/pages';
import { GroupProvider, MessagesProvider, UserProvider, PollProvider, ChuzzonProvider } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core/src/translate.service';
import { GroupDetailPage } from '../../pages/group-detail/group-detail';
import {ItemDetailsPageComment} from '../../pages/item-details-comment/item-details-comment';

class Chuzzon {
  description: string;
  start_time: string;
  end_time: string;
  image_id: string;
  id: string;
}


/**
 * Generated class for the PollCardListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'poll-card-list',
  templateUrl: 'poll-card-list.html'
})
export class PollCardListComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;
  @Input("polls")
  polls: any[] = [];
  items: any[];
  chuzzon: any[] = [];
  pollsweliminated: any[] = [];
  timeSince = timeSince;
  groups: any[];
  currentGroup: any;
  groupMembers: any;
  groupPolls: any;
  pollQuestions: any;
  loading: any;
  listSize: number = -1;
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  deletingMessage: string = "";
  deleteMessage: string = "";
  titleDeletePoll: string = "";
  cancelText: string = "";
  deleteText: string = "";
  loadingtext = "";
  isAdmin: boolean;
  currentUser: any;
  groupID;
  userId;
  group;
  errorText = '';
  ProfilePlaceholderImage = "assets/img/poll_card.png";
  userDefaultProfileImage = "assets/img/profile_placeholder.png"
  imgchuzzon: string;
  chuzzondescription: string;
  ChuzzOnObject: Chuzzon;
  gotoPage;
  eliminated: any[] = [];
  tabname;
  resultfilter: any[] = [];
  ms1;
  ms2;
  ms3;



  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupProvider: GroupProvider,
    public pollProvider: PollProvider,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    private userProvider: UserProvider,
    private chuzzonProvider: ChuzzonProvider,
    public toastCtrl: ToastController,
    public msgsProvider: MessagesProvider,
    private alertCtrl: AlertController,
    public popOverCtrl: PopoverController) {
    console.log("DATA DE NAVPARAMS: ", this.navParams.data);
    this.tabname = this.navParams.data
    this.isAdmin = this.navParams.get('isUserAdmin');
    this.groupID = this.navParams.get('id');
    this.group = this.navParams.data;
    this.pollQuestions = navParams.get('questions');
    this.translateService.get(['LOADING_CONTENT',

      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_GROUPS_POLLS_TITLE', 'EMPTY_SCREEN_GROUPS_POLLS_TEXT', 'DELETE_MESSAGE', 'DELETING_MESSAGE', 'TITLE_DELETE_POLL', 'CANCEL', 'DELETE', 'CHUZZON_MSG_PART1','CHUZZON_MSG_PART2','CHUZZON_MSG_PART3']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];

        this.empyScreenTitle = values['EMPTY_SCREEN_GROUPS_POLLS_TITLE'];
        this.empyScreenText = values['EMPTY_SCREEN_GROUPS_POLLS_TEXT'];
        this.deleteMessage = values['DELETE_MESSAGE'];
        this.deletingMessage = values['DELETING_MESSAGE'];
        this.titleDeletePoll = values['TITLE_DELETE_POLL'];
        this.deleteText = values['DELETE'];
        this.cancelText = values['CANCEL'];
        this.errorText = values['GENERAL_ERRROR_TEXT'];
        this.ms1 = values['CHUZZON_MSG_PART1'];
        this.ms2 = values['CHUZZON_MSG_PART2'];
        this.ms3 = values['CHUZZON_MSG_PART3'];

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

      });

    this.emptyScreenImage = 'assets/img/poll_card';


    /**  this.groupProvider.getGroupPolls(this.groupID).subscribe(p => {
      console.log("todas las poll de este grupo", p)
       this.polls_is_not_deleted = p.find(function (obj) { return obj.deleted === true; });
      console.log("array de polls",this.polls_is_not_deleted)
      var filtered = [];
      for (var i = 0; i < p.length; i++) {
        if (p[i].deleted == false) {
          filtered.push(p[i]);
        }
      }
      console.log("Filtrado por false", filtered)
      this.polls = filtered;
    },
      error => {


      }); */






  }


  ngOnInit() {
    console.log("FIRTS POLLS", this.polls)
    
    /*
    if (this.navParams.data == 'celebrities') {
      this.chuzzon = this.pollss.data[1];
      console.log("chuzz on ", this.chuzzon)
      var props = ['id'];
      var object2 = this.polls;
      this.resultfilter = this.chuzzon.filter(function (o1) {
        // filter out (!) items in result2
        return !object2.some(function (o2) {
          return o1.poll_id === o2.id;          // assumes unique id
        });
      });
      console.log("RESULTADO FILTTRADO", this.resultfilter)
      
    

  

  this.chuzzon = this.resultfilter;
     
    }*/

    this.polls = this.polls.filter(item => !item.deleted);

    console.log("Polls to show after filter by deleted: ", this.polls)

    this.userProvider.getCachedCurrentUser().then((user) => {
      this.currentUser = user.id;
      this.userId = user.id;
      console.log("usuario actual", user)
      console.log("user", this.currentUser)

    });
  }
  getActiveItems() {
    // NOTE: Returning a new array might mess up the change detection of Ng2.
    // TODO: Use an existing array instead of returning a new one each time.
    return this.polls.filter(item => !item.deleted);
  }
  openChuzzonPoll(pollid) {
    this.pollProvider.getPoll(pollid).subscribe((result) => {
      console.log("Resultado", result.poll)
      this.openPoll(result.poll)
    },
      () => {
        console.log(Error)
      });
  }

  openPoll(poll) {
    this.appCtrl.getRootNav().push(PollPage, { poll: poll });
  }
  opencomment(pollId) {
   //this.nav.push(ItemDetailsPageComment, {fromMenu: true});
    this.appCtrl.getRootNav().push(ItemDetailsPageComment,{fromMenu: true});
  }
  deletedisplaypoll(topicClick: any, topicCard) {
    let pos = this.indexOfTopicSelected(topicClick);

    if (pos > -1) {
      this.polls.splice(pos, 1);
    }
  }

  indexOfTopicSelected(poll: any): number {
    return this.polls.map(x => x.id).indexOf(poll.id);
  }

  onPollShareClick(poll) {

    const prompt = this.alertCtrl.create({
      title: "Chuzz-on",
      message: this.ms1 + poll.name,
      buttons: [
        {
          text: this.cancelText,
          handler: data => {
          }
        },
        {
          text: "Chuzz-on",
          handler: data => {
            this.createChuzzOn(poll);
          }
        }
      ]
    })
    prompt.present()
  }

  createChuzzOn(poll) {
    this.pollProvider.getPoll(poll.id).subscribe((result) => {
      var polluserid = result.poll.user.id;
      if (result.poll.image == null) {
        this.imgchuzzon = this.ProfilePlaceholderImage;
      } else {
        this.imgchuzzon = result.poll.image
      }
      let chuzzonobject = {
        description: result.poll.name,
        start_time: result.poll.start_time,
        end_time: result.poll.end_time,
        image_id: this.imgchuzzon,
        id: result.poll.id,
        user_id: result.poll.user.id,

      }
      console.log("chuzzon", chuzzonobject)

      this.chuzzonProvider.createChuzzon(chuzzonobject).subscribe((result) => {
        console.log("Create chuzz-on", result);
        const alert = this.alertCtrl.create({
          title: '¡Chuzz-on!',
          subTitle: this.ms2 + poll.name + this.ms3,
          buttons: ['OK']
        });
        alert.present();

      }, () => {
        this.showError(this.errorText);
      });

    },
      () => {
        this.showError(this.errorText);
      });

  }


  onPollDeleteClick(poll) {

    const prompt = this.alertCtrl.create({
      title: this.titleDeletePoll,
      message: this.deleteMessage + poll.name,
      buttons: [
        {
          text: this.cancelText,
          handler: data => {
          }
        },
        {
          text: this.deleteText,
          handler: data => {
            this.onDeletePoll(poll)
          }
        }
      ]
    })
    prompt.present()
  }

  onDeletePoll(poll) {
    const loader = this.loadingController.create({
      content: this.deletingMessage,
    });



    this.pollProvider.setPollDelete(poll.id, true).then(() => {

      poll.deleted = true;

      this.appCtrl.getRootNav().setRoot(MainPage);
      loader.dismiss()
    });

  }
  /**
   *  onDeletePoll(poll) {
      //remove group
      const loader = this.loadingController.create({
        content: "Deleting, please wait...",
      });
      loader.present();
      this.pollProvider.deletePoll(poll.id).then(() => {
        this.polls = this.polls.filter(p => p.id !== poll.id)
        this.appCtrl.getRootNav().setRoot(GroupDetailPage, { group: this.groupID });
        
      }).catch(error => {
        console.log("Error deleting Poll", error)
        loader.dismiss()
      })
  
    }
   * 
   */
  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}


