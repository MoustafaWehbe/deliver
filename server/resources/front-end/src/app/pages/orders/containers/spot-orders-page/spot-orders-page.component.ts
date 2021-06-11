import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DriversSelectModalComponent } from 'src/app/pages/drivers/components/drivers-select-modal/drivers-select-modal.component';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-spot-orders-page',
  templateUrl: './spot-orders-page.component.html',
  styleUrls: ['./spot-orders-page.component.scss']
})
export class SpotOrdersPageComponent {

  status = 'spotOrder';
  reload = false;
  events: string[] = [];
  selectedDate: Date = new Date();

  constructor(
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private apiService: ApiService) {
    let pastDate = this.selectedDate.getDate() - 7;
    this.selectedDate.setDate(pastDate);
  }

  async openDriversModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(DriversSelectModalComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.selectedDriver) {
          resolve(result.selectedDriver);
        }
        else {
          resolve(null);
        }
      }, _ => { resolve(null) });
    })
  }

  generateCsvAssignedOrders() {
    this.openDriversModal().then(res => {
      let driverId = '';
      if (res) {
        driverId = res.id;
      }
      let paramsText = "?";
      paramsText += 'date=' + this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
      if (driverId) {
        paramsText += "&driverId=" + driverId;
      }
      this.apiService
        .getAdvanced('orders/generateAssignedOrders' + paramsText, 'text/csv')
        .subscribe((data: any) => {
          const file = new Blob([data], { type: 'text/csv' });
          let downloadUrl = URL.createObjectURL(file);

          let a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'assignedOrders.csv';// you can take a custom name as well as provide by server
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
          }, 100);
        })
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }
}
