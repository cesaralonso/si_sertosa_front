import { AuthService } from './../../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from './../../../../shared/services/toaster.service';
import { WarehousesInterface } from './warehouses.interface';
import { WarehousesResponseInterface } from './warehouses-response.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehousesService } from './warehouses.service';
import { WarehousesAddModalComponent } from './warehouses-add-modal/warehouses-add-modal.component';
import * as _ from 'lodash';
import { CommonService } from './../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderinsInterface } from './../../../orderins/components/orderins-table/orderins.interface';
import { OrderinsAddModalComponent } from './../../../orderins/components/orderins-table/orderins-add-modal/orderins-add-modal.component';
import { OrderoutsInterface } from './../../../orderouts/components/orderouts-table/orderouts.interface';
import { OrderoutsAddModalComponent } from './../../../orderouts/components/orderouts-table/orderouts-add-modal/orderouts-add-modal.component';
import { SolicitudewarehousesInterface } from './../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses.interface';
import { SolicitudewarehousesAddModalComponent } from './../../../solicitudewarehouses/components/solicitudewarehouses-table/solicitudewarehouses-add-modal/solicitudewarehouses-add-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudeprovidersAddModalComponent } from 'app/pages/solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders-add-modal/solicitudeproviders-add-modal.component';
import { SolicitudeprovidersInterface } from 'app/pages/solicitudeproviders/components/solicitudeproviders-table/solicitudeproviders.interface';

@Component({
selector: 'warehouses-table',
templateUrl: './warehouses-table.html',
styleUrls: ['./warehouses-table.scss'],
})
export class WarehousesTableComponent implements OnInit {
    data;
    backpage: boolean;

    // Permisos en vista
    updateable: boolean = false;
    deleteable: boolean = false;
    writeable: boolean = false;
    displayedColumns: string[] = [
      'actions',
      'company_company_idcompany',
      'name',
      'status',
    ];
    displayedLabels: string[] = [
      '',
      'Compañia',
      'Nombre',
      'Status',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    user;
    routeParamsSubs: Subscription;


    constructor(
      private service: WarehousesService, 
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
            if (userModules[element].path === '/pages/warehouses') {
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
            (data: WarehousesResponseInterface) => {
                if (data.success) {
                  this.data = new MatTableDataSource<WarehousesInterface>(data.result);
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
    insertOrderin(warehouses: WarehousesInterface) {
      const orderin: OrderinsInterface = {
        warehouse_idwarehouse: warehouses.idwarehouse
      }
      const dialogRef = this.dialog.open(OrderinsAddModalComponent, {
              width: '550px',
              data: orderin,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.orderinShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    orderinShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }

    // INVENTARIO
    viewInventary(warehouses: WarehousesInterface) {
      this.router.navigate([`/pages/warehouses/${warehouses.idwarehouse}/inventary`]);
    }

    viewOrderin(warehouses: WarehousesInterface) {
      this.router.navigate([`/pages/orderins/warehouse/${warehouses.idwarehouse}`]);
    }
    insertOrderout(warehouses: WarehousesInterface) {
      const orderout: OrderoutsInterface = {
        warehouse_idwarehouse: warehouses.idwarehouse
      }
      const dialogRef = this.dialog.open(OrderoutsAddModalComponent, {
              width: '550px',
              data: orderout,
          });
          dialogRef.afterClosed()
              .pipe(take(1))
              .subscribe(data => {
                  if (data) {
                      this.orderoutShowToast(data);
                  }
              }),
              error => console.log(error),
              () => console.log('Action completed');
    }
    orderoutShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewOrderout(warehouses: WarehousesInterface) {
      this.router.navigate([`/pages/orderouts/warehouse/${warehouses.idwarehouse}`]);
    }
    /* insertSolicitudeprovider(warehouses: WarehousesInterface) {
      const solicitudeprovider: SolicitudeprovidersInterface = {
        warehouse_idwarehouse: warehouses.idwarehouse
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
    viewSolicitudeprovider(warehouses: WarehousesInterface) {
      this.router.navigate([`/pages/solicitudeproviders/warehouse/${warehouses.idwarehouse}`]);
    } */
    insertSolicitudewarehouse(warehouses: WarehousesInterface) {
      const solicitudewarehouse: SolicitudewarehousesInterface = {
        warehouse_idwarehouse: warehouses.idwarehouse
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
    viewSolicitudewarehouse(warehouses: WarehousesInterface) {
      this.router.navigate([`/pages/solicitudewarehouses/warehouse/${warehouses.idwarehouse}`]);
    }
    filtrarFechas(fechaDesde, fechaHasta) {
      this.service
        .allFromTo(fechaDesde, fechaHasta)
        .pipe(take(1))
        .subscribe(
            (data: WarehousesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<WarehousesInterface>(data.result);
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
      const dialogRef = this.dialog.open(WarehousesAddModalComponent, {
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
    editModalShow(warehouses: WarehousesInterface) {
      const dialogRef = this.dialog.open(WarehousesAddModalComponent, {
              width: '550px',
              data: warehouses
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
          this.service.remove(item.idwarehouse)
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
            (data: WarehousesResponseInterface) =>  {
                if (data.success) {
                  this.data = new MatTableDataSource<WarehousesInterface>(data.result);
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
