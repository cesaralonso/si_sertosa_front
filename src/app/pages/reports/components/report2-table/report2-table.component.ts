import { Component, OnInit,ViewChild } from '@angular/core';
import { Report2Interface } from './report2.interface';
import { ReportsService } from '../../reports.service';
import { CommonService } from 'app/shared/services/common.service';
import { ReportsResponseInterface } from '../../reports.response.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToasterService } from 'app/shared/services/toaster.service';
import { AuthService } from 'app/shared/services/auth.service';
@Component({
    'selector': 'report2-table',
    'templateUrl': 'report2-table.component.html',
    'styleUrls': ['report2-table.component.scss']
})
export class Report2TableComponent implements OnInit {

  data;
  user;
  backpage: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  routeParamsSubs: Subscription;
    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;

    displayedColumns: string[] = [
      'actions',
      'idsolicitudewarehouse',
      'created_at',
      'user',
      'type',
      'repair',
      'item',
      'created_by',
      // : number;
      // :string;
      // created_by:number;
      // usuario:string;
      // type:string;
      // repair:string;
      // item:string;

    ];
    displayedLabels: string[] = [
      '',
      'Id de la orden',
      'Fecha',
      'Usuario',
      'Tipo',
      'Reparación',
      //'Cantidad',
      'Item',
      'Creado por'



    ];

    constructor(
        private reportsService: ReportsService,
        private commonService: CommonService,
        private toastrService: ToasterService,
        private authService: AuthService,
    ) {
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
            if (userModules[element].path === '/pages/providers') {
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
    private getAll(): void {
      this.reportsService
        .allReport2()
        .pipe(take(1))
        .subscribe(
            (data: ReportsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Report2Interface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;

                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    ngOnDestroy() {
    }
    refill() {
      this.getAll();
    }
    showToast(result) {
      if (result.success) {
        this.toastrService.success(result.message);
        this.refill();
      } else {
        this.toastrService.error(result.message);
      }
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
  filtrarFechasreport2(fechaDesde, fechaHasta) {
    this.reportsService
      .allFromTo(fechaDesde, fechaHasta)
      .pipe(take(1))
      .subscribe(
          (data: ReportsResponseInterface) =>  {
              if (data.success) {
                this.data = new MatTableDataSource<Report2Interface>(data.result);
                this.data.paginator = this.paginator;
                this.data.sort = this.sort;
              } else {
                this.toastrService.error(data.message);
              }
          },
          error => console.log(error),
          () => console.log('Get all Items complete'))
  }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.data.filter = filterValue.trim().toLowerCase();

  }

}
