import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DriversModalComponent } from '../../components/drivers-modal/drivers-modal.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent implements OnInit {

  reload = false;
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  createDriver() {
    const dialogRef = this.dialog.open(DriversModalComponent, {
      data: { action: 'create', driver: {} }, height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reload = !this.reload;
    }, _ => { });
  }
}
