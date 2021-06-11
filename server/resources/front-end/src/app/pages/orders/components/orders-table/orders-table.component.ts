import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/pages/auth/services';
import { BranchesModalComponent } from 'src/app/pages/branches/components/branches-modal/branches-modal.component';
import { DriversSelectModalComponent } from '../../../drivers/components/drivers-select-modal/drivers-select-modal.component';
import { FilterOrder } from '../../models/orders.interface';
import { pagination } from '../../models/pagination.interface';
import { OrdersService } from '../../services';
import { CompanySelectModalComponent } from '../companies-select-modal/companies-select-modal.component';
import { OrdersModalComponent } from '../orders-modal/orders-modal.component';
import { ServiceTypeSelectModalComponent } from '../service-type-select-modal/service-type-select-modal.component';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
})
export class OrdersTableComponent implements OnInit {
  @Input() status: string;
  @Input() transfered: boolean;
  @Input() reload?: boolean;

  public displayedColumns: string[] = [
    'select',
    'id',
    'shipmentCode',
    'receiverName',
    'receiverPhone',
    'receiverAddress',
    'receiverLandmark',
    'fees',
    'status',
    'comment',
    'serviceType',
    'itemDescription',
    'weight',
    'companyName',
    'driverName',
    'branch',
    'isPaid',
    'createdAt',
    'createdBy',
    'update',
    'delay',
    'confirm',
  ];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public isLoading = false;
  public currentPage = 1;
  public userRole = '';
  public ordersToPrint: any = [];

  public isShowFilterInput = false;
  public ordersTableData = [];
  public paginationObj: pagination;

  moreActionsText = 'More actions';
  moreActions = [
    { key: 'assignToDriver', name: 'Assign to driver' },
    { key: 'printOrders', name: 'Print orders' },
    { key: 'cancelOrders', name: 'Cancel orders' },
  ];

  filterByText = 'Filter by';
  filterByOptions = [
    { key: 'driver', name: 'Driver', value: null },
    { key: 'company', name: 'Company', value: null },
    { key: 'serviceType', name: 'Service Type', value: null },
    { key: 'branch', name: 'Branch', value: null },
  ];
  currentFilter: FilterOrder = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('orderPrint', { static: true }) MyDOMElement: ElementRef;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private ordersService: OrdersService,
    private toastService: ToastrService
  ) {}

  public ngOnInit(): void {
    this.initPage();
  }

  initPage() {
    this.userRole = this.authService.currentUserRole();
    this.getOrders('');
  }

  public getOrders(q: string) {
    this.isLoading = true;
    this.ordersService
      .getOrders(
        this.status,
        this.transfered,
        q,
        this.currentPage,
        this.currentFilter
      )
      .subscribe(
        (res) => {
          this.ordersTableData = res.data.orders;
          // this.ordersToPrint[0] = this.ordersTableData[0];
          this.paginationObj = res.data.pagination;
          this.dataSource = new MatTableDataSource<any>(this.ordersTableData);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          this.hideClientActions();
          this.selection.clear();
        },
        (_) => {
          this.isLoading = false;
          this.selection.clear();
        }
      );
  }

  hideClientActions() {
    if (this.status != 'spotOrder') {
      this.moreActions = this.moreActions.filter(
        (c) => c.key != 'assignToDriver'
      );
      this.displayedColumns = this.displayedColumns.filter((c) => c != 'delay');
    }
    if (!this.transfered) {
      this.displayedColumns = this.displayedColumns.filter(
        (c) => c != 'confirm'
      );
    }
    if (this.userRole == 'client') {
      this.displayedColumns = this.displayedColumns.filter(
        (c) => c != 'update' && c != 'confirm'
      );
      this.moreActions = this.moreActions.filter(
        (c) => c.key != 'assignToDriver' && c.key != 'cancelOrders'
      );
      this.filterByOptions = this.filterByOptions.filter(
        (c) => c.key != 'driver' && c.key != 'company'
      );
    }
    if (this.userRole != 'admin' && this.userRole != 'manager') {
      this.moreActions = this.moreActions.filter(
        (c) => c.key != 'cancelOrders'
      );
    }
    if (this.status == 'canceled' || this.status == 'finished') {
      this.moreActions = this.moreActions.filter(
        (c) => c.key != 'cancelOrders'
      );
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  public applyFilter(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.getOrders(val);
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.ordersTableData);
    if (!this.isShowFilterInput) {
      this.currentPage = 1;
      this.getOrders('');
    }
  }

  public assignToDriver() {
    const selectedOrders = this.selection.selected || [];
    const ordersIds = selectedOrders.map((order) => order.id);

    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one order!');
      return;
    }
    this.openDriversModal().then((res) => {
      if (res) {
        const driverId = res.id;
        this.ordersService.assignToDriver({ ordersIds }, driverId).subscribe(
          (res) => {
            if (res.status === 'success') {
              this.toastService.success(res.message);
              this.getOrders('');
            } else {
              this.toastService.error(
                'Error occured while transfering orders',
                '',
                { positionClass: 'toast-top-center' }
              );
            }
          },
          (_) => {
            this.toastService.error(
              'Error occured while transfering orders',
              '',
              { positionClass: 'toast-top-center' }
            );
          }
        );
      }
    });
  }

  public cancelOrders() {
    const selectedOrders = this.selection.selected || [];
    const ordersIds = selectedOrders.map((order) => order.id);
    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one order!');
      return;
    }
    if (confirm('Are you sure you want to cancel the selected orders?')) {
      const status = 'canceled';
      this.ordersService.changeStatus({ ordersIds, status }).subscribe(
        (res) => {
          if (res.status === 'success') {
            this.toastService.success(res.message);
            this.getOrders('');
          } else {
            this.toastService.error(
              'Error occured while canceling orders',
              '',
              { positionClass: 'toast-top-center' }
            );
          }
        },
        (_) => {
          this.toastService.error('Error occured while canceling orders', '', {
            positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  printOrder() {
    const selectedOrders = this.selection.selected || [];
    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one order!');
      return;
    }
    this.ordersToPrint = selectedOrders;
    this.cd.detectChanges();
    var divToPrint = document.getElementById('orderPrint');
    var newWin = window.open('/', 'Print-Window');
    newWin.document.write(
      '<html><head><style>.float-container {display: flex;border: 3px solid #000;margin: 10px;padding: 20px;} .print-header{display: inline-block;width: 10%;vertical-align: top;padding: 40px;font-size: 20px;font-weight: 800;background: white;margin: 0px 20px;}.float-child {flex: 1;width: 50%;padding: 20px;border: 2px solid gray;}.float-child:first-child {margin-right: 20px;}.bold {font-weight: bold;}</style></head><body onload="window.print()">' +
        divToPrint.innerHTML +
        '</body></html>'
    );
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 10);
  }

  // printOrder(order) {
  //   this.orderToPrint = order;
  //   this.cd.detectChanges();
  //   var divToPrint = document.getElementById('orderPrint');
  //   var newWin = window.open('/', 'Print-Window');
  //   newWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
  //   newWin.document.close();
  //   setTimeout(function () { newWin.close(); }, 10);
  // }

  public deleteSelected() {
    let selectedOrders = this.selection.selected || [];
    let ordersIds = selectedOrders.map((order) => order.id);
    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one order!');
      return;
    }
    if (confirm('Are you sure you want to delete the selected order(s)')) {
      this.ordersService.deleteOrders({ ordersIds }).subscribe(
        (res) => {
          if (res.status === 'success') {
            this.toastService.success(res.message);
            this.getOrders('');
          } else {
            this.toastService.error(
              'Error occured while deleting the selected orders',
              '',
              { positionClass: 'toast-top-center' }
            );
          }
        },
        (_) => {
          this.toastService.error(
            'Error occured while deleting the selected orders',
            '',
            { positionClass: 'toast-top-center' }
          );
        }
      );
    }
  }

  transferSelected() {
    let selectedOrders = this.selection.selected || [];
    let ordersIds = selectedOrders.map((order) => order.id);
    if (selectedOrders.length == 0) {
      this.toastService.warning('Please select at least one order!', '', {
        positionClass: 'toast-top-center',
      });
      return;
    }
    this.openBranchesModal().then((res) => {
      if (res) {
        const branchId = res.id;
        this.ordersService.transferOrders({ ordersIds }, branchId).subscribe(
          (res) => {
            if (res.status === 'success') {
              this.toastService.success(res.message);
              this.getOrders('');
            } else {
              this.toastService.error(
                'Error occured while transfering orders',
                '',
                { positionClass: 'toast-top-center' }
              );
            }
          },
          (_) => {
            this.toastService.error(
              'Error occured while transfering orders',
              '',
              { positionClass: 'toast-top-center' }
            );
          }
        );
      }
    });
  }

  async openBranchesModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(BranchesModalComponent);

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result && result.selectedBranch) {
            resolve(result.selectedBranch);
          } else {
            resolve(null);
          }
        },
        (_) => {
          resolve(null);
        }
      );
    });
  }

  async openDriversModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(DriversSelectModalComponent);

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result && result.selectedDriver) {
            resolve(result.selectedDriver);
          } else {
            resolve(null);
          }
        },
        (_) => {
          resolve(null);
        }
      );
    });
  }

  async openCompanyModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(CompanySelectModalComponent);

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result && result.selectedCompany) {
            resolve(result.selectedCompany);
          } else {
            resolve(null);
          }
        },
        (_) => {
          resolve(null);
        }
      );
    });
  }

  async openServiceTypeModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(ServiceTypeSelectModalComponent);

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result && result.selectedService) {
            resolve(result.selectedService);
          } else {
            resolve(null);
          }
        },
        (_) => {
          resolve(null);
        }
      );
    });
  }

  public pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.getOrders('');
  }

  ngOnChanges(model: any) {
    if (model.reload) {
      this.getOrders('');
    }
  }

  updateOrder(order, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const dialogRef = this.dialog.open(OrdersModalComponent, {
      data: { action: 'update', order },
      height: '600px',
      width: '860px',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        this.selection.clear();
        this.getOrders('');
      },
      (_) => {
        this.masterToggle();
        this.masterToggle();
      }
    );
  }

  delayOrder(order, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.masterToggle();
    this.masterToggle();
    if (this.userRole != 'admin' && this.userRole != 'manager') {
      this.toastService.warning('User is not allowed to make this action');
      return;
    }
    order.isDelayed = !order.isDelayed;
    const clone = JSON.parse(JSON.stringify(order));
    clone['barcode'] = clone['barcode'] || '';
    clone['comment'] = clone['comment'] || '';
    clone['customerId'] = clone['client'].id;
    clone['branchId'] = clone['branch'] ? clone['branch'].id : null;
    clone['driverId'] = clone['driver'] ? clone['driver'].id : null;

    this.ordersService.updateOrder(clone, order.id).subscribe((res) => {});
  }

  confirmOrder(order, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.masterToggle();
    this.masterToggle();
    order.isTransferedConfirmed = true;
    order.lastTransferBranchId = null;
    const clone = JSON.parse(JSON.stringify(order));
    if (!clone['barcode']) {
      delete clone['barcode'];
    }
    if (!clone['comment']) {
      delete clone['comment'];
    }
    if (!clone['barcode']) {
      delete clone['barcode'];
    }
    if (clone['branch']) {
      clone['branchId'] = clone['branch'].id;
    }
    if (clone['driver']) {
      clone['driverId'] = clone['driver'].id;
    }
    if (clone['client']) {
      clone['customerId'] = clone['client'].id;
    }

    clone['isDelayed'] = clone['isDelayed'] || false;
    clone['status'] = 'spotOrder';

    this.ordersService.updateOrder(clone, order.id).subscribe((res) => {
      this.getOrders('');
    });
  }

  onActionSelect(action) {
    switch (action.key) {
      case 'assignToDriver':
        this.assignToDriver();
        break;
      case 'printOrders':
        this.printOrder();
        break;
      case 'cancelOrders':
        this.cancelOrders();
        break;
      default:
        break;
    }
  }

  filterByDriver(filterBy: any) {
    this.currentFilter = filterBy;
    this.openDriversModal().then((res) => {
      if (res) {
        this.currentFilter.value = res.id;
        this.getOrders('');
      }
    });
  }

  filterByBranch(filterBy: any) {
    this.currentFilter = filterBy;
    this.openBranchesModal().then((res) => {
      if (res) {
        this.currentFilter.value = res.id;
        this.getOrders('');
      }
    });
  }

  filterByCompany(filterBy: any) {
    this.currentFilter = filterBy;
    this.openCompanyModal().then((res) => {
      if (res) {
        this.currentFilter.value = res.id;
        this.getOrders('');
      }
    });
  }

  filterByServiceType(filterBy: any) {
    this.currentFilter = filterBy;
    this.openServiceTypeModal().then((res) => {
      if (res) {
        this.currentFilter.value = res;
        this.getOrders('');
      }
    });
  }

  clearFilter() {
    this.currentFilter = null;
    this.getOrders('');
  }

  onFilterSelect(action) {
    switch (action.key) {
      case 'driver':
        this.filterByDriver(action);
        break;
      case 'company':
        this.filterByCompany(action);
        break;
      case 'serviceType':
        this.filterByServiceType(action);
        break;
      case 'branch':
        this.filterByBranch(action);
        break;
      default:
        break;
    }
  }
}
