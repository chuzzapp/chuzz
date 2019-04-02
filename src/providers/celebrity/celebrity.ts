import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Api } from '../api';

@Injectable()
export class CelebrityProvider{
  constructor(
    public http: Http, 
    public api:Api,) {
  }


  followInProcess = {};
  unfollowInProcess = {};

  getCelebrities(searchString='', page=1, size=20) {
    return this.api.get(`celebrity/?page=${page}&size=${size}&search=${searchString}`)
      .map(resp => resp.json());
  }

  followCelebrity(celebrityId) {
    if (this.followInProcess[celebrityId]) {
      return;
    } else {
      this.followInProcess[celebrityId] = true;
    }

    return this.api.get(`celebrity/${celebrityId}/follow`)
      .map(resp => {
        delete this.followInProcess[celebrityId];
        return resp.json().success
      });
  }
  
  unfollowCelebrity(celebrityId) {
    if (this.unfollowInProcess[celebrityId]) {
      return;
    } else {
      this.unfollowInProcess[celebrityId] = true;
    }

    return this.api.get(`celebrity/${celebrityId}/unfollow`)
      .map(resp => {
        delete this.unfollowInProcess[celebrityId];
        return resp.json().success
      });
  }
}
