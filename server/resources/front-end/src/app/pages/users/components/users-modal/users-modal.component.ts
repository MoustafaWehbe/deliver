import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/pages/auth/services';
import { UsersService } from '../../services/users.service';

interface UserModal {
  user: any;
  action: string;
}

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent {

  isLoading = false;
  branches = [];
  companies = [];
  selectedBranch = '';
  mainObj: UserModal;
  roles = ['admin', 'manager', 'client', 'agent', 'accountant'];
  public usersForm: FormGroup;

  toppings = new FormControl();

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  userRole = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastrService) {
    this.mainObj = data;
  }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    let role = '';
    if (this.mainObj.user && this.mainObj.user.roles) {
      role = this.mainObj.user.roles[0].name;
    }
    this.usersForm = new FormGroup({
      userName: new FormControl(this.mainObj.action == 'update' ? this.mainObj.user.userName : '', [Validators.required, Validators.minLength(4)]),
      phone: new FormControl(this.mainObj.action == 'update' ? this.mainObj.user.phone : '', [Validators.required]),
      companyName: new FormControl(this.mainObj.action == 'update' ? this.mainObj.user.companyName : '', [Validators.required]),
      locationAddress: new FormControl(this.mainObj.action == 'update' ? this.mainObj.user.locationAddress : '', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl(this.mainObj.action == 'update' ? this.mainObj.user.email : '', [Validators.required]),
      role: new FormControl(this.mainObj.action == 'update' ? role : '', [Validators.required]),
    });
    this.filteredOptions = this.usersForm.controls['companyName'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    await this.getUsers();
    this.userRole = this.authService.currentUserRole();
    this.isLoading = true;
  }

  checkboxChange(even) {
    console.log(even);
  }

  async getUsers() {
    await this.usersService.getUsers().toPromise().then(res => {
      this.companies = res.data.users.map(user => user.companyName);
      this.companies = this.companies.filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
    })
  }

  close() {
    this.dialogRef.close({})
  }

  submitForm() {
    if (!this.usersForm.valid) {
      this.toastService.error("please fill the missing fields");
      return;
    }
    else {
      // if (this.mainObj.action === 'update') {
      //   this.usersService.updateOrder(this.usersForm.value, this.mainObj.order.id).subscribe(res => {
      //     this.close();
      //   })
      // }
      // else {
      this.usersService.createUser(this.usersForm.value).subscribe(res => {
        this.close();
      });
      // }
    }
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();

    return this.companies.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
