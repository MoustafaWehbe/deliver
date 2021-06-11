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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DriversTableComponent } from './components/drivers-table/drivers-table.component';
import { DriversModalComponent } from './components/drivers-modal/drivers-modal.component';
import { DriversSelectModalComponent } from './components/drivers-select-modal/drivers-select-modal.component';
import { DriversComponent } from './containers/drivers/drivers.component';

import { DriversRoutingModule } from './drivers-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DriversTableComponent,
    DriversComponent,
    DriversModalComponent,
    DriversSelectModalComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DriversRoutingModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    MatTabsModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressBarModule,
    SharedModule,
    ReactiveFormsModule
  ],
})
export class DriversModule { }
