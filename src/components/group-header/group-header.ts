import { Component, Input } from '@angular/core';
import { App } from 'ionic-angular';

import { TabsPage } from '../../pages/tabs/tabs';
import { GroupEditPage } from '../../pages/group-edit/group-edit';


@Component({
  selector: 'group-header',
  templateUrl: 'group-header.html'
})
export class GroupHeaderComponent {

  @Input('group') group;
  @Input('isAdmin') isAdmin;

  text: string;

  constructor(public appCtrl: App) {
    console.log('Hello GroupHeaderComponent Component');
    this.text = 'Hello World';
  }

  editGroup() {
    this.appCtrl.getRootNav().push(GroupEditPage, { group: this.group  });
  }

  dismiss() {
    this.appCtrl.getRootNav().setRoot(TabsPage, { tab: 'group' });
  }

}
