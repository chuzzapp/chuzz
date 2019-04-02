import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { BasePage } from '../base-page'
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MessagesProvider } from '../../providers/providers';
//import { File } from '@angular/core';



/**
 * Generated class for the UserRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-ranking',
  templateUrl: 'user-ranking.html',
})
export class UserRankingPage extends BasePage {
  users: any[] = [];
  usersgt: any[] = [];
  usersby_cb: any[] = [];
  usersby_cbgt: any[] = [];
  usersby_fq: any[] = [];
  usersby_r: any[] = [];
  usersby_fqgt: any[] = [];
  position: number;
  position_p: number;
  loading: any;
  item: any[] = [];
  item_c: any[] = [];
  item_fa: any[] = [];
  item_r: any[] = [];
  position_c: number;
  position_r: number;
  position_f: number;
  position_c_p: number;
  position_r_p: number;
  position_f_p: number;
  isCelebrity: boolean;
  isAdmin: boolean;
  userId;
  emptyScreenImage: string;
  emptyScreenTitle: string = "";
  emptyScreenText: string = "";
  emptyScreenLoadingTitle: string = "";
  emptyScreenLoadingText: string = "";
  emptyScreenTitleAux: string = "";
  emptyScreenTextAux: string = "";
  messageConexionTitle = "";
  messageConexionText = "";
  goalsTitle: string = "";
  answerTitle: string = "";
  followersTitles: string = "";
  FirstAnswerTitle: string = "";
  ReferralsTitles: string = "";
  PdfTex: string = "";
  profilePlaceholderImage = "assets/img/profile_placeholder.png";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public loadingController: LoadingController,
    public translateService: TranslateService,
    public msgsProvider: MessagesProvider,
    protected menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private userProvider: UserProvider,
  ) {
    super(menuCtrl, navParams, navCtrl);
    let loadingtext = "";
    this.translateService.get([
      'LOADING_CONTENT', 'CONEXION_ERROR_MESSAGE_TITLE', 'CONEXION_ERROR_MESSAGE_TEXT',
      'EMPTY_SCREEN_GROUPS_TITLE', 'EMPTY_SCREEN_GROUPS_TEXT',
      'EMPTY_SCREEN_EVENTS_LOADING_TITLE', 'EMPTY_SCREEN_EVENTS_LOADING_TEXT', 'USER_ACHIEVEMENTS', 'POSITION_ANSWER','POSITION_REFERRALS','GENERATE_PDF', 'POSITION_FOLLOWERS', 'POSITION_FIRSTANSWER']).subscribe(values => {
        loadingtext = values['LOADING_CONTENT'];

        this.loading = this.loadingController.create({
          content: loadingtext
        });
        this.loading.present();
        this.goalsTitle = values['USER_ACHIEVEMENTS'];
        this.answerTitle = values['POSITION_ANSWER'];
        this.followersTitles = values['POSITION_FOLLOWERS'];
        this.FirstAnswerTitle = values['POSITION_FIRSTANSWER'];
        this.ReferralsTitles = values['POSITION_REFERRALS'];
        this.PdfTex = values['GENERATE_PDF'];
        this.emptyScreenLoadingTitle = values['EMPTY_SCREEN_EVENTS_LOADING_TITLE'];
        this.emptyScreenLoadingText = values['EMPTY_SCREEN_EVENTS_LOADING_TEXT'];
        this.emptyScreenTitleAux = values['EMPTY_SCREEN_GROUPS_TITLE'];
        this.emptyScreenTextAux = values['EMPTY_SCREEN_GROUPS_TEXT'];

        this.cambiaTituloPantallaVacia(true);

        this.messageConexionTitle = values['CONEXION_ERROR_MESSAGE_TITLE'];
        this.messageConexionText = values['CONEXION_ERROR_MESSAGE_TEXT'];
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRankingPage');
    this.loading.dismiss()
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      console.log("current user: ", this.userId)
      console.log("user:", user)
      this.isCelebrity = user.is_celebrity;
      this.isAdmin = user.is_admin;


    });
  
    this.userProvider.getUserBy().subscribe(r => {
      console.log("Records de la nueva funcion", r)
      var result = r.data.map(a => a.display_name);
      this.item = result;
      console.log("Resultado de solo los nombres", this.item)
      const mindex = r.data.findIndex(record => record.id === this.userId);
      console.log("Mi posicion actual: ", mindex + 1)
      this.position = mindex + 1;
      this.position_p = this.position * 0.50;
      function isBigEnough(element, index, array) {
        return (index == mindex);
      }
      this.users = r.data.filter(isBigEnough);
      console.log("usuarios con filtro de answer_count", this.users)
      r.data.sort(function (a, b) {
        return b.followers_count - a.followers_count

      })
      console.log("ordenados por followers_count", r.data)
      var result_c = r.data.map(a => a.display_name);
      this.item_c = result_c;
      const mindexf = r.data.findIndex(record => record.id === this.userId);

      this.position_c = mindexf + 1;
      this.position_c_p = this.position_c * 0.30;
      console.log("Mi posicion por followers_count", this.position_c)
      function isBigEnough2(element, index, array) {
        return (index == mindexf);
      }
      this.usersby_cb = r.data.filter(isBigEnough2);
      r.data.sort(function (a, b) {
        return b.first_answer_count - a.first_answer_count

      })
      console.log("ordenados por first_answer_count", r.data)
      var result_fa = r.data.map(a => a.display_name);
      this.item_fa = result_fa;
      const mindexa = r.data.findIndex(record => record.id === this.userId);

      this.position_f = mindexa + 1;
      this.position_f_p = this.position_f * 0.05;
      console.log("Mi posicion por first_answer_count", this.position_c)
      function isBigEnough3(element, index, array) {
        return (index == mindexa);
      }
      this.usersby_fq = r.data.filter(isBigEnough3);
      r.data.sort(function (a, b) {
        return b.referred_users_count - a.referred_users_count

      })
      console.log("ordenados por referred_users_count ", r.data)
      var result_r = r.data.map(a => a.display_name);
      this.item_r = result_r;
      const mindexr = r.data.findIndex(record => record.id === this.userId);

      this.position_r = mindexr + 1;
      this.position_r_p = this.position_r * 0.15;

      const total_percent = this.position_c_p + this.position_f_p + this.position_r_p + this.position_p;
      
      console.log("Mi posicion por referido", this.position_r)
      function isBigEnough4(element, index, array) {
        return (index == mindexr);
      }
      this.usersby_r = r.data.filter(isBigEnough4);
      //this.userProvider.actUserPercent(this.userId,total_percent);
    },
      error => {
        this.msgsProvider.createMessageAlert(this.messageConexionTitle, this.messageConexionText);

      });

  }

  dismiss() {
    this.navCtrl.pop();
  }
  private cambiaTituloPantallaVacia(loading: boolean = false) {
    if (loading) {
      this.emptyScreenTitle = this.emptyScreenLoadingTitle;
      this.emptyScreenText = this.emptyScreenLoadingText;
    } else {
      this.emptyScreenTitle = this.emptyScreenTitleAux;
      this.emptyScreenText = this.emptyScreenTextAux;
    }
  }
  makePdf() {
    let self = this;
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var docDefinition = {
      header: 'Ranking of Users',
      content: [

        'Ranking by Answer Count:',
        {

          ol: this.item,
          margin: [5, 2, 10, 20]


        },
        'Ranking by Followers Count:',
        {

          ol: this.item_c,
          margin: [5, 2, 10, 20]

        },
        'Ranking by First Answer:',
        {

          ol: this.item_fa,
          margin: [5, 2, 10, 20]


        }, 'Ranking by referrals:',
        {

          ol: this.item_r,
          margin: [5, 2, 10, 20]


        }
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 20,
          alignment: 'right'
        },
        sub_header: {
          fontSize: 18,
          alignment: 'right'
        },
        url: {
          fontSize: 16,
          alignment: 'right'
        }
      },
      pageSize: 'A4',
      pageOrientation: 'portrait'
    };
    //pdfmake.createPdf(docDefinition).open();

    pdfmake.createPdf(docDefinition).getBuffer(function (buffer) {
    let utf8 = new Uint8Array(buffer);
    let binaryArray = utf8.buffer;
    self.saveToDevice(binaryArray, "Ranking.pdf")
  }); 

  }
  saveToDevice(data: any, savefile: any) {
    let self = this;
    self.file.writeFile(self.file.externalDataDirectory, savefile, data, { replace: false });
    const toast = self.toastCtrl.create({
      message: 'File saved to your device',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



}
