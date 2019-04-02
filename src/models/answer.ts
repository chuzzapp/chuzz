export class Answer {
    private _user_id: number;
    private _chuzz_id: number;
    private _question_id: number;
    private _choice_id: number;

    get user_id(): number {
        return this._user_id;
    }
    set user_id(userId: number) {
        this._user_id = userId;
    }

    get chuzz_id(): number {
        return this._chuzz_id;
    }
    set chuzz_id(chuzzId: number) {
        this._chuzz_id = chuzzId;
    }

    get question_id(): number {
        return this._question_id;
    }
    set question_id(questionId: number) {
        this._question_id = questionId;
    }

    get choice_id(): number {
        return this._choice_id;
    }
    set choice_id(choiceId: number) {
        this._choice_id = choiceId;
    }

    public getObject(): any {
        return {user_id: this._user_id, chuzz_id: this._chuzz_id, question_id: this._question_id, choice_id: this._choice_id};
    }

}