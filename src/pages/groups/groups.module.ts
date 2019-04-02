import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupsPage } from './groups';
import { ChuzzHeaderPage } from '../chuzz-header/chuzz-header';

@NgModule({
  declarations: [
    GroupsPage,
    ChuzzHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsPage),
  ],
  exports: [
    GroupsPage
  ]
})
export class GroupsPageModule {}
