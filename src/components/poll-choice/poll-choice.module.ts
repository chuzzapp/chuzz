import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollChoiceComponent } from './poll-choice';

@NgModule({
  declarations: [
    PollChoiceComponent,
  ],
  imports: [
    IonicPageModule.forChild(PollChoiceComponent),
  ],
  exports: [
    PollChoiceComponent
  ]
})
export class PollChoiceComponentModule {}
