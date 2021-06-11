import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './pages/auth/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event['url'] == '/') {
          router.navigate(['/login']);
          this.tryAuth();
        }
        if (event['url'] == '/login') {
          this.tryAuth();
        }
      });
  }

  private tryAuth(): void {
    this.authService.getUserAsync(true).then(user => {
      if (user['id']) {
        this.router.navigate(['orders/pending']);
      }
    });
  }
}
