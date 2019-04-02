import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from '../api';

/*
  Generated class for the TermsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TermsProvider {

  constructor(public http: Http, public api: Api) {
    console.log('Hello TermsProvider Provider');
  }

  query(params?: any) {
    return this.api.get('terms', params)
      .map(resp => resp.json());
  }

}
