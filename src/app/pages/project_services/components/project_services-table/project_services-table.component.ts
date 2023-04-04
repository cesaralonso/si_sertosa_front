import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Project_servicesInterface } from './project_services.interface';
import { Project_servicesResponseInterface } from './project_services-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Project_servicesService } from './project_services.service';
import { Project_servicesAddModalComponent } from './project_services-add-modal/project_services-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Service_employeesInterface } from './../../../service_employees/components/service_employees-table/service_employees.interface';
import { Service_employeesAddModalComponent } from './../../../service_employees/components/service_employees-table/service_employees-add-modal/service_employees-add-modal.component';
import { SolicitudeprovidersInterface } from './../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders.interface';
import { SolicitudeprovidersAddModalComponent } from './../../../solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import { SolicitudewarehousesInterface } from './../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.interface';
import { SolicitudewarehousesAddModalComponent } from './../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses-add-modal/solicitudewarehouses-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'project_services-table',
templateUrl: './project_services-table.html',
styleUrls: ['./project_services-table.scss'],
})
export class Project_servicesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'project_project_idproject',
      'service_service_idservice',
    ];
    displayedLabels: string[] = [
      '',
      'Reparación',
      'Servicio',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Project_servicesService, 
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
            if (userModules[element].path === '/pages/project_services') {
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
        if (params['idproject'] !== undefined) {
          const idproject = +params['idproject'];
          this.findByIdProject(idproject);
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
    private findByIdProject(id: number): void {
      this.service
        .findByIdProject(id)
        .pipe(take(1))
        .subscribe(
            (data: Project_servicesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Project_servicesInterface>(data.result);
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
            (data: Project_servicesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Project_servicesInterface>(data.result);
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
    insertService_employee(project_services: Project_servicesInterface) {
      const service_employee: Service_employeesInterface = {
        project_service_idproject_service: project_services.idproject_service
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
    viewService_employee(project_services: Project_servicesInterface) {
      this.router.navigate([`/pages/service_employees/project_service/${project_services.idproject_service}`]);
    }
    insertSolicitudeprovider(project_services: Project_servicesInterface) {
      const solicitudeprovider: SolicitudeprovidersInterface = {
        project_service_idproject_service: project_services.idproject_service
      }
      const dialogRef = this.dialog.open(SolicitudeprovidersAddModalComponent, {
              width: '550px',
              data: solicitudeprovider,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudeproviderShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    solicitudeproviderShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSolicitudeprovider(project_services: Project_servicesInterface) {
      this.router.navigate([`/pages/solicitudeproviders/project_service/${project_services.idproject_service}`]);
    }
    insertSolicitudewarehouse(project_services: Project_servicesInterface) {
      const solicitudewarehouse: SolicitudewarehousesInterface = {
        project_service_idproject_service: project_services.idproject_service
      }
      const dialogRef = this.dialog.open(SolicitudewarehousesAddModalComponent, {
              width: '550px',
              data: solicitudewarehouse,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.solicitudewarehouseShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    solicitudewarehouseShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSolicitudewarehouse(project_services: Project_servicesInterface) {
      this.router.navigate([`/pages/solicitudewarehouses/project_service/${project_services.idproject_service}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Project_servicesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Project_servicesInterface>(data.result);
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
      const dialogRef = this.dialog.open(Project_servicesAddModalComponent, {
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
    editModalShow(project_services: Project_servicesInterface) {
      const dialogRef = this.dialog.open(Project_servicesAddModalComponent, {
              width: '550px',
              data: project_services
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
          this.service.remove(item.idproject_service)
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
            (data: Project_servicesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Project_servicesInterface>(data.result);
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
