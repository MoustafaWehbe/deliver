import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/pages/auth/services';
import { UsersService } from '../../services';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() status: string;
  @Input() transfered: boolean;
  @Input() reload?: boolean;

  public displayedColumns: string[] = ['select', 'username', 'email', 'phone', 'locationAddress',
    'companyName', 'role'];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public isLoading = false;
  public currentUser;

  public isShowFilterInput = false;
  public usersTableData = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private usersService: UsersService,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  initPage() {
    this.getUsers();
  }

  public async getUsers() {
    this.isLoading = true;
    await this.usersService.getUsers().toPromise().then(res => {
      this.usersTableData = res.data.users;
      this.usersTableData = this.usersTableData.map(user => {
        let u = user;
        u.roles = u.roles || [];
        u['role'] = user.roles.map(r => r.name);
        return u;
      });
      this.dataSource = new MatTableDataSource<any>(this.usersTableData);
      this.dataSource.paginator = this.paginator;
    }, _ => { this.isLoading = false });

    await this.authService.getUserAsync().then(user => {
      this.currentUser = user;
    }, _ => { this.isLoading = false; });
    this.isLoading = false
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.usersTableData);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteSelected() {
    let selectedOrders = this.selection.selected || [];
    let usersIds = selectedOrders.map(user => user.id);
    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one user!');
      return;
    }
    else if (usersIds.find(id => id == this.currentUser.id)) {
      this.toastService.error('You cant remove yourself');
      return;
    }
    if (confirm('Are you sure you want to delete the selected users?')) {
      this.usersService.deleteUser({ usersIds }).subscribe(res => {
        if (res.status === 'success') {
          this.toastService.success(res.message);
          // this.ordersTableData = this.ordersTableData.filter(o => {
          //   return usersIds.indexOf(o.id) === -1;
          // })
          this.getUsers();
        }
        else {
          this.toastService.error('Error occured while deleting the selected orders', '',
            { 'positionClass': 'toast-top-center' });
        }
      }, _ => {
        this.toastService.error('Error occured while deleting the selected orders', '',
          { 'positionClass': 'toast-top-center' });
      })
    }
  }

  ngOnChanges(model: any) {
    if (model.reload) {
      this.getUsers();
    }
  }

  updateUser(user) {
    // const dialogRef = this.dialog.open(UsersModalComponent, {
    //   data: { action: 'update', user }, height: '400px',
    //   width: '600px',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // this.reload = !this.reload;
    //   this.getUsers('');
    // }, _ => { });
  }
}
