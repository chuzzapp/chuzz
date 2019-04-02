import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorageProvider {

  constructor(private storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
  }

  getObject(key: string): any {
    this.storage.ready().then(() => {
      this.storage.get(key).then((obj) => {
        return JSON.parse(obj);
      });
    });
  }

  setObject(key: string, obj: any) {
    this.storage.ready().then(() => {
      this.storage.set(key, JSON.stringify(obj)).then(() => {});
    });
  }

}
