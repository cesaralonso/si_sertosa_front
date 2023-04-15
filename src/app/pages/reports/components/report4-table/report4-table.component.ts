import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../reports.service';
import { Report4Interface } from './report4.interface';
import { ReportsResponseInterface } from '../../reports.response.interface';

import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { take } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';





@Component({
  selector: 'report4-table',
  templateUrl: './report4-table.component.html',
  styleUrls: ['./report4-table.component.scss']
})
export class Report4TableComponent implements OnInit {
  data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;

  displayedColumns: string[] = [
    'actions',
    'name',
    'amount',
    'unitin',
    'sku',
    'provider_provider_idprovider',
    'cost',
    'total',
    
  ];
  displayedLabels: string[] = [
    '',
    'Nombre',
    'Cantidad',
    'Unidad de entrada',
    'SKU',
    'Nombre de Proveedor',
    'Valor de pieza',
    'Valor total de cantidad',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;

  constructor(
      private service: ReportsService, 
      private toastrService: ToasterService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private commonService: CommonService,
      public dialog: MatDialog,
      private router: Router)
   {
    // Buscar permisos del usuario en el módulo
    this.user = this.authService.useJwtHelper();
      
    if (this.user.super) {
      this.updateable = true;
      this.deleteable = true;
      this.writeable = true;
    } else {
      const userModules = this.authService.getUserModules();
      if (userModules[0]) {
        for (const element in userModules) {
          if (userModules[element].path === '/pages/reports') {
            this.updateable = userModules[element].updateable;
            this.deleteable = userModules[element].deleteable;
            this.writeable = userModules[element].writeable;
          }
        }
      }
    }
   }


ngOnInit() {
  this.refill();
}
ngOnDestroy() {
}
refill() { 
  this.getAll();
}
productShowToast(result) {
  if (result.success) {
      this.toastrService.success(result.message);
      this.refill();
  } else {
      this.toastrService.error(result.message);
  }
}

showToast(result) {
  if (result.success) {
    this.toastrService.success(result.message);
    this.refill();
  } else {
    this.toastrService.error(result.message);
  }
}

private getAll(): void {
  this.service
    .allReport4()
    .pipe(take(1))
    .subscribe(
        (data: ReportsResponseInterface) =>  {
            if (data.success) {
              this.data = new MatTableDataSource<Report4Interface>(data.result);
              this.data.paginator = this.paginator;
              this.data.sort = this.sort;
            } else {
              this.toastrService.error(data.message);
            }
        },
        error => console.log(error),
        () => console.log('Get all Items complete'))
}

descargarCSV(data, reportTitle, showLabel) {
  const arrayReport = [];
  let report = [];
  data.filteredData.forEach(element => {
  report = [];
  for(let column in this.displayedColumns) {
      const key = this.displayedLabels[column];
      if (key) {
      report['"'+ key +'"'] = element[this.displayedColumns[column]];
      }
  }
  arrayReport.push(report);
  });
  this.commonService.JSONToCSVConvertor(arrayReport, reportTitle, showLabel);
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.data.filter = filterValue.trim().toLowerCase();
}





}
