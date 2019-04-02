import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupPollsPopoverPage } from './group-polls-popover';

@NgModule({
  declarations: [
    GroupPollsPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupPollsPopoverPage),
  ],
  exports: [
    GroupPollsPopoverPage
  ]
})
export class GroupPollsPopoverPageModule {}
