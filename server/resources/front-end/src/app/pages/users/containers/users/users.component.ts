import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersModalComponent } from '../../components/users-modal/users-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  reload = false;
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  createUser() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.width = '860px';
    dialogconfig.height = '600px';
    dialogconfig.data = { action: 'create', user: null };
    const dialogRef = this.dialog.open(UsersModalComponent, dialogconfig);

    dialogRef.afterClosed().subscribe(result => {
      this.reload = !this.reload;
    }, _ => { });
  }
}
