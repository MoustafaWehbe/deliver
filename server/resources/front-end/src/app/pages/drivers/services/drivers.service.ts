import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private apiService: ApiService) { }

  public getDrivers(): Observable<any> {
    return this.apiService.get('drivers/all');
  }

  public createDriver(driver): Observable<any> {
    return this.apiService.post('drivers/create', driver);
  }

}
