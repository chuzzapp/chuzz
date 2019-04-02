import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserWelcomePage } from './user-welcome';

@NgModule({
  declarations: [
    UserWelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(UserWelcomePage),
  ],
  exports: [
    UserWelcomePage
  ]
})
export class UserWelcomePageModule {}
