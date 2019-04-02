import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CelebrityListPage } from './celebrity-list';

@NgModule({
  declarations: [
    CelebrityListPage,
  ],
  imports: [
    IonicPageModule.forChild(CelebrityListPage),
  ],
  exports: [
    CelebrityListPage
  ]
})
export class CelebrityListPageModule {}
