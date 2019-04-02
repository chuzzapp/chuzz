import { Component } from '@angular/core';
import {
  IonicPage, NavController, LoadingController, MenuController, Platform
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { CelebrityProvider, MessagesProvider } from '../../providers/providers';
import { BasePage } from '../base-page';

@IonicPage()
@Component({
  selector: 'page-celebrity-list',
  templateUrl: 'celebrity-list.html',
})
export class CelebrityListPage extends BasePage {

  searchKeyword = "";
  loadingText = "";
  loading: any;
  listSize = 0;
  celebrities = [];  
  maxFetchedPage = 0;
  isLastPageReached = false;
  isClosing = false;
  unregisterBackButtonAction: Function;

  constructor(
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public platform: Platform,
    public msgsProvider: MessagesProvider,
    protected navCtrl: NavController,
    protected menuCtrl: MenuController,
    private celebrityProvider: CelebrityProvider
  ) {
    super(menuCtrl);

    this.translateService
      .get(['LOADING_CONTENT'])
      .subscribe(values => {
      this.loadingText = values['LOADING_CONTENT'];
    });

    this.platform.ready().then(() => {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.dismiss();
        this.unregisterBackButtonAction();
      });
    });
  }

  ionViewWillEnter() {
    this.loading = this.loadingController.create({
      content: this.loadingText,
    });

    this.loading.present();
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.getCelebrities(() => {
      this.loading.dismiss();
    });
  }

  dismiss() {
    this.isClosing = true;
    this.navCtrl.pop(); 
  }

  doInfinite(infiniteScroll) {
    if (this.isLastPageReached) {
      infiniteScroll.complete();
      return;
    }

    this.getCelebrities(() => {
      infiniteScroll.complete();
    });
  }

  follow(index: number) {
    let celebrityId = this.celebrities[index].id;
    this.celebrityProvider.followCelebrity(celebrityId).subscribe(ok => {
      this.celebrities[index].is_followed = ok;
      this.celebrities[index].followers_count += 1;
    })
  }

  unfollow(index: number) {
    let celebrityId = this.celebrities[index].id;
    this.celebrityProvider.unfollowCelebrity(celebrityId).subscribe(ok => {
      this.celebrities[index].is_followed = !ok;
      this.celebrities[index].followers_count -= 1;
    })
  }

  searchBarOnInput($event) {
    this.maxFetchedPage = 0;
    this.celebrities = [];
    this.isLastPageReached = false;
    this.getCelebrities(() => {
      this.loading.dismiss();
    });
  }

  private getCelebrities(callback = () => {}) {
    this.celebrityProvider.getCelebrities(this.searchKeyword.toLowerCase(), this.maxFetchedPage + 1).subscribe(resp => {
      if (resp.count > 0) {
        this.maxFetchedPage = resp.page;
        this.celebrities = this.celebrities.concat(resp.data);
        this.listSize += resp.count;
      } else {
        this.isLastPageReached = true;
      }

      callback();
    },
    error => {
      this.msgsProvider.createMessageAlert('Error', 'Cannot get celebrity list');
      callback();
    }); 
  }
}
