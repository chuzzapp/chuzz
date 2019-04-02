import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollFormPage } from './poll-form';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [
    PollFormPage,
    FormsModule,
  ],
  imports: [
    IonicPageModule.forChild(PollFormPage),
    FormsModule,
  ],
  exports: [
    PollFormPage
  ]
})
export class PollFormPageModule {}
