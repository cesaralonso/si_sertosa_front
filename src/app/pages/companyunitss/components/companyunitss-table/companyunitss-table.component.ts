import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { CompanyunitssInterface } from './companyunitss.interface';
import { CompanyunitssResponseInterface } from './companyunitss-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyunitssService } from './companyunitss.service';
import { CompanyunitssAddModalComponent } from './companyunitss-add-modal/companyunitss-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmployeesInterface } from './../../../employees/components/employees-table/employees.interface';
import { EmployeesAddModalComponent } from './../../../employees/components/employees-table/employees-add-modal/employees-add-modal.component';
import { ProjectsInterface } from './../../../projects/components/projects-table/projects.interface';
import { ProjectsAddModalComponent } from './../../../projects/components/projects-table/projects-add-modal/projects-add-modal.component';
import { Si_usersInterface } from './../../../si_users/components/si_users-table/si_users.interface';
import { Si_usersAddModalComponent } from './../../../si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'companyunitss-table',
templateUrl: './companyunitss-table.html',
styleUrls: ['./companyunitss-table.scss'],
})
export class CompanyunitssTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: CompanyunitssService, 
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
            if (userModules[element].path === '/pages/companyunitss') {
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
        if (params['idcompany'] !== undefined) {
          const idcompany = +params['idcompany'];
          this.findByIdCompany(idcompany);
          this.backpage = true;
        }
        if (!this.backpage) {
          this.getAll();
        }
      });
    }
    private findByIdCompany(id: number): void {
      this.service
        .findByIdCompany(id)
        .pipe(take(1))
        .subscribe(
            (data: CompanyunitssResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanyunitssInterface>(data.result);
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
    insertEmployee(companyunitss: CompanyunitssInterface) {
      const employee: EmployeesInterface = {
        companyunits_idcompanyunits: companyunitss.idcompanyunits
      }
      const dialogRef = this.dialog.open(EmployeesAddModalComponent, {
              width: '550px',
              data: employee,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.employeeShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    employeeShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewEmployee(companyunitss: CompanyunitssInterface) {
      this.router.navigate([`/pages/employees/companyunits/${companyunitss.idcompanyunits}`]);
    }
    insertProject(companyunitss: CompanyunitssInterface) {
      const project: ProjectsInterface = {
        companyunits_idcompanyunits: companyunitss.idcompanyunits
      }
      const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
              width: '550px',
              data: project,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.projectShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    projectShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewProject(companyunitss: CompanyunitssInterface) {
      this.router.navigate([`/pages/projects/companyunits/${companyunitss.idcompanyunits}`]);
    }
    insertSi_user(companyunitss: CompanyunitssInterface) {
      const si_user: Si_usersInterface = {
        companyunits_idcompanyunits: companyunitss.idcompanyunits
      }
      const dialogRef = this.dialog.open(Si_usersAddModalComponent, {
              width: '550px',
              data: si_user,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_userShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_userShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_user(companyunitss: CompanyunitssInterface) {
      this.router.navigate([`/pages/si_users/companyunits/${companyunitss.idcompanyunits}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: CompanyunitssResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanyunitssInterface>(data.result);
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
      const dialogRef = this.dialog.open(CompanyunitssAddModalComponent, {
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
    editModalShow(companyunitss: CompanyunitssInterface) {
      const dialogRef = this.dialog.open(CompanyunitssAddModalComponent, {
              width: '550px',
              data: companyunitss
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
          this.service.remove(item.idcompanyunits)
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
            (data: CompanyunitssResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<CompanyunitssInterface>(data.result);
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
