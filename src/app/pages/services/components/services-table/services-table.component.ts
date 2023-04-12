import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { ServicesInterface } from './services.interface';
import { ServicesResponseInterface } from './services-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from './services.service';
import { ServicesAddModalComponent } from './services-add-modal/services-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Project_servicesInterface } from './../../../project_services/components/project_services-table/project_services.interface';
import { Project_servicesAddModalComponent } from './../../../project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { ValidationsInterface } from './../../../validations/components/validations-table/validations.interface';
import { ValidationsAddModalComponent } from './../../../validations/components/validations-table/validations-add-modal/validations-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'services-table',
templateUrl: './services-table.html',
styleUrls: ['./services-table.scss'],
})
export class ServicesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
      'initialMessage',
      /* 'finalMessage',
      'emailMessage',
      'downloable',
      'showEmployee',
      'target',
      'time',
      'saveAsTemplate', */
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
      'Descripción',
      /* 'Mensaje final',
      'Mensaje email',
      'Descargable',
      'Muestra empleado',
      'Target',
      'Tiempo para contestar',
      'Elegible como plantilla', */
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;


    constructor(
      private service: ServicesService, 
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
            if (userModules[element].path === '/pages/services') {
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
    insertProject_service(services: ServicesInterface) {
      const project_service: Project_servicesInterface = {
        service_idservice: services.idservice
      }
      const dialogRef = this.dialog.open(Project_servicesAddModalComponent, {
              width: '550px',
              data: project_service,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.project_serviceShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    project_serviceShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewProject_service(services: ServicesInterface) {
      this.router.navigate([`/pages/project_services/service/${services.idservice}`]);
    }
    insertValidation(services: ServicesInterface) {
      const validation: ValidationsInterface = {
        service_idservice: services.idservice
      }
      const dialogRef = this.dialog.open(ValidationsAddModalComponent, {
              width: '550px',
              data: validation,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.validationShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    validationShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewValidation(services: ServicesInterface) {
      this.router.navigate([`/pages/validations/service/${services.idservice}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: ServicesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ServicesInterface>(data.result);
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
      const dialogRef = this.dialog.open(ServicesAddModalComponent, {
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
    editModalShow(services: ServicesInterface) {
      const dialogRef = this.dialog.open(ServicesAddModalComponent, {
              width: '550px',
              data: services
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
          this.service.remove(item.idservice)
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
            (data: ServicesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ServicesInterface>(data.result);
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
