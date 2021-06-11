import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, EmailService } from '../../../../pages/auth/services';
import { routes } from '../../../../consts';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isMenuOpened: boolean;
  @Output() isShowSidebar = new EventEmitter<boolean>();
  public user;
  public routers: typeof routes = routes;

  constructor(
    private userService: AuthService,
    private emailService: EmailService,
    private router: Router,
    private toastrService: ToastrService,
    private storageService: StorageService
  ) {
    this.getUser();
  }

  public getUser() {
    this.userService.getUserAsync().then(res => {
      this.user = res;
    });
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;

    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public logOut(): void {
    this.userService.logOut().then(res => {
      if (res && res['status'] === 'success') {
        this.router.navigate([this.routers.LOGIN]);
        this.toastrService.success('Logged out success.');
        this.storageService.remove('token');
        this.storageService.remove('user');
      }
      else {
        this.router.navigate([this.routers.LOGIN]);
        this.toastrService.error('Logged out error.');
      }
    });
  }
}
