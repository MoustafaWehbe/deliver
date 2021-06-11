import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  constructor(private apiService: ApiService) { }

  public getBranches(): Observable<any> {
    return this.apiService.get('branches/all');
  }

  public createBranch(branch): Observable<any> {
    return this.apiService.post('branches/create', branch);
  }

}
