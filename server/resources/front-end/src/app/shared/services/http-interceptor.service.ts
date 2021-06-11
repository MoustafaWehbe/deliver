import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/consts';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  public routers: typeof routes = routes;

  constructor(
    private storageService: StorageService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.get('token')}`
      },
      // url: `http://localhost:8080${req.url}`,
    });

    return next
      .handle(authReq)
      .pipe(
        tap(ev => { if (ev instanceof HttpResponse) { } }),
        catchError(err => {
          if (err.status === 401 || err.status === 403) {
            this.storageService.remove('token');
            this.storageService.remove('user');
            this.router.navigate([this.routers.LOGIN]);
            return empty();
          } else {
            return next.handle(req);
          }
        }));
  }
}
