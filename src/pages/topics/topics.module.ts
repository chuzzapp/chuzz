import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicsPage } from './topics';

@NgModule({
  declarations: [
    TopicsPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicsPage),
  ],
  exports: [
    TopicsPage
  ]
})
export class TopicsPageModule {}
