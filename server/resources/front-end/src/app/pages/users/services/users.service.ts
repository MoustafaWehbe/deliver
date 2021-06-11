import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private apiService: ApiService) { }

  public getUsers(): Observable<any> {
    return this.apiService.get('users/all');
  }

  public createUser(user) {
    return this.apiService.post('auth/register', user);
  }

  public deleteUser(usersIds) {
    return this.apiService.post('users/delete', usersIds);
  }
}
