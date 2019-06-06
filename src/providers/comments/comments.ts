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
  Generated class for the CommentsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommentsProvider {

  constructor(public http: Http, public api: Api) {
    console.log('Hello CommentsProvider Provider');
  }

  query(params?: any) {
    return this.api.get("comment", params).map(resp => resp.json());
  }

  createComment(info: any) {
    return this.api
      .post(`comment/`, JSON.stringify({ comment: info}))
      .map(resp => resp.json());
  }
  deleteComment(id){
    
      return this.api.deleteRecord({ id: 'comment/' + id})
    
  }

  
  getCommentListBypoll(pollid:string) {
    return this.api.get(`comment/${pollid}`)
      .map(resp => resp.json());
  }
  getCommentListByPollSkygear(pollid){
    return this.api.comment(pollid);
  }
  getCommentlistTest(){
    let data;
    return data = {
      "headerTitle": "Commnets Basic",
      "allComments": "2121 Comments",
      "items": [
          {
              "id": 1,
              "image": "assets/img/extras/users/img_1.jpg",
              "title": "Erica Romaguera",
              "time": "18 August 2018 at 12:20pm",
              "description": "If you could have any kind of pet, what would you choose?"
          },
          {
              "id": 2,
              "image": "assets/img/extras/users/img_2.jpg",
              "title": "Caleigh Jerde",
              "time": "18 August 2018 at 8:13pm",
              "description": "If you could learn any language, what would you choose?"
          },
          {
              "id": 3,
              "image": "assets/img/extras/users/img_3.jpg",
              "title": "Lucas Schultz",
              "time": "18 August 2018 at 5:22pm",
              "description": "Life is about making an impact, not making an income."
          },
          {
              "id": 4,
              "image": "assets/img/extras/users/img_4.jpg",
              "title": "Carole Marvin",
              "time": "18 August 2018 at 7:36am",
              "description": "I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel"
          },
          {
              "id": 5,
              "image": "assets/img/extras/users/img_5.jpg",
              "title": "Doriana Feeney",
              "time": "18 August 2018 at 5:28am",
              "description": "Definiteness of purpose is the starting point of all achievement."
          },
          {
              "id": 6,
              "image": "assets/img/extras/users/img_6.jpg",
              "title": "Nia Gutkowski",
              "time": "18 August 2018 at 11:27pm",
              "description": "Life is what happens to you while you’re busy making other plans"
          }
      ]    
    };
  }
  

}
