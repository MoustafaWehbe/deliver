import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/pages/orders/services/orders.service';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-orders-history-page',
  templateUrl: './orders-history-page.component.html',
  styleUrls: ['./orders-history-page.component.scss']
})
export class OrdersHistoryPageComponent {

  public displayedColumns: string[] = ['id', 'status', 'updatedBy', 'updatedAt'];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public isLoading = false;
  historyTableData = [];
  isShowInput = true;
  searchModel = '';

  public isShowFilterInput = false;

  constructor(
    private orderService: OrdersService,
    private apiService: ApiService,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  initPage() {

  }

  search() {
    if (!this.searchModel) {
      return;
    }
    this.isLoading = true;
    this.orderService.ordersHistory(this.searchModel).subscribe(res => {
      if (res && res.data) {
        this.historyTableData = res.data;
        this.dataSource = new MatTableDataSource<any>(this.historyTableData);
      }
      else {
        this.historyTableData = [];
      }
      this.isLoading = false;
    }, _ => { this.isLoading = false; })
  }

  showInput() {
    this.isShowInput = true;
  }
}
