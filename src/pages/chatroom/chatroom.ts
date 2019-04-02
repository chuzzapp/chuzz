import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/providers';
import { Api } from '../../providers/providers';
import { ViewChild, NgZone } from "@angular/core";
import { Content, TextInput } from "ionic-angular";
import { ImagePicker } from "@ionic-native/image-picker";
import skygear from "skygear";
import { File } from "@ionic-native/file";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Platform } from "ionic-angular";
import { Media } from "@ionic-native/media";
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
  providers: [ImagePicker, File, PhotoViewer, Media]
})
export class ChatroomPage {

  conversation;
  title = "";
  productContext;
  editorMsg = "";
  msgList;
  shouldShowTextMessageBar = true;
  audioFile;
  audioRecordingStartTime; //getDuration not working https://github.com/apache/cordova-plugin-media/pull/94/files
  audioRecordingEndTime;
  audioFilePlaying;
  audioFilePlayingURL = "";
  loader;
  //You may also store the user object here for easier info access
  userId: string;
  toUserId: string;

  handler;

  @ViewChild(Content) content: Content;
  @ViewChild("chat_input") messageInput: TextInput;



  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private imagePicker: ImagePicker,
    private photoViewer: PhotoViewer,
    private platform: Platform,
    private media: Media,
    private file: File,
    private userProvider: UserProvider,
    private api: Api,
    private zone: NgZone,
    private loadingCtrl: LoadingController
  ) {

    this.conversation = navParams.get("conversation");

    this.title = this.conversation.title;


    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      console.log("user", this.userId)
      console.log("this.conversation.participant_ids", this.conversation.participant_ids);
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatroomPage');
    /**
     * 
     
    if (!this.conversation) {return;}
    
        this.api.getMessages(this.conversation.skygearRecord).then((result) => {
          this.msgList = result;
          //this.scrollToBottom();
         // this.subscribeMessageUpdate();
        }).catch((error) => {
          console.log("My error:",error);
          alert("Couldn't load messages :( ");
        });*/
  }
/*
  pushNewMsg(msg) {
    this.msgList.push(msg);
    this.scrollToBottom();

    return msg;
  }

  scrollToBottom() {
    setTimeout(() => {
        if (this.content) {
            this.content.scrollToBottom();
        }
    }, 400);
  }

  // TODO: Fix me
  h;
  
    subscribeMessageUpdate() {
      this.userProvider.subscribeOneConversation(this.conversation.skygearRecord, (update) => {
      console.log("update", update);
      if (update.event_type == "create") {
        this.pushNewMsg(this.userProvider.convertMessage(update.record));
      } else if (update.event_type == "update"){
        // handle message update here
      }
    }).then(h => {
        this.h = h;
      });
    }*/

}
