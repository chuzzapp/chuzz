import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupSingleResultComponent } from './group-single-result';

@NgModule({
  declarations: [
    GroupSingleResultComponent,
  ],
  imports: [
    IonicPageModule.forChild(GroupSingleResultComponent),
  ],
  exports: [
    GroupSingleResultComponent
  ]
})
export class GroupSingleResultComponentModule {}
