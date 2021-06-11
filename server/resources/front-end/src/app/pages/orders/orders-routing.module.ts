import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  CanceledOrdersPageComponent,
  FinishedOrdersPageComponent,
  ReturnedOrdersPageComponent, TransferedOrdersPageComponent, PendingOrdersPageComponent, SpotOrdersPageComponent
} from './containers';

const routes: Routes = [
  {
    path: 'pending',
    component: PendingOrdersPageComponent
  },
  {
    path: 'spot',
    component: SpotOrdersPageComponent
  },
  {
    path: 'finished',
    component: FinishedOrdersPageComponent
  },
  {
    path: 'returned',
    component: ReturnedOrdersPageComponent
  },
  {
    path: 'transfered',
    component: TransferedOrdersPageComponent
  },
  {
    path: 'canceled',
    component: CanceledOrdersPageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class OrdersRoutingModule {
}
