import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { ProjectsInterface } from './projects.interface';
import { ProjectsResponseInterface } from './projects-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ProjectsAddModalComponent } from './projects-add-modal/projects-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Project_servicesInterface } from './../../../project_services/components/project_services-table/project_services.interface';
import { Project_servicesAddModalComponent } from './../../../project_services/components/project_services-table/project_services-add-modal/project_services-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'projects-table',
templateUrl: './projects-table.html',
styleUrls: ['./projects-table.scss'],
})
export class ProjectsTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'name',
      'companyunits_companyunits_idcompanyunits',
      'vehicle_vehicle_idvehicle',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
      'Unidad de negocio',
      'Vehículo',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: ProjectsService, 
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
            if (userModules[element].path === '/pages/projects') {
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
        if (params['idvehicle'] !== undefined) {
          const idvehicle = +params['idvehicle'];
          this.findByIdVehicle(idvehicle);
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
            (data: ProjectsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ProjectsInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdVehicle(id: number): void {
      this.service
        .findByIdVehicle(id)
        .pipe(take(1))
        .subscribe(
            (data: ProjectsResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<ProjectsInterface>(data.result);
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
    insertProject_service(projects: ProjectsInterface) {
      const project_service: Project_servicesInterface = {
        project_idproject: projects.idproject
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
    viewProject_service(projects: ProjectsInterface) {
      this.router.navigate([`/pages/project_services/project/${projects.idproject}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: ProjectsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProjectsInterface>(data.result);
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
      const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
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
    editModalShow(projects: ProjectsInterface) {
      const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
              width: '550px',
              data: projects
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
          this.service.remove(item.idproject)
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
            (data: ProjectsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<ProjectsInterface>(data.result);
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
