import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChuzzPage } from './group-chuzz';

@NgModule({
  declarations: [
    GroupChuzzPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChuzzPage),
  ],
  exports: [
    GroupChuzzPage
  ]
})
export class GroupChuzzPageModule {}
