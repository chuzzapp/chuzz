import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePollsPage } from './profile-polls';

@NgModule({
  declarations: [
    ProfilePollsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePollsPage),
  ],
  exports: [
    ProfilePollsPage
  ]
})
export class ProfilePollsPageModule {}
