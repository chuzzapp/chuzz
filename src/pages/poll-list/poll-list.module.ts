import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollListPage } from './poll-list';
import { ChuzzHeaderPage } from '../chuzz-header/chuzz-header';

@NgModule({
  declarations: [
    PollListPage,
    ChuzzHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(PollListPage),
  ],
  exports: [
    PollListPage
  ]
})
export class PollListPageModule {}
