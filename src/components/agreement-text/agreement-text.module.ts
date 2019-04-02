import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgreementTextComponent } from './agreement-text';

@NgModule({
  declarations: [
    AgreementTextComponent,
  ],
  imports: [
    IonicPageModule.forChild(AgreementTextComponent),
  ],
  exports: [
    AgreementTextComponent
  ]
})
export class AgreementTextComponentModule {}
