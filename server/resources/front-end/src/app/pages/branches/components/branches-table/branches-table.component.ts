import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BranchesService } from '../../services';

@Component({
  selector: 'app-branches-table',
  templateUrl: './branches-table.component.html',
  styleUrls: ['./branches-table.component.scss']
})
export class BranchesTableComponent {
  @Input() reload: boolean = false;

  public displayedColumns: string[] = ['id', 'name', 'isMain'];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public isLoading = false;
  branchesTableData = [];

  public isShowFilterInput = false;

  constructor(
    public dialog: MatDialog,
    private branchesService: BranchesService,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  initPage() {
    this.getBranches();
  }

  ngOnChanges(model: any) {
    if (model.reload) {
      this.getBranches();
    }
  }

  public getBranches() {
    this.isLoading = true;
    this.branchesService.getBranches().subscribe(res => {
      if (res && res.data) {
        this.branchesTableData = res.data;
        this.dataSource = new MatTableDataSource<any>(this.branchesTableData);
      }
      else {
        this.branchesTableData = [];
      }
      this.isLoading = false;
    }, _ => {
      this.isLoading = false;
      this.branchesTableData = [];
    })
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.branchesTableData);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
