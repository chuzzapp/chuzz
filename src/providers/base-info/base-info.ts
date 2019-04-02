import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

import { Api } from '../api';
import { getCountryList } from '../../utils/countries';

@Injectable()
export class BaseInfoProvider {

  constructor(public http: Http, public api: Api) {
    console.log('Hello BaseInfoProvider Provider');
  }

  getCountries() {
    return this.api.get(`base-info/countries`)
      .map(resp => resp.json());
  }

  getCountriesLocally() {
    return Observable.fromPromise(Promise.resolve(getCountryList()));
  }

  getCountryCode() {
    return this.http.get('http://api.ipstack.com/check?access_key=a7d4757be0ff3c3ec0c0ff425b13d616')
      .timeout(5000)
      .map(resp => resp.json().country_code);
  }

  getMessagesSystem() {
    return this.api.get(`base-info/messages-systems`)
      .map(resp => resp.json());
  }

}
