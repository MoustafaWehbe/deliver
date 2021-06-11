import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DriversComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    component: DriversComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class DriversRoutingModule {
}
