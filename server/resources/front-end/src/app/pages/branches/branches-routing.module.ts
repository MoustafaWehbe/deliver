import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { BranchesComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    component: BranchesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class BranchesRoutingModule {
}
