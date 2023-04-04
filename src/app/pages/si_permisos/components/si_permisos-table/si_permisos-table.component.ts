import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Si_permisosInterface } from './si_permisos.interface';
import { Si_permisosResponseInterface } from './si_permisos-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Si_permisosService } from './si_permisos.service';
import { Si_permisosAddModalComponent } from './si_permisos-add-modal/si_permisos-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Si_rol_permisosInterface } from './../../../si_rol_permisos/components/si_rol_permisos-table/si_rol_permisos.interface';
import { Si_rol_permisosAddModalComponent } from './../../../si_rol_permisos/components/si_rol_permisos-table/si_rol_permisos-add-modal/si_rol_permisos-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'si_permisos-table',
templateUrl: './si_permisos-table.html',
styleUrls: ['./si_permisos-table.scss'],
})
export class Si_permisosTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      /* 'codigo', */
      'nombre',
      'si_rol_si_rol_idsi_rol',
      'si_modulo_si_modulo_idsi_modulo',
      'acceso',
      'readable',
      'writeable',
      'updateable',
      'deleteable',
      'read_own',
      'write_own',
      'update_own',
      'delete_own',
    ];
    displayedLabels: string[] = [
      '',
      /* 'Código', */
      'Nombre',
      'Rol',
      'Módulo',
      'Acceso',
      'Lectura',
      'Escritura',
      'Edición',
      'Eliminación',
      'Leer Propios',
      'Escribir Propios',
      'Editar Propios',
      'Eliminar Propios',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: Si_permisosService, 
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
            if (userModules[element].path === '/pages/si_permisos') {
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
        if (params['idsi_modulo'] !== undefined) {
          const idsi_modulo = +params['idsi_modulo'];
          this.findByIdSi_modulo(idsi_modulo);
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
    private findByIdSi_modulo(id: number): void {
      this.service
        .findByIdSi_modulo(id)
        .pipe(take(1))
        .subscribe(
            (data: Si_permisosResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_permisosInterface>(data.result);
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
            (data: Si_permisosResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_permisosInterface>(data.result);
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
    insertSi_rol_permiso(si_permisos: Si_permisosInterface) {
      const si_rol_permiso: Si_rol_permisosInterface = {
        si_permiso_idsi_permiso: si_permisos.idsi_permiso
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
    viewSi_rol_permiso(si_permisos: Si_permisosInterface) {
      this.router.navigate([`/pages/si_rol_permisos/si_permiso/${si_permisos.idsi_permiso}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Si_permisosResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_permisosInterface>(data.result);
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
      const dialogRef = this.dialog.open(Si_permisosAddModalComponent, {
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
    editModalShow(si_permisos: Si_permisosInterface) {
      const dialogRef = this.dialog.open(Si_permisosAddModalComponent, {
              width: '550px',
              data: si_permisos
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
          this.service.remove(item.idsi_permiso)
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
            (data: Si_permisosResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_permisosInterface>(data.result);
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
