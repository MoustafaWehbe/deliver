import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersModalComponent } from '../../components/orders-modal/orders-modal.component';

@Component({
  selector: 'app-canceled-orders-page',
  templateUrl: './canceled-orders-page.component.html',
  styleUrls: ['./canceled-orders-page.component.scss']
})
export class CanceledOrdersPageComponent {

  status = 'canceled';
  reload = false;

  constructor(public dialog: MatDialog) {
  }
}
