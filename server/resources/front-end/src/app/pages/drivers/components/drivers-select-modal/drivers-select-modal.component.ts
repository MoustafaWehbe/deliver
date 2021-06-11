import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DriversService } from '../../services';

@Component({
  selector: 'app-drivers-select-modal',
  templateUrl: './drivers-select-modal.component.html',
  styleUrls: ['./drivers-select-modal.component.scss']
})
export class DriversSelectModalComponent {

  isLoading = false;
  drivers = [];
  selectedBranch = '';
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private driversService: DriversService,
    public dialogRef: MatDialogRef<DriversSelectModalComponent>,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.isLoading = true;
    await this.driversService.getDrivers().toPromise().then(res => {
      this.drivers = res.data;
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
      filterValue = value.name.toLowerCase();
    }

    return this.drivers.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  getDisplayName(option) {
    if (option) {
      return option.name;
    }
  }

  close(sendData = true) {
    if (!this.myControl.value.id) {
      this.toastService.warning('Please select one of the available drivers.');
      return;
    }
    this.dialogRef.close({ selectedDriver: sendData ? this.myControl.value : null })
  }
}
