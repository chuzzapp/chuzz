import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams,ModalController} from 'ionic-angular';
import { ChatroomPage } from '../chatroom/chatroom';
import { UserProvider } from '../../providers/providers';
import { Conversation } from '../../models/conversation'
/**
 * Generated class for the ConversationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation-list',
  templateUrl: 'conversation-list.html',
})
export class ConversationListPage {
  myConversations;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private userProvider: UserProvider,
    public modalCtrl: ModalController,
) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationListPage');
    this.loadConversations();
  }
  /** 
  openSettings() {
    this.presentSettingsModal();
  }

  presentSettingsModal() {
    let settingsModal = this.modalCtrl.create(SettingsPage);
    settingsModal.present();
  } */

  openConversation(conversation) {
    this.app.getRootNavs()[0].push(ChatroomPage, {conversation: conversation});
  }
  /*
  loadConversations() {

    this.userProvider.getConversationList().map((record) => {
      console.log("result",record)
    });

  }*/

  createConversation(){
    this.userProvider.createConversation('8843a92f-6005-4207-83ff-eac75ee76f6e');
  }
  sendmenssage(){
    this.userProvider.sendmessage();
  }
  loadConversations() {
    this.userProvider.getConversationList().then((conversations : any[]) => {
      console.log("convers", conversations)
      this.myConversations = conversations;

      
    }).catch(error => {
      console.log(error);
      console.log("Couldn't load conversations");
    });
  }

}
