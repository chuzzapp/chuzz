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
  TUTO_SLIDE3_TITLE1 = "";
  TUTO_SLIDE3_TITLE2 = "";
  TUTO_SLIDE3_TITLE3 = "";
  TUTO_SLIDE1_DES = "";
  TUTO_SLIDE2_DES = "";
  TUTO_SLIDE3_DES1= "";
  TUTO_SLIDE3_DES2= "";
  TUTO_SLIDE3_DES3= "";
  TUTO_SLIDE4_TITLE = "";
  TUTO_SLIDE4_DES = "";
  TUTO_SLIDE5_TITLE = "";
  TUTO_SLIDE5_DES = "";
  TUTO_SLIDE6_TITLE = "";
  TUTO_SLIDE6_DES = "";
  TITLE_DELETE_POLL = "";
  profiletitle ="";

  constructor(public navCtrl: NavController, public menu: MenuController, public translate: TranslateService) {
   
      this.translate.get([
        'TUTO_SLIDE1_TITLE',
        'TUTO_SLIDE1_DES',
        'TUTO_SLIDE2_TITLE',
        'TUTO_SLIDE2_DES',
        'TUTO_SLIDE3_TITLE1',
        'TUTO_SLIDE3_DES1',
        'TUTO_SLIDE3_TITLE2',
        'TUTO_SLIDE3_DES2',
        'TUTO_SLIDE3_TITLE3',
        'TUTO_SLIDE3_DES3',
        'TUTO_SLIDE4_TITLE',
        'TUTO_SLIDE4_DES',
        'TUTO_SLIDE5_TITLE',
        'TUTO_SLIDE5_DES',
        'TUTO_SLIDE6_TITLE',
        'TUTO_SLIDE3_TITLE1.0',
        'TUTO_SLIDE6_DES',]).subscribe(values => {
        console.log('Loaded values', values);
  
  
        this.TUTO_SLIDE1_TITLE = values['TUTO_SLIDE1_TITLE'];
        this.TUTO_SLIDE1_DES = values['TUTO_SLIDE1_DES'];
        this.TUTO_SLIDE2_TITLE = values['TUTO_SLIDE2_TITLE'];
        this.TUTO_SLIDE2_DES = values['TUTO_SLIDE2_DES'];
        this.TUTO_SLIDE3_TITLE1 = values['TUTO_SLIDE3_TITLE1'];
        this.TUTO_SLIDE3_DES1 = values['TUTO_SLIDE3_DES1'];
        this.TUTO_SLIDE3_TITLE2 = values['TUTO_SLIDE3_TITLE2'];
        this.TUTO_SLIDE3_DES2 = values['TUTO_SLIDE3_DES2'];
        this.TUTO_SLIDE3_TITLE3 = values['TUTO_SLIDE3_TITLE3'];
        this.TUTO_SLIDE3_DES3 = values['TUTO_SLIDE3_DES3'];
        this.TUTO_SLIDE4_TITLE = values['TUTO_SLIDE4_TITLE'];
        this.TUTO_SLIDE4_DES = values['TUTO_SLIDE4_DES'];
        this.TUTO_SLIDE5_TITLE = values['TUTO_SLIDE5_TITLE'];
        this.TUTO_SLIDE5_DES = values['TUTO_SLIDE5_DES'];
        this.TUTO_SLIDE6_TITLE= values['TUTO_SLIDE6_TITLE'];
        this.TUTO_SLIDE6_DES = values['TUTO_SLIDE6_DES'];
        this.TITLE_DELETE_POLL = values['TITLE_DELETE_POLL'];
        this.profiletitle = values['TUTO_SLIDE3_TITLE1.0'];
  
      
  
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
