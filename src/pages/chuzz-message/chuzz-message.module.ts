import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChuzzMessagePage } from './chuzz-message';

@NgModule({
  declarations: [
    ChuzzMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChuzzMessagePage),
  ],
  exports: [
    ChuzzMessagePage
  ]
})
export class ChuzzMessagePageModule {}
