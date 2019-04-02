import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { GroupProvider, ParamProvider } from '../../providers/providers';

import { GroupMembersPage } from '../group-members/group-members';
import { GroupPollsListPage } from '../group-polls-list/group-polls-list';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {

  currentGroup: any;
  tab1Root = GroupMembersPage;
  tab2Root = GroupPollsListPage;
  tab1Title = "";
  tab2Title = "";
  tabIndex: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private groupProvider: GroupProvider,
    private paramProvider: ParamProvider) {

    console.log('constructor GroupDetailPage');

    this.translateService.get(['GROUPS_MEMBERS_TITLE', 'GROUPS_POLLS_TITLE']).subscribe(values => {

      this.tab1Title = values['GROUPS_MEMBERS_TITLE'];
      this.tab2Title = values['GROUPS_POLLS_TITLE'];
    });

    if (this.navParams.get('group')) {
      this.currentGroup = this.navParams.get('group');
      //this.currentGroup.isAdmin = false;
    } else {
      let groupId = this.navParams.get('id');
      this.groupProvider.getGroup(groupId).subscribe(group => {
        this.paramProvider.paramsData.currentGroup = group;
      });
    }

    let tab = this.navParams.get('tab');
    if (tab == 'polls') {
      this.tabIndex = 1;
    } else {
      this.tabIndex = 0;
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter GroupDetailPage');

  }

  dismiss() {
    this.navCtrl.setRoot(TabsPage);
  }

}
