import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CHUZZLIST } from '../chuzz-list-mock';

@Injectable()
export class PollProvider {

    query(params?: any) {
        return Observable.create(observer => {
            observer.next(CHUZZLIST);
            observer.complete();
        });
    }

    getChuzz(chuzzId) {
        return Observable.create(observer => {
            observer.next(CHUZZLIST[0]);
            observer.complete();
        });
    }

    getChuzzQuestions(chuzzId) {
        return null;
    }

    getQuestionResult(chuzzId, questionId) {
        return null;
    }

    saveUserAnswer(answer: any) {
        return null;
    }

    likeChuzz(chuzzId, userId) {
        return null;
    }

}