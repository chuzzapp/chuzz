import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCertificatePage } from './user-certificate';

@NgModule({
  declarations: [
    UserCertificatePage,
  ],
  imports: [
    IonicPageModule.forChild(UserCertificatePage),
  ],
  exports: [
    UserCertificatePage
  ]
})
export class UserCertificatePageModule {}
