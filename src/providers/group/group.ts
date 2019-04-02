import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/zip'
import 'rxjs/add/observable/from'

import { Api } from '../api';

import { removeMIMEFromDataURI } from '../../utils/image-helper';

@Injectable()
export class GroupProvider {

  constructor(
    public http: Http,
    public api: Api) {
    console.log('Hello GroupProvider Provider');
  }

  getGroup(groupId: number) {
    return this.api.get(`groups/${groupId}`)
      .map(resp => resp.json());
  }

  getUserGroups(userId: number) {
    return this.api.get(`user/${userId}/groups`)
      .map(resp => resp.json());
  }

  getGroupMembers(groupId: number) {
    return this.api.get(`group/${groupId}/users`)
      .map(resp => resp.json());
  }

  getGroupPollQuestions(groupId: number, pollId: number) {
    return this.api.get(`group/${groupId}/poll/${pollId}/questions`)
      .map(resp => resp.json());
  }

  getGroupPollAnswers(groupId: number, pollId: number, questionId) {
    return this.api.get(`group/${groupId}/poll/${pollId}/question/${questionId}/results`)
      .map(resp => resp.json());
  }

  getGroupPolls(groupId: number) {
    return this.api.get(`group/${groupId}/polls`)
      .map(resp => resp.json());
  }

  saveGrouPoll(groupId: number, pollObject: any) {
    return this.api.post(`group/${groupId}/poll`, JSON.stringify(pollObject))
      .map(resp => resp.json());
  }

  saveGroup(groupObject: any) {
    return this.api.post(`group/`, JSON.stringify(groupObject))
      .map(resp => resp.json());
  }

  addGroupMembers(groupId: number, members: any) {
    return this.api.post(`group/${groupId}/users`, JSON.stringify(members))
      .map(resp => resp.json());
  }

  deleteGroupMember(id) {
    return this.api.deleteRecord({ id: 'user_group/' + id });
  }


  deleteGroupPoll(id){
    return this.api.deleteRecord({ id: 'poll/' + id})
  }

  public deleteGroup(id) {
    //polls
    //members
    const members$ = this.getGroupMembers(id).map(members => {
      members.map(member => this.deleteGroupMember(member.id))
    })
    const polls$ = this.getGroupPolls(id).map(polls => {
      polls.map(poll => this.deleteGroupPoll(poll.id))
    })
    return Observable.zip(members$, polls$).map(() => {
      return Observable.from(this.api.deleteRecord({id: 'group/' + id }))
    })
  }

  setAdminGroupMember(id, is_administrator) {
    const UserGroup = this.api.skygear.Record.extend('user_group');
    var userGroup = new UserGroup({ _id: 'user_group/' + id, is_administrator: is_administrator });
    return this.api.saveRecord(userGroup);
  }

  toggleStarGroup(groupId: number, userId: number) {
    return this.api.post(`group/${groupId}/highlight`, JSON.stringify({ user_id: userId }))
      .map(resp => resp.json());
  }

  togglenotificationForGroup(groupId: number, userId: number) {
    return this.api.post(`group/${groupId}/notificate`, JSON.stringify({ user_id: userId }))
      .map(resp => resp.json());
  }

  getPollGroupOwner(groupId: number, pollId: number) {
    return this.api.get(`group/${groupId}/poll/${pollId}/owner`)
      .map(resp => resp.json());
  }

  uploadGroupImage(image: any, grouprId: string) {
    var asset = new this.api.skygear.Asset({
      name: "group_pic",
      base64: removeMIMEFromDataURI(image),
      contentType: "image/jpeg"
    });
    const Group = this.api.skygear.Record.extend('group');
    var group = new Group({ _id: 'group/' + grouprId, image_id: asset });
    return this.api.saveRecord(group);
  }

  editGroup(grouprId: string, name: string) {
    const Group = this.api.skygear.Record.extend('group');
    var group = new Group({ _id: 'group/' + grouprId, name: name });
    return this.api.saveRecord(group);
  }

  getUserByNumber(number: string) {
    return this.api.get(`user/byNumber/${number}`)
      .map(resp => resp.json());
  }

  getUserBySearch(searchString = '', page = 1, size = 20) {
    return this.api.get(`user/bySearch?page=${page}&size=${size}&search=${searchString}`)
      .map(resp => resp.json());
  }

}
