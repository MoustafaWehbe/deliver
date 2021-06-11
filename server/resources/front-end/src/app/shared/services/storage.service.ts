import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  get(key: string): any {
    const data: string = localStorage.getItem(key);
    return this.parse(data);
  }

  set(key: string, value: any): void {
    localStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    );
  }

  remove(key: string): void {
    if (localStorage[key]) {
      localStorage.removeItem(key);
    } else {
      console.log('Trying to remove unexisting key: ', key);
    }
  }

  private parse(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
