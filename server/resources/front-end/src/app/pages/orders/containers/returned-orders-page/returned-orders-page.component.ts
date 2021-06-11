import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OrdersModalComponent } from '../../components';

import { OrdersService } from '../../services';

@Component({
  selector: 'app-returned-orders-page',
  templateUrl: './returned-orders-page.component.html',
  styleUrls: ['./returned-orders-page.component.scss']
})
export class ReturnedOrdersPageComponent {

  status = 'returned';
  reload = false;

  constructor(public dialog: MatDialog) {
  }
}
