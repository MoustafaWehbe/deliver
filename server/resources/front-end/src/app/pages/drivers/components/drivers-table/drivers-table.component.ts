import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DriversService } from '../../services';

@Component({
  selector: 'app-drivers-table',
  templateUrl: './drivers-table.component.html',
  styleUrls: ['./drivers-table.component.scss']
})
export class DriversTableComponent {

  @Input() reload?= false;

  public displayedColumns: string[] = ['id', 'name', 'phone'];
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public isLoading = false;

  driversTableData = [];

  public isShowFilterInput = false;

  constructor(
    public dialog: MatDialog,
    private driversService: DriversService,
    private toastService: ToastrService) { }

  public ngOnInit(): void {
    this.initPage();
  }

  ngOnChanges(model: any) {
    if (model.reload) {
      this.getDrivers();
    }
  }

  initPage() {
    this.getDrivers();
  }

  public getDrivers() {
    this.isLoading = true;
    this.driversService.getDrivers().subscribe(res => {
      if (res && res.data) {
        this.driversTableData = res.data;
        this.dataSource = new MatTableDataSource<any>(this.driversTableData);
      }
      else {
        this.driversTableData = [];
      }
      this.isLoading = false;
    }, _ => {
      this.isLoading = false;
      this.driversTableData = [];
    })
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.driversTableData);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
