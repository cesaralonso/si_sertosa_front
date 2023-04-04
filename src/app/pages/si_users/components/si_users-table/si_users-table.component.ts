import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Si_usersInterface } from './si_users.interface';
import { Si_usersResponseInterface } from './si_users-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Si_usersService } from './si_users.service';
import { Si_usersAddModalComponent } from './si_users-add-modal/si_users-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmployeesInterface } from './../../../employees/components/employees-table/employees.interface';
import { EmployeesAddModalComponent } from './../../../employees/components/employees-table/employees-add-modal/employees-add-modal.component';
import { Si_alertasInterface } from './../../../si_alertas/components/si_alertas-table/si_alertas.interface';
import { Si_alertasAddModalComponent } from './../../../si_alertas/components/si_alertas-table/si_alertas-add-modal/si_alertas-add-modal.component';
import { Si_devicesInterface } from './../../../si_devices/components/si_devices-table/si_devices.interface';
import { Si_devicesAddModalComponent } from './../../../si_devices/components/si_devices-table/si_devices-add-modal/si_devices-add-modal.component';
import { Si_logsInterface } from './../../../si_logs/components/si_logs-table/si_logs.interface';
import { Si_logsAddModalComponent } from './../../../si_logs/components/si_logs-table/si_logs-add-modal/si_logs-add-modal.component';
import { Si_sesionsInterface } from './../../../si_sesions/components/si_sesions-table/si_sesions.interface';
import { Si_sesionsAddModalComponent } from './../../../si_sesions/components/si_sesions-table/si_sesions-add-modal/si_sesions-add-modal.component';
import { Si_user_rolsInterface } from './../../../si_user_rols/components/si_user_rols-table/si_user_rols.interface';
import { Si_user_rolsAddModalComponent } from './../../../si_user_rols/components/si_user_rols-table/si_user_rols-add-modal/si_user_rols-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'si_users-table',
templateUrl: './si_users-table.html',
styleUrls: ['./si_users-table.scss'],
})
export class Si_usersTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'nombre',
      'apmat',
      'appat',
      'email',
      /* 'password', */
      'si_rol_si_rol_idsi_rol',
      'companyunits_companyunits_idcompanyunits',
    ];
    displayedLabels: string[] = [
      '',
      'Nombre',
      'Apellido paterno',
      'Apellido materno',
      'Email para acceso',
      /* 'Password', */
      'Rol',
      'Unidad de negocio',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Si_usersService, 
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
            if (userModules[element].path === '/pages/si_users') {
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
        if (params['idsi_rol'] !== undefined) {
          const idsi_rol = +params['idsi_rol'];
          this.findByIdSi_rol(idsi_rol);
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
            (data: Si_usersResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_usersInterface>(data.result);
                  this.data.paginator = this.paginator;
                  this.data.sort = this.sort;
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    private findByIdSi_rol(id: number): void {
      this.service
        .findByIdSi_rol(id)
        .pipe(take(1))
        .subscribe(
            (data: Si_usersResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_usersInterface>(data.result);
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
    insertEmployee(si_users: Si_usersInterface) {
      const employee: EmployeesInterface = {
        si_user_idsi_user: si_users.idsi_user
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
    viewEmployee(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/employees/si_user/${si_users.idsi_user}`]);
    }
    insertSi_alerta(si_users: Si_usersInterface) {
      const si_alerta: Si_alertasInterface = {
        si_user_idsi_user: si_users.idsi_user
      }
      const dialogRef = this.dialog.open(Si_alertasAddModalComponent, {
              width: '550px',
              data: si_alerta,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_alertaShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_alertaShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_alerta(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/si_alertas/si_user/${si_users.idsi_user}`]);
    }
    insertSi_device(si_users: Si_usersInterface) {
      const si_device: Si_devicesInterface = {
        si_user_idsi_user: si_users.idsi_user
      }
      const dialogRef = this.dialog.open(Si_devicesAddModalComponent, {
              width: '550px',
              data: si_device,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_deviceShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_deviceShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_device(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/si_devices/si_user/${si_users.idsi_user}`]);
    }
    insertSi_log(si_users: Si_usersInterface) {
      const si_log: Si_logsInterface = {
        // si_user_idsi_user: si_users.idsi_user
      }
      const dialogRef = this.dialog.open(Si_logsAddModalComponent, {
              width: '550px',
              data: si_log,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_logShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_logShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_log(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/si_logs/si_user/${si_users.idsi_user}`]);
    }
    insertSi_sesion(si_users: Si_usersInterface) {
      const si_sesion: Si_sesionsInterface = {
        si_user_idsi_user: si_users.idsi_user
      }
      const dialogRef = this.dialog.open(Si_sesionsAddModalComponent, {
              width: '550px',
              data: si_sesion,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_sesionShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_sesionShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_sesion(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/si_sesions/si_user/${si_users.idsi_user}`]);
    }
    insertSi_user_rol(si_users: Si_usersInterface) {
      const si_user_rol: Si_user_rolsInterface = {
        si_user_idsi_user: si_users.idsi_user
      }
      const dialogRef = this.dialog.open(Si_user_rolsAddModalComponent, {
              width: '550px',
              data: si_user_rol,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_user_rolShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_user_rolShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_user_rol(si_users: Si_usersInterface) {
      this.router.navigate([`/pages/si_user_rols/si_user/${si_users.idsi_user}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Si_usersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_usersInterface>(data.result);
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
      const dialogRef = this.dialog.open(Si_usersAddModalComponent, {
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
    editModalShow(si_users: Si_usersInterface) {
      const dialogRef = this.dialog.open(Si_usersAddModalComponent, {
              width: '550px',
              data: si_users
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
          this.service.remove(item.idsi_user)
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
            (data: Si_usersResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_usersInterface>(data.result);
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
