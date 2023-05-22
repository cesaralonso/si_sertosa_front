import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Service_employeeestadosInterface } from './service_employeeestados.interface';
import { Service_employeeestadosResponseInterface } from './service_employeeestados-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Service_employeeestadosService } from './service_employeeestados.service';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ValidationsInterface } from './../../../validations/components/validations-table/validations.interface';
import { ValidationsAddModalComponent } from './../../../validations/components/validations-table/validations-add-modal/validations-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'service_employeeestados-table',
templateUrl: './service_employeeestados-table.html',
styleUrls: ['./service_employeeestados-table.scss'],
})
export class Service_employeeestadosTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    validateServiceEmployee: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'estado',
      'created_at'
    ];
    displayedLabels: string[] = [
      '',
      'Estatus',
      'Fecha de creación'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Service_employeeestadosService, 
      private toastrService: ToasterService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private commonService: CommonService,
      public dialog: MatDialog,
      private router: Router) {

      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
      
      if (this.user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
        this.validateServiceEmployee = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/service_employeeestados') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
              this.validateServiceEmployee = userModules[element].validateServiceEmployee
            }
          }
        }
      }
    }
    ngOnInit() {
      this.refill();
    }
    ngOnDestroy() {
        this.routeParamsSubs.unsubscribe();
    }
    refill() { 
      this.routeParamsSubs = this.route.params.subscribe(params => {
        if (params['idservice_employee'] !== undefined) {
          const idservice_employee = +params['idservice_employee'];
          this.findByIdServiceEmployee(idservice_employee);
          this.backpage = true;
        }
      });
    }
    private findByIdServiceEmployee(id: number): void {
      this.service
        .findByIdServiceEmployee(id)
        .pipe(take(1))
        .subscribe(
            (data: Service_employeeestadosResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeeestadosInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    backPage() {
        window.history.back();
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allEstadosFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Service_employeeestadosResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeeestadosInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    onDeleteConfirm(event, item): void {
      if (window.confirm('¿Estas seguro de querer eliminar este registro?')) {
          this.service.removeEstado(item.idservice_employeeestado)
          .pipe(take(1))
          .subscribe(
              (data) => this.showToast(data),
              error => console.log(error),
              () => console.log('Delete completed')
          );
      } else {
          console.log('item cancelado');
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
