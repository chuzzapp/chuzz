import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagePickerPage } from './image-picker';


@NgModule({
  declarations: [
    ImagePickerPage
  ],
  imports: [
    IonicPageModule.forChild(ImagePickerPage),
    ImageCropperModule,
  ],
  exports: [
    ImagePickerPage
  ]
})
export class ImagePickerPageModule {}

