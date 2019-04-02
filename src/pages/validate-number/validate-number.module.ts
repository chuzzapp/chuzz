import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidateNumberPage } from './validate-number';

@NgModule({
  declarations: [
    ValidateNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(ValidateNumberPage),
  ],
})
export class ValidateNumberPageModule {}
