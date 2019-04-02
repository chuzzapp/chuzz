import { Injectable } from "@angular/core";
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

// TODO: Rename ChuzzProvider to PollProvider
@Injectable()
export class PollProvider {
  constructor(public http: Http, public api: Api) {
    console.log("Hello PollzProvider Provider");
  }

  query(params?: any) {
    return this.api.get("chuzz", params).map(resp => resp.json());
  }

  getPollList(endpoint: string, params?: any) {
    return this.api.get("poll" + endpoint, params).map(resp => resp.json());
  }

  getPoll(pollId) {
    return this.api.get(`poll/${pollId}`).map(resp => resp.json());
  }

  getWelcomeChuzzId() {
    return this.api
      .get("chuzz-welcome")
      .timeout(5000)
      .map(resp => resp.json());
  }

  getChuzzQuestions(chuzzId) {
    return this.api
      .get(`chuzz/${chuzzId}/questions`, { page: 0 })
      .map(resp => resp.json());
  }

  getQuestionResult(chuzzId, questionId) {
    return this.api
      .get(`chuzz/${chuzzId}/questions/${questionId}/results`)
      .map(resp => resp.json());
  }

  saveUserAnswer(answer: any) {
    return this.api
      .post(`user_answers`, JSON.stringify(answer))
      .map(resp => resp.json());
  }

  submitAnswer(pollId: string, questionId: string, selectedChoiceId: string) {
    return this.api
      .post(
        `answer`,
        JSON.stringify({
          poll_id: pollId,
          answers: [
            { question_id: questionId, selected_choice_id: selectedChoiceId }
          ]
        })
      )
      .map(resp => resp.json());
  }



  createOrUpdatePoll(poll: any, questions: any[], isUpdate: Boolean) {
    if (isUpdate) {
      return this.updatePoll(poll, questions);
    } else {
      return this.createPoll(poll, questions);
    }
  }

  createPoll(poll: any, questions: any[]) {
    return this.api
      .post(`poll/`, JSON.stringify({ poll: poll, questions: questions }))
      .map(resp => resp.json());
  }
  createChuzzon(poll: any) {
    return this.api
      .post(`chuzzon/`, JSON.stringify({ poll: poll }))
      .map(resp => resp.json());
  }

  updatePoll(poll: any, questions: any[]) {
    return this.api
      .patch(`poll/`, JSON.stringify({ poll: poll, questions: questions }))
      .map(resp => resp.json());
  }
  deleteQuestionChoice(id) {
    return this.api.deleteRecord({ id: "choice/" + id });
  }
  deletePollQuestion(id) {
    return this.api.deleteRecord({ id: "question/" + id });
  }
  queryPollObject(nameObj: any, pollID: any) {
    return this.api.queryRecordObject(nameObj, pollID);
  }
  deletePollView(id) {
    return this.api.deleteRecord({ id: "poll_view/" + id });
  }
  deletePollTopic(id) {
    return this.api.deleteRecord({ id: "poll_topic/" + id });
  }
  deletePollCountry(id) {
    return this.api.deleteRecord({ id: "poll_country/" + id });
  }
  queryAnswer(c) {
    return this.api.queryRecord("answer", c);
  }
  deleteAnswer(id) {
    return this.api.deleteRecord({ id: "answer/" + id });
  }
  _deletePoll(id) {
    return this.api.deleteRecord({ id: "poll/" + id });
  }
  queryAnswerbyCreated(choiceID) {
   return this.api.queryAnswerbyCreatedAt("answer",choiceID);
  }
  updateFirstAnwersCount(id,value) {
    return this.api.actUserFirstAnswerCount(id,value);
  }
  public deletePoll(id) {
    //poll_view
    //poll_topic
    //poll_country
    //Choice
    //Answer
    //QuestionChoice
    //Question
    //Poll
    return this.queryPollObject('poll_view', id).then(records => {
      return Promise.all(
        records.map(v => {
          console.log("poll views", v);
          return this.deletePollView(v._id);
        })

      ).then(() => this.queryPollObject('poll_topic', id).then(records => {
        return Promise.all(
          records.map(t => {
            console.log("poll topic", t);
            return this.deletePollTopic(t._id);
          })

        ).then(

          () => this.queryPollObject('poll_country', id).then(records => {
            return Promise.all(
              records.map(c => {
                console.log("poll country", c);
                return this.deletePollCountry(c._id);
              })

            ).then(

              () => this.getPoll(id)
                .toPromise()
                .then(({ poll, questions }) => {
                  return Promise.all(
                    questions.map(q =>
                      Promise.all(
                        q.choices.map(c => {
                          console.log('choice to dele',c)
                         return this.queryAnswer(c.id).then(records =>
                          {
                            //return this.api.deleteRecord(records).then(() => this.deleteQuestionChoice(c.id))
                            return Promise.all(
                              records.map(r => {
                                console.log("answers result", r);
                                return this.deleteAnswer(r._id);
                              })
                            ).then(() => this.deleteQuestionChoice(c.id));

                          });

                        })
                      ).then(() => this.deletePollQuestion(q.id))
                    )
                  ).then(() => this._deletePoll(id));
                })
            );
          }));
      })
      );
    });
  }
  setPollDelete(id, is_deleted) {
    const Poll = this.api.skygear.Record.extend('poll');
    var pollDelete = new Poll({ _id: 'poll/' + id, deleted: is_deleted });
    return this.api.saveRecord(pollDelete);
  }

  likeChuzz(chuzzId, userId) {
    return this.api
      .post(`chuzz/${chuzzId}/like`, JSON.stringify({ user_id: userId }))
      .map(resp => resp.json());
  }

  getUsersThatAnswerred(chuzzId: number) {
    return this.api.get(`chuzz/${chuzzId}/users`).map(resp => resp.json());
  }

  getUsersAnswers(chuzzId: number, userId: number) {
    return this.api
      .get(`chuzz/${chuzzId}/user/${userId}/answers`)
      .map(resp => resp.json());
  }

  uploadPollImages(pollImage: any, pollId: string, choiceIdImagePairs: any[]) {
    var recordsToUpdate = [];

    if (pollImage) {
      var pollAsset = new this.api.skygear.Asset({
        name: "poll_pic",
        base64: removeMIMEFromDataURI(pollImage),
        contentType: "image/jpeg"
      });
      const Poll = this.api.skygear.Record.extend("poll");
      var poll = new Poll({ _id: "poll/" + pollId, image_id: pollAsset });

      recordsToUpdate.push(poll);
    }

    const Choice = this.api.skygear.Record.extend("choice");
    for (var index = 0; index < choiceIdImagePairs.length; index++) {
      var choiceAsset = new this.api.skygear.Asset({
        name: "choice_pic",
        base64: removeMIMEFromDataURI(choiceIdImagePairs[index].image),
        contentType: "image/jpeg"
      });
      var choice = new Choice({
        _id: "choice/" + choiceIdImagePairs[index].choiceId,
        image_id: choiceAsset
      });
      recordsToUpdate.push(choice);
    }

    return this.api.saveMultipleRecords(recordsToUpdate);
  }

  viewPoll(pollId: string) {
    return this.api.patch(`poll/${pollId}/view`, {}).map(resp => resp.json());
  }

  watchPoll(pollId: string, callback: Function) {
    this.api.subscribePubSubEvent("poll_" + pollId, callback);
  }

  unwatchPoll(pollId: string) {
    this.api.unsubscribePubSubEvent("poll_" + pollId);
  }

  publishPollEvent(pollId: string, type: string) {
    this.api.publishPubSubEvent("poll_" + pollId, { type });
  }
}
