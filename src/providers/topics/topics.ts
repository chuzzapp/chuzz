import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from '../api';

/*
  Generated class for the TopicsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TopicsProvider {

  constructor(public http: Http, public api: Api) {
    console.log('Hello TopicsProvider Provider');
  }

  query(params?: any) {
    return this.api.get('topics', params)
      .map(resp => resp.json());
  }

  follow(topicIds: string[]) {
    return this.api.patch('topics/follow', JSON.stringify({topic_ids: topicIds}))
      .map(resp => resp.json());
  }

  currentFollow() {
    return this.api.get('topics/follow')
      .map(resp => resp.json());
  }

}
