import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddQuestionComponent } from './add-question';

@NgModule({
  declarations: [
    AddQuestionComponent,
  ],
  imports: [
    IonicPageModule.forChild(AddQuestionComponent),
  ],
  exports: [
    AddQuestionComponent
  ]
})
export class AddQuestionComponentModule {}
