import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the TimeUtilsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TimeUtilsProvider {

  constructor(public http: Http) {
    console.log('Hello TimeUtilsProvider Provider');
  }

  public timeSince(dateStr) {
    let date = new Date(dateStr);
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + "mon";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }

}
