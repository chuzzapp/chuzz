import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import skygear from 'skygear';
import { Message } from '../models/message';
import skygearchat from 'skygear-chat';
import { ENV } from '@environment';
import { DateTime } from '../../node_modules/ionic-angular/umd';


(window as any).skygear = skygear;
(window as any).skygearchat = skygearchat;

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  url: string = ENV.API_URL;
  apiKey: string = ENV.API_KEY;
  appId: string = ENV.APP_ID;
  skygearAccessToken: string = undefined;
  skygear: any
  accessToken: any;
  isConfigurated = false;
  currentUser;
  

  defaultOptions: RequestOptions;

  constructor(public http: Http, private storage: Storage) {
    var headers = new Headers();
    headers.append('content-type', 'application/json;charset=UTF-8');
    this.defaultOptions = new RequestOptions({ headers: headers });

    this.storage.get('TOKEN').then((token) => {
      if (token) {
        this.setAccessToken(token);
      }
    });
    this.initSkygear();
  }
  
  initSkygear() {
    this.skygear = skygear;

    this.skygear.pubsub.onOpen(() => {
      console.log('Pubsub is ready!');
    });
    this.skygear.pubsub.onClose(() => {
      console.log('Pubsub is temporarily unavailable');
    });

    this.skygear.config({
      'endPoint': this.url,
      'apiKey': this.apiKey
    }).then(() => {
      console.log('skygear container is now ready for making API calls.');
      this.skygear.pubsub.reconfigure();
    }, (error) => {
      console.error(error);
    });
  }
  configSkygear() {
    return new Promise((resolve) => {
      skygear.config({
        'endPoint': this.url,
        'apiKey': this.apiKey,
      }).then(()=> {
        this.isConfigurated = true
        console.log("Skygear Ready");
        resolve(skygear);
      });
    });
  }

  setAccessToken(token: string) {
    this.skygearAccessToken = token;
    this.defaultOptions.headers.append('X-Skygear-Access-Token', token);
    this.skygear._auth._accessToken = token;
  }

  clearAccesstoken() {
    this.skygearAccessToken = undefined;
    this.skygear._auth._accessToken = null;
    this.defaultOptions.headers.delete('X-Skygear-Access-Token');
    return this.storage.remove('TOKEN');
  }
  
  getUserByEmail(email: any){
    const Records = skygear.Record.extend('user');
    const query = new skygear.Query(Records);
    query.equalTo('email', email);
    return skygear.publicDB.query(query);
  }

  saveRecord(record: any) {
    return this.skygear.publicDB.save(record);
  }

  deleteRecord(record: any) {
    console.log("Delete:", record)
    return new Promise((resolve, reject) => {
      this.skygear.publicDB.delete(record).then(resolve, reject)
    }).then(a => {
      console.log("Deleted:", { record, response: a })
      return a
    })
  }

  queryRecord(record: any, questionid: any) {
    const Records = skygear.Record.extend(record);
    const query = new skygear.Query(Records);
    query.equalTo('selected_choice_id', questionid);
    return skygear.publicDB.query(query);
  }
  queryAnswerbyCreatedAt(record: any, choice_id) {
    const Records = skygear.Record.extend(record);
    const query = new skygear.Query(Records);
    query.equalTo('poll_id', choice_id);
    query.addAscending('_created_at');
    return skygear.publicDB.query(query);
  }
  queryRecordObject(name: any, id: any) {
    const Records = skygear.Record.extend(name);
    const query = new skygear.Query(Records);
    query.equalTo('poll_id', id);
    query.limit = 3;
    return skygear.publicDB.query(query);
  }
  queryUser(record: any, id: any) {
    const Records = skygear.Record.extend(record);
    const query = new skygear.Query(Records);
    query.equalTo('_id', id);
    return skygear.publicDB.query(query);
  }
  queryUserphone(email: string) {
    const Records = skygear.Record.extend('user');
    const query = new skygear.Query(Records);
    query.equalTo('email', email);
    return skygear.publicDB.query(query);
  }
  saveReferenceCoupon(name: string) {
    const Reference = skygear.Record.extend('reference_coupon');
    skygear.publicDB.save(new Reference({
      'name': name,
    })).then((record) => {
      console.log(record);
    }, (error) => {
      console.error(error);
    });

  }
  savecodeverification(code: string, phone: string) {
    const currentTime = new Date();
    const EmailVerification = skygear.Record.extend('email_verification');
    skygear.publicDB.save(new EmailVerification({
      'code': code,
      'email': 'codefortest@test.com',
      'phone': phone,
      'revoked': false,
      'expired_at': currentTime
    })).then((record) => {
      console.log(record);
    }, (error) => {
      console.error(error);
    });

  }
  /**
   * 
   *   actUserFirstAnswerCount(record,recordiD,value) {
    const query = new skygear.Query(record);
    query.equalTo('_id', recordiD);

    skygear.publicDB.query(query)
      .then((records) => {
        const record = records[0];
        record['firstanswer_count'] = value;
        return skygear.publicDB.save(record);
      }).then((record) => {
        console.log('update success');
      }, (error) => {
        console.error(error);
      });
  }
   */
  actUserFirstAnswerCount(recordiD, value) {
    const User = skygear.Record.extend('user')
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      //_id: recordiD,
      first_answer_count: value
    }));
  }
checkUserPhone(phone: string){
  const Note = skygear.Record.extend('user');
  const query = new skygear.Query(Note);
  query.equalTo('phone_number', phone);
  return skygear.publicDB.query(query);
}
  actUserReference(recordiD, value:string) {
    const User = skygear.Record.extend('user')
    
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      reference_coupon_id: value
    }));
  }
  actUserPhoneValidated(recordiD, value) {
    const User = skygear.Record.extend('user')
    
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      phone_number: value,
      is_phone_validated: true
    }));
  }
  actUserPositionPercent(recordiD, value:string) {
    const User = skygear.Record.extend('user')
    
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      position_percentage: value
    }));
  }
  getchuzzon(){
    const Chuzzon = skygear.Record.extend('chuzzon');
    const query = new skygear.Query(Chuzzon);
    return skygear.publicDB.query(query);
  }
  comment(pollid){
    const Comment = skygear.Record.extend('comment');
    const query = new skygear.Query(Comment);
    query.equalTo('poll_id', pollid);
    return skygear.publicDB.query(query);
  }
  

  actUserReferenceCount(recordiD, value) {
    const User = skygear.Record.extend('user')
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      referred_users_count: value
    }));
  }
  actFacebookData(recordiD, value, pic) {
    /**
     * const picture = new skygear.Asset({
      name: pic,            // filename of your asset
      base64: 'iVBORw0KGgoAAAA...', // base64 of the file, no mime
      contentType: 'image/png'      // mime of the file
    }); */
    
    const User = skygear.Record.extend('user')
    
    skygear.publicDB.save(new User({
      _id: `user/${recordiD}`,
      display_name: value,
      image_id_by_fb: pic,
      is_linked_to_facebook: true
    }));
    
  }
  

  queryReferenceFound(name) {
    const Records = skygear.Record.extend('reference_coupon');
    const query = new skygear.Query(Records);
    query.equalTo('name', name);
    return skygear.publicDB.query(query);
  }

  queryRecordUser(name: any, by) {
    const Records = skygear.Record.extend(name);
    const query = new skygear.Query(Records);
    //query.addDescending('answers_count'); 
    //query.limit = 50;
    query.addDescending(by);
    return this.skygear.publicDB.query(query);
  }
  
  getSkygearChat() {
    if (this.isConfigurated) {
      console.log("Configed");
      skygearchat.skygear = skygear;

      return Promise.resolve(skygearchat);
    } else {
      let promise = new Promise(resolve => {
        this.configSkygear().then(skygear => {
          skygearchat.skygear = skygear; 
          resolve(skygearchat);
        });
      });
      return promise;
    }
  }
  createDirectConversation (){
    skygearchat.createDirectConversation('8843a92f-6005-4207-83ff-eac75ee76f6e', 'Greeting')
    .then(function (conversation) {
      // a new direct conversation is created
      console.log('Conversation created!', conversation);
    }, function (err) {
      console.log('Failed to create conversation');
    });
  }

  getConversationList() {
      const Conversation = skygear.Record.extend('conversation');
      const query = new skygear.Query(Conversation);
      return skygear.publicDB.query(query);
     
  }
sendmessage(){
 

  const message = "Hi! This is a plain text message!";
  
  skygearchat.createMessage('6accfe06-98c7-43b9-88a3-d82dd25a213f', message, null, null)
    .then(function (result) {
      console.log('Message sent!', result);
  });
}


getSkygear() {
  if (this.isConfigurated) {
    this.currentUser = skygear.currentUser;
    return Promise.resolve(skygear);
  }
  let promise = this.configSkygear();
  return promise;
}
getCurrentUser() {
  var skygearPromise = new Promise((resolve, reject) => {
  this.getSkygear()
    .then((skygear) => {
      console.log(`Skygear OK`);
      resolve(skygear.auth.currentUser);
    })
    .catch((error) => {
      console.log(`Skygear Error`);
      reject(error);
    });
  });
  return skygearPromise;
}
getUserProfile(userId) {
  return new Promise((resolve, reject) => {
    this.getSkygear().then(skygear => {
      const query = new skygear.Query(skygear.UserRecord);
      query.equalTo('_id', userId);
      skygear.publicDB.query(query).then((records) => {
        const record = records[0];
        console.log(record);
        resolve(record);
      }, (error) => {
        console.error(error);
        reject(error);
      });
    });
  });
}
convertMessage(msg) {
  var message = new Message({});
  message.message = msg.body;
  if (msg.attachment) {
    message.attachment = msg.attachment;
  }
  if (msg.metadata) {
    message.metadata = msg.metadata;
  }
  message.time = msg.createdAt;
  message.id = msg._id;
  message.sender = msg.ownerID;
  message.skygearRecord = msg;

  return message;
}
  /* Messages */
  parseMessages(messages) {
    var result = [];
    for (var i in messages) {
      var message = this.convertMessage(messages[i])

      if(!messages[i].deleted) {
        result.unshift(message);
      }
    }
    return result;
  }
getMessages(conversation) {
  let _me = this;
  return new Promise((resolve, reject) => {
    this.getSkygearChat().then(skygearchat => {

      const LIMIT = 9999;
      const currentTime = new Date();
      skygearchat.getMessages(conversation, LIMIT, currentTime)
        .then(function (messages) {
          //var parsedMessages = _me.parseMessages(messages);
          resolve(messages);
        }, function (error) {
          console.log('Error: ', error);
          reject(error);
        });

    });
  });
 
}
  getSkygearChat1() {
    if (this.isConfigurated) {
      console.log("Configed");
      skygearchat.skygear = skygear;

      return Promise.resolve(skygearchat);
    } else {
      let promise = new Promise(resolve => {
        this.configSkygear().then(skygear => {
          skygearchat.skygear = skygear; 
          resolve(skygearchat);
        });
      });
      return promise;
    }
  }


  saveMultipleRecords(records: any[]) {
    var recordTaskList = [];
    for (let record of records) {
      recordTaskList.push(this.skygear.publicDB.save(record));
    }
    return Promise.all(recordTaskList);
  }

  subscribePubSubEvent(event: string, callback: Function) {
    this.skygear.pubsub.on(event, callback);
  }

  unsubscribePubSubEvent(event: string) {
    this.skygear.pubsub.off(event);
  }

  publishPubSubEvent(event: string, data: any) {
    this.skygear.pubsub.publish(event, data);
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = this.defaultOptions;
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options).timeout(5000);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    if (!options) {
      options = this.defaultOptions;
    }
    return this.http.post(this.url + '/' + endpoint, body, options).timeout(20000);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    if (!options) {
      options = this.defaultOptions;
    }
    return this.http.put(this.url + '/' + endpoint, body, options).timeout(10000);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options).timeout(5000);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    if (!options) {
      options = this.defaultOptions;
    }
    return this.http.patch(this.url + '/' + endpoint, body, options).timeout(20000);
  }
}
