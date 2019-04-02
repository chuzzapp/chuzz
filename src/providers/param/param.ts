import { Injectable } from '@angular/core';

@Injectable()
export class ParamProvider {

  public paramsData: any;

  constructor() {
    this.paramsData = {};
  }

}
