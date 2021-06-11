import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services';
import { routes } from '../../../../consts';
import { StorageService } from 'src/app/shared/services';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  public todayDate: Date = new Date();
  public routers: typeof routes = routes;
  loginErrors = [];
  registerErrors = [];

  constructor(
    private service: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  public sendLoginForm(loginObj): void {
    this.service.login(loginObj).then(res => {
      if (!res) {
        this.loginErrors = ['This user is not authorized'];
        return;
      }
      if (res['status'] && res['status'] == 'success') {
        this.storageService.set('token', res.data.original.access_token);
        this.storageService.set('user', res.data.original.user);
        this.router.navigate([this.routers.ORDERS_PENDING]);
      }
      else if (res['password'] && res['password'].length > 0) {
        this.loginErrors = res['password'];
      }
      else {
        this.loginErrors = ['This user is not authorized'];
      }
    }, err => {
      this.loginErrors = ['This user is not authorized'];
    });
  }

  public sendRegisterForm(): void {
    this.service.register();

    this.router.navigate([this.routers.ORDERS_PENDING]).then();
  }
}
