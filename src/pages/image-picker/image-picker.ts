import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'image-picker',
  templateUrl: 'image-picker.html'
})
export class ImagePickerPage {

  @ViewChild('imageInput') imageInput: ElementRef;
  imageChangedEvent: any = null;
  croppedImageDataUri: string;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  chooseButtonClicked() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    }
  }
  
  useButtonClicked() {
    if (this.croppedImageDataUri) {
      this.dismiss({imageUri: this.croppedImageDataUri});
    } else {
      this.dismiss();
    }
  }

  fileChanged(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(image: string) {
    this.croppedImageDataUri = image;
  }

  dismiss(params:any = {}) {
    this.viewCtrl.dismiss(params);
  }
}

