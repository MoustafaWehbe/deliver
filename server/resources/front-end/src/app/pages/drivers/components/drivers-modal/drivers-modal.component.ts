import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DriversService } from '../../services';

interface DriverModal {
  driver: any;
  action: string;
}

@Component({
  selector: 'app-drivers-modal',
  templateUrl: './drivers-modal.component.html',
  styleUrls: ['./drivers-modal.component.scss']
})
export class DriversModalComponent {

  isLoading = false;
  branches = [];
  drivers = [];
  users = [];
  selectedBranch = '';
  mainObj: DriverModal;
  public driversForm: FormGroup;
  statuses = ['pending', 'assigned', 'spotOrder', 'finished', 'returned'];
  serviceType = ['transfer orders', 'others'];

  constructor(
    private driversService: DriversService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DriversModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastrService) {
    this.mainObj = data;
  }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.driversForm = new FormGroup({
      name: new FormControl(this.mainObj.action == 'update' ? this.mainObj.driver.name : '', [Validators.required, Validators.minLength(4)]),
      phone: new FormControl(this.mainObj.action == 'update' ? this.mainObj.driver.phone : '', [Validators.required]),
    });
    this.isLoading = true;
  }

  close() {
    this.dialogRef.close({})
  }

  submitForm() {
    if (!this.driversForm.valid) {
      this.toastService.error("please fill the missing fields");
      return;
    }
    else {
      // if (this.mainObj.action === 'update') {
      //   this.driversService.updateOrder(this.driversForm.value, this.mainObj.order.id).subscribe(res => {
      //     this.close();
      //   })
      // }
      // else {
      this.driversService.createDriver(this.driversForm.value).subscribe(res => {
        this.close();
      });
      // }
    }
  }
}
