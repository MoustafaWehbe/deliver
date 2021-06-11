import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UsersService } from '../../../users/services';

@Component({
  selector: 'app-companies-select-modal',
  templateUrl: './companies-select-modal.component.html',
  styleUrls: ['./companies-select-modal.component.scss']
})
export class CompanySelectModalComponent {

  isLoading = false;
  users = [];
  selectedBranch = '';
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private userServiceService: UsersService,
    public dialogRef: MatDialogRef<CompanySelectModalComponent>,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.isLoading = true;
    await this.userServiceService.getUsers().toPromise().then(res => {
      this.users = res.data.users;
      this.isLoading = false;
    }, err => this.isLoading = false);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value): string[] {
    let filterValue = '';
    if (value) {
      filterValue = value.companyName.toLowerCase();
    }

    return this.users.filter(option => option.companyName.toLowerCase().includes(filterValue) && (option.roles && option.roles[0] && option.roles[0].name == 'client'));
  }

  getDisplayName(option) {
    if (option) {
      return option.companyName;
    }
  }

  close(sendData = true) {
    if (!this.myControl.value && !this.myControl.value.id) {
      this.toastService.warning('Please select one of the available companies.');
      return;
    }
    this.dialogRef.close({ selectedCompany: sendData ? this.myControl.value : null })
  }
}
