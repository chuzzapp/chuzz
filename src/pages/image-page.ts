import { 
  ToastController, AlertController, Platform, ActionSheetController, MenuController, 
  NavParams, NavController, ModalController
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '../plugin/image-picker';
import { TranslateService } from '@ngx-translate/core';
import { ImageResizer } from '@ionic-native/image-resizer';
import { ImagePickerPage } from  '../pages/image-picker/image-picker';
import { Crop } from '@ionic-native/crop';
import { BasePage } from './base-page';

export abstract class ImagePage extends BasePage {

  protected imageFromTitle
  protected cameraText;
  protected libraryText;
  protected canceltext;
  protected obj;

  protected imageSize = 600;

  protected cameraOptions: CameraOptions
  protected libraryOptions
  protected resizerOptions

  protected imageResizer: ImageResizer = new ImageResizer();

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public crop: Crop,
    protected menuCtrl: MenuController,
    protected modalCtrl: ModalController,
    protected navParams: NavParams = null,
    protected navCtrl: NavController = null
  ) {
    super(menuCtrl, navParams, navCtrl);

    this.translateService.get([
      'CANCEL', 'PROFILE_FORM_IMAGE_FROM_CAMERA', 'PROFILE_FORM_IMAGE_FROM_LIBRARY',
      'PROFILE_FORM_IMAGE_FROM_TITLE']).subscribe(values => {

        this.canceltext = values['CANCEL']
        this.cameraText = values['PROFILE_FORM_IMAGE_FROM_CAMERA'];
        this.libraryText = values['PROFILE_FORM_IMAGE_FROM_LIBRARY'];
        this.imageFromTitle = values['PROFILE_FORM_IMAGE_FROM_TITLE'];
      });

    this.cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      cameraDirection : 1,
    };
    this.libraryOptions = {
      maximumImagesCount: 1,
      quality: 100
    };
    this.resizerOptions = {
      uri: undefined,
      folderName: "Protonet Messenger",
      quality: 100,
      width: this.imageSize,
      height: this.imageSize
    };

    if (this.platform.is('ios')) {
      this.resizerOptions.fileName = 'resize.jpg';
    }
  }

  imageFrom() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.imageFromTitle,
      buttons: [
        {
            text: this.cameraText,
            icon: 'camera',
            handler: () => { this.getPictureFromCamera() }
        },
        {
          text: this.libraryText,
          icon: 'images',
          handler: () => { this.getPictureFromAlbum() }
        },
        {
          text: this.canceltext,
          icon: 'close',
          role: 'cancel',
          handler: () => { console.log('Cancel clicked') }
        }
      ]
    });
    actionSheet.present();
  }

  protected abstract setImage(image): void;

  private getPictureFromCamera() {
    if (this.platform.is('cordova') !== true) {
      return;
    }
    console.log('Get picture from Camara');

    this.camera.getPicture(this.cameraOptions).then((uri) => {
      this.cropAndResizeImage(uri);
    }, 
    (err) => { this.showGetPictureError(err) });
  }

  private getPictureFromAlbum() {
    if (this.platform.is('cordova') !== true) {
      const modal = this.modalCtrl.create(ImagePickerPage);
      modal.onDidDismiss((data, role) => {
        if (data && data.imageUri) {
          this.setImage(data.imageUri);
        }
      });
      modal.present();
        
      return; 
    }
    console.log('Get picture from Album');


    this.imagePicker.hasReadPermission().then((ok) => {
      if (ok) {
        this.doGetPictures();
      } else {
        this.imagePicker.requestReadPermission().then(() =>{
          this.doGetPictures();
        });  
      }
    });
  }

  private doGetPictures() {
    this.imagePicker.getPictures(this.libraryOptions).then((uris) => {
      if (uris.length > 0) {
        this.cropAndResizeImage(uris[0]);
      }
    }, (err) => { this.showGetPictureError(err) });
  }

  private errorsToIgnore() {
    if (this.platform.is('ios')) {
      return [
        'no image selected',
      ]; 
    } else if (this.platform.is('android')) {
      return [
        'Camera cancelled.',
      ]; 
    }

    return [];
  }

  private showGetPictureError(err) {
    if (this.errorsToIgnore().indexOf(err) >= 0) {
      return;
    }
    
    let alert = this.alertCtrl.create({
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();
  }

  private cropAndResizeImage(uri) {
    this.crop.crop(uri, {quality: 100}).then((uri) => {
      var resizerOptions = this.resizerOptions;
      resizerOptions.uri = uri;
      this.imageResizer.resize(resizerOptions).then((url) => {
        this.convertToBase64(url, 'image/jpeg').then(
          data => {
            this.setImage(data.toString());
          }
        );
      });
    });
  }

  private convertToBase64(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }
}
