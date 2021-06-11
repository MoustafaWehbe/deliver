import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BranchesService } from '../../services';

interface BranchModal {
  branch: any;
  action: string;
}

@Component({
  selector: 'app-add-branch-modal',
  templateUrl: './add-branch-modal.component.html',
  styleUrls: ['./add-branch-modal.component.scss']
})
export class AddBranchModalComponent {

  isLoading = false;
  mainObj: BranchModal;
  public branchesForm: FormGroup;

  constructor(
    private branchesService: BranchesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBranchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastrService) {
    this.mainObj = data;
  }

  public ngOnInit(): void {
    this.initPage();
  }

  async initPage() {
    this.branchesForm = new FormGroup({
      name: new FormControl(this.mainObj.action == 'update' ? this.mainObj.branch.name : '', [Validators.required, Validators.minLength(4)]),
      isMain: new FormControl(this.mainObj.action == 'update' ? this.mainObj.branch.isMain : false, [Validators.required]),
    });
  }

  close() {
    this.dialogRef.close({})
  }

  submitForm() {
    if (!this.branchesForm.valid) {
      this.toastService.error("please fill the missing fields");
      return;
    }
    else {
      // if (this.mainObj.action === 'update') {
      //   this.branchesService.updateOrder(this.branchesForm.value, this.mainObj.order.id).subscribe(res => {
      //     this.close();
      //   })
      // }
      // else {
      this.branchesService.createBranch(this.branchesForm.value).subscribe(res => {
        this.close();
      });
      // }
    }
  }
}
