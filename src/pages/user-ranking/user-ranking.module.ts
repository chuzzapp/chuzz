import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRankingPage } from './user-ranking';

@NgModule({
  declarations: [
    UserRankingPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRankingPage),
  ],
})
export class UserRankingPageModule {}
