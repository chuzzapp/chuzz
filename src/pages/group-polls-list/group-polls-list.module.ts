import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupPollsListPage } from './group-polls-list';

@NgModule({
  declarations: [
    GroupPollsListPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupPollsListPage),
  ],
  exports: [
    GroupPollsListPage
  ]
})
export class GroupPollListPageModule {}
