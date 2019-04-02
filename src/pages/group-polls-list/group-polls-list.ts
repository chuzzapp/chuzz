import { Component } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams,
  LoadingController, PopoverController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { GroupProvider, MessagesProvider, ParamProvider, UserProvider } from '../../providers/providers';

import { TabsPage } from '../tabs/tabs';
import { PollFormPage } from '../poll-form/poll-form'
import { GroupPollsPopoverPage } from '../group-polls-popover/group-polls-popover';
import { PollPage } from '../poll/poll';

@IonicPage()
@Component({
  selector: 'page-group-lists-poll',
  templateUrl: 'group-polls-list.html',
})
export class GroupPollsListPage {

  currentGroup: any;
  groupPolls: any;
  loading: any;
  listSize: number = -1;
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  loadingtext = "";
  isAdmin = false;
  currentUser: any;

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupProvider: GroupProvider,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    public popOverCtrl: PopoverController,
    private userProvider: UserProvider, 
    private paramProvider: ParamProvider
  ) {

    this.translateService.get(['LOADING_CONTENT',
      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_GROUPS_POLLS_TITLE', 'EMPTY_SCREEN_GROUPS_POLLS_TEXT']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];

        this.empyScreenTitle = values['EMPTY_SCREEN_GROUPS_POLLS_TITLE'];
        this.empyScreenText = values['EMPTY_SCREEN_GROUPS_POLLS_TEXT'];

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

      });

    this.emptyScreenImage = 'assets/img/emptys_screens/ic_no_surveys.png';
  }

  ionViewWillEnter() {
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPollPage');
  }

  loadPolls() {
    this.groupProvider.getGroupPolls(this.currentGroup.id)
      .subscribe(polls => {
        this.groupPolls = polls;
        if (this.groupPolls) {
          this.listSize = this.groupPolls.length;
        } else {
          this.listSize = 0;
        }
      }, error => {
        this.listSize = 0;
        this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
      }, () => {
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter GroupPollPage');
    if (!this.currentGroup) {
      if (this.paramProvider.paramsData.currentGroup) {
        console.log("LA DATA", this.paramProvider.paramsData);
        this.currentGroup = this.paramProvider.paramsData.currentGroup;
        this.paramProvider.paramsData = {};
      } else {
        console.log("NADA DE NADA");
        this.currentGroup = this.navParams.data;
      }
    }
    this.loadPolls();
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.currentUser = user;
      this.groupProvider.getGroupMembers(this.currentGroup.id).subscribe(members => {
        for(let memb of members) {
          if(memb.user_id == this.currentUser.id && memb.is_administrator) {
            this.isAdmin = true;
            //this.currentGroup.isAdmin = true;
          }
        }
      });
    });
  }

  dismiss() {
    this.appCtrl.getRootNav().setRoot(TabsPage, { tab: 'group' });
  }

  openGroupPollPage(groupId) {
    //this.navCtrl.push(ProfilePage, { memberId: memberId } );
  }

  addPoll() {
    this.navCtrl.push(PollFormPage, { group: this.currentGroup });
  }

  popOverPollOptions(event, poll) {
    let popover = this.popOverCtrl.create(GroupPollsPopoverPage, { poll: poll });
    popover.present({ ev: event });
  }

  openPoll(poll) {
    this.appCtrl.getRootNav().push(PollPage, { poll: poll });
  }


}
