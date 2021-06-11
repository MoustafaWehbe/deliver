import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AppSetting } from './appSetting.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private appSetting: AppSetting
  ) { }

  get(url: string): Observable<any> {
    return this.httpClient
      .get<any>(`${this.appSetting.getAPIUrl()}/${url}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getAdvanced(url, responseType) {
    return this.httpClient
      .get<any>(`${this.appSetting.getAPIUrl()}/${url}`, { responseType: responseType })
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  post(url: string, item: any): Observable<any> {
    return this.httpClient.post<any>(`${this.appSetting.getAPIUrl()}/${url}`, item)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }

    return throwError(errorMessage);
  }
}
