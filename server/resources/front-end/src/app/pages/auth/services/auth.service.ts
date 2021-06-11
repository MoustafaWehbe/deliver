import { Injectable } from '@angular/core';
import { ApiService, StorageService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userRole = '';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) { }

  public login(obj): Promise<any> {
    return this.apiService.post('auth/login', obj).toPromise();
  }

  public register(): void {
  }

  public logOut(): Promise<any> {
    return this.apiService.get('auth/logout').toPromise();
  }

  public currentUserRole() {
    const user = this.storageService.get('user');
    if (user && user.roles) {
      this.userRole = user.roles[0].name;
      return this.userRole;
    }
    return this.userRole;
  }

  public getUserAsync(force=false): Promise<any> {
    return new Promise((resolve, reject) => {
      let user = this.storageService.get('user');
      if (user && JSON.stringify(user) !== '{}' && !force) {
        resolve(user);
      }
      else {
        this.apiService.get('auth/profile').toPromise().then(res => {
          this.storageService.set('user', res);
          resolve(res);
        }, err => { reject(err) });
      }
    });
  }

  public getUser() {
    return this.storageService.get('user');
  }
}
