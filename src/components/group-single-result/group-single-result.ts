import { Component, Input } from '@angular/core';

import { PollProvider } from '../../providers/providers';

@Component({
  selector: 'group-single-result',
  templateUrl: 'group-single-result.html'
})
export class GroupSingleResultComponent {

  @Input('questions') questions;
  currentUser: any = 1;
  currentUserObj: any;
  users: any;

  currentQuestion: any;
  currentQuestionAnswer: number;
  currentQuestionIndex: number = 1;
  totalQuestions: number = 0;

  constructor(private pollProvider: PollProvider) {
    console.log('Hello GroupSingleResultComponent Component');
  }

  ngOnChanges() {
    this.currentQuestion = this.questions[0];
    this.totalQuestions = this.questions.length;

    if (this.currentQuestion) {
      this.pollProvider.getUsersThatAnswerred(this.currentQuestion.chuzz_id)
        .subscribe((users) => {
          this.users = users;
          if (this.users && this.users.length > 0) {
            this.currentUser = this.users[0].id;
            this.currentUserObj = this.users[0];

            this.users.forEach(user => {
              this.pollProvider.getUsersAnswers(this.currentQuestion.chuzz_id, user.id)
                .subscribe((answers) => {
                  user.answers = answers;
                  if (user.id === this.currentUser) {
                    this.getAnswer(answers);
                  }
                });
            });
          }
        });
    }

  }

  private getAnswer(answers) {
    this.currentQuestionAnswer = -1;
    for (var index = 0; index < answers.length; index++) {
      var answer = answers[index];
      if (this.currentQuestion.id === answer.question_id) {
        this.currentQuestionAnswer = answer.option_id;
        break;
      }
    }
  }

  private getCurrentUserObj(userID: number) {
    for (var index = 0; index < this.users.length; index++) {
      var u = this.users[index];
      if (u.id === userID) {
        this.currentUserObj = u;
        break;
      }
    }
  }

  optionSelected(event) {
    this.getCurrentUserObj(this.currentUser);
    this.getAnswer(this.currentUserObj.answers);
  }

  nextPrevQuestion(event) {
    if (event.direction == 2 && this.currentQuestionIndex < this.totalQuestions) {
      this.currentQuestionIndex++;

    } else if (event.direction == 4 && this.currentQuestionIndex > 1) {
      this.currentQuestionIndex--;
    }
    this.currentQuestion = this.questions[this.currentQuestionIndex - 1];
    this.getAnswer(this.currentUserObj.answers);
  }

  go(back: boolean) {
    if (back) {
      this.nextPrevQuestion({ direction: 4 });
    } else {
      this.nextPrevQuestion({ direction: 2 });
    }
  }

}
