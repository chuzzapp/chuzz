import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, LoadingController, Searchbar} from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { TranslateService } from '@ngx-translate/core';
import { SOCIAL_SHARE_OPTIONS } from '../../utils/constants';

//PARA PRUEBAS
import { CONTACTS } from '../../mocks/contact-list-mock';
import { GroupProvider, MessagesProvider } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';



@IonicPage()
@Component({
  selector: 'page-add-group-member',
  templateUrl: 'add-group-member.html',
})
export class AddGroupMemberPage {

  @ViewChild('search') search: Searchbar;

  contactlist: any = [];
  contactsSelected: any;
  existingSelected: any;
  searchText;
  searchKeyword;

  activateSearchBar: boolean = false;
  contactsReady: boolean = false;
  maxFetchedPage = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private contacts: Contacts,
    private translateService: TranslateService,
    public loadingController: LoadingController,
    private viewCtrl: ViewController,
    public groupProvider: GroupProvider,
    private socialSharing: SocialSharing,
    public msgsProvider: MessagesProvider
  ) {

    this.contactsSelected = navParams.get('members');
    if (!this.contactsSelected) {
      this.contactsSelected = [];
    }
    this.existingSelected = [];

    translateService.get(['SEARCH_TITLE', 'LOADING_CONTENT']).subscribe(values => {
      this.searchText = values['SEARCH_TITLE'];
    });

  }

  private selectExisting() {
    for (var index = 0; index < this.contactlist.length; index++) {
      this.contactlist[index].added = -1;
      var element = this.contactlist[index];
      for (var x = 0; x < this.contactsSelected.length; x++) {
        var selected = this.contactsSelected[x];
        if (selected.user_id === element.id) {
          this.contactlist[index].added = x;
        }
        // if (selected.display_name === element.display_name
        //   && selected.phoneNumbers[0] === element.phoneNumbers[0]) {
        //   this.contactlist[index].added = -1;
        //   break;
        // }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGroupMemberPage');
    setTimeout(() => {
      this.search.setFocus();
 }, 1000);
    //ESTANDARIZAR OPCIONES DE BUSQUEDAS
    /*if (this.platform.is('cordova')) {
      var opts = {
        multiple: true,
        hasPhoneNumber: true,
        fields: ['displayName', 'name', 'phoneNumbers', 'emails']
      };

      this.contacts.find(['displayName', 'name', 'emails'], opts).then((contacts) => {
        this.contactlist = contacts;
        this.contactsReady = true;

        this.selectExisting();

      }, (error) => {
        this.contactsReady = true;
        console.log(error);
      });

    } else {
      // PARA PROPOSITOS DE PRUEBA
      this.contactlist = CONTACTS;
      this.selectExisting();
      this.contactsReady = true;
    }*/
  }

  dismiss(cancel) {
    if (!cancel) {
      this.viewCtrl.dismiss(this.contactsSelected);
    } else {
      this.viewCtrl.dismiss();
    }
  }

  addContact(contactIndex) {
    //Buscar contacto en base de datos
    let contact = this.contactlist[contactIndex];
    /*console.log(contact);
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      let phoneNumber = contact.phoneNumbers[0].value.replace(/ /g, '').replace(/-/g, '');
      phoneNumber = phoneNumber.substring(phoneNumber.length - 10)
      this.groupProvider.getUserByNumber(phoneNumber).subscribe(user => {
        this.contactsSelected.push({ user_id: user.id, is_administrator: false, displayName: user.display_name });        
        this.contactlist[contactIndex].added = this.contactsSelected.length - 1;
      }, () => {
        alert("El usuario no se encuentra registrado en Chuzz, puedes invitarlo.");
        this.socialSharing.shareWithOptions(SOCIAL_SHARE_OPTIONS);
      });
    }
    else {
      alert("El contacto no tiene numeros telefónicos.")
    }*/
    this.contactsSelected.push({ user_id: contact.id, is_administrator: false, display_name: contact.display_name });        
    this.contactlist[contactIndex].added = this.contactsSelected.length - 1;
  }

  removeContact(contactIndex) {
    let selected = this.contactsSelected[contactIndex];
    for (var index = 0; index < this.contactlist.length; index++) {
      var element = this.contactlist[index];
      if (selected.user_id === element.id) {
        this.contactlist[index].added = -1;
        break;
      }
      // if (selected.display_name === element.display_name
      //   && selected.phoneNumbers[0] === element.phoneNumbers[0]) {
      //   this.contactlist[index].added = -1;
      //   break;
      // }
    }
    this.contactsSelected.splice(contactIndex, 1);
  }

  searchContacts(ev) {
    let searchTerm = ev.target.value;
  }

  toggleSearchBar() {
    this.activateSearchBar = !this.activateSearchBar;
    //return this.activateSearchBar;
  }

  searchBarOnInput($event) {
    this.contactlist = [];
    this.maxFetchedPage = 0;
    //this.isLastPageReached = false;
    if(this.searchKeyword.length > 0) {
      this.getContacts(() => {
        //this.loading.dismiss();
      });
    }
  }
  private getContacts(callback = () => {}) {
    this.groupProvider.getUserBySearch(this.searchKeyword, this.maxFetchedPage + 1).subscribe(resp => {
      if (resp.count > 0) {
        this.maxFetchedPage = resp.page;
        this.contactlist = this.contactlist.concat(resp.data);
        //this.listSize += resp.count;
      } else {
        //this.isLastPageReached = true;
      }
      this.contactsReady = true;
      this.selectExisting();

      callback();
    },
    error => {
      this.msgsProvider.createMessageAlert('Error', 'Cannot get user list');
      callback();
    }); 
  }

}
