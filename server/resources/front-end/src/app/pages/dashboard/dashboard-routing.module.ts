import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrdersHistoryPageComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    component: OrdersHistoryPageComponent
  },
  {
    path: 'history',
    component: OrdersHistoryPageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class DashboardRoutingModule {
}
