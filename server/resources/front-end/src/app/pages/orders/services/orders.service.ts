import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';
import { FilterOrder } from '../models/orders.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public serviceTypes = ['--', 'Replacement', 'End pickup user', 'Cash', 'Premium', 'Return'];
  public addressLocations = ["Akkar", "Akkar - halba", "Akkar - abde ", "Akkar - aarida", "Zgharta "
    , "Bchari", "Minieh ", "Minieh - dannieh", "Akkar - deir aamar", "Tripoli - mina", "Tripoli",
    "Tripoli - jabal el beddewe", "Koura - kosba", "Koura - amioun", "Koura ", "Koura - anfe",
    "Koura - chekka", "Batroun", "Batroun - amchit", "Jbeil", "Jbeil - monsef", "Jbeil - anaya",
    "Jbeil - blat", "Keserwan - zouk mosbeh", "Keserwan", "Keserwan zouk mikhael", "Keserwan - adma",
    "Keserwan - kaslik", "Keserwan - jounieh", "Keserwan - ghadir", "Keserwan - nahr el kalb",
    "Keserwan - haret sakher", "Keserwan - sahel alma", "Keserwan - faraya", "Keserwan - kfardebian",
    "Jbeil - tabarja", "Jbeil - nahr ibrahim", "Matn", "Matn - jisr el bacha", "Matn - mkalles",
    "Matn - sin el fil", "Matn - dekwene", "Matn - sad bouchrieh", "Matn - bouchrieh", "Matn - jdeide",
    "Matn - fanar", "Matn - dawra", "Matn - daher el sawan", "Matn - bourj hammoud ", "Matn - dbayeh",
    "Matn - sin el fil", "Beirut - ain mreisse", "Beirut - medawar ", "Beirut - port beirut",
    "Beirut - saifi", "Beirut - solidere", "Beirut - mina el hosn", "Beirut - bchara el khoury",
    "Beirut - nweiry", "Beirut - sanayeh", "Beirut - hamra", "Beirut - achrafieh", "Beirut - gemmayze",
    "Beirut - monot", "Beirut - sodeco", "Beirut - sioufi", "Beirut - sursok", "Beirut - huvlin",
    "Beirut - mathaf", "Beirut - mar mitr", "Beirut - mar elias", "Beirut", "Baabda", "Baabda - hazmieh",
    "Baabda - hadath ", "Baabda - ein roumeneh", "Baabda - furn el chebek", "Baabda - chiah",
    "Baabda - borj barajne", "Baabda - ghobeiry", "Baabda - beer hassan", "Alley ", "Alley - kafatmata",
    "Alley - araya", "Alley - kaberchamoun", "Alley - aaytat", "Alley - souk el ghareb", "Chouf",
    "Chouf - semkaniyet chouf", "Chouf - deir el kamar", "Chouf - jeb jenin", "Chouf - bekaata",
    "Jnoub", "Jnoub - nakoura", "Jnoub - sultanieh", "Jnoub - ber al salasel", "Jnoub - kana",
    "Jnoub - abbesiye", "Jnoub - marjaayoun ", "Jnoub - benet jbeil", "Jnoub - nabatieh", "Saida ",
    "Saida - wardanieh", "Saida - wadi zayne", "Saida wardeniye", "Bekaa", "Bekaa - hermel",
    "Bekaa - ferzol", "Bekaa - ras baalbek", "Bekaa - baalbek", "Bekaa - chtoura", "Bekaa - marej",
    "Bekaa - riyak", "Bekaa - west bekaa", "Bekaa - zahle", "Bekaa - zahle pologna ",
    "Bekaa - zahle tarchich", "Bekaa - hasbaya", "Bekaa - rachaya"
  ]
  constructor(private apiService: ApiService) { }

  public getOrders(status: string, transfered: boolean, q: string, page: number, currentFilter: FilterOrder): Observable<any> {
    let paramsText = '';
    let params = [];
    if (transfered) {
      params.push('transfered=true');
    }
    if (page) {
      params.push('page=' + page);
    }
    if (q) {
      params.push('q=' + q);
    }
    if (status) {
      params.push('status=' + status);
    }
    if (currentFilter) {
      params.push('filterByKey=' + currentFilter.key);
      if (currentFilter.value) {
        params.push('filterByValue=' + currentFilter.value);
      }
    }
    paramsText = "?" + params.join('&');
    return this.apiService.get('orders/all' + paramsText);
  }

  public deleteOrders(ordersIds) {
    return this.apiService.post('orders/delete', ordersIds);
  }

  public transferOrders(ordersIds, branch) {
    return this.apiService.post('orders/transferToBranch/' + branch, ordersIds);
  }

  public assignToDriver(ordersIds, driver) {
    return this.apiService.post('orders/assignToDriver/' + driver, ordersIds);
  }

  public createOrder(order) {
    return this.apiService.post('orders/create', order);
  }

  public updateOrder(order, orderId) {
    return this.apiService.post('orders/update/' + orderId, order);
  }

  public changeStatus(obj) {
    return this.apiService.post('orders/changeStatus', obj);
  }

  public ordersHistory(orderId) {
    return this.apiService.get('orders/history/' + orderId);
  }
}
