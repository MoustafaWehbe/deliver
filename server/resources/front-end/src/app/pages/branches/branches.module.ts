import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  BranchesComponent
} from './containers';
import { BranchesRoutingModule } from './branches-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { BranchesModalComponent } from './components/branches-modal/branches-modal.component';
import { BranchesTableComponent } from './components/branches-table/branches-table.component';
import { AddBranchModalComponent } from './components/add-branch-modal/add-branch-modal.component';

@NgModule({
  declarations: [
    BranchesComponent,
    BranchesModalComponent,
    BranchesTableComponent,
    AddBranchModalComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatMenuModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    SharedModule
  ],
})
export class BranchesModule { }
