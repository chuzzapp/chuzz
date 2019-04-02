import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from '../api';

import { Item } from '../../models/item';

@Injectable()
export class NotificationProvider {

  constructor(
    public http: Http, 
    public api: Api) {
    console.log('Hello NotificationProvider Provider');
  }

  getNotificationsForUSer(userId) {
    return this.api.get(`user/${userId}/notifications`)
      .map(resp => resp.json());
  }

  getNotificationCountForUSer(userId) {
    return this.api.get(`user/${userId}/notification-count`)
      .map(resp => resp.json());
  }

  resetNotificationForUSer(userId) {
    return this.api.get(`user/${userId}/reset-notification-count`)
      .map(resp => resp.json());
  }

}
