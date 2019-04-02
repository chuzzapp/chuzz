import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupHeaderComponent } from './group-header';

@NgModule({
  declarations: [
    GroupHeaderComponent,
  ],
  imports: [
    IonicPageModule.forChild(GroupHeaderComponent),
  ],
  exports: [
    GroupHeaderComponent
  ]
})
export class GroupHeaderComponentModule {}
