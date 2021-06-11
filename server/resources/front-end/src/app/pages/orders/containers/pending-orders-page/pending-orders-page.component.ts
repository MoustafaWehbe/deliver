import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services';
import { OrdersModalComponent } from '../../components/orders-modal/orders-modal.component';

@Component({
  selector: 'app-pending-orders-page',
  templateUrl: './pending-orders-page.component.html',
  styleUrls: ['./pending-orders-page.component.scss']
})
export class PendingOrdersPageComponent {

  status = 'pending';
  reload = false;

  constructor(public dialog: MatDialog, private apiService: ApiService) {
  }

  createOrder() {
    const dialogRef = this.dialog.open(OrdersModalComponent, {
      data: { action: 'create', order: {} }, height: '600px',
      width: '860px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reload = !this.reload;
    }, _ => { });
  }
}
