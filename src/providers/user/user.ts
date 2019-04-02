import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Message } from '../../models/message';
import { RequestOptions, Headers } from '@angular/http';
import { Platform, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Api } from '../api';
import { removeMIMEFromDataURI } from '../../utils/image-helper';
import { ENV } from '@environment';
import { Device } from '@ionic-native/device';

@Injectable()
export class UserProvider {
  conversations;
  devicePlatform;
  constructor(
    public http: Http,
    public api: Api,
    private platform: Platform,
    private device: Device,
    private storage: Storage) {
    console.log('Hello UserProvider Provider');
  }

  updateApiAccessToken(token: string) {
    this.api.setAccessToken(token);
  }

  /**
   * Metodo para obtener lista de encuesta que el usuario halla respondido
   */
  getUserPolls(userId: number) {
    return this.api.get(`user/${userId}/polls`)
      .map(resp => resp.json());
  }

  getUserLikePolls(userId: number) {
    return this.api.get(`user/${userId}/polls?like=true`)
      .map(resp => resp.json());
  }

  /**
   * Devuelve una lista de las preguntas de una encuesta de un usuario
   */
  getUserPollQuestions(userId: number, pollId: number) {
    return this.api.get(`user/${userId}/poll/${pollId}/questions`)
      .map(resp => resp.json());
  }

  /**
   * Devuelve una lista de las respuestass de una encuesta de un usuario
   */
  getUserPollAnswers(userId: number, pollId: number) {
    return this.api.get(`user/${userId}/poll/${pollId}/answers`)
      .map(resp => resp.json());
  }

  getMetadata() {
    return this.api.get('user/metadata')
      .map(resp => resp.json());
  }

  updateMetadata(metadata: any) {
    return this.api.patch('user/metadata', metadata)
      .map(resp => resp.json());
  }

  getNotificationSettings() {
    return this.api.get('user/notification')
      .map(resp => resp.json());
  }

  updateNotificationSettings(settings: any) {
    return this.api.patch('user/notification', JSON.stringify(settings))
      .map(resp => resp.json());
  }
  

  register(user: any) {
    return this.api.post(`signup`, JSON.stringify(user))
      .map(resp => resp.json());
  }

  getUser(userId): Observable<any> {
    return this.api.get(`user/${userId}`)
      .map(resp => resp.json())
      .map(user => this.postProcessRetrievedUser(user));
  }
 
  getUserBypoll(by) {
    return this.api.queryRecordUser('user', by);
  }

  getUserBy(by = 'answers_count', page = 1, size = 10) {
    return this.api.get(`user/listBy?page=${page}&size=${size}&by=${by}`)
      .map(resp => resp.json());
  }

  getCurrentUser(): Observable<any> {
    return this.api.get('user/')
      .map(resp => resp.json())
      .map(user => this.postProcessRetrievedUser(user));
  }
  getUserSky(id){
    return this.api.queryUser('user',id)
  }
  getCachedCurrentUser() {
    let fallback = () => {
      return this.getCurrentUser()
        .toPromise()
        .then((user) => {
          this.storage.set('USER', user);
          return user;
        });
    };

    return this.storage.ready()
      .then(() => {
        return this.storage.get('USER').then((user) => {
          if (user) {
            return user;
          } else {
            return fallback();
          }
        });
      })
      .catch(() => {
        return fallback();
      });
  }
  /**
   *  getConversationList(){
   return this.api.getConversationList();
  }
   */
 
 
  createConversation(userID) {
    this.api.createDirectConversation();
  }
  sendmessage(){
    this.api.sendmessage();
  }
  getConversationList() {
    return new Promise((resolve,reject) => {
      console.log('getting conversation list');
      this.api.getSkygearChat().then(skygearchat => {
        console.log('skygearchat', skygearchat);
        skygearchat.getConversations().then(conversations => {
          console.log('conversations', conversations);
          this.conversations = conversations;
          resolve(conversations);
        }).catch(error => {
          reject(error);
        })
      });
    });
  }


  getMessages(conversation) {
  this.api.getMessages(conversation);
  }
  /* Realtime update */
  subscribeOneConversation(conversation, handler) {
    return new Promise((resolve, reject)=> {
      this.api.getSkygearChat().then(skygearchat => {
        var h = (update)=> {
          if (update.record && conversation.id == update.record.conversation.id) {
            handler(update);
          }
        }
        skygearchat.subscribe(h);

        resolve(h);
      });
    });
  }
/*
  getConversationTitle(conversation) {
    return new Promise((resolve, reject) => {
      this.api.getCurrentUser().then(user => {
        var userId = user["_id"];

        console.log("userId", userId);
        console.log("conversation.participant_ids", conversation.participant_ids);

        // Assume only one user
        var anotherUserId;

        for (var i in conversation.participant_ids) {
          var participantId = conversation.participant_ids[i];
          if (participantId !== userId) {
            anotherUserId = participantId;
          }
        }

        this.api.getUserProfile(anotherUserId).then(user=> {
          console.log('user as title');
          console.log(user);
          resolve(user['username']);
        }).catch(error=> {
          console.error(error);
          reject(error);
        });

      });
    });
  }
 */

  userHasTopicselected(userId: number) {
    return this.api.get(`user/${userId}/hasTopicsSelected`)
      .map(resp => resp.json());
  }

  sendValidationCode(email) {
    console.log('sendValidationCode');
    return this.api.post(`send_validation_code`, JSON.stringify({ email: email }))
      .map(resp => resp.json());
  }

  validateUser(userId, code) {
    return this.api.post(`user/${userId}/validate`, JSON.stringify({ code: code }))
      .map(resp => resp.json());
  }

  validateSignupInfo(user) {
    return this.api.post(`user/validate`, JSON.stringify(user))
      .map(resp => resp.json());
  }

  checkUserExists(email: string) {
    return this.api.post(`user/email`, JSON.stringify({ email: email }))
      .map(resp => resp.json());
  }
   checkUserExistsPhone(phone: string) {
    return this.api.post(`user/tel`, JSON.stringify({ phone_number: phone }))
      .map(resp => resp.json());
  }
   
  checkuserphone(phone: string){
    return this.api.checkUserPhone(phone);
  }
 actuserphone(id,phone){
  this.api.actUserPhoneValidated(id,phone);
 }

  login(loginData: any) {
    return this.api.post(`login`, JSON.stringify(loginData))
      .map(resp => resp.json());
  }

  updateUser(user): Observable<{ profile: any }> {
    return this.api.patch(`user`, JSON.stringify(user))
      .map(resp => resp.json())
      .map((resp) => {
        if (resp.profile && resp.profile.id) {
          return {
            ...resp,
            profile: this.postProcessRetrievedUser(resp.profile),
          }
        } else {
          return resp;
        }
      });
  }

  follow(follower_id, following_id) {
    return this.api.post(`user/${follower_id}/follow`, JSON.stringify({ celebrity_id: follower_id }))
      .map(resp => resp.json());
  }

  skygearAuth(email: string, code: string) {
    var authRequestBody: any = {
      provider: "email",
      action: "auth:login",
      api_key: this.api.apiKey,
      provider_auth_data: {
        email: email,
        code: code,
      }
    }
    return this.api.post(``, JSON.stringify(authRequestBody))
      .map(resp => resp.json());

    // return this.api.skygear.auth.loginWithProvider("email", {
    //   email: email,
    //   code: code
    // });
    // return this.api.skygear.lambda(`sso/email/login`, {
    //   email: email,
    //   code: code
    // });
  }
  skygearAuthSms( code: string, codegenerated:any) {
    var authRequestBody: any = {
      provider: "sms",
      action: "auth:login",
      api_key: this.api.apiKey,
      provider_auth_data: {
        code: code,
        codegenerated: codegenerated,
      }
    }
    return this.api.post(``, JSON.stringify(authRequestBody))
      .map(resp => resp.json());

    // return this.api.skygear.auth.loginWithProvider("email", {
    //   email: email,
    //   code: code
    // });
    // return this.api.skygear.lambda(`sso/email/login`, {
    //   email: email,
    //   code: code
    // });
  }
    /*
  registerNotification(deviceToken: string) {
    var deviceType = '';
    if (this.platform.is('iOS')) {
      deviceType = 'ios';
    } else if (this.platform.is('android')) {
      deviceType = 'android';
    }
  
    this.devicePlatform = this.device.platform;
    var deviceType ='';
   if (this.devicePlatform = "iOS") {
     deviceType = 'ios';
   } else if (this.devicePlatform = "Android") {
     deviceType = 'android';
   }
   console.log("DEVICE ENCONTRADO", deviceType);
    return Observable.fromPromise(
      this.api.skygear.push.registerDevice(deviceToken, deviceType, this.api.appId)
    );
  }*/
  registerNotification(deviceToken: string) {
    var deviceType = '';
    if (this.platform.is('ios')) {
      deviceType = 'ios';
    } else if (this.platform.is('android')) {
      deviceType = 'android';
    }
    
    return Observable.fromPromise(
      this.api.skygear.push.registerDevice(deviceToken, deviceType, this.api.appId)
    );
  }
  unregisterNotification() {
    return Observable.fromPromise(
      this.api.skygear.push.unregisterDevice()
    );
  }

  uploadProfileImage(image: any, userId: string) {
      var asset = new this.api.skygear.Asset({
      name: "profile_pic",
      base64: removeMIMEFromDataURI(image),
      contentType: "image/jpeg",
    });
    
    
    const User = this.api.skygear.Record.extend('user');
    var user = new User({ _id: 'user/' + userId, image_id: asset });
    return this.api.saveRecord(user);
  }

  linkWithInstagram(instagramProfile, countryId) {
    return this.api.post(`user/linkInstagram/country/${countryId}`, instagramProfile)
      .map(resp => resp.json());
  }
  linkWithFacebook(FacebookProfile, countryId) {
    return this.api.post(`user/linkFacebook/country/${countryId}`, FacebookProfile)
      .map(resp => resp.json());
  }
  linkWithGoogle(Googleprofile, countryId) {
    return this.api.post(`user/linkGoogle/country/${countryId}`, Googleprofile)
      .map(resp => resp.json());
  }
  saveFacebookData(profileid, field,pic){
    return this.api.actFacebookData(profileid, field, pic);
  }
  actUserPercent(id,value){
    return this.api.actUserPositionPercent(id,value);
  }

  clearUserAndToken(callback: Function) {
    this.storage.remove('USER').then(() => {
      this.api.clearAccesstoken().then(() => {
        callback();
      });
    });
  }
  
  setRefererCoupon(name:string){
    return this.api.saveReferenceCoupon(name);
  } 
  setemailv(code, phone){
    return this.api.savecodeverification(code,phone);
  }
  queryuserphone(email){
    return this.api.queryUserphone(email);
  }
  /**
   * updateUserReference(id,value) {
    return this.api.actUserFirstAnswerCount(id,value);
  }
   * 
   */
  getReferenceFound(name){
    return this.api.queryReferenceFound(name);
  }
  actReferenceFound(id, value:string){
    return this.api.actUserReference(id,value);
  }
  actReferenceCount(id, value){
    return this.api.actUserReferenceCount(id,value);
  }
  private removeMIMEFromDataURI(imageDataURI) {
    return imageDataURI.slice(imageDataURI.indexOf(',') + 1);
  }

  private getProfileImageUrlForUser(user) {
    const User = this.api.skygear.Record.extend('user');
    const query = new this.api.skygear.Query(User);
    query.equalTo('_id', user.id);
    return this.api.skygear.publicDB.query(query).then((records) => {
      if (records[0].image_id) {
        return records[0].image_id.url;
      } else {
        return "";
      }
    });
  }

  private postProcessRetrievedUser(user) {
    return {
      ...user,
      country_id: user.country_id || undefined,
      birthday: user.birthday || undefined,
      gender: user.gender || undefined,
      phone_number: user.phone_number || undefined,
      is_group_admin: false,
      answers_count: user.answers_count || 0,
      groups_count: user.groups_count || 0,
      likes_count: user.likes_count || 0,
      polls_count: user.polls_count || 0,
      followers_count: user.followers_count || 0,
      following_count: user.following_count || 0,
    };
  }
}
