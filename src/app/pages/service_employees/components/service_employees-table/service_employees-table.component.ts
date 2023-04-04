import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Service_employeesInterface } from './service_employees.interface';
import { Service_employeesResponseInterface } from './service_employees-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Service_employeesService } from './service_employees.service';
import { Service_employeesAddModalComponent } from './service_employees-add-modal/service_employees-add-modal.component';
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
selector: 'service_employees-table',
templateUrl: './service_employees-table.html',
styleUrls: ['./service_employees-table.scss'],
})
export class Service_employeesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'status',
      'employee_employee_idemployee',
      'project_service_project_service_idproject_service',
      'ponderationFinal',
      'observations',
      /* 'url', */
      'time',
    ];
    displayedLabels: string[] = [
      '',
      'Estatus',
      'Empleado',
      'Orden de reparación',
      'Resultado final',
      'Observaciones',
      /* 'Url Pdf', */
      'Tiempo total',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Service_employeesService, 
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
            if (userModules[element].path === '/pages/service_employees') {
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
        if (params['idproject_service'] !== undefined) {
          const idproject_service = +params['idproject_service'];
          this.findByIdProject_service(idproject_service);
          this.backpage = true;
        }
        if (params['idemployee'] !== undefined) {
          const idemployee = +params['idemployee'];
          this.findByIdEmployee(idemployee);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdProject_service(id: number): void {
      this.service
        .findByIdProject_service(id)
        .pipe(take(1))
        .subscribe(
            (data: Service_employeesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeesInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdEmployee(id: number): void {
      this.service
        .findByIdEmployee(id)
        .pipe(take(1))
        .subscribe(
            (data: Service_employeesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeesInterface>(data.result);
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
    insertValidation(service_employees: Service_employeesInterface) {
      const validation: ValidationsInterface = {
        service_employee_idservice_employee: service_employees.idservice_employee
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
    viewValidation(service_employees: Service_employeesInterface) {
      this.router.navigate([`/pages/validations/service_employee/${service_employees.idservice_employee}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Service_employeesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeesInterface>(data.result);
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
      const dialogRef = this.dialog.open(Service_employeesAddModalComponent, {
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
    editModalShow(service_employees: Service_employeesInterface) {
      const dialogRef = this.dialog.open(Service_employeesAddModalComponent, {
              width: '550px',
              data: service_employees
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
          this.service.remove(item.idservice_employee)
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
            (data: Service_employeesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Service_employeesInterface>(data.result);
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
