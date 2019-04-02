import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChuzzHeaderPage } from './chuzz-header';

@NgModule({
  declarations: [
    ChuzzHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(ChuzzHeaderPage),
  ],
  exports: [
    ChuzzHeaderPage
  ]
})
export class ChuzzHeaderPageModule {}
