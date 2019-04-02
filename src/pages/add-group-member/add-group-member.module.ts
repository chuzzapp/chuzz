import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddGroupMemberPage } from './add-group-member';

@NgModule({
  declarations: [
    AddGroupMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(AddGroupMemberPage),
  ],
  exports: [
    AddGroupMemberPage
  ]
})
export class AddGroupMemberPageModule {}
