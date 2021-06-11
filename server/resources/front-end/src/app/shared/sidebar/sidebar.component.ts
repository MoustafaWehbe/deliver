import { Component } from '@angular/core';
import { AuthService } from 'src/app/pages/auth/services';
import { routes } from '../../consts/routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public routes: typeof routes = routes;
  public isOpenUiElements = false;
  userRole = '';

  constructor(authService: AuthService) {
    this.userRole = authService.currentUserRole();
  }

  public openUiElements() {
    this.isOpenUiElements = !this.isOpenUiElements;
  }
}
