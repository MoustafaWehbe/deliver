import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { OrdersService } from '../../services';

@Component({
  selector: 'app-service-type-select-modal',
  templateUrl: './service-type-select-modal.component.html',
  styleUrls: ['./service-type-select-modal.component.scss']
})
export class ServiceTypeSelectModalComponent {

  serviceTypes = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private ordersService: OrdersService,
    public dialogRef: MatDialogRef<ServiceTypeSelectModalComponent>,
    private toastService: ToastrService) {
  }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.serviceTypes = this.ordersService.serviceTypes;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value): string[] {
    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }

    return this.serviceTypes.filter(option => option.toLowerCase().includes(filterValue));
  }

  getDisplayName(option) {
    if (option) {
      return option;
    }
  }

  close(sendData = true) {
    if (!this.myControl.value) {
      this.toastService.warning('Please select one of the available services.');
      return;
    }
    this.dialogRef.close({ selectedService: sendData ? this.myControl.value : null })
  }
}
