import { MenuController, NavParams, NavController } from 'ionic-angular';

export abstract class BasePage {

  originalMenuEnabled = null;
  isPushByMenu = false;
  shouldSkipNextMenuOpen = false;

  get isMainPage() {
    return false;
  }


  get shouldOpenMenuOnLeave() {
    return (
      this.isPushByMenu && 
      this.menuCtrl.isEnabled && 
      (this.navCtrl ? (this.navCtrl.getViews().length <= 2) : true) &&
      !this.shouldSkipNextMenuOpen
    );
  }
  
  constructor(
    protected menuCtrl: MenuController,
    protected navParams: NavParams = null,
    protected navCtrl: NavController = null
  ) {
  
    if (navParams && navParams.get('fromMenu')) { 
      this.isPushByMenu = true;
    }
  }

  ionViewDidEnter() {
    if (!this.isMainPage) {
      if (this.originalMenuEnabled === null) {
        this.originalMenuEnabled = this.menuCtrl.isEnabled();
      }
      this.menuCtrl.enable(false);
    } else {
      this.menuCtrl.enable(true);
    }   
  } 

  ionViewWillLeave() {
    if (!this.isMainPage) {
      this.menuCtrl.enable(this.originalMenuEnabled);
    }

    if (this.shouldOpenMenuOnLeave) {
      this.menuCtrl.open();
    }

    if (this.shouldSkipNextMenuOpen) {
      this.shouldSkipNextMenuOpen = false;
    }
  }
}
