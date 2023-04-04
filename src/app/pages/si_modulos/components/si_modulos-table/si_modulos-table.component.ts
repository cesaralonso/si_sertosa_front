import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { Si_modulosInterface } from './si_modulos.interface';
import { Si_modulosResponseInterface } from './si_modulos-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Si_modulosService } from './si_modulos.service';
import { Si_modulosAddModalComponent } from './si_modulos-add-modal/si_modulos-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Si_logsInterface } from './../../../si_logs/components/si_logs-table/si_logs.interface';
import { Si_logsAddModalComponent } from './../../../si_logs/components/si_logs-table/si_logs-add-modal/si_logs-add-modal.component';
import { Si_permisosInterface } from './../../../si_permisos/components/si_permisos-table/si_permisos.interface';
import { Si_permisosAddModalComponent } from './../../../si_permisos/components/si_permisos-table/si_permisos-add-modal/si_permisos-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
selector: 'si_modulos-table',
templateUrl: './si_modulos-table.html',
styleUrls: ['./si_modulos-table.scss'],
})
export class Si_modulosTableComponent implements OnInit {
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
      private service: Si_modulosService, 
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
            if (userModules[element].path === '/pages/si_modulos') {
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
    insertSi_log(si_modulos: Si_modulosInterface) {
      const si_log: Si_logsInterface = {
        si_modulo_idsi_modulo: si_modulos.idsi_modulo
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
    viewSi_log(si_modulos: Si_modulosInterface) {
      this.router.navigate([`/pages/si_logs/si_modulo/${si_modulos.idsi_modulo}`]);
    }
    insertSi_permiso(si_modulos: Si_modulosInterface) {
      const si_permiso: Si_permisosInterface = {
        si_modulo_idsi_modulo: si_modulos.idsi_modulo
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
    viewSi_permiso(si_modulos: Si_modulosInterface) {
      this.router.navigate([`/pages/si_permisos/si_modulo/${si_modulos.idsi_modulo}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: Si_modulosResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_modulosInterface>(data.result);
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
      const dialogRef = this.dialog.open(Si_modulosAddModalComponent, {
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
    editModalShow(si_modulos: Si_modulosInterface) {
      const dialogRef = this.dialog.open(Si_modulosAddModalComponent, {
              width: '550px',
              data: si_modulos
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
          this.service.remove(item.idsi_modulo)
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
            (data: Si_modulosResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<Si_modulosInterface>(data.result);
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
