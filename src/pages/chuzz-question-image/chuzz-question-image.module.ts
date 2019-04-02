import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChuzzQuestionImagePage } from './chuzz-question-image';

@NgModule({
  declarations: [
    ChuzzQuestionImagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChuzzQuestionImagePage),
  ],
  exports: [
    ChuzzQuestionImagePage
  ]
})
export class ChuzzQuestionImagePageModule {}
