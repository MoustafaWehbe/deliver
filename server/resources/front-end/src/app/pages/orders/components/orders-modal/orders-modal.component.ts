import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/pages/auth/services';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { UsersService } from 'src/app/pages/users/services/users.service';
import { BranchesService } from '../../../branches/services';
import { OrdersService } from '../../services';

interface OrdersModal {
  order: any;
  action: string;
}

@Component({
  selector: 'app-orders-modal',
  templateUrl: './orders-modal.component.html',
  styleUrls: ['./orders-modal.component.scss']
})
export class OrdersModalComponent {

  isLoading = false;
  branches = [];
  drivers = [];
  users = [];
  selectedBranch = '';
  isSubmittingForm = false;
  mainObj: OrdersModal;
  userRole = '';
  public ordersForm: FormGroup;
  statuses = [
    { value: 'pending', disabled: false, },
    { value: 'assigned', disabled: false, },
    { value: 'spotOrder', disabled: false, },
    { value: 'finished', disabled: false, },
    { value: 'returned', disabled: false, }
  ]
  serviceType = [];
  currency = ['LL', '$', 'cheque(LL)', 'cheque($)'];
  addressLocations = [];

  addressesControl = new FormControl();
  addressFilteredOptions: Observable<string[]>;

  constructor(
    private branchesService: BranchesService,
    private driverService: DriversService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrdersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastrService) {
    this.mainObj = data;
  }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.userRole = this.authService.currentUserRole();
    this.serviceType = this.ordersService.serviceTypes;
    this.addressLocations = this.ordersService.addressLocations;
    this.ordersForm = new FormGroup({
      shipmentCode: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.shipmentCode : '', [Validators.required, Validators.minLength(4)]),
      weight: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.weight : '1 Kg', [Validators.required]),
      receiverName: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.receiverName : '', [Validators.required]),
      receiverPhone: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.receiverPhone : '', [Validators.required]),
      receiverAddress: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.receiverAddress : '', [Validators.required]),
      receiverLandmark: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.receiverLandmark : '', [Validators.required]),
      fees: new FormControl(
        {
          disabled: this.mainObj.action === 'update' && this.userRole != 'admin',
          value: this.mainObj.action == 'update' ? this.mainObj.order.fees : ''
        }
        , [Validators.required]),
      currency: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.currency : this.currency[0], [Validators.required]),
      serviceType: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.serviceType : this.serviceType[0], [Validators.required]),
      status: new FormControl({
        value: this.mainObj.action == 'update' ? this.mainObj.order.status : this.statuses[0].value,
        disabled: this.mainObj.action == 'update' ? false : true
      }, [Validators.required]),
      itemDescription: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.itemDescription : '', []),
      comment: new FormControl(this.mainObj.action == 'update' ? this.mainObj.order.comment : '', []),
      driverId: new FormControl(
        {
          disabled: true,
          value: this.mainObj.action == 'update' ? (this.mainObj.order.driver ? this.mainObj.order.driver.id : '') : ''
        }, []),
      branchId: new FormControl(this.mainObj.action == 'update' ? (this.mainObj.order.branch ? this.mainObj.order.branch.id : '') : '', []),
      customerId: new FormControl(this.mainObj.action == 'update' ? (this.mainObj.order.client ? this.mainObj.order.client.id : '') : '', []),
      isPaid: new FormControl(
        {
          value: this.mainObj.action == 'update' ? this.mainObj.order.isPaid : false,
          disabled: (this.mainObj.action == 'update' ? this.mainObj.order.status != "finished"
            && this.mainObj.order.status != "canceled" && this.mainObj.order.status != "returned" : false)
            || (this.userRole != 'admin' && this.userRole != 'accountant')
        }, [Validators.required]),
    });
    this.isLoading = true;
    if (this.userRole != 'client') {
      await this.branchesService.getBranches().subscribe(res => {
        this.branches = res.data;
        this.isLoading = false;
      }, err => this.isLoading = false);

      await this.driverService.getDrivers().subscribe(res => {
        this.drivers = res.data;
        this.isLoading = false;
      }, err => this.isLoading = false);

      await this.usersService.getUsers().subscribe(res => {
        this.users = res.data.users;
        this.users = this.users.filter(u => u.roles && u.roles[0] && u.roles[0].name == 'client')
        this.isLoading = false;
      }, err => this.isLoading = false);
    }

    for (let i = 0; i < this.statuses.length; i++) {
      let status = this.statuses[i];
      if (this.userRole != 'manager' && status.value == 'assigned') {
        this.statuses[i].disabled = true;
      }
      if (status.value == 'pending' || this.userRole == 'agent' || this.userRole == 'accountant') {
        this.statuses[i].disabled = true;
      }
      if (this.mainObj && this.mainObj.order &&
        (this.mainObj.order.status == "finished" || this.mainObj.order.status == "returned" || this.mainObj.order.status == "canceled"
          || (this.mainObj.order.status == "pending" && status.value != "spotOrder") || (this.mainObj.order.status == "assigned" && status.value == "spotOrder"))) {
        this.statuses[i].disabled = true;
      }
      if (this.mainObj && this.mainObj.order &&
        this.mainObj.order.status == "spotOrder" && (status.value == 'finished' || status.value == 'returned')) {
        this.statuses[i].disabled = true;
      }
    }
    if (this.userRole == "admin" && (this.mainObj.order.status == "returned" || this.mainObj.order.status == "canceled")) {
      this.statuses = this.statuses.map(s => { s.disabled = false; return s; });
    }

    this.addressFilteredOptions = this.ordersForm.controls['receiverAddress'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterAddresses(value))
      );
  }

  private _filterAddresses(value): string[] {
    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }

    return this.addressLocations.filter(option => option.toLowerCase().includes(filterValue));
  }
  close() {
    this.dialogRef.close({})
  }

  submitForm() {
    if (!this.ordersForm.valid) {
      this.toastService.error("please fill the missing fields");
      return;
    }
    else {
      if (this.isSubmittingForm) {
        return;
      }
      this.isSubmittingForm = true;
      // clean data
      const clone = JSON.parse(JSON.stringify(this.ordersForm.value));

      if (clone['branchId'] == '') {
        delete clone['branchId']
      }
      if (clone['customerId'] == '') {
        const currentUser = this.authService.getUser();
        if (this.userRole == 'client') {
          clone['customerId'] = currentUser.id;
        }
        else {
          delete clone['customerId'];
        }
      }
      if (clone['driverId'] == '') {
        delete clone['driverId']
      }

      clone['status'] = clone['status'] || this.ordersForm.controls['status'].value;
      clone['fees'] = clone['fees'] || this.ordersForm.controls['fees'].value;
      clone['isPaid'] = clone['isPaid'] || false;

      if (this.mainObj.action === 'update') {
        this.ordersService.updateOrder(clone, this.mainObj.order.id).subscribe(res => {
          this.close();
          this.isSubmittingForm = false;
        }, _ => { this.isSubmittingForm = false; })
      }
      else {
        this.ordersService.createOrder(clone).subscribe(res => {
          this.close();
          this.isSubmittingForm = false;
        }, _ => { this.isSubmittingForm = false; });
      }
    }
  }
}
