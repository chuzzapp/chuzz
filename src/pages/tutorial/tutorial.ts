import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';

import { TranslateService } from '@ngx-translate/core';



export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  slidesMoving;
  SwipedTabsSlider;
  slidesHeight;
  TUTO_SLIDE1_TITLE = "";
  TUTO_SLIDE2_TITLE = "";
  TUTO_SLIDE3_TITLE = "";
  TUTO_SLIDE1_DES = "";
  TUTO_SLIDE2_OPC = "";
  TUTO_SLIDE2_OPC1 = "";
  TUTO_SLIDE2_OPC2 = "";
  TUTO_SLIDE3_MENUT = "";
  TUTO_SLIDE3_MENUD = "";
  TUTO_SLIDE3_PERFILT = "";
  TUTO_SLIDE3_PERFILD = "";
  TUTO_SLIDE4_TITLE = "";
  TUTO_SLIDE4_BUSCART = "";
  TUTO_SLIDE4_BUSCARD = "";
  TUTO_SLIDE4_FOLLOWT = "";
  TUTO_SLIDE4_FOLLOWD = "";
  TITLE_DELETE_POLL = "";

  constructor(public navCtrl: NavController, public menu: MenuController, public translate: TranslateService) {
  
      this.translate.get([
        'TUTORIAL_SLIDE1_TITLE',
      'TUTORIAL_SLIDE1_DESCRIPTION',
      'TUTORIAL_SLIDE2_TITLE',
      'TUTORIAL_SLIDE2_DESCRIPTION',
      'TUTORIAL_SLIDE3_TITLE',
      'TUTORIAL_SLIDE3_DESCRIPTION',
      'TUTO_SLIDE1_TITLE',
      'TUTO_SLIDE1_DES',
      'TUTO_SLIDE2_TITLE',
      'TUTO_SLIDE2_OPC',
      'TUTO_SLIDE2_OPC1',
      'TUTO_SLIDE2_OPC2',
      'TUTO_SLIDE3_TITLE',
      'TUTO_SLIDE3_MENUT',
      'TUTO_SLIDE3_MENUD',
      'TUTO_SLIDE3_PERFILT',
      'TUTO_SLIDE3_PERFILD',
      'TUTO_SLIDE4_TITLE',
      'TUTO_SLIDE4_BUSCART',
      'TUTO_SLIDE4_BUSCARD',
      'TUTO_SLIDE4_FOLLOWT',
      'TUTO_SLIDE4_FOLLOWD',
      'TITLE_DELETE_POLL',]).subscribe(values => {
        console.log('Loaded values', values);
  
  
        this.TUTO_SLIDE1_TITLE = values['TUTO_SLIDE1_TITLE'];
        this.TUTO_SLIDE2_TITLE = values['TUTO_SLIDE2_TITLE'];
        this.TUTO_SLIDE3_TITLE = values['TUTO_SLIDE3_TITLE'];
        this.TUTO_SLIDE1_DES = values['TUTO_SLIDE1_DES'];
        this.TUTO_SLIDE2_OPC = values['TUTO_SLIDE2_OPC'];
        this.TUTO_SLIDE2_OPC1 = values['TUTO_SLIDE2_OPC1'];
        this.TUTO_SLIDE2_OPC2 = values['TUTO_SLIDE2_OPC2'];
        this.TUTO_SLIDE3_TITLE = values['TUTO_SLIDE3_TITLE'];
        this.TUTO_SLIDE3_MENUT = values['TUTO_SLIDE3_MENUT'];
        this.TUTO_SLIDE3_MENUD = values['TUTO_SLIDE3_MENUD'];
        this.TUTO_SLIDE3_PERFILT = values['TUTO_SLIDE3_PERFILT'];
        this.TUTO_SLIDE3_PERFILD = values['TUTO_SLIDE3_PERFILD'];
        this.TUTO_SLIDE4_TITLE = values['TUTO_SLIDE4_TITLE'];
        this.TUTO_SLIDE4_BUSCART = values['TUTO_SLIDE4_BUSCART'];
        this.TUTO_SLIDE4_BUSCARD = values['TUTO_SLIDE4_BUSCARD'];
        this.TUTO_SLIDE4_FOLLOWT = values['TUTO_SLIDE4_FOLLOWT'];
        this.TUTO_SLIDE4_FOLLOWD = values['TUTO_SLIDE4_FOLLOWD'];
        this.TITLE_DELETE_POLL = values['TITLE_DELETE_POLL'];
  
      
  
      });
      
  }

  startApp() {
    this.navCtrl.setRoot(WelcomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  slideDidChange() {
    setTimeout(() => { this.updateSliderHeight(); }, 1200);
  }
  slideWillChange() {
    this.slidesMoving = true;
  }
  updateSliderHeight() {
    this.slidesMoving = false;
    let slideIndex: number = this.SwipedTabsSlider.getActiveIndex();
    let currentSlide: Element = this.SwipedTabsSlider._slides[slideIndex];
    this.slidesHeight = currentSlide.clientHeight;

    console.log('index slide', slideIndex)
    console.log('current slide', currentSlide)
    console.log('height of slide', this.slidesHeight);

  }

}
