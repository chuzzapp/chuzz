import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollGroupComponent } from './poll-group';

@NgModule({
  declarations: [
    PollGroupComponent,
  ],
  imports: [
    IonicPageModule.forChild(PollGroupComponent),
  ],
  exports: [
    PollGroupComponent
  ]
})
export class PollGroupComponentModule {}
