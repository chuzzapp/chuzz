import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupMembersPopoverPage } from './group-members-popover';

@NgModule({
  declarations: [
    GroupMembersPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupMembersPopoverPage),
  ],
  exports: [
    GroupMembersPopoverPage
  ]
})
export class GroupMembersPopoverPageModule {}
