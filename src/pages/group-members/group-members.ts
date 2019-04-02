import { Component } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams,
  LoadingController, ModalController, PopoverController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { GroupProvider, MessagesProvider, ParamProvider, UserProvider } from '../../providers/providers';

import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { AddGroupMemberPage } from '../add-group-member/add-group-member';
import { GroupMembersPopoverPage } from '../group-members-popover/group-members-popover';


@IonicPage()
@Component({ selector: 'page-group-members', templateUrl: 'group-members.html', })
export class GroupMembersPage {

  currentGroup: any;
  groupMembers: any;
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
    private modalCtrl: ModalController,
    public msgsProvider: MessagesProvider,
    public popOverCtrl: PopoverController,
    private userProvider: UserProvider, 
    private paramProvider: ParamProvider
  ) {

    console.log("DATA DE NAVPARAMS: ", this.navParams.data);
    this.translateService.get(['LOADING_CONTENT', 'EMPTY_SCREEN_GROUPS_MEMBERS_TITLE',
      'EMPTY_SCREEN_GROUPS_MEMBERS_TEXT', 'CONEXION_ERROR_MESSAGE_TITLE',
      'CONEXION_ERROR_MESSAGE_TEXT']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];

        this.empyScreenTitle = values['EMPTY_SCREEN_GROUPS_MEMBERS_TITLE'];
        this.empyScreenText = values['EMPTY_SCREEN_GROUPS_MEMBERS_TEXT'];

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

      });

    this.emptyScreenImage = 'assets/img/emptys_screens/ic_no_friends.png';
  }

  private loadMembers() {
    console.log("EL GRUPO: ", this.currentGroup);
    this.groupProvider.getGroupMembers(this.currentGroup.id)
      .subscribe(members => {
        this.groupMembers = members;
        if (this.groupMembers) {
          this.listSize = this.groupMembers.length;
        } else {
          this.listSize = 0;
        }
        console.log("LO MIEMBROS: ", this.groupMembers);
        for(let memb of members) {
          if(memb.user_id == this.currentUser.id && memb.is_administrator) {
            this.isAdmin = true;
            //this.currentGroup.isAdmin = true;
          }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupMembersPage');

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter GroupMembersPage');
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter GroupMembersPage');
    if (!this.currentGroup) {
      if (this.paramProvider.paramsData.currentGroup) {
        console.log("LA DATA", this.paramProvider.paramsData);
        this.currentGroup = this.paramProvider.paramsData.currentGroup;
        this.paramProvider.paramsData = {};
      } else {
        console.log("NADA DE NADA");
        this.currentGroup = this.navParams.data;
        console.log("DATA DE NAVPARAMS: ", this.navParams.data);
      }
    }
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.currentUser = user;
      this.loadMembers();
    });
  }

  dismiss() {
    this.appCtrl.getRootNav().setRoot(TabsPage, { tab: 'group' });
  }

  openProfilePage(memberId) {
    this.navCtrl.push(ProfilePage, { memberId: memberId });
    /*this.appCtrl.getRootNav().setRoot(ProfilePage, {
      memberId: memberId, 
      parent: 'group-members', 
      aux_id: this.currentGroup.id,
      aux_tab: 0
    } );*/
  }

  addMember() {
    //let newMembers;
    let addMemberModal = this.modalCtrl.create(AddGroupMemberPage, { members: this.groupMembers });
    this.loading = this.loadingController.create({
      content: this.loadingtext
    });
    this.loading.present();
    addMemberModal.onDidDismiss(data => {

      // SALVAR NUEVOS MIEMBROS
      this.groupProvider.addGroupMembers(this.currentGroup.id, { 
        group: { id: this.currentGroup.id, name: this.currentGroup.name }, 
        users: data 
      }).subscribe(() => {

          // RECERGAR MIEMBROS DEL SERVICIO
          this.loadMembers();
        },
        error => {
          this.loading.dismiss();
        });

    });
    addMemberModal.present();
  }

  popOverPollOptions(event, user) {
    let popover = this.popOverCtrl.create(GroupMembersPopoverPage, { user: user, isAdmin: this.isAdmin });
    popover.present({ ev: event });
    popover.onDidDismiss((refresh) => {
      if(refresh) {
        this.loadMembers();
      }
    });
  }

}
