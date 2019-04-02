import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController, AlertController,LoadingController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { GroupProvider, UserProvider } from '../../providers/providers';



@IonicPage()
@Component({
  selector: 'page-group-members-popover',
  templateUrl: 'group-members-popover.html',
})
export class GroupMembersPopoverPage {

  user: any;
  isAdmin: boolean;
  loading: any;
  userId;
  salir: boolean;
  eliminar: boolean;

 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public app: App,
    private userProvider: UserProvider,
    private groupProvider: GroupProvider,
    public loadingController: LoadingController,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController
  ) {
      this.user = this.navParams.get('user');
      this.isAdmin = this.navParams.get('isAdmin');
      this.ShowCurrentUser();
    
      


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupMembersPopoverPage');
  }

  view() {
     this.viewCtrl.dismiss().then(() => this.app.getRootNav().push(ProfilePage, { extUser: this.user.user_id })); 
     console.log("ID DEL USUARIO",this.user.user_id)
  }
  ShowCurrentUser() {

    /* Temporarily disable group features */
    this.userProvider.getCachedCurrentUser().then((user) => {
      this.userId = user.id;
      console.log("Este es el usuario actual", user.id);
      console.log("Este es el usuario del grupo", this.user.user_id)
   
   
      if(user.id==this.user.user_id){
      
        return this.salir = true;
      }
      if(user.id==this.user.user_id || this.isAdmin==true){
        
        return this.eliminar = true;
      }
     
    });
  }

  onGroupDeleteClick(){

    const prompt = this.alertCtrl.create({
      title: 'Leave Group',
      message: "Are you sure you want to leave the group ",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.delete()
          }
        }
      ]
    })
    prompt.present()
  }

  
  delete() {
    
    this.loading = this.loadingController.create({
      content: 'Procesando...'
    });
    this.loading.present();

    this.groupProvider.deleteGroupMember(this.user.id).then(() => {
      this.loading.dismiss();
      this.viewCtrl.dismiss(true);
    });
  }

  setAdmin() {
    this.viewCtrl.dismiss();
    
    this.loading = this.loadingController.create({
      content: 'Procesando...'
    });
    this.loading.present();

    this.groupProvider.setAdminGroupMember(this.user.id, true).then(() => {
      this.loading.dismiss();
      this.user.is_administrator = true;
    });
  }
}
