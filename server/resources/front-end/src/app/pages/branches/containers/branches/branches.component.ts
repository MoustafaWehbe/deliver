import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBranchModalComponent } from '../../components/add-branch-modal/add-branch-modal.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
})
export class BranchesComponent implements OnInit {

  reload = false;
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  createBranch() {
    const dialogRef = this.dialog.open(AddBranchModalComponent, {
      data: { action: 'create', branch: {} }, height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reload = !this.reload;
    }, _ => { });
  }
}
