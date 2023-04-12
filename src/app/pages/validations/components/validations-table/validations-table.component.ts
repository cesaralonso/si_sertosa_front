import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { ValidationsInterface } from './validations.interface';
import { ValidationsResponseInterface } from './validations-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationsService } from './validations.service';
import { ValidationsAddModalComponent } from './validations-add-modal/validations-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'validations-table',
templateUrl: './validations-table.html',
styleUrls: ['./validations-table.scss'],
})
export class ValidationsTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'validated',
      'service_employee_service_employee_idservice_employee',
      /* 'service_service_idservice', */
    ];
    displayedLabels: string[] = [
      '',
      'Validado',
      'Empleado',
      /* 'Servicio', */
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: ValidationsService, 
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
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/validations') {
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
        this.routeParamsSubs.unsubscribe();
    }
    refill() { 
      this.routeParamsSubs = this.route.params.subscribe(params => {
        if (params['idservice_employee'] !== undefined) {
          const idservice_employee = +params['idservice_employee'];
          this.findByIdService_employee(idservice_employee);
          this.backpage = true;
        }
        if (params['idservice'] !== undefined) {
          const idservice = +params['idservice'];
          this.findByIdService(idservice);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdService_employee(id: number): void {
      this.service
        .findByIdService_employee(id)
        .pipe(take(1))
        .subscribe(
            (data: ValidationsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ValidationsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdService(id: number): void {
      this.service
        .findByIdService(id)
        .pipe(take(1))
        .subscribe(
            (data: ValidationsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ValidationsInterface>(data.result);
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
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: ValidationsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ValidationsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    addModalShow() {
      const dialogRef = this.dialog.open(ValidationsAddModalComponent, {
              width: '550px',
              data: {}
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.showToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    editModalShow(validations: ValidationsInterface) {
      const dialogRef = this.dialog.open(ValidationsAddModalComponent, {
              width: '550px',
              data: validations
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.showToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    onDeleteConfirm(event, item): void {
      if (window.confirm('¿Estas seguro de querer eliminar este registro?')) {
          this.service.remove(item.idvalidation)
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
    private getAll(): void {
      this.service
        .all()
        .pipe(take(1))
        .subscribe(
            (data: ValidationsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ValidationsInterface>(data.result);
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
