import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/reduce";
import "rxjs/add/observable/zip";
import "rxjs/add/operator/do";

import "rxjs/add/observable/from";

import { Api } from "../api";

import { Item } from "../../models/item";
import { removeMIMEFromDataURI } from "../../utils/image-helper";
import { markParentViewsForCheckProjectedViews } from "@angular/core/src/view/util";

/*
  Generated class for the ChuzzonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChuzzonProvider {

  constructor(public http: Http, public api: Api) {
    console.log('Hello ChuzzonProvider Provider');
  }

  query(params?: any) {
    return this.api.get("chuzz", params).map(resp => resp.json());
  }

  createChuzzon(poll: any) {
    return this.api
      .post(`chuzzon/`, JSON.stringify({ chuzzon: poll}))
      .map(resp => resp.json());
  }

  /*getChuzzonList(endpoint: string, params?: any) {
    return this.api.get("chuzzon/" + endpoint, params).map(resp => resp.json());
  }*/
  getChuzzonList(endpoint: string, params?: any) {
    return this.api.get(`chuzzon/celebrities`)
      .map(resp => resp.json());
  }
  getChuzzonSkygear(){
    return this.api.getchuzzon();
  }
}
