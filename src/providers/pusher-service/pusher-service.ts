import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare const Pusher: any;
@Injectable()
export class PusherServiceProvider {
  channel;
  constructor(public http: HttpClient) {
  var pusher = new Pusher("3a54c055924328ad4ac8", { 
    cluster: 'eu',
    forceTLS: true
  });
  this.channel = pusher.subscribe('data');
}

  public init(){
   return this.channel;
  }
}