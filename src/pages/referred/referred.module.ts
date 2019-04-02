import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferredPage } from './referred';

@NgModule({
  declarations: [
    ReferredPage,
  ],
  imports: [
    IonicPageModule.forChild(ReferredPage),
  ],
})
export class ReferredPageModule {}
