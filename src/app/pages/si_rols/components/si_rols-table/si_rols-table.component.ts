import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Si_rolsInterface } from './si_rols.interface';
import { Si_rolsResponseInterface } from './si_rols-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Si_rolsService } from './si_rols.service';
import { Si_rolsAddModalComponent } from './si_rols-add-modal/si_rols-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Si_devicesInterface } from './../../../si_devices/components/si_devices-table/si_devices.interface';
import { Si_devicesAddModalComponent } from './../../../si_devices/components/si_devices-table/si_devices-add-modal/si_devices-add-modal.component';
import { Si_permisosInterface } from './../../../si_permisos/components/si_permisos-table/si_permisos.interface';
import { Si_permisosAddModalComponent } from './../../../si_permisos/components/si_permisos-table/si_permisos-add-modal/si_permisos-add-modal.component';
import { Si_rol_permisosInterface } from './../../../si_rol_permisos/components/si_rol_permisos-table/si_rol_permisos.interface';
import { Si_rol_permisosAddModalComponent } from './../../../si_rol_permisos/components/si_rol_permisos-table/si_rol_permisos-add-modal/si_rol_permisos-add-modal.component';
import { Si_usersInterface } from './../../../si_users/components/si_users-table/si_users.interface';
import { Si_usersAddModalComponent } from './../../../si_users/components/si_users-table/si_users-add-modal/si_users-add-modal.component';
import { Si_user_rolsInterface } from './../../../si_user_rols/components/si_user_rols-table/si_user_rols.interface';
import { Si_user_rolsAddModalComponent } from './../../../si_user_rols/components/si_user_rols-table/si_user_rols-add-modal/si_user_rols-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'si_rols-table',
templateUrl: './si_rols-table.html',
styleUrls: ['./si_rols-table.scss'],
})
export class Si_rolsTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'codigo',
      'nombre',
    ];
    displayedLabels: string[] = [
      '',
      'Código',
      'Nombre',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;


    constructor(
      private service: Si_rolsService, 
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
            if (userModules[element].path === '/pages/si_rols') {
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
    insertSi_device(si_rols: Si_rolsInterface) {
      const si_device: Si_devicesInterface = {
        si_rol_idsi_rol: si_rols.idsi_rol
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
    viewSi_device(si_rols: Si_rolsInterface) {
      this.router.navigate([`/pages/si_devices/si_rol/${si_rols.idsi_rol}`]);
    }
    insertSi_permiso(si_rols: Si_rolsInterface) {
      const si_permiso: Si_permisosInterface = {
        si_rol_idsi_rol: si_rols.idsi_rol
      }
      const dialogRef = this.dialog.open(Si_permisosAddModalComponent, {
              width: '550px',
              data: si_permiso,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_permisoShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_permisoShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_permiso(si_rols: Si_rolsInterface) {
      this.router.navigate([`/pages/si_permisos/si_rol/${si_rols.idsi_rol}`]);
    }
    insertSi_rol_permiso(si_rols: Si_rolsInterface) {
      const si_rol_permiso: Si_rol_permisosInterface = {
        si_rol_idsi_rol: si_rols.idsi_rol
      }
      const dialogRef = this.dialog.open(Si_rol_permisosAddModalComponent, {
              width: '550px',
              data: si_rol_permiso,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.si_rol_permisoShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    si_rol_permisoShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSi_rol_permiso(si_rols: Si_rolsInterface) {
      this.router.navigate([`/pages/si_rol_permisos/si_rol/${si_rols.idsi_rol}`]);
    }
    insertSi_user(si_rols: Si_rolsInterface) {
      const si_user: Si_usersInterface = {
        si_rol_idsi_rol: si_rols.idsi_rol
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
    viewSi_user(si_rols: Si_rolsInterface) {
      this.router.navigate([`/pages/si_users/si_rol/${si_rols.idsi_rol}`]);
    }
    insertSi_user_rol(si_rols: Si_rolsInterface) {
      const si_user_rol: Si_user_rolsInterface = {
        si_rol_idsi_rol: si_rols.idsi_rol
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
    viewSi_user_rol(si_rols: Si_rolsInterface) {
      this.router.navigate([`/pages/si_user_rols/si_rol/${si_rols.idsi_rol}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Si_rolsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_rolsInterface>(data.result);
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
      const dialogRef = this.dialog.open(Si_rolsAddModalComponent, {
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
    editModalShow(si_rols: Si_rolsInterface) {
      const dialogRef = this.dialog.open(Si_rolsAddModalComponent, {
              width: '550px',
              data: si_rols
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
          this.service.remove(item.idsi_rol)
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
            (data: Si_rolsResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_rolsInterface>(data.result);
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
