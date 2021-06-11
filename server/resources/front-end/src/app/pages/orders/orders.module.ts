import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';

import {
  OrdersTableComponent, OrdersModalComponent, CompanySelectModalComponent,
  ServiceTypeSelectModalComponent
} from './components';

import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { OrdersService } from './services';
import {
  CanceledOrdersPageComponent, FinishedOrdersPageComponent,
  PendingOrdersPageComponent, ReturnedOrdersPageComponent,
  TransferedOrdersPageComponent, SpotOrdersPageComponent
} from './containers';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    OrdersTableComponent,
    OrdersModalComponent,
    TransferedOrdersPageComponent,
    FinishedOrdersPageComponent,
    PendingOrdersPageComponent,
    ReturnedOrdersPageComponent,
    SpotOrdersPageComponent,
    CompanySelectModalComponent,
    CanceledOrdersPageComponent,
    ServiceTypeSelectModalComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    NgApexchartsModule,
    AgmCoreModule,
    MatNativeDateModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatInputModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    OrdersService,
    DatePipe
  ]
})
export class OrdersModule { }
