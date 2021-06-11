import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BranchesService } from '../../services';

@Component({
  selector: 'app-branches-modal',
  templateUrl: './branches-modal.component.html',
  styleUrls: ['./branches-modal.component.scss']
})
export class BranchesModalComponent {

  isLoading = false;
  branches = [];
  selectedBranch = '';

  constructor(
    private branchesService: BranchesService,
    public dialogRef: MatDialogRef<BranchesModalComponent>,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  initPage() {
    this.isLoading = true;
    this.branchesService.getBranches().subscribe(res => {
      this.branches = res.data;
      this.isLoading = false;
    }, err => this.isLoading = false);
  }

  close(sendData=true) {
    this.dialogRef.close({ selectedBranch: sendData ? this.selectedBranch : null })
  }
}
