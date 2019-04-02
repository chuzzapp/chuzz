import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import { App, IonicPage, NavController,AlertController,ToastController, NavParams, LoadingController, MenuController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { PollProvider, MessagesProvider, UserProvider, ChuzzonProvider } from '../../providers/providers';

import { PollPage } from '../poll/poll';

import { MasonryLayoutPage } from '../layout/masonry-layout';

import { TutorialPage } from '../tutorial/tutorial'

@IonicPage()
@Component({
  selector: 'page-poll-list',
  templateUrl: 'poll-list.html',
})

export class PollListPage extends MasonryLayoutPage {

  polls: any;
  pollstrend: any;
  chuzzon: any[] = []
  polls_deleted_false: any;
  endpoint: string = ''
  listSize: number = 0;
  listSizeChuzzon: number = 0;
  currentPage: number = 1;
  loading: any;
  isTrending: boolean = false;
  hasReachedLastPage: boolean = false;
  excludePollIds: string[] = [];
  showSearchButton: boolean = false;
  showShareButton: boolean = false;
  showUnansweredDot: boolean = true;
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  empyScreenLoadingTitle: string = "";
  empyScreenLoadingText: string = "";
  empyScreenTitleAux: string = "";
  empyScreenTextAux: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  userDefaultProfileImage = "assets/img/profile_placeholder.png";
  pollCardDefaultImage = "assets/img/poll_card.png";
  chuzzonimage = "assets/img/ica-slidebox-img-3.png"
  ChuzzonOwner;
  resultfilter: any[] = [];
  Celebrity;
  cancelText: string = "";
  imgchuzzon: string;
  errorText;
  ms1;
  ms2;
  ms3;
  /*
    la propiedad bajoConsumoActivado indica si la modalidad de bajo consumo esta activada o no. Esto es utilizado para saber que elemento cargar o no cuando la conexion de internet sea por wifi o por datos moviles.
  */
  bajoConsumoActivado = true;

  loadingtext = "";

  title: string;

  gridAux: string = "";
  pollsOpacity = 'hidden-cards';

  get isMainPage() {
    return !this.title;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public pollProvider: PollProvider,
    public appCtrl: App,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    private storage: Storage,
    private userProvider: UserProvider,
    private chuzzonProvider: ChuzzonProvider,
    protected menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private events: Events
  ) {
    super(menuCtrl);

    let empyScreenTitleToLoad = "";
    let empyScreenTextToLoad = "";

    this.gridAux = navParams.data;

    if (navParams.data == "live") {
      this.endpoint = '/live';
      this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";
      empyScreenTitleToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
      empyScreenTextToLoad = 'EMPTY_SCREEN_EVENTS_TEXT';
      this.showShareButton = true;
      this.showSearchButton = false;
    } else if (navParams.data == "hot") {
      this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";
      this.endpoint = '/trending';
      empyScreenTitleToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
      empyScreenTextToLoad = 'EMPTY_SCREEN_EVENTS_TEXT';
      this.isTrending = true;
      this.showShareButton = true;
      this.showSearchButton = false;
    } else if (navParams.data == "celebrities") {
      this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";
      this.endpoint = '/celebrities';
      this.Celebrity = true;
      this.showSearchButton = true;
      this.showShareButton = false;
      empyScreenTitleToLoad = 'EMPTY_SCREEN_CELEBRITIES_TITLE';
      empyScreenTextToLoad = 'EMPTY_SCREEN_CELEBRITIES_TEXT';
      /*var newparamschuzz = { page: 1 }
      this.chuzzonProvider.getChuzzonList(this.endpoint, newparamschuzz).subscribe(result =>{
        console.log("resultado", result)
      },
      error => {
        this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
        
      });*/

    } else if (typeof (navParams.data) === 'object') {
      let category = navParams.data.category;
      this.showUnansweredDot = false;
      this.gridAux = category;
      if (category == "answered") {
        if (navParams.data.onTab) {
          this.showShareButton = true;
          this.showSearchButton = false;
        } else {
          this.title = 'POLL_LIST_ANSWERED';
        }
        this.endpoint = `/answered/${navParams.data.userId}`;
        this.emptyScreenImage = "assets/img/emptys_screens/ic_no_answered.png";
        empyScreenTitleToLoad = 'EMPTY_SCREEN_ANSWERED_EVENTS_TITLE';
        empyScreenTextToLoad = 'EMPTY_SCREEN_ANSWERED_EVENTS_TEXT';
      } else if (category == "created") {
        this.title = 'POLL_LIST_CREATED'
        this.endpoint = `/created/${navParams.data.userId}`;
        this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";
        empyScreenTitleToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
        empyScreenTextToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
      } else if (category == "drafts") {
        this.title = 'POLL_LIST_DRAFT'
        this.endpoint = `/drafts`;
        this.emptyScreenImage = "assets/img/emptys_screens/ic_no_events.png";
        empyScreenTitleToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
        empyScreenTextToLoad = 'EMPTY_SCREEN_EVENTS_TITLE';
      }
    } else if (navParams.data == "notifications") {
      this.emptyScreenImage = "assets/img/emptys_screens/ic_no_notifications.png";
      this.endpoint = '/notifications';
      empyScreenTitleToLoad = 'EMPTY_SCREEN_NOTIFICATIONS_TITLE';
      empyScreenTextToLoad = 'EMPTY_SCREEN_NOTIFICATIONS_TEXT';
      this.showShareButton = false;
      this.showSearchButton = false;
    }

    this.translateService.get([
      'LOADING_CONTENT', empyScreenTitleToLoad, empyScreenTextToLoad,
      'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT',
      'EMPTY_SCREEN_ANSWERED_EVENTS_TITLE', 'EMPTY_SCREEN_ANSWERED_EVENTS_TEXT','CANCEL','GENERAL_ERRROR_TEXT','CHUZZON_MSG_PART1','CHUZZON_MSG_PART2','CHUZZON_MSG_PART3']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];
        this.loading = this.loadingController.create({
          content: this.loadingtext
        });
        this.loading.present();
        this.cancelText = values['CANCEL'];
        this.errorText = values['GENERAL_ERRROR_TEXT'];
        this.empyScreenLoadingTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
        this.empyScreenLoadingText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];
        this.empyScreenTitleAux = values[empyScreenTitleToLoad];
        this.empyScreenTextAux = values[empyScreenTextToLoad];
        this.ms1 = values['CHUZZON_MSG_PART1'];
        this.ms2 = values['CHUZZON_MSG_PART2'];
        this.ms3 = values['CHUZZON_MSG_PART3'];

        this.changeEmptyScreenTitle(false);

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];

      });
      console.log("tamaño chuzzon", this.listSizeChuzzon)
      console.log("tamaño polls", this.listSize)
    this.events.subscribe('dismissFromPollPage', (result) => {
      console.log('dismissFromPollPage');
      this.updateMansoryGrid();
    });
  }

  private changeEmptyScreenTitle(loading: boolean = false) {
    if (loading) {
      this.empyScreenTitle = this.empyScreenLoadingTitle;
      this.empyScreenText = this.empyScreenLoadingText;
    } else {
      this.empyScreenTitle = this.empyScreenTitleAux;
      this.empyScreenText = this.empyScreenTextAux;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChuzzListPage');
    this.getPoll(1, () => this.loading.dismiss());
    if (this.Celebrity) {
      this.getchuzzon(1, () => this.loading.dismiss());
      
    } else {
      this.chuzzon = [];
      this.listSizeChuzzon = 0;
    }


  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    console.log('ionViewDidEnter ChuzzListPage');
    this.updateMansoryGrid();
  }

  private getPoll(page: number = 1, callback: Function) {
    var newparams = { page: page }
    if (this.isTrending && page > 1) {
      newparams['exclude_poll_ids'] = JSON.stringify(this.excludePollIds);
    }

    this.pollProvider.getPollList(this.endpoint, newparams)
      .subscribe(result => {
        var polls = result.polls;

        if (polls && polls.length > 0) {
          this.currentPage = page;
          if (page === 1) {
            this.pollsOpacity = 'hidden-cards';
            if (this.isTrending) {
              this.excludePollIds = result.exclude_poll_ids;
            }
          }

          if (page > 1) {
            this.polls = this.polls.concat(polls);
            this.polls = this.polls.filter(item => !item.deleted);
          } else {
            this.polls = polls;
            this.polls = this.polls.filter(item => !item.deleted);
          }
          this.listSize = this.polls.length;

          this.updateMansoryGrid();
        } else {
          this.hasReachedLastPage = true;
          if (page == 1) {
            this.listSize = 0;
            this.changeEmptyScreenTitle();
          }
        }

        if (callback) {
          callback();
        }
      },
      error => {
        if (!this.polls || this.polls.length === 0) {
          this.listSize = 0;
          this.changeEmptyScreenTitle();
        }

        this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);
        if (callback) {
          callback();
        }
      });
  }

  getchuzzon(page: number = 1, callback: Function) {
    var newparams = { page: 1 }
    this.chuzzonProvider.getChuzzonList(this.endpoint, newparams).subscribe(resultb => {
     
      
    if (page > 1) {
      newparams['exclude_poll_ids'] = JSON.stringify(this.excludePollIds);
    }
      this.pollProvider.getPollList('/trending', newparams)
      .subscribe(result => {
        var polls = result.polls;
          this.currentPage = page;
          if (page === 1) {
            this.pollsOpacity = 'hidden-cards';
              this.excludePollIds = result.exclude_poll_ids;
          }
         this.pollstrend = polls.filter(item => !item.deleted);
        if(this.polls == undefined){
          this.polls = [];
        }
        const resultArray = Object.keys(resultb).map(i => resultb[i])
        if (this.Celebrity) {
          this.chuzzon = resultArray[0];
          console.log("cuzz-on",this.chuzzon)
          var props = ['id'];
          var object2 = this.polls.concat(this.pollstrend);
          this.resultfilter = this.chuzzon.filter(function (o1) {
            return !object2.some(function (o2) {
              return o1.poll_id === o2.id;         
            });
          });
          this.chuzzon = this.resultfilter;
          this.chuzzon = this.getUniqueChuzzon(this.chuzzon, 'poll_id');
          this.listSizeChuzzon = this.chuzzon.length;
          console.log("chuzzon lnght",this.listSizeChuzzon)
      
        }
     
      },
      error => {
       
      });
     


    }, error => {
    
      console.log("error", error)

    });
  }
  onPollShareClick(chuzzon) {

    const prompt = this.alertCtrl.create({
      title: "Chuzz-on",
      message:  this.ms1 + chuzzon.description,
      buttons: [
        {
          text: this.cancelText,
          handler: data => {
          }
        },
        {
          text: "Chuzz-on",
          handler: data => {
            this.createChuzzOn(chuzzon.poll_id,chuzzon.description);
          }
        }
      ]
    })
    prompt.present()
  }
  createChuzzOn(pollid,name) {
    this.pollProvider.getPoll(pollid).subscribe((result) => {
      var polluserid = result.poll.user.id;
      if (result.poll.image == null) {
        this.imgchuzzon = this.pollCardDefaultImage;
      } else {
        this.imgchuzzon = result.poll.image
      }
      let chuzzonobject = {
        description: result.poll.name,
        start_time: result.poll.start_time,
        end_time: result.poll.end_time,
        image_id: this.imgchuzzon,
        id: result.poll.id,
        user_id: result.poll.user.id,

      }
      console.log("chuzzon", chuzzonobject)

      this.chuzzonProvider.createChuzzon(chuzzonobject).subscribe((result) => {
        const alert = this.alertCtrl.create({
          title: '¡Chuzz-on!',
          subTitle: this.ms2  + name + this.ms3,
          buttons: ['OK']
        });
        alert.present();

      }, () => {
        this.showError(this.errorText);
      });

    },
      () => {
        this.showError(this.errorText);
      });

  }

  getUniqueChuzzon(arr, comp) {
    const unique = arr
      .map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }

  openChuzzonPoll(pollid) {
    this.pollProvider.getPoll(pollid).subscribe((result) => {
      console.log("Resultado", result.poll)
      this.openPoll(result.poll)
    },
      () => {
        console.log(Error)
      });
  }
  openPoll(poll) {
    this.appCtrl.getRootNav().push(PollPage, { poll: poll });
  }

 

  likePoll(pollId) {
    // TODO: Implement like poll
    // this.userProvider.getCachedCurrentUser().then((user) => {
    //   this.pollProvider.likePoll(pollId, user.id).subscribe(
    //     () => {
    //       this.pollProvider.getPoll(pollId)
    //         .subscribe(dbPoll => {

    //           for (var index = 0; index < this.polls.length; index++) {
    //             var c = this.polls[index];
    //             if (c.id == dbPoll.id) {
    //               this.polls[index] = dbPoll;
    //               break;
    //             }
    //           }

    //           this.masonrisar('.grid-' + this.gridAux, '.grid-' + this.gridAux + '-item');

    //         });

    //     });
    // });
  }

  doRefresh(refresner) {
    this.changeEmptyScreenTitle(false);
    this.hasReachedLastPage = false;
    this.getPoll(1, () => refresner.complete());
    this.getchuzzon(1, () => refresner.complete());
  }

  doInfinite(infiniteScroll) {
    let nextPage = this.currentPage + 1
    this.getPoll(nextPage, () => infiniteScroll.complete());
  }
  public isBajoConsumoActivado() {
    return this.bajoConsumoActivado;
  }

  public timeSince(dateStr) {
    let date = new Date(dateStr);
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + "mon";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }

  dismiss() {
    this.navCtrl.pop();
  }

  postLayout() {
    this.pollsOpacity = 'show-cards';
  }

  private updateMansoryGrid() {
    this.masonrisar('.grid-' + this.gridAux, '.grid-' + this.gridAux + '-item');
  }
  private showError(message: string) {
    console.log('ERROR');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
