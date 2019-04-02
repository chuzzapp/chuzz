import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UserProvider } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms';
class Port {
  public id: number;
  public name: string;
}
class Contacto {
  public displayName: string;
  public phoneNumbers: string;
}
/**
 * Generated class for the ReferredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-referred',
  templateUrl: 'referred.html',
})
export class ReferredPage {
  ports: Port[];
  port: Port;
  contactos: Contacto[];
  contacto: Contacto;
  selecionados: any[] = [];
  loading: any;
  loadingtext = "";
  messages: any = [];
  findcoupon: any = [];
  emptyScreenImage: string;
  empyScreenTitle: string = "";
  empyScreenText: string = "";
  referredText: string = "";
  contactlistText: string = "";
  sendText: string = "";
  searchTitle: string = "";
  closeTitle: string = "";




  listaContactos: any[] = [];

  constructor(public navCtrl: NavController, private sms: SMS, private contacts: Contacts, public loadingController: LoadingController, public navParams: NavParams, private socialSharing: SocialSharing, private userProvider: UserProvider, public viewCtrl: ViewController, public translateService: TranslateService) {
    this.translateService.get([
      'LOADING_CONTENT', 'EMPTY_SCREEN_EVENTS_TITLE', 'EMPTY_SCREEN_EVENTS_TEXT',
      'CONEXION_ERROR_MESSAGE_TITLE', 'REFERRED_TITLE', 'ADD_MEMBER_ALL_CONTACTS', 'SUBMIT', 'SEARCH_TITLE', 'CLOSE_TITLE']).subscribe(values => {
        this.loadingtext = values['LOADING_CONTENT'];
        this.loading = this.loadingController.create({
          content: this.loadingtext
        });

        this.referredText = values['REFERRED_TITLE'];
        this.contactlistText = values['ADD_MEMBER_ALL_CONTACTS'];
        this.sendText = values['SUBMIT'];
        this.searchTitle = values['SEARCH_TITLE'];
        this.closeTitle = values['CLOSE_TITLE'];
      });

    this.ports = [
      { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' },
      { id: 3, name: 'Navlakhi' }
    ];
    /**
     this.contactos = [
      { displayName: 'Mama', phoneNumbers: '+58 4246066755' },
      {  displayName: 'vecino', phoneNumbers: '+58 28564789' },
      {  displayName: 'papa', phoneNumbers: '4266066755' },
      { displayName: 'David Marcelo', phoneNumbers: '+58 42444566755' },
      {  displayName: 'Luis David', phoneNumbers: '54549' },
      {  displayName: 'kharla sofia', phoneNumbers: '+58 245789' },
      {  displayName: 'Antonio Sanchez', phoneNumbers: '424554755' },
      { displayName: 'Casa', phoneNumbers: '+58 42444566755' },
      {  displayName: 'Daniel Ortiz', phoneNumbers: '54549545' },
  ];*/
     

    this.cargarListaContactos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferredPage');
  }
  dismiss() {

    this.viewCtrl.dismiss();
  }
  
  cargarListaContactos() {
    this.contacts.find(["*"])
      .then(res => {
        console.log({ funcion: 'CargarListaContactos', res: res })
        let datosMostar: any[] = [];
        res.map((item) => {
          if (item.displayName != null && item.phoneNumbers != null) {
            datosMostar.push({ displayName: item.displayName, phoneNumbers: item.phoneNumbers })
          }
        })
        console.log({ funcion: 'CargarListaContactos', datosMostar: datosMostar })
        this.listaContactos = datosMostar;
        this.contactos = datosMostar;
      }, error => {
        console.log({ error: error })
      })
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
    var result = event.value.map(a => a.phoneNumbers);
    console.log("los id", result)

    var uniqueId = function () {
      return 'id-' + Math.random().toString(36).substr(2, 5);
    };
    var name = uniqueId();
    var tomensaje = `${name} download the app http://chuzzapp.com`;

    for (var index = 0; index < result.length; index++) {
      console.log("Id uno: ", result[index][0].value)
      //this.socialSharing.shareViaSMS(tomensaje, )
      this.sms.send(result[index][0].value, tomensaje).then(function (result) {
        //this.userProvider.setRefererCoupon(name);
      }, function (err) {
        //alert(err)
      });
    }


    return this.userProvider.setRefererCoupon(name);

    //this.selecionados = event.value;
  }/**
   *   uniqueName() {
     var uniqueId = function () {
      return 'id-' + Math.random().toString(36).substr(2, 5);
    };
    var name = uniqueId();
    var tomensaje = `${name} download the app http://chuzzapp.com`;
    this.userProvider.setRefererCoupon(name);
    for (var index = 0; index < this.contactos.length; index++) {
   
    this.socialSharing.shareViaSMS(tomensaje, null)
    .then(function (result) {
      //this.userProvider.setRefererCoupon(name);
    }, function (err) {
      console.log('error', err)
    });
    }
    
   
  }
   * 
   */


}
