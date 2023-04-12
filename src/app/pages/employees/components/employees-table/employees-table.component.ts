import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { EmployeesInterface } from './employees.interface';
import { EmployeesResponseInterface } from './employees-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeesService } from './employees.service';
import { EmployeesAddModalComponent } from './employees-add-modal/employees-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Service_employeesInterface } from './../../../service_employees/components/service_employees-table/service_employees.interface';
import { Service_employeesAddModalComponent } from './../../../service_employees/components/service_employees-table/service_employees-add-modal/service_employees-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'employees-table',
templateUrl: './employees-table.html',
styleUrls: ['./employees-table.scss'],
})
export class EmployeesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
      'email',
      'si_user_si_user_idsi_user',
      'companyunits_companyunits_idcompanyunits',
      'code',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre completo',
      'Email',
      'Usuario',
      'Unidad de negocio',
      'Código interno opcional',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: EmployeesService, 
      private toastrService: ToasterService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private commonService: CommonService,
      public dialog: MatDialog,
      private router: Router) {

      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
      console.log('user', this.user);
      
      if (this.user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/employees') {
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
        if (params['idcompanyunits'] !== undefined) {
          const idcompanyunits = +params['idcompanyunits'];
          this.findByIdCompanyunits(idcompanyunits);
          this.backpage = true;
        }
        if (params['idsi_user'] !== undefined) {
          const idsi_user = +params['idsi_user'];
          this.findByIdSi_user(idsi_user);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdCompanyunits(id: number): void {
      this.service
        .findByIdCompanyunits(id)
        .pipe(take(1))
        .subscribe(
            (data: EmployeesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<EmployeesInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdSi_user(id: number): void {
      this.service
        .findByIdSi_user(id)
        .pipe(take(1))
        .subscribe(
            (data: EmployeesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<EmployeesInterface>(data.result);
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
    insertService_employee(employees: EmployeesInterface) {
      const service_employee: Service_employeesInterface = {
        employee_idemployee: employees.idemployee
      }
      const dialogRef = this.dialog.open(Service_employeesAddModalComponent, {
              width: '550px',
              data: service_employee,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.service_employeeShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    service_employeeShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewService_employee(employees: EmployeesInterface) {
      this.router.navigate([`/pages/service_employees/employee/${employees.idemployee}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: EmployeesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<EmployeesInterface>(data.result);
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
      const dialogRef = this.dialog.open(EmployeesAddModalComponent, {
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
    editModalShow(employees: EmployeesInterface) {
      const dialogRef = this.dialog.open(EmployeesAddModalComponent, {
              width: '550px',
              data: employees
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
          this.service.remove(item.idemployee)
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
            (data: EmployeesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<EmployeesInterface>(data.result);
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
