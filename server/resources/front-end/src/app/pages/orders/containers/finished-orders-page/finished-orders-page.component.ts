import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services';
import { OrdersModalComponent } from '../../components';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import { AuthService } from 'src/app/pages/auth/services';

@Component({
  selector: 'app-finished-orders-page',
  templateUrl: './finished-orders-page.component.html',
  styleUrls: ['./finished-orders-page.component.scss']
})
export class FinishedOrdersPageComponent {
  status = 'finished';
  reload = false;
  userRole = '';

  events: string[] = [];
  selectedDate: Date = new Date();
  constructor(
    public dialog: MatDialog,
    public datepipe: DatePipe,
    authService: AuthService,
    private apiService: ApiService) {
    let pastDate = this.selectedDate.getDate() - 7;
    this.selectedDate.setDate(pastDate);
    this.userRole = authService.currentUserRole();
  }

  generateCsvPaidOrders() {
    this.apiService
      .getAdvanced('orders/generatePaidOrders?date=' + this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd'), 'text/csv')
      .subscribe((data: any) => {
        const file = new Blob([data], { type: 'text/csv' });
        let downloadUrl = URL.createObjectURL(file);

        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'paidOrders.csv';// you can take a custom name as well as provide by server
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      })
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }
}
